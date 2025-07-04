/* eslint-disable @typescript-eslint/no-explicit-any */
import { createElement, Browser, closest } from '@syncfusion/ej2-base';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import {
    Schedule, ScheduleModel, TimelineViews, TimelineMonth, EJ2Instance,
    CellClickEventArgs, SelectEventArgs, PopupOpenEventArgs, ActionEventArgs
} from '../../../src/schedule/index';
import * as cls from '../../../src/schedule/base/css-constant';
import { timelineData, resourceData, timelineResourceData, resourceGroupData, levelBasedData } from '../base/datasource.spec';
import { DateTimePicker } from '@syncfusion/ej2-calendars';
import { blockData, generateResourceDatasource, generateEvents } from '../base/datasource.spec';
import * as util from '../util.spec';
import { profile, inMB, getMemoryProfile } from '../../common.spec';
/**
 * Schedule Timeline Month view spec
 */
Schedule.Inject(TimelineViews, TimelineMonth);

describe('Schedule Timeline Month view', () => {
    beforeAll(() => {
        const isDef: (o: any) => boolean = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            // eslint-disable-next-line no-console
            console.log('Unsupported environment, window.performance.memory is unavailable');
            (this as any).skip(); //Skips test (in Chai)
            return;
        }
    });

    describe('Initial load', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                currentView: 'TimelineMonth', selectedDate: new Date(2017, 10, 1),
                views: ['Day', 'Week', 'TimelineMonth', 'Month']
            };
            schObj = util.createSchedule(model, timelineData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('view class on container', () => {
            expect(schObj.element.querySelector('.e-timeline-month-view')).toBeTruthy();
        });

        it('check active view class on toolbar views', () => {
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-timeline-month');
        });

        it('check work cell elements count', () => {
            expect(schObj.getWorkCellElements().length).toEqual(30);
        });

        it('check date header cells count', () => {
            expect(schObj.element.querySelectorAll('.e-date-header-container .e-date-header').length).toEqual(30);
        });

        it('check date header cells text', () => {
            expect(schObj.element.querySelector('.e-date-header-container .e-date-header').innerHTML).
                toEqual('<span class="e-navigate" title="Wednesday, November 1, 2017">Nov 1</span>');
        });

        it('work cells', () => {
            const firstWorkCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
            expect(firstWorkCell.getAttribute('data-date')).toEqual(new Date(2017, 10, 1).getTime().toString());
            expect(schObj.element.getAttribute('aria-labelledby')).toEqual(schObj.element.querySelector('.e-schedule-table.e-content-table').getAttribute('id'));
            expect(schObj.element.querySelector('.e-schedule-table.e-content-table').getAttribute('aria-label')).
                toEqual('Timeline Month Start Wednesday, November 1, 2017 Ends At Thursday, November 30, 2017');
        });

        it('navigate next date', () => {
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
            expect(schObj.element.querySelectorAll('.e-date-header-container .e-date-header').length).toEqual(31);
        });

        it('navigate previous date', () => {
            (schObj.element.querySelector('.e-toolbar-item.e-prev') as HTMLElement).click();
            expect(schObj.element.querySelectorAll('.e-date-header-container .e-date-header').length).toEqual(30);
        });

        it('Event rendering', (done: DoneFn) => {
            schObj.dataBound = () => {
                const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(eventElementList.length).toEqual(25);
                expect(schObj.eventsData.length).toEqual(21);
                done();
            };
            schObj.selectedDate = new Date(2018, 4, 1);
            schObj.dataBind();
        });

        it('Checking left indicator icons', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[1].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Spanned  Event - Same week');
            expect(eventElementList[1].querySelectorAll('.e-appointment-details .e-indicator')[0].classList.contains('e-left-icon'))
                .toBeTruthy();
        });

        it('Checking recurrence icon', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[2].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Recurrence Event - Greater than 24');
            expect(eventElementList[2].querySelectorAll('.e-appointment-details .e-icons')[1].classList.contains('e-recurrence-icon'))
                .toBeTruthy();
        });

        it('Checking more indicator', () => {
            const moreIndicatorList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
            expect(moreIndicatorList.length).toEqual(3);
            const element: HTMLElement = moreIndicatorList[0] as HTMLElement;
            element.click();
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-appointment-wrapper .e-appointment'));
            expect(eventElementList.length).toEqual(15);
            const close: HTMLElement = <HTMLElement>schObj.element.querySelector('.e-more-event-close');
            close.click();
        });
        it('cell single click', () => {
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            const cellPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(cellPopup.classList).toContain('e-popup-open');
            const moreDetail: HTMLElement = <HTMLElement>cellPopup.querySelector('.e-event-details');
            expect(moreDetail.classList).toContain('e-btn');
            expect(moreDetail.classList).toContain('e-flat');
            expect(moreDetail.innerHTML).toEqual('More Details');
            const save: HTMLElement = cellPopup.querySelector('.e-event-create');
            expect(save.classList).toContain('e-primary');
            expect(save.innerHTML).toEqual('Save');
            const close: HTMLElement = cellPopup.querySelector('.e-close-icon');
            expect(close.classList).toContain('e-btn-icon');
            close.click();
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.cellIndex).toEqual(0);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
        it('cell double click', () => {
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            expect(dialogElement.querySelector('.' + cls.EVENT_WINDOW_TITLE_TEXT_CLASS).innerHTML).toEqual('New Event');
            expect(dialogElement.querySelector('.e-subject-container label').innerHTML).toEqual('Title');
            expect(dialogElement.querySelector('.e-location-container label').innerHTML).toEqual('Location');
            expect(dialogElement.querySelector('.e-start-container label').innerHTML).toEqual('Start');
            expect(dialogElement.querySelector('.e-end-container label').innerHTML).toEqual('End');
            expect(dialogElement.querySelector('.e-start-time-zone-container label').innerHTML).toEqual('Start Timezone');
            expect(dialogElement.querySelector('.e-end-time-zone-container label').innerHTML).toEqual('End Timezone');
            expect(dialogElement.querySelector('.e-description-container label').innerHTML).toEqual('Description');
            expect(dialogElement.querySelector('.e-all-day-container .e-label').innerHTML).toEqual('All day');
            expect(dialogElement.querySelector('.e-time-zone-container .e-label').innerHTML).toEqual('Timezone');
            const cancelButton: HTMLElement = dialogElement.querySelector('.e-event-cancel') as HTMLElement;
            cancelButton.click();
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.cellIndex).toEqual(0);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
        it('event single click', () => {
            const event: HTMLElement = schObj.element.querySelectorAll('.e-appointment')[1] as HTMLElement;
            util.triggerMouseEvent(event, 'click');
            const eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup.classList).toContain('e-popup-open');
            const edit: HTMLElement = eventPopup.querySelector('.e-edit');
            expect(edit.children[0].classList).toContain('e-edit-icon');
            const deleteIcon: HTMLElement = eventPopup.querySelector('.e-delete');
            expect(deleteIcon.children[0].classList).toContain('e-delete-icon');
            (eventPopup.querySelector('.e-close-icon') as HTMLElement).click();
            expect(event.classList).toContain('e-appointment-border');
        });
        it('event double click', () => {
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-appointment')[1] as HTMLElement, 'dblclick');
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            expect(dialogElement.querySelector('.' + cls.EVENT_WINDOW_TITLE_TEXT_CLASS).innerHTML).toEqual('Edit Event');
            const cancelButton: HTMLElement = dialogElement.querySelector('.e-event-cancel') as HTMLElement;
            cancelButton.click();
        });
        it('EJ2-29887 - Checking Calendar format', () => {
            (schObj.element.querySelector('.e-toolbar-item.e-date-range') as HTMLElement).click();
            const calendarCells: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-cell'));
            expect(calendarCells.length).toEqual(12);
            expect((calendarCells[0]).innerHTML).toEqual('<span title="Jan 2018" class="e-day">Jan</span>');
            expect((calendarCells[1]).innerHTML).toEqual('<span title="Feb 2018" class="e-day">Feb</span>');
            expect((calendarCells[10]).innerHTML).toEqual('<span title="Nov 2018" class="e-day">Nov</span>');
            expect((calendarCells[11]).innerHTML).toEqual('<span title="Dec 2018" class="e-day">Dec</span>');
        });
    });

    describe('Work hour highlight', () => {
        let schObj: Schedule;
        beforeAll(() => {
            const model: ScheduleModel = {
                selectedDate: new Date(2017, 10, 1), currentView: 'TimelineMonth',
                views: ['Day', 'Week', 'TimelineMonth', 'Month']
            };
            schObj = util.createSchedule(model, []);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('ensure work days highlight', () => {
            expect(schObj.element.querySelectorAll('.e-work-cells').length).toEqual(30);
            expect(schObj.element.querySelectorAll('.e-work-days').length).toEqual(22);
        });

        it('ensure highlight class names', () => {
            const workCell: Element = schObj.element.querySelectorAll('.e-work-cells')[2];
            expect(workCell.classList.contains('e-work-days'));
        });

        it('ensure not highlight class names', () => {
            const workCell: Element = schObj.element.querySelectorAll('.e-work-cells')[3];
            expect(workCell.classList.contains('e-work-days')).toBeFalsy();
        });
    });

    describe('Work days', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                height: '580px', currentView: 'TimelineMonth',
                selectedDate: new Date(2017, 11, 1), workDays: [1, 3, 4, 5],
                views: ['Day', 'Week', 'TimelineMonth', 'Month']
            };
            schObj = util.createSchedule(model, timelineData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('ensure work days highlight count', () => {
            expect(schObj.element.querySelectorAll('.e-work-cells').length).toEqual(31);
            expect(schObj.element.querySelectorAll('.e-work-days').length).toEqual(17);
        });

        it('ensure work days', () => {
            expect(schObj.element.querySelectorAll('.e-work-cells')[5].classList.contains('e-work-days'));
        });

        it('ensure not work days', () => {
            expect(schObj.element.querySelectorAll('.e-work-cells')[8].classList.contains('e-work-days')).toBeFalsy();
        });

        it('ensure work days in next month', () => {
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
            expect(schObj.element.querySelectorAll('.e-work-cells').length).toEqual(31);
            expect(schObj.element.querySelectorAll('.e-work-days').length).toEqual(18);
        });

        it('ensure date', () => {
            expect(schObj.element.querySelectorAll('.e-date-header-container .e-date-header')[2].innerHTML).
                toEqual('<span class="e-navigate" title="Wednesday, January 3, 2018">3</span>');
        });

        it('Event rendering', (done: DoneFn) => {
            schObj.dataBound = () => {
                const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(eventElementList.length).toEqual(25);
                expect(schObj.eventsData.length).toEqual(21);
                done();
            };
            schObj.selectedDate = new Date(2018, 4, 1);
            schObj.dataBind();
        });

        it('Checking left indicator icons', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[1].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Spanned  Event - Same week');
            expect(eventElementList[1].querySelectorAll('.e-appointment-details .e-indicator')[0].classList.contains('e-left-icon'))
                .toBeTruthy();
        });

        it('Checking recurrence icon', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[2].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Recurrence Event - Greater than 24');
            expect(eventElementList[2].querySelectorAll('.e-appointment-details .e-icons')[1].classList.contains('e-recurrence-icon'))
                .toBeTruthy();
        });

        it('Checking more indicator', () => {
            const moreIndicatorList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
            expect(moreIndicatorList.length).toEqual(3);
        });
    });

    describe('Show weekend', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                height: '580px', selectedDate: new Date(2018, 3, 1),
                showWeekend: false, currentView: 'TimelineMonth',
                views: ['Day', 'Week', 'TimelineMonth', 'Month']
            };
            schObj = util.createSchedule(model, timelineData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('check work cell elements count', () => {
            expect(schObj.getWorkCellElements().length).toEqual(21);
        });

        it('check date header cells count', () => {
            expect(schObj.element.querySelectorAll('.e-date-header-container .e-date-header').length).toEqual(21);
        });

        it('check date header cells text', () => {
            expect(schObj.element.querySelector('.e-date-header-container .e-date-header').innerHTML).
                toEqual('<span class="e-navigate" title="Monday, April 2, 2018">2</span>');
        });

        it('ensure work days', () => {
            expect(schObj.element.querySelectorAll('.e-work-days').length).toEqual(21);
        });

        it('Event rendering', (done: DoneFn) => {
            schObj.dataBound = () => {
                const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(eventElementList.length).toEqual(24);
                expect(schObj.eventsData.length).toEqual(21);
                done();
            };
            schObj.selectedDate = new Date(2018, 4, 1);
            schObj.dataBind();
        });

        it('Checking left indicator icons', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[1].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Spanned  Event - Same week');
            expect(eventElementList[1].querySelectorAll('.e-appointment-details .e-indicator')[0].classList.contains('e-left-icon'))
                .toBeTruthy();
        });

        it('Checking recurrence icon', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[2].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Recurrence Event - Greater than 24');
            expect(eventElementList[2].querySelectorAll('.e-appointment-details .e-icons')[1].classList.contains('e-recurrence-icon'))
                .toBeTruthy();
        });

        it('Checking more indicator', () => {
            const moreIndicatorList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
            expect(moreIndicatorList.length).toEqual(3);
        });
    });

    describe('Show weekend and Work days', () => {
        let schObj: Schedule;
        beforeAll(() => {
            const model: ScheduleModel = {
                height: '550px', selectedDate: new Date(2017, 10, 1),
                showWeekend: false, workDays: [1, 3, 4, 5],
                currentView: 'TimelineMonth', views: ['Day', 'Week', 'TimelineMonth', 'Month']
            };
            schObj = util.createSchedule(model, []);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('ensure work days', () => {
            expect(schObj.element.querySelectorAll('.e-work-days').length).toEqual(18);
        });
    });

    describe('Current Day Highlight testing', () => {
        let schObj: Schedule;
        beforeAll(() => {
            const model: ScheduleModel = { height: '550px', currentView: 'TimelineMonth', views: ['Day', 'Week', 'TimelineMonth', 'Month'] };
            schObj = util.createSchedule(model, []);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('checking default current day highlight', () => {
            const index: number = schObj.activeView.renderDates.map((date: Date) => date.getDate()).indexOf(new Date().getDate());
            expect(schObj.element.querySelectorAll('.e-header-cells').item(index).classList).toContain('e-current-day');
        });

        it('checking current day highlight with different firstDayOfWeek', () => {
            schObj.firstDayOfWeek = 3;
            schObj.dataBind();
            const index: number = schObj.activeView.renderDates.map((date: Date) => date.getDate()).indexOf(new Date().getDate());
            expect(schObj.element.querySelectorAll('.e-header-cells').item(index).classList).toContain('e-current-day');
        });

        it('checking current day highlight with different workDays', () => {
            schObj.workDays = [0, 1, 2, 3, 4, 5, 6];
            schObj.dataBind();
            const index: number = schObj.activeView.renderDates.map((date: Date) => date.getDate()).indexOf(new Date().getDate());
            expect(schObj.element.querySelectorAll('.e-header-cells').item(index).classList).toContain('e-current-day');
        });

        it('checking current day highlight with showWeekend property', () => {
            schObj.showWeekend = false;
            schObj.dataBind();
            const index: number = schObj.activeView.renderDates.map((date: Date) => date.getDate()).indexOf(new Date().getDate());
            expect(schObj.element.querySelectorAll('.e-header-cells').item(index).classList).toContain('e-current-day');
        });
    });

    describe('Checking rowAutoHeight property', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const options: ScheduleModel = {
                currentView: 'TimelineMonth', rowAutoHeight: true, selectedDate: new Date(2018, 4, 1),
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek', 'TimelineMonth']
            };
            schObj = util.createSchedule(options, timelineData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('initial load', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList.length).toEqual(29);
            const eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
            expect(eventWrapperList.length).toEqual(1);
            const moreIndicatorList: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
            expect(moreIndicatorList.length).toEqual(0);
        });
        it('Change property through set model', (done: DoneFn) => {
            schObj.dataBound = () => {
                const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(eventElementList.length).toEqual(25);
                const eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
                expect(eventWrapperList.length).toEqual(1);
                const moreIndicatorList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
                expect(moreIndicatorList.length).toEqual(3);
                done();
            };
            schObj.rowAutoHeight = false;
            schObj.dataBind();
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
            const model: ScheduleModel = {
                height: '250px', width: '500px', currentView: 'TimelineMonth',
                views: ['Day', 'Week', 'TimelineMonth', 'Month'], selectedDate: new Date(2017, 10, 1)
            };
            schObj = util.createSchedule(model, []);
            expect(schObj.element.style.width).toEqual('500px');
            expect(schObj.element.style.height).toEqual('250px');
            expect(schObj.element.offsetWidth).toEqual(500);
            expect(schObj.element.offsetHeight).toEqual(250);
        });

        it('start and end hour', () => {
            const model: ScheduleModel = {
                height: '550px', currentView: 'TimelineMonth',
                views: ['Day', 'Week', 'TimelineMonth', 'Month'], selectedDate: new Date(2017, 10, 1)
            };
            schObj = util.createSchedule(model, []);
            expect(schObj.getWorkCellElements().length).toEqual(30);
            expect(schObj.element.querySelectorAll('.e-work-cells').length).toEqual(30);
            expect(schObj.element.querySelectorAll('.e-work-days').length).toEqual(22);

            schObj.startHour = '08:00';
            schObj.endHour = '16:00';
            schObj.dataBind();
            expect(schObj.getWorkCellElements().length).toEqual(30);
            expect(schObj.element.querySelectorAll('.e-work-cells').length).toEqual(30);
            expect(schObj.element.querySelectorAll('.e-work-days').length).toEqual(22);
        });

        it('work hours start and end', () => {
            const model: ScheduleModel = {
                height: '550px', currentView: 'TimelineMonth',
                views: ['Day', 'Week', 'TimelineMonth', 'Month'], selectedDate: new Date(2017, 10, 1)
            };
            schObj = util.createSchedule(model, []);
            expect(schObj.getWorkCellElements().length).toEqual(30);
            expect(schObj.element.querySelectorAll('.e-work-days').length).toEqual(22);

            schObj.workHours = { highlight: true, start: '08:00', end: '15:00' };
            schObj.dataBind();
            expect(schObj.getWorkCellElements().length).toEqual(30);
            expect(schObj.element.querySelectorAll('.e-work-days').length).toEqual(22);

            schObj.workHours = { highlight: false };
            schObj.dataBind();
            expect(schObj.getWorkCellElements().length).toEqual(30);
            expect(schObj.element.querySelectorAll('.e-work-days').length).toEqual(0);
        });

        it('show weekend', () => {
            const model: ScheduleModel = {
                height: '550px', currentView: 'TimelineMonth', views: ['Day', 'Week', 'TimelineMonth', 'Month'],
                selectedDate: new Date(2017, 3, 1), showWeekend: false
            };
            schObj = util.createSchedule(model, []);
            expect(schObj.getWorkCellElements().length).toEqual(20);
            expect(schObj.element.querySelector('.e-date-header-container .e-date-header').innerHTML).
                toEqual('<span class="e-navigate" title="Monday, April 3, 2017">3</span>');
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-date-header-container .e-date-header').innerHTML).
                toEqual('<span class="e-navigate" title="Monday, May 1, 2017">May 1</span>');
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-date-header-container .e-date-header').innerHTML).
                toEqual('<span class="e-navigate" title="Thursday, June 1, 2017">Jun 1</span>');

            schObj.showWeekend = true;
            schObj.dataBind();
            expect(schObj.getWorkCellElements().length).toEqual(30);
            expect(schObj.element.querySelectorAll('.e-work-days').length).toEqual(22);
        });

        it('work days', () => {
            const model: ScheduleModel = {
                height: '550px', currentView: 'TimelineMonth', views: ['Day', 'Week', 'TimelineMonth', 'Month'],
                selectedDate: new Date(2017, 10, 1), workDays: [0, 1, 3, 4]
            };
            schObj = util.createSchedule(model, []);
            expect(schObj.getWorkCellElements().length).toEqual(30);
            expect(schObj.element.querySelectorAll('.e-work-days').length).toEqual(18);
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
            expect(schObj.element.querySelectorAll('.e-work-days').length).toEqual(17);

            schObj.workDays = [0, 2, 3];
            schObj.dataBind();
            expect(schObj.getWorkCellElements().length).toEqual(31);
            expect(schObj.element.querySelectorAll('.e-work-days').length).toEqual(13);

            schObj.showWeekend = false;
            schObj.dataBind();
            expect(schObj.getWorkCellElements().length).toEqual(13);
            expect(schObj.element.querySelectorAll('.e-work-days').length).toEqual(13);
        });

        it('cell template', () => {
            const templateEle: HTMLElement = createElement('div', { innerHTML: '<span class="custom-element"></span>' });
            const model: ScheduleModel = {
                height: '550px', currentView: 'TimelineMonth', views: ['Day', 'Week', 'TimelineMonth', 'Month'],
                selectedDate: new Date(2017, 10, 1), cellTemplate: templateEle.innerHTML
            };
            schObj = util.createSchedule(model, []);
            expect(schObj.element.querySelectorAll('.custom-element').length).toEqual(schObj.getWorkCellElements().length);
            const workCellEle: HTMLElement = createElement('div', { innerHTML: '<span>11/4/17, 12:00 AM</span>' });
            schObj.cellTemplate = '<span>${getShortDateTime(data.date)}</span>';
            schObj.dataBind();
            expect(schObj.element.querySelectorAll('.e-work-cells')[3].innerHTML).toEqual(workCellEle.innerHTML);
        });

        it('date header template', () => {
            const model: ScheduleModel = {
                selectedDate: new Date(2017, 9, 5), currentView: 'TimelineMonth', views: ['Day', 'Week', 'TimelineMonth', 'Month'],
                dateHeaderTemplate: '<span>${getDateHeaderText(data.date)}</span>'
            };
            schObj = util.createSchedule(model, []);
            expect(schObj.element.querySelector('.e-date-header-container .e-date-header').innerHTML).toEqual('<span>Sun, 10/1</span>');
            schObj.dateHeaderTemplate = '<span>${getShortDateTime(data.date)}</span>';
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-date-header-container .e-date-header').innerHTML).
                toEqual('<span>10/1/17, 12:00 AM</span>');
        });

        it('dateRange template', () => {
            const model: ScheduleModel = {
                currentView: 'TimelineMonth', views: ['Day', 'Week', 'TimelineMonth', 'Month'],
                selectedDate: new Date(2017, 9, 5),
                dateRangeTemplate: '<div class="date-text">${(data.startDate).getMonth()}-${(data.endDate).getMonth()}</div>'
            };
            schObj = util.createSchedule(model, []);
            expect(schObj.element.querySelector('.e-tbar-btn-text').innerHTML).toEqual('<div class="date-text">9-9</div>');
            schObj.dateRangeTemplate = '<div>${getShortDateTime(data.startDate)}-${getShortDateTime(data.endDate)}</div>';
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-tbar-btn-text').innerHTML).toEqual('<div>10/1/17, 12:00 AM-10/31/17, 12:00 AM</div>');
        });

        it('events template', (done: DoneFn) => {
            const model: ScheduleModel = {
                height: '580px', selectedDate: new Date(2018, 4, 1), currentView: 'TimelineMonth',
                views: ['Day', 'Week', 'TimelineMonth', 'Month'],
                eventSettings: { template: '<span>${Subject}</span>' },
                dataBound: () => {
                    const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                    expect(eventElementList.length).toEqual(25);
                    expect(schObj.eventsData.length).toEqual(21);
                    expect(eventElementList[0].querySelector('.e-appointment-details').innerHTML).toEqual(
                        '<div class="e-indicator e-icons e-left-icon"></div><span>Recurrence Event - Previous week</span>' +
                        '<div class="e-icons e-recurrence-icon"></div>');
                    expect(eventElementList[2].querySelector('.e-appointment-details span').innerHTML)
                        .toEqual('Recurrence Event - Greater than 24');
                    expect(eventElementList[2].querySelectorAll('.e-appointment-details .e-indicator')[0].classList.contains('e-left-icon'))
                        .toBeTruthy();
                    const moreIndicatorList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
                    expect(moreIndicatorList.length).toEqual(3);
                    expect(moreIndicatorList[0].innerHTML).toEqual('+4&nbsp;more');
                    done();
                }
            };
            schObj = util.createSchedule(model, timelineData);
        });

        it('minDate and maxDate', () => {
            const model: ScheduleModel = {
                currentView: 'TimelineMonth',
                views: ['Day', 'Week', 'TimelineMonth', 'Month', 'TimelineDay'],
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
            schObj.minDate = new Date(2017, 9, 2);
            schObj.selectedDate = new Date(2017, 9, 4);
            schObj.maxDate = new Date(2017, 9, 7);
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('October 2017');
            expect(prevButton.getAttribute('aria-disabled')).toEqual('true');
            expect(nextButton.getAttribute('aria-disabled')).toEqual('true');
            (schObj.element.querySelectorAll('.e-header-cells .e-navigate')[0] as HTMLElement).click();
            expect(schObj.currentView).toEqual('TimelineMonth');
            (schObj.element.querySelectorAll('.e-header-cells .e-navigate')[1] as HTMLElement).click();
            expect(schObj.currentView).toEqual('TimelineDay');
        });
    });

    describe('Week Number and firstDayofWeek Combination', () => {
        let schObj: Schedule;
        beforeEach(() => {
            schObj = undefined;
        });
        afterEach(() => {
            util.destroy(schObj);
        });

        it('Timeline Day', () => {
            const model: ScheduleModel = {
                height: '600px', width: '1000px', currentView: 'TimelineDay',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek', 'TimelineMonth'],
                headerRows: [{ option: 'Year' }, { option: 'Month' }, { option: 'Week' }, { option: 'Date' }, { option: 'Hour' }],
                selectedDate: new Date(2019, 0, 1)
            };
            schObj = util.createSchedule(model, []);
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-timeline-day');
            let headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('January 1, 2019');
            expect((headTrs[2].children[0] as HTMLElement).innerText).toEqual('1');
            (schObj.element.querySelector('.e-toolbar-item.e-prev') as HTMLElement).click();
            headTrs = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('December 31, 2018');
            expect((headTrs[2].children[0] as HTMLElement).innerText).toEqual('1');
            (schObj.element.querySelector('.e-toolbar-item.e-prev') as HTMLElement).click();
            headTrs = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('December 30, 2018');
            expect((headTrs[2].children[0] as HTMLElement).innerText).toEqual('1');
            (schObj.element.querySelector('.e-toolbar-item.e-prev') as HTMLElement).click();
            headTrs = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('December 29, 2018');
            expect((headTrs[2].children[0] as HTMLElement).innerText).toEqual('52');
            schObj.firstDayOfWeek = 6;
            schObj.dataBind();
            headTrs = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('December 29, 2018');
            expect((headTrs[2].children[0] as HTMLElement).innerText).toEqual('1');
        });

        it('Timeline Week', () => {
            const model: ScheduleModel = {
                height: '600px', width: '1000px', currentView: 'TimelineWeek',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek', 'TimelineMonth'],
                headerRows: [{ option: 'Year' }, { option: 'Month' }, { option: 'Week' }, { option: 'Date' }, { option: 'Hour' }],
                selectedDate: new Date(2019, 0, 1)
            };
            schObj = util.createSchedule(model, []);
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-timeline-week');
            let headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
            expect((schObj.element.querySelector('.e-date-header-container .e-header-cells') as HTMLElement).innerText)
                .toEqual('Dec 30, Sunday');
            expect((headTrs[2].children[0] as HTMLElement).innerText).toEqual('1');
            (schObj.element.querySelector('.e-toolbar-item.e-prev') as HTMLElement).click();
            headTrs = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
            expect((schObj.element.querySelector('.e-date-header-container .e-header-cells') as HTMLElement).innerText)
                .toEqual('Dec 23, Sunday');
            expect((headTrs[2].children[0] as HTMLElement).innerText).toEqual('52');
            schObj.firstDayOfWeek = 6;
            schObj.dataBind();
            headTrs = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
            expect((schObj.element.querySelector('.e-date-header-container .e-header-cells') as HTMLElement).innerText)
                .toEqual('Dec 22, Saturday');
            expect((headTrs[2].children[0] as HTMLElement).innerText).toEqual('52');
        });

        it('TimelineWorkWeek', () => {
            const model: ScheduleModel = {
                height: '600px', width: '1000px', currentView: 'TimelineWorkWeek',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek', 'TimelineMonth'],
                headerRows: [{ option: 'Year' }, { option: 'Month' }, { option: 'Week' }, { option: 'Date' }, { option: 'Hour' }],
                selectedDate: new Date(2019, 0, 1)
            };
            schObj = util.createSchedule(model, []);
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-timeline-work-week');
            let headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
            expect((schObj.element.querySelector('.e-date-header-container .e-header-cells') as HTMLElement).innerText)
                .toEqual('Dec 31, Monday');
            expect((headTrs[2].children[0] as HTMLElement).innerText).toEqual('1');
            (schObj.element.querySelector('.e-toolbar-item.e-prev') as HTMLElement).click();
            headTrs = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
            expect((schObj.element.querySelector('.e-date-header-container .e-header-cells') as HTMLElement).innerText)
                .toEqual('Dec 24, Monday');
            expect((headTrs[2].children[0] as HTMLElement).innerText).toEqual('52');
            schObj.firstDayOfWeek = 6;
            schObj.dataBind();
            headTrs = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
            expect((schObj.element.querySelector('.e-date-header-container .e-header-cells') as HTMLElement).innerText)
                .toEqual('Dec 24, Monday');
            expect((headTrs[2].children[0] as HTMLElement).innerText).toEqual('52');
        });

        it('TimelineMonth', () => {
            const model: ScheduleModel = {
                height: '600px', width: '1000px', currentView: 'TimelineMonth',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek', 'TimelineMonth'],
                headerRows: [{ option: 'Year' }, { option: 'Month' }, { option: 'Week' }, { option: 'Date' }, { option: 'Hour' }],
                selectedDate: new Date(2019, 0, 1)
            };
            schObj = util.createSchedule(model, []);
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-timeline-month');
            let headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
            expect((schObj.element.querySelector('.e-date-header-container .e-header-cells') as HTMLElement).innerText)
                .toEqual('Jan 1');
            expect((headTrs[2].children[0] as HTMLElement).innerText).toEqual('1');
            (schObj.element.querySelector('.e-toolbar-item.e-prev') as HTMLElement).click();
            headTrs = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
            expect((schObj.element.querySelector('.e-date-header-container .e-header-cells') as HTMLElement).innerText)
                .toEqual('Dec 1');
            expect((headTrs[2].children[0] as HTMLElement).innerText).toEqual('48');
            schObj.firstDayOfWeek = 6;
            schObj.dataBind();
            headTrs = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
            expect((schObj.element.querySelector('.e-date-header-container .e-header-cells') as HTMLElement).innerText)
                .toEqual('Dec 1');
            expect((headTrs[2].children[0] as HTMLElement).innerText).toEqual('49');
        });
    });

    describe('Getting Week numbers while changing weekRule property', () => {
        let schObj: Schedule;
        beforeAll(() => {
            const model: ScheduleModel = {
                selectedDate: new Date(2020, 11, 29),
                currentView: 'TimelineMonth',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek', 'TimelineMonth'],
                headerRows: [{ option: 'Year' }, { option: 'Month' }, { option: 'Week' }, { option: 'Date' }, { option: 'Hour' }],
                showWeekNumber: true
            };
            schObj = util.createSchedule(model, []);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Week number testing for when weekRule set to FirstDay', () => {
            schObj.weekRule = 'FirstDay';
            expect((schObj.element.querySelectorAll('.e-header-week-cell')[1] as HTMLElement).innerText).toBe('50');
        });
        it('Week number testing for when weekRule set to FirstFourDayWeek', () => {
            schObj.weekRule = 'FirstFourDayWeek';
            schObj.dataBind();
            expect((schObj.element.querySelectorAll('.e-header-week-cell')[4] as HTMLElement).innerText).toBe('53');
        });
        it('Week number testing for when weekRule set to FirstFullWeek', () => {
            schObj.weekRule = 'FirstFullWeek';
            schObj.dataBind();
            expect((schObj.element.querySelectorAll('.e-header-week-cell')[1] as HTMLElement).innerText).toBe('49');
        });
    });

    describe('Public methods', () => {
        let schObj: Schedule;
        beforeEach((): void => {
            schObj = undefined;
        });
        afterEach((): void => {
            util.destroy(schObj);
        });

        it('interval count', () => {
            const model: ScheduleModel = {
                height: '550px', currentView: 'TimelineMonth', views: [{ option: 'TimelineMonth', interval: 2 }],
                selectedDate: new Date(2017, 10, 1)
            };
            schObj = util.createSchedule(model, []);
            expect(schObj.element.querySelectorAll('.e-work-cells').length).toEqual(61);
            expect(schObj.element.querySelector('.e-date-header-container .e-date-header').innerHTML).
                toEqual('<span class="e-navigate" title="Wednesday, November 1, 2017">Nov 1</span>');
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
            expect(schObj.element.querySelectorAll('.e-work-cells').length).toEqual(59);
            expect(schObj.element.querySelectorAll('.e-date-header-container .e-date-header')[3].innerHTML).
                toEqual('<span class="e-navigate" title="Thursday, January 4, 2018">4</span>');
            (schObj.element.querySelector('.e-toolbar-item.e-prev') as HTMLElement).click();
            expect(schObj.element.querySelectorAll('.e-work-cells').length).toEqual(61);
        });

        it('scrollTo', (done: DoneFn) => {
            const model: ScheduleModel = {
                height: 500, width: 500, currentView: 'TimelineMonth',
                views: [{ option: 'TimelineMonth', interval: 3 }], selectedDate: new Date(2017, 9, 1),
                dataBound: () => {
                    const contentArea: HTMLElement = schObj.element.querySelector('.e-content-wrap') as HTMLElement;
                    expect(contentArea.scrollLeft).toEqual(0);
                    schObj.scrollTo(null, new Date(2017, 11, 20));
                    expect(contentArea.scrollLeft).toEqual(5600);
                    done();
                }
            };
            schObj = util.createSchedule(model, []);
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
            const renderFn: jasmine.Spy = jasmine.createSpy('renderEvent');
            const model: ScheduleModel = {
                renderCell: renderFn, height: '550px', currentView: 'TimelineMonth',
                views: ['TimelineMonth'], selectedDate: new Date(2017, 10, 1)
            };
            schObj = util.createSchedule(model, []);
            (schObj.element.querySelectorAll('.e-work-cells')[3] as HTMLElement).click();
            expect(renderFn).toHaveBeenCalledTimes(60);
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
            expect(renderFn).toHaveBeenCalledTimes(122);
        });

        it('cell select', () => {
            let eventName1: string;
            let eventName2: string;
            let eventName3: string;
            const model: ScheduleModel = {
                select: (args: SelectEventArgs) => eventName1 = args.name,
                cellClick: (args: CellClickEventArgs) => eventName2 = args.name,
                popupOpen: (args: PopupOpenEventArgs) => eventName3 = args.name,
                currentView: 'TimelineMonth', views: ['TimelineMonth'], selectedDate: new Date(2018, 5, 5)
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
                currentView: 'TimelineMonth', views: ['TimelineMonth'], selectedDate: new Date(2018, 5, 5)
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
                currentView: 'TimelineMonth', views: ['TimelineMonth'], selectedDate: new Date(2018, 5, 5)
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
            expect(schObj.activeCellsData.startTime).toEqual(new Date(2018, 5, 4, 0, 0, 0));
            expect(schObj.activeCellsData.endTime).toEqual(new Date(2018, 5, 7, 0, 0, 0));
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
                currentView: 'TimelineMonth',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek', 'TimelineMonth'],
                selectedDate: new Date(2018, 5, 5)
            };
            schObj = util.createSchedule(model, []);
            (schObj.element.querySelectorAll('.e-work-cells')[3] as HTMLElement).click();
            expect(cellStartTime).toEqual(new Date(2018, 5, 4).getTime());
            expect(cellEndTime).toEqual(new Date(2018, 5, 5).getTime());
            expect(eventName).toEqual('cellClick');
        });

        it('cancel cell click', () => {
            const model: ScheduleModel = {
                cellClick: (args: CellClickEventArgs) => args.cancel = true,
                currentView: 'TimelineMonth',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek', 'TimelineMonth'],
                selectedDate: new Date(2018, 5, 5)
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
                currentView: 'TimelineMonth',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek', 'TimelineMonth'],
                selectedDate: new Date(2018, 5, 5)
            };
            schObj = util.createSchedule(model, []);
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[3] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[3] as HTMLElement, 'dblclick');
            expect(cellStartTime).toEqual(new Date(2018, 5, 4).getTime());
            expect(cellEndTime).toEqual(new Date(2018, 5, 5).getTime());
            expect(eventName).toEqual('cellDoubleClick');
        });

        it('cancel cell double click', () => {
            const model: ScheduleModel = {
                cellDoubleClick: (args: CellClickEventArgs) => args.cancel = true,
                currentView: 'TimelineMonth', selectedDate: new Date(2018, 5, 5),
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek', 'TimelineMonth']
            };
            schObj = util.createSchedule(model, []);
            const workCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[3] as HTMLElement;
            util.triggerMouseEvent(workCell, 'click');
            util.triggerMouseEvent(workCell, 'dblclick');
        });
    });

    describe('RTL', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                height: '580px', selectedDate: new Date(2017, 10, 1),
                enableRtl: true, currentView: 'TimelineMonth',
                views: ['Day', 'Week', 'TimelineMonth', 'Month']
            };
            schObj = util.createSchedule(model, timelineData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('check work cell elements count', () => {
            expect(schObj.getWorkCellElements().length).toEqual(30);
        });

        it('check date header cells', () => {
            expect(schObj.element.querySelectorAll('.e-date-header-container .e-date-header').length).toEqual(30);
            expect(schObj.element.querySelectorAll('.e-date-header-container .e-date-header')[2].innerHTML)
                .toEqual('<span class="e-navigate" title="Friday, November 3, 2017">3</span>');
        });

        it('work cells', () => {
            const firstWorkCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
            expect(firstWorkCell.getAttribute('data-date')).toEqual(new Date(2017, 10, 1).getTime().toString());
        });

        it('navigate next date', () => {
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
            expect(schObj.element.querySelectorAll('.e-date-header-container .e-date-header').length).toEqual(31);
            expect(schObj.element.querySelectorAll('.e-date-header-container .e-date-header')[1].innerHTML)
                .toEqual('<span class="e-navigate" title="Saturday, December 2, 2017">2</span>');
        });

        it('navigate previous date', () => {
            (schObj.element.querySelector('.e-toolbar-item.e-prev') as HTMLElement).click();
            expect(schObj.element.querySelectorAll('.e-date-header-container .e-date-header').length).toEqual(30);
            expect(schObj.element.querySelectorAll('.e-date-header-container .e-date-header')[6].innerHTML).
                toEqual('<span class="e-navigate" title="Tuesday, November 7, 2017">7</span>');
        });

        it('Event rendering', (done: DoneFn) => {
            schObj.dataBound = () => {
                const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(eventElementList.length).toEqual(25);
                expect(schObj.eventsData.length).toEqual(21);
                done();
            };
            schObj.selectedDate = new Date(2018, 4, 1);
            schObj.dataBind();
        });

        it('Checking left indicator icons', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[1].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Spanned  Event - Same week');
            expect(eventElementList[1].querySelectorAll('.e-appointment-details .e-indicator')[0].classList.contains('e-left-icon'))
                .toBeTruthy();
        });

        it('Checking recurrence icon', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[2].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Recurrence Event - Greater than 24');
            expect(eventElementList[2].querySelectorAll('.e-appointment-details .e-icons')[1].classList.contains('e-recurrence-icon'))
                .toBeTruthy();
        });

        it('Checking more indicator', () => {
            const moreIndicatorList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
            expect(moreIndicatorList.length).toEqual(3);
            expect(moreIndicatorList[0].innerHTML).toEqual('+4&nbsp;more');
        });

        it('Change property through set model', (done: DoneFn) => {
            schObj.dataBound = () => {
                const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(eventElementList.length).toEqual(29);
                const eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
                expect(eventWrapperList.length).toEqual(1);
                const moreIndicatorList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
                expect(moreIndicatorList.length).toEqual(0);
                done();
            };
            schObj.rowAutoHeight = true;
            schObj.dataBind();
        });
    });

    describe('Single level resource rendering', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                height: '550px', width: '100%', currentView: 'TimelineMonth',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineMonth'],
                group: { resources: ['Owners'] },
                resources: [{
                    field: 'OwnerId', title: 'Owner', name: 'Owners', allowMultiple: true,
                    dataSource: [
                        { OwnerText: 'Nancy', Id: 1, OwnerColor: '#ffaa00' },
                        { OwnerText: 'Steven', Id: 2, OwnerColor: '#f8a398' },
                        { OwnerText: 'Michael', Id: 3, OwnerColor: '#7499e1' },
                        { OwnerText: 'Oliver', Id: 4, OwnerColor: '#ffaa00' },
                        { OwnerText: 'John', Id: 5, OwnerColor: '#f8a398' },
                        { OwnerText: 'Barry', Id: 6, OwnerColor: '#7499e1' },
                        { OwnerText: 'Felicity', Id: 7, OwnerColor: '#ffaa00' },
                        { OwnerText: 'Cisco', Id: 8, OwnerColor: '#f8a398' },
                        { OwnerText: 'Sara', Id: 9, OwnerColor: '#7499e1' },
                        { OwnerText: 'Malcolm', Id: 3101, OwnerColor: '#ffaa00' }
                    ],
                    textField: 'OwnerText', idField: 'Id', colorField: 'OwnerColor'
                }],
                selectedDate: new Date(2018, 4, 1)
            };
            schObj = util.createSchedule(model, timelineResourceData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('checking resource title rendering', () => {
            const headerRow: HTMLElement = schObj.element.querySelector('.e-timeline-month-view tr') as HTMLElement;
            expect(headerRow.children.length).toEqual(2);
            const firstTD: HTMLElement = schObj.element.querySelector('.e-timeline-month-view tr td.e-resource-left-td') as HTMLElement;
            expect([firstTD].length).toEqual(1);
            expect(firstTD.querySelector('.e-resource-text').innerHTML).toEqual('');
        });
        it('checking resource tree rendering', () => {
            const contentRow: HTMLElement = schObj.element.querySelector('.e-timeline-month-view table tbody') as HTMLElement;
            expect(contentRow.children[1].children.length).toEqual(2);
            expect([contentRow.children[1].querySelector('td div.e-resource-column-wrap')].length).toEqual(1);
            const resourceRow: HTMLElement = schObj.element.querySelector('.e-resource-column-wrap tbody') as HTMLElement;
            expect(resourceRow.children.length).toEqual(10);
            expect([resourceRow.querySelector('tr td.e-resource-cells')].length).toEqual(1);
            expect([resourceRow.querySelector('tr td.e-resource-cells div.e-resource-text')].length).toEqual(1);
            expect(resourceRow.querySelector('tr td.e-resource-cells div.e-resource-text').innerHTML).toEqual('Nancy');
            const contentRows: HTMLElement = contentRow.children[1].children[1].querySelector('tbody');
            expect(contentRows.children.length).toEqual(10);
        });

        it('Checking events elements', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList.length).toEqual(15);
            const eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
            expect(eventWrapperList.length).toEqual(8);
        });

        it('Checking Left icon', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[1].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Spanned Event - Less than 24');
            expect(eventElementList[1].querySelectorAll('.e-appointment-details .e-indicator')[0].classList.contains('e-left-icon'))
                .toBeTruthy();
        });

        it('Checking recurrence icon', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[4].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Recurrence Event - Greater than 24');
            expect(eventElementList[4].querySelectorAll('.e-appointment-details .e-icons')[0].classList.contains('e-recurrence-icon'))
                .toBeTruthy();
        });

        it('More event element checking', () => {
            const moreIndicatorList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
            expect(moreIndicatorList.length).toEqual(9);
            const element: HTMLElement = moreIndicatorList[0] as HTMLElement;
            element.click();
            const morePopup: HTMLElement = schObj.element.querySelector('.e-more-popup-wrapper') as HTMLElement;
            const moreEventList: Element[] = [].slice.call(morePopup.querySelectorAll('.e-more-appointment-wrapper .e-appointment'));
            expect(moreEventList.length).toEqual(2);
            util.triggerMouseEvent(morePopup.querySelector('.e-more-event-close'), 'click');
        });

        it('Checking rowAutoHeight property', (done: DoneFn) => {
            schObj.dataBound = () => {
                const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(eventElementList.length).toEqual(18);
                const eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
                expect(eventWrapperList.length).toEqual(8);
                const moreIndicatorList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
                expect(moreIndicatorList.length).toEqual(0);
                done();
            };
            schObj.rowAutoHeight = true;
            schObj.dataBind();
        });
    });

    describe('Multi level resource rendering', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                height: '550px', width: '100%', currentView: 'TimelineMonth',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineMonth'],
                group: { resources: ['Halls', 'Rooms', 'Owners'] },
                resources: [{
                    field: 'HallId', title: 'Hall', name: 'Halls', allowMultiple: false,
                    dataSource: [
                        { HallText: 'Hall 1', Id: 1, HallColor: '#cb6bb2' },
                        { HallText: 'Hall 2', Id: 2, HallColor: '#56ca85' }
                    ],
                    textField: 'HallText', idField: 'Id', colorField: 'HallColor'
                }, {
                    field: 'RoomId', title: 'Room', name: 'Rooms', allowMultiple: false,
                    dataSource: [
                        { RoomText: 'ROOM 1', Id: 1, RoomGroupId: 1, RoomColor: '#cb6bb2' },
                        { RoomText: 'ROOM 2', Id: 2, RoomGroupId: 2, RoomColor: '#56ca85' },
                        { RoomText: 'ROOM 3', Id: 3, RoomGroupId: 1, RoomColor: '#56ca85' }
                    ],
                    textField: 'RoomText', idField: 'Id', groupIDField: 'RoomGroupId', colorField: 'RoomColor'
                }, {
                    field: 'OwnerId', title: 'Owner', name: 'Owners', allowMultiple: true,
                    dataSource: [
                        { OwnerText: 'Nancy', Id: 1, OwnerGroupId: 1, OwnerColor: '#ffaa00' },
                        { OwnerText: 'Steven', Id: 2, OwnerGroupId: 2, OwnerColor: '#f8a398' },
                        { OwnerText: 'Michael', Id: 3, OwnerGroupId: 3, OwnerColor: '#7499e1' },
                        { OwnerText: 'Oliver', Id: 4, OwnerGroupId: 1, OwnerColor: '#ffaa00' },
                        { OwnerText: 'John', Id: 5, OwnerGroupId: 2, OwnerColor: '#f8a398' },
                        { OwnerText: 'Barry', Id: 6, OwnerGroupId: 3, OwnerColor: '#7499e1' },
                        { OwnerText: 'Felicity', Id: 7, OwnerGroupId: 1, OwnerColor: '#ffaa00' },
                        { OwnerText: 'Cisco', Id: 8, OwnerGroupId: 2, OwnerColor: '#f8a398' },
                        { OwnerText: 'Sara', Id: 9, OwnerGroupId: 3, OwnerColor: '#7499e1' },
                        { OwnerText: 'Malcolm', Id: 10, OwnerGroupId: 1, OwnerColor: '#ffaa00' }
                    ],
                    textField: 'OwnerText', idField: 'Id', groupIDField: 'OwnerGroupId', colorField: 'OwnerColor'
                }],
                selectedDate: new Date(2018, 4, 1)
            };
            schObj = util.createSchedule(model, timelineResourceData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('checking resource title rendering', () => {
            const headerRow: HTMLElement = schObj.element.querySelector('.e-timeline-month-view tr') as HTMLElement;
            expect(headerRow.children.length).toEqual(2);
            const firstTD: HTMLElement = schObj.element.querySelector('.e-timeline-month-view tr td.e-resource-left-td') as HTMLElement;
            expect([firstTD].length).toEqual(1);
            expect(firstTD.querySelector('.e-resource-text').innerHTML).toEqual('');
        });
        it('checking resource tree rendering', () => {
            const contentRow: HTMLElement = schObj.element.querySelector('.e-timeline-month-view table tbody') as HTMLElement;
            expect(contentRow.children[1].children.length).toEqual(2);
            expect([contentRow.children[1].querySelector('td div.e-resource-column-wrap')].length).toEqual(1);
            const resourceRow: HTMLElement = schObj.element.querySelector('.e-resource-column-wrap tbody') as HTMLElement;
            expect(resourceRow.children.length).toEqual(15);
            expect([resourceRow.querySelector('tr td.e-resource-cells')].length).toEqual(1);
            expect([resourceRow.querySelector('tr td.e-resource-cells div.e-resource-tree-icon')].length).toEqual(1);
            expect([resourceRow.querySelector('tr td.e-resource-cells div.e-resource-collapse')].length).toEqual(1);
            expect([resourceRow.querySelector('tr td.e-parent-node')].length).toEqual(1);
            expect(resourceRow.querySelector('tr td.e-resource-cells').children.length).toEqual(2);
            expect(resourceRow.querySelector('tr td.e-resource-cells div.e-resource-text').innerHTML).toEqual('Hall 1');
            expect([resourceRow.querySelector('tr td.e-resource-cells div.e-resource-tree-icon')].length).toEqual(1);
            expect([resourceRow.querySelector('tr td.e-resource-cells div.e-resource-collapse')].length).toEqual(1);
            expect([resourceRow.querySelector('tr td.e-parent-node')].length).toEqual(1);
            expect(resourceRow.children[1].querySelector('.e-resource-cells').children.length).toEqual(2);
            expect(resourceRow.children[1].querySelector('.e-resource-cells div.e-resource-text').innerHTML).toEqual('ROOM 1');
            expect([resourceRow.children[2].querySelector('.e-child-node')].length).toEqual(1);
            expect(resourceRow.children[2].querySelector('.e-child-node').children.length).toEqual(1);
            const contentRows: HTMLElement = contentRow.children[1].children[1].querySelector('tbody');
            expect(contentRows.children.length).toEqual(15);
        });
        it('Checking events elements', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList.length).toEqual(15);
            const eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
            expect(eventWrapperList.length).toEqual(7);
        });

        it('Checking Left icon', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[1].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Recurrence Event - Greater than 24');
            expect(eventElementList[1].querySelectorAll('.e-appointment-details .e-indicator')[0].classList.contains('e-left-icon'))
                .toBeTruthy();
        });

        it('Checking recurrence icon', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[4].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Recurrence Event - Previous week');
            expect(eventElementList[4].querySelectorAll('.e-appointment-details .e-icons')[1].classList.contains('e-recurrence-icon'))
                .toBeTruthy();
        });

        it('More event element checking', () => {
            const moreIndicatorList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
            expect(moreIndicatorList.length).toEqual(5);
            const element: HTMLElement = moreIndicatorList[0] as HTMLElement;
            element.click();
            const morePopup: HTMLElement = schObj.element.querySelector('.e-more-popup-wrapper') as HTMLElement;
            const moreEventList: Element[] = [].slice.call(morePopup.querySelectorAll('.e-more-appointment-wrapper .e-appointment'));
            expect(moreEventList.length).toEqual(2);
            util.triggerMouseEvent(morePopup.querySelector('.e-more-event-close'), 'click');
        });

        it('Checking rowAutoHeight property', (done: DoneFn) => {
            schObj.dataBound = () => {
                const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(eventElementList.length).toEqual(18);
                const moreIndicatorList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
                expect(moreIndicatorList.length).toEqual(0);
                done();
            };
            schObj.rowAutoHeight = true;
            schObj.dataBind();
        });
    });

    describe('Multi level resource rendering with expanded property', () => {
        let schObj: Schedule;
        let keyModule: any;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                height: '550px', width: '100%', currentView: 'TimelineMonth',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineMonth'],
                group: { resources: ['Halls', 'Rooms', 'Owners'] },
                resources: [{
                    field: 'HallId', title: 'Hall', name: 'Halls', allowMultiple: false,
                    dataSource: [
                        { HallText: 'Hall 1', Id: 1, HallColor: '#cb6bb2' },
                        { HallText: 'Hall 2', Id: 2, HallColor: '#56ca85', Expand: false }
                    ],
                    textField: 'HallText', idField: 'Id', colorField: 'HallColor', expandedField: 'Expand'
                }, {
                    field: 'RoomId', title: 'Room', name: 'Rooms', allowMultiple: false,
                    dataSource: [
                        { RoomText: 'ROOM 1', Id: 1, RoomGroupId: 1, RoomColor: '#cb6bb2', Expand: false },
                        { RoomText: 'ROOM 2', Id: 2, RoomGroupId: 2, RoomColor: '#56ca85' },
                        { RoomText: 'ROOM 3', Id: 3, RoomGroupId: 1, RoomColor: '#56ca85' }
                    ],
                    textField: 'RoomText', idField: 'Id', groupIDField: 'RoomGroupId', colorField: 'RoomColor', expandedField: 'Expand'
                }, {
                    field: 'OwnerId', title: 'Owner', name: 'Owners', allowMultiple: true,
                    dataSource: [
                        { OwnerText: 'Nancy', Id: 1, OwnerGroupId: 1, OwnerColor: '#ffaa00' },
                        { OwnerText: 'Steven', Id: 2, OwnerGroupId: 2, OwnerColor: '#f8a398' },
                        { OwnerText: 'Michael', Id: 3, OwnerGroupId: 3, OwnerColor: '#7499e1' },
                        { OwnerText: 'Oliver', Id: 4, OwnerGroupId: 1, OwnerColor: '#ffaa00' },
                        { OwnerText: 'John', Id: 5, OwnerGroupId: 2, OwnerColor: '#f8a398' },
                        { OwnerText: 'Barry', Id: 6, OwnerGroupId: 3, OwnerColor: '#7499e1' },
                        { OwnerText: 'Felicity', Id: 7, OwnerGroupId: 1, OwnerColor: '#ffaa00' },
                        { OwnerText: 'Cisco', Id: 8, OwnerGroupId: 2, OwnerColor: '#f8a398' },
                        { OwnerText: 'Sara', Id: 9, OwnerGroupId: 3, OwnerColor: '#7499e1' },
                        { OwnerText: 'Malcolm', Id: 10, OwnerGroupId: 1, OwnerColor: '#ffaa00' }
                    ],
                    textField: 'OwnerText', idField: 'Id', groupIDField: 'OwnerGroupId',
                    colorField: 'OwnerColor', expandedField: 'Expand'
                }],
                selectedDate: new Date(2018, 4, 1)
            };
            schObj = util.createSchedule(model, timelineResourceData, done);
            keyModule = schObj.keyboardInteractionModule;
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('checking resource title rendering', () => {
            const headerRow: HTMLElement = schObj.element.querySelector('.e-timeline-month-view tr') as HTMLElement;
            expect(headerRow.children.length).toEqual(2);
            expect(headerRow.children[0].classList.contains('e-resource-left-td')).toEqual(true);
            expect(headerRow.children[0].children[0].innerHTML).toEqual('');
        });
        it('checking resource tree rendering', () => {
            const contentRow: HTMLElement = schObj.element.querySelector('.e-timeline-month-view table tbody') as HTMLElement;
            expect(contentRow.children[1].children.length).toEqual(2);
            expect([contentRow.children[1].querySelector('td div.e-resource-column-wrap')].length).toEqual(1);
            const resourceRow: HTMLElement = schObj.element.querySelector('.e-resource-column-wrap tbody') as HTMLElement;
            expect(resourceRow.children.length).toEqual(15);
            expect([resourceRow.querySelector('tr td.e-resource-cells')].length).toEqual(1);
            expect([resourceRow.querySelector('tr td.e-resource-cells div.e-resource-tree-icon')].length).toEqual(1);
            expect([resourceRow.querySelector('tr td.e-resource-cells div.e-resource-collapse')].length).toEqual(1);
            expect([resourceRow.querySelector('tr td.e-parent-node')].length).toEqual(1);
            expect(resourceRow.querySelector('tr td.e-resource-cells').children.length).toEqual(2);
            expect(resourceRow.querySelector('tr td.e-resource-cells div.e-resource-text').innerHTML).toEqual('Hall 1');
            expect([resourceRow.querySelector('tr td.e-resource-cells div.e-resource-tree-icon')].length).toEqual(1);
            expect([resourceRow.querySelector('tr td.e-resource-cells div.e-resource-collapse')].length).toEqual(1);
            expect([resourceRow.querySelector('tr td.e-parent-node')].length).toEqual(1);
            expect(resourceRow.children[1].querySelector('.e-resource-cells').children.length).toEqual(2);
            expect(resourceRow.children[1].querySelector('.e-resource-cells div.e-resource-text').innerHTML).toEqual('ROOM 1');
            expect([resourceRow.children[2].querySelector('.e-child-node')].length).toEqual(1);
            expect(resourceRow.children[2].querySelector('.e-child-node').children.length).toEqual(1);
            const contentRows: HTMLElement = contentRow.children[1].children[1].querySelector('tbody');
            expect(contentRows.children.length).toEqual(15);
        });
        it('resource icon click testing', () => {
            const resourceRow: HTMLElement = schObj.element.querySelector('.e-resource-column-wrap tbody') as HTMLElement;
            const beforeExpand: NodeListOf<Element> = schObj.element.querySelectorAll('.e-resource-column-wrap tbody tr:not(.e-hidden)');
            expect(beforeExpand.length).toEqual(7);
            const firstRow: HTMLElement = resourceRow.children[1].querySelector('.e-resource-cells div.e-resource-tree-icon') as HTMLElement;
            firstRow.click();
            const afterExpand: NodeListOf<Element> = schObj.element.querySelectorAll('.e-resource-column-wrap tbody tr:not(.e-hidden)');
            expect(afterExpand.length).toEqual(11);
            expect(resourceRow.children[1].classList.contains('e-hidden')).toEqual(false);
            expect([resourceRow.children[1].querySelector('.e-resource-cells div.e-resource-collapse')].length).toEqual(1);
            expect(resourceRow.children[2].classList.contains('e-hidden')).toEqual(false);
            expect(resourceRow.children[2].querySelector('.e-resource-cells div.e-resource-text').innerHTML).toEqual('Nancy');
        });

        it('Checking events elements', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList.length).toEqual(11);
            const eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
            expect(eventWrapperList.length).toEqual(7);
        });

        it('Checking Left icon', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[1].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Recurrence Event - Greater than 24');
            expect(eventElementList[1].querySelectorAll('.e-appointment-details .e-indicator')[0].classList.contains('e-left-icon'))
                .toBeTruthy();
        });

        it('Checking recurrence icon', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[4].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Recurrence Event - Previous week');
            expect(eventElementList[4].querySelectorAll('.e-appointment-details .e-icons')[1].classList.contains('e-recurrence-icon'))
                .toBeTruthy();
        });

        it('More event element checking', () => {
            const moreIndicatorList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
            expect(moreIndicatorList.length).toEqual(12);
            const element: HTMLElement = moreIndicatorList[0] as HTMLElement;
            element.click();
            const morePopup: HTMLElement = schObj.element.querySelector('.e-more-popup-wrapper') as HTMLElement;
            const moreEventList: Element[] = [].slice.call(morePopup.querySelectorAll('.e-more-appointment-wrapper .e-appointment'));
            expect(moreEventList.length).toEqual(2);
            util.triggerMouseEvent(morePopup.querySelector('.e-more-event-close'), 'click');
        });
        it('cell single click', () => {
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[100] as HTMLElement, 'click');
            const cellPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(cellPopup.classList).toContain('e-popup-open');
            const moreDetail: HTMLElement = <HTMLElement>cellPopup.querySelector('.e-event-details');
            expect(moreDetail.classList).toContain('e-btn');
            expect(moreDetail.classList).toContain('e-flat');
            expect(moreDetail.innerHTML).toEqual('More Details');
            const save: HTMLElement = cellPopup.querySelector('.e-event-create');
            expect(save.classList).toContain('e-primary');
            expect(save.innerHTML).toEqual('Save');
            const close: HTMLElement = cellPopup.querySelector('.e-close-icon');
            expect(close.classList).toContain('e-btn-icon');
            close.click();
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.cellIndex).toEqual(7);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(3);
        });
        it('cell double click', () => {
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[100] as HTMLElement, 'dblclick');
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            expect(dialogElement.querySelector('.' + cls.EVENT_WINDOW_TITLE_TEXT_CLASS).innerHTML).toEqual('New Event');
            expect(dialogElement.querySelector('.e-subject-container label').innerHTML).toEqual('Title');
            expect(dialogElement.querySelector('.e-location-container label').innerHTML).toEqual('Location');
            expect(dialogElement.querySelector('.e-start-container label').innerHTML).toEqual('Start');
            expect(dialogElement.querySelector('.e-end-container label').innerHTML).toEqual('End');
            expect(dialogElement.querySelector('.e-start-time-zone-container label').innerHTML).toEqual('Start Timezone');
            expect(dialogElement.querySelector('.e-end-time-zone-container label').innerHTML).toEqual('End Timezone');
            expect(dialogElement.querySelector('.e-description-container label').innerHTML).toEqual('Description');
            expect(dialogElement.querySelector('.e-all-day-container .e-label').innerHTML).toEqual('All day');
            expect(dialogElement.querySelector('.e-time-zone-container .e-label').innerHTML).toEqual('Timezone');
            const hall: DropDownList = (dialogElement.querySelector('.e-HallId') as EJ2Instance).ej2_instances[0] as DropDownList;
            expect(hall.text).toEqual('Hall 1');
            expect(hall.value).toEqual(1);
            const room: DropDownList = (dialogElement.querySelector('.e-RoomId') as EJ2Instance).ej2_instances[0] as DropDownList;
            expect(room.text).toEqual('ROOM 1');
            const owner: DropDownList = (dialogElement.querySelector('.e-OwnerId') as EJ2Instance).ej2_instances[0] as DropDownList;
            expect(owner.text).toEqual('Oliver');
            const cancelButton: HTMLElement = dialogElement.querySelector('.e-event-cancel') as HTMLElement;
            cancelButton.click();
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.cellIndex).toEqual(7);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(3);
        });
        it('event single click', () => {
            const event: HTMLElement = schObj.element.querySelectorAll('.e-appointment')[0] as HTMLElement;
            util.triggerMouseEvent(event, 'click');
            const eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup.classList).toContain('e-popup-open');
            const edit: HTMLElement = eventPopup.querySelector('.e-edit');
            expect(edit.children[0].classList).toContain('e-edit-icon');
            const deleteIcon: HTMLElement = eventPopup.querySelector('.e-delete');
            expect(deleteIcon.children[0].classList).toContain('e-delete-icon');
            (eventPopup.querySelector('.e-close-icon') as HTMLElement).click();
            expect(event.classList).toContain('e-appointment-border');
        });
        it('event double click', () => {
            const event: HTMLElement = schObj.element.querySelectorAll('.e-appointment')[0] as HTMLElement;
            util.triggerMouseEvent(event, 'dblclick');
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            expect(dialogElement.querySelector('.' + cls.EVENT_WINDOW_TITLE_TEXT_CLASS).innerHTML).toEqual('Edit Event');
            const hall: DropDownList = (dialogElement.querySelector('.e-HallId') as EJ2Instance).ej2_instances[0] as DropDownList;
            expect(hall.text).toEqual('Hall 1');
            expect(hall.value).toEqual(1);
            const room: DropDownList = (dialogElement.querySelector('.e-RoomId') as EJ2Instance).ej2_instances[0] as DropDownList;
            expect(room.text).toEqual('ROOM 1');
            const owner: DropDownList = (dialogElement.querySelector('.e-OwnerId') as EJ2Instance).ej2_instances[0] as DropDownList;
            expect(owner.text).toEqual('Nancy');
            const cancelButton: HTMLElement = dialogElement.querySelector('.e-event-cancel') as HTMLElement;
            cancelButton.click();
        });
        it('event save by clicking cell', (done: DoneFn) => {
            const eventWrap: HTMLElement = schObj.element.querySelector('.e-event-table div:nth-child(3)');
            const event: HTMLElement[] = [].slice.call(eventWrap.querySelectorAll('.e-appointment'));
            expect(event.length).toEqual(1);
            expect(event[0].getAttribute('data-id')).toEqual('Appointment_1');
            const workCell: HTMLElement = schObj.element.querySelector('.e-content-table tr:nth-child(3) td:nth-child(3)') as HTMLElement;
            util.triggerMouseEvent(workCell, 'click');
            util.triggerMouseEvent(workCell, 'dblclick');
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const saveButton: HTMLElement = dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS) as HTMLElement;
            saveButton.click();
            schObj.dataBound = () => {
                const eventWrap: HTMLElement = schObj.element.querySelector('.e-event-table div:nth-child(3)');
                const event: HTMLElement[] = [].slice.call(eventWrap.querySelectorAll('.e-appointment'));
                expect(event.length).toEqual(2);
                expect(event[0].getAttribute('data-id')).toEqual('Appointment_1');
                expect(event[1].getAttribute('data-id')).toEqual('Appointment_16');
                done();
            };
        });

        it('Checking rowAutoHeight property', (done: DoneFn) => {
            schObj.dataBound = () => {
                const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(eventElementList.length).toEqual(19);
                const eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
                expect(eventWrapperList.length).toEqual(7);
                const moreIndicatorList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
                expect(moreIndicatorList.length).toEqual(0);
                done();
            };
            schObj.rowAutoHeight = true;
            schObj.dataBind();
        });

        it('Checking resource icon click through enter key', () => {
            const resourceRow: Element = schObj.element.querySelector('.e-resource-column-wrap tbody');
            const beforeExpand: NodeListOf<Element> = schObj.element.querySelectorAll('.e-resource-column-wrap tbody tr:not(.e-hidden)');
            expect(beforeExpand.length).toEqual(11);
            const firstRow: Element = resourceRow.children[1].querySelector('.e-resource-cells');
            keyModule.keyActionHandler({ action: 'enter', target: firstRow });
            const afterExpand: NodeListOf<Element> = schObj.element.querySelectorAll('.e-resource-column-wrap tbody tr:not(.e-hidden)');
            expect(afterExpand.length).toEqual(7);
            expect(resourceRow.children[1].classList.contains('e-hidden')).toEqual(false);
            expect([resourceRow.children[1].querySelector('.e-resource-cells div.e-resource-collapse')].length).toEqual(1);
            expect(resourceRow.children[2].classList.contains('e-hidden')).toEqual(true);
            expect(resourceRow.children[2].querySelector('.e-resource-cells div.e-resource-text').innerHTML).toEqual('Nancy');
        });
    });

    describe('Custom work days of Resources in group', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                width: '100%', height: '550px', currentView: 'TimelineMonth',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineMonth'],
                selectedDate: new Date(2018, 7, 6),
                group: { resources: ['Rooms', 'Owners'] },
                resources: [{
                    field: 'RoomId', title: 'Room', name: 'Rooms', allowMultiple: false,
                    dataSource: [
                        { text: 'ROOM 1', id: 1, color: '#cb6bb2', workDays: [] },
                        { text: 'ROOM 2', id: 2, color: '#56ca85', workDays: [] }
                    ],
                    textField: 'text', idField: 'id', colorField: 'color', workDaysField: 'workDays'
                }, {
                    field: 'OwnerId', title: 'Owner', name: 'Owners', allowMultiple: true,
                    dataSource: [
                        { text: 'Nancy', id: 1, groupId: 1, color: '#ffaa00', workDays: [0, 1, 3] },
                        { text: 'Steven', id: 2, groupId: 2, color: '#f8a398', workDays: [1, 3, 5] },
                        { text: 'Michael', id: 3, groupId: 1, color: '#7499e1', workDays: [2, 3, 4] }
                    ],
                    textField: 'text', idField: 'id', groupIDField: 'groupId', colorField: 'color', workDaysField: 'workDays'
                }]
            };
            schObj = util.createSchedule(model, [], done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('work days count', (done: DoneFn) => {
            expect(schObj.element.querySelectorAll('.e-work-days').length).toBe(41);
            const contentTable: NodeListOf<Element> = schObj.element.querySelectorAll('.e-content-table tr');
            expect((<Element>contentTable[1].childNodes[1]).classList.contains('e-work-days')).toEqual(false);
            expect((<Element>contentTable[1].childNodes[0]).classList.contains('e-work-days')).toEqual(true);
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-work-days').length).toBe(37);
                done();
            };
        });
    });

    describe('Single level resource rendering in RTL', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                height: '550px', width: '100%', enableRtl: true, currentView: 'TimelineMonth',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineMonth'],
                group: { resources: ['Owners'] },
                resources: [{
                    field: 'OwnerId', title: 'Owner', name: 'Owners', allowMultiple: true,
                    dataSource: [
                        { OwnerText: 'Nancy', Id: 1, OwnerColor: '#ffaa00' },
                        { OwnerText: 'Steven', Id: 2, OwnerColor: '#f8a398' },
                        { OwnerText: 'Michael', Id: 3, OwnerColor: '#7499e1' },
                        { OwnerText: 'Oliver', Id: 4, OwnerColor: '#ffaa00' },
                        { OwnerText: 'John', Id: 5, OwnerColor: '#f8a398' },
                        { OwnerText: 'Barry', Id: 6, OwnerColor: '#7499e1' },
                        { OwnerText: 'Felicity', Id: 7, OwnerColor: '#ffaa00' },
                        { OwnerText: 'Cisco', Id: 8, OwnerColor: '#f8a398' },
                        { OwnerText: 'Sara', Id: 9, OwnerColor: '#7499e1' },
                        { OwnerText: 'Malcolm', Id: 10, OwnerColor: '#ffaa00' }
                    ],
                    textField: 'OwnerText', idField: 'Id', colorField: 'OwnerColor'
                }],
                selectedDate: new Date(2018, 4, 1)
            };
            schObj = util.createSchedule(model, timelineResourceData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('checking resource title rendering', () => {
            const headerRow: HTMLElement = schObj.element.querySelector('.e-timeline-month-view tr') as HTMLElement;
            expect(headerRow.children.length).toEqual(2);
            expect(headerRow.children[0].classList.contains('e-resource-left-td')).toEqual(true);
            expect(headerRow.children[0].children[0].innerHTML).toEqual('');
        });
        it('checking resource tree rendering', () => {
            const contentRow: HTMLElement = schObj.element.querySelector('.e-timeline-month-view table tbody') as HTMLElement;
            expect(contentRow.children[1].children.length).toEqual(2);
            expect([contentRow.children[1].querySelector('td div.e-resource-column-wrap')].length).toEqual(1);
            const resourceRow: HTMLElement = schObj.element.querySelector('.e-resource-column-wrap tbody') as HTMLElement;
            expect(resourceRow.children.length).toEqual(10);
            expect([resourceRow.querySelector('tr td.e-resource-cells')].length).toEqual(1);
            expect([resourceRow.querySelector('tr td.e-resource-cells div.e-resource-text')].length).toEqual(1);
            expect(resourceRow.querySelector('tr td.e-resource-cells div.e-resource-text').innerHTML).toEqual('Nancy');
            const contentRows: HTMLElement = contentRow.children[1].children[1].querySelector('tbody');
            expect(contentRows.children.length).toEqual(10);
        });
        it('Checking events elements', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList.length).toEqual(19);
            const eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
            expect(eventWrapperList.length).toEqual(9);
        });

        it('Checking Left icon', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[1].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Spanned Event - Less than 24');
            expect(eventElementList[1].querySelectorAll('.e-appointment-details .e-indicator')[0].classList.contains('e-left-icon'))
                .toBeTruthy();
        });

        it('Checking recurrence icon', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[4].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Recurrence Event - Greater than 24');
            expect(eventElementList[4].querySelectorAll('.e-appointment-details .e-icons')[0].classList.contains('e-recurrence-icon'))
                .toBeTruthy();
        });

        it('More event element checking', () => {
            const moreIndicatorList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
            expect(moreIndicatorList.length).toEqual(10);
            const element: HTMLElement = moreIndicatorList[0] as HTMLElement;
            element.click();
            const morePopup: HTMLElement = schObj.element.querySelector('.e-more-popup-wrapper') as HTMLElement;
            const moreEventList: Element[] = [].slice.call(morePopup.querySelectorAll('.e-more-appointment-wrapper .e-appointment'));
            expect(moreEventList.length).toEqual(2);
            util.triggerMouseEvent(morePopup.querySelector('.e-more-event-close'), 'click');
        });

        it('Checking rowAutoHeight property', (done: DoneFn) => {
            schObj.dataBound = () => {
                const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(eventElementList.length).toEqual(23);
                const eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
                expect(eventWrapperList.length).toEqual(9);
                const moreIndicatorList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
                expect(moreIndicatorList.length).toEqual(0);
                done();
            };
            schObj.rowAutoHeight = true;
            schObj.dataBind();
        });
    });

    describe('Multi level resource rendering in RTL', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                height: '550px', width: '100%', enableRtl: true, currentView: 'TimelineMonth',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineMonth'],
                group: { resources: ['Halls', 'Rooms', 'Owners'] },
                resources: [{
                    field: 'HallId', title: 'Hall', name: 'Halls', allowMultiple: false,
                    dataSource: [
                        { HallText: 'Hall 1', Id: 1, HallColor: '#cb6bb2' },
                        { HallText: 'Hall 2', Id: 2, HallColor: '#56ca85' }
                    ],
                    textField: 'HallText', idField: 'Id', colorField: 'HallColor'
                }, {
                    field: 'RoomId', title: 'Room', name: 'Rooms', allowMultiple: false,
                    dataSource: [
                        { RoomText: 'ROOM 1', Id: 1, RoomGroupId: 1, RoomColor: '#cb6bb2' },
                        { RoomText: 'ROOM 2', Id: 2, RoomGroupId: 2, RoomColor: '#56ca85' },
                        { RoomText: 'ROOM 3', Id: 3, RoomGroupId: 1, RoomColor: '#56ca85' }
                    ],
                    textField: 'RoomText', idField: 'Id', groupIDField: 'RoomGroupId', colorField: 'RoomColor'
                }, {
                    field: 'OwnerId', title: 'Owner', name: 'Owners', allowMultiple: true,
                    dataSource: [
                        { OwnerText: 'Nancy', Id: 1, OwnerGroupId: 1, OwnerColor: '#ffaa00' },
                        { OwnerText: 'Steven', Id: 2, OwnerGroupId: 2, OwnerColor: '#f8a398' },
                        { OwnerText: 'Michael', Id: 3, OwnerGroupId: 3, OwnerColor: '#7499e1' },
                        { OwnerText: 'Oliver', Id: 4, OwnerGroupId: 1, OwnerColor: '#ffaa00' },
                        { OwnerText: 'John', Id: 5, OwnerGroupId: 2, OwnerColor: '#f8a398' },
                        { OwnerText: 'Barry', Id: 6, OwnerGroupId: 3, OwnerColor: '#7499e1' },
                        { OwnerText: 'Felicity', Id: 7, OwnerGroupId: 1, OwnerColor: '#ffaa00' },
                        { OwnerText: 'Cisco', Id: 8, OwnerGroupId: 2, OwnerColor: '#f8a398' },
                        { OwnerText: 'Sara', Id: 9, OwnerGroupId: 3, OwnerColor: '#7499e1' },
                        { OwnerText: 'Malcolm', Id: 10, OwnerGroupId: 1, OwnerColor: '#ffaa00' }
                    ],
                    textField: 'OwnerText', idField: 'Id', groupIDField: 'OwnerGroupId', colorField: 'OwnerColor'
                }],
                selectedDate: new Date(2018, 4, 1)
            };
            schObj = util.createSchedule(model, timelineResourceData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('checking resource title rendering', () => {
            const headerRow: HTMLElement = schObj.element.querySelector('.e-timeline-month-view tr') as HTMLElement;
            expect(headerRow.children.length).toEqual(2);
            expect(headerRow.children[0].classList.contains('e-resource-left-td')).toEqual(true);
            expect(headerRow.children[0].children[0].innerHTML).toEqual('');
        });
        it('checking resource tree rendering', () => {
            const contentRow: HTMLElement = schObj.element.querySelector('.e-timeline-month-view table tbody') as HTMLElement;
            expect(contentRow.children[1].children.length).toEqual(2);
            expect([contentRow.children[1].querySelector('td div.e-resource-column-wrap')].length).toEqual(1);
            const resourceRow: HTMLElement = schObj.element.querySelector('.e-resource-column-wrap tbody') as HTMLElement;
            expect(resourceRow.children.length).toEqual(15);
            expect([resourceRow.querySelector('tr td.e-resource-cells')].length).toEqual(1);
            expect([resourceRow.querySelector('tr td.e-resource-cells div.e-resource-tree-icon')].length).toEqual(1);
            expect([resourceRow.querySelector('tr td.e-resource-cells div.e-resource-collapse')].length).toEqual(1);
            expect([resourceRow.querySelector('tr td.e-parent-node')].length).toEqual(1);
            expect(resourceRow.querySelector('tr td.e-resource-cells').children.length).toEqual(2);
            expect(resourceRow.querySelector('tr td.e-resource-cells div.e-resource-text').innerHTML).toEqual('Hall 1');
            expect([resourceRow.querySelector('tr td.e-resource-cells div.e-resource-tree-icon')].length).toEqual(1);
            expect([resourceRow.querySelector('tr td.e-resource-cells div.e-resource-collapse')].length).toEqual(1);
            expect([resourceRow.querySelector('tr td.e-parent-node')].length).toEqual(1);
            expect(resourceRow.children[1].querySelector('.e-resource-cells').children.length).toEqual(2);
            expect(resourceRow.children[1].querySelector('.e-resource-cells div.e-resource-text').innerHTML).toEqual('ROOM 1');
            expect([resourceRow.children[2].querySelector('.e-child-node')].length).toEqual(1);
            expect(resourceRow.children[2].querySelector('.e-child-node').children.length).toEqual(1);
            const contentRows: HTMLElement = contentRow.children[1].children[1].querySelector('tbody');
            expect(contentRows.children.length).toEqual(15);
        });
        it('Checking events elements', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList.length).toEqual(15);
            const eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
            expect(eventWrapperList.length).toEqual(7);
        });

        it('Checking Left icon', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[1].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Recurrence Event - Greater than 24');
            expect(eventElementList[1].querySelectorAll('.e-appointment-details .e-indicator')[0].classList.contains('e-left-icon'))
                .toBeTruthy();
        });

        it('Checking recurrence icon', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[4].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Recurrence Event - Previous week');
            expect(eventElementList[4].querySelectorAll('.e-appointment-details .e-icons')[1].classList.contains('e-recurrence-icon'))
                .toBeTruthy();
        });

        it('More event element checking', () => {
            const moreIndicatorList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
            expect(moreIndicatorList.length).toEqual(5);
            const element: HTMLElement = moreIndicatorList[0] as HTMLElement;
            element.click();
            const morePopup: HTMLElement = schObj.element.querySelector('.e-more-popup-wrapper') as HTMLElement;
            const moreEventList: Element[] = [].slice.call(morePopup.querySelectorAll('.e-more-appointment-wrapper .e-appointment'));
            expect(moreEventList.length).toEqual(2);
            util.triggerMouseEvent(morePopup.querySelector('.e-more-event-close'), 'click');
        });

        it('Checking rowAutoHeight property', (done: DoneFn) => {
            schObj.dataBound = () => {
                const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(eventElementList.length).toEqual(18);
                const moreIndicatorList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
                expect(moreIndicatorList.length).toEqual(0);
                done();
            };
            schObj.rowAutoHeight = true;
            schObj.dataBind();
        });
    });

    describe('Multi level resource rendering with expanded property in RTL', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                height: '550px', width: '100%', enableRtl: true, currentView: 'TimelineMonth',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineMonth'],
                group: { resources: ['Halls', 'Rooms', 'Owners'] },
                resources: [{
                    field: 'HallId', title: 'Hall', name: 'Halls', allowMultiple: false,
                    dataSource: [
                        { HallText: 'Hall 1', Id: 1, HallColor: '#cb6bb2' },
                        { HallText: 'Hall 2', Id: 2, HallColor: '#56ca85', Expand: false }
                    ],
                    textField: 'HallText', idField: 'Id', colorField: 'HallColor', expandedField: 'Expand'
                }, {
                    field: 'RoomId', title: 'Room', name: 'Rooms', allowMultiple: false,
                    dataSource: [
                        { RoomText: 'ROOM 1', Id: 1, RoomGroupId: 1, RoomColor: '#cb6bb2', Expand: false },
                        { RoomText: 'ROOM 2', Id: 2, RoomGroupId: 2, RoomColor: '#56ca85' },
                        { RoomText: 'ROOM 3', Id: 3, RoomGroupId: 1, RoomColor: '#56ca85' }
                    ],
                    textField: 'RoomText', idField: 'Id', groupIDField: 'RoomGroupId', colorField: 'RoomColor', expandedField: 'Expand'
                }, {
                    field: 'OwnerId', title: 'Owner', name: 'Owners', allowMultiple: true,
                    dataSource: [
                        { OwnerText: 'Nancy', Id: 1, OwnerGroupId: 1, OwnerColor: '#ffaa00' },
                        { OwnerText: 'Steven', Id: 2, OwnerGroupId: 2, OwnerColor: '#f8a398' },
                        { OwnerText: 'Michael', Id: 3, OwnerGroupId: 3, OwnerColor: '#7499e1' },
                        { OwnerText: 'Oliver', Id: 4, OwnerGroupId: 1, OwnerColor: '#ffaa00' },
                        { OwnerText: 'John', Id: 5, OwnerGroupId: 2, OwnerColor: '#f8a398' },
                        { OwnerText: 'Barry', Id: 6, OwnerGroupId: 3, OwnerColor: '#7499e1' },
                        { OwnerText: 'Felicity', Id: 7, OwnerGroupId: 1, OwnerColor: '#ffaa00' },
                        { OwnerText: 'Cisco', Id: 8, OwnerGroupId: 2, OwnerColor: '#f8a398' },
                        { OwnerText: 'Sara', Id: 9, OwnerGroupId: 3, OwnerColor: '#7499e1' },
                        { OwnerText: 'Malcolm', Id: 10, OwnerGroupId: 1, OwnerColor: '#ffaa00' }
                    ],
                    textField: 'OwnerText', idField: 'Id', groupIDField: 'OwnerGroupId',
                    colorField: 'OwnerColor', expandedField: 'Expand'
                }],
                selectedDate: new Date(2018, 4, 1)
            };
            schObj = util.createSchedule(model, timelineResourceData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('checking resource title rendering', () => {
            const headerRow: HTMLElement = schObj.element.querySelector('.e-timeline-month-view tr') as HTMLElement;
            expect(headerRow.children.length).toEqual(2);
            expect(headerRow.children[0].classList.contains('e-resource-left-td')).toEqual(true);
            expect(headerRow.children[0].children[0].innerHTML).toEqual('');
        });
        it('checking resource tree rendering', () => {
            const contentRow: HTMLElement = schObj.element.querySelector('.e-timeline-month-view table tbody') as HTMLElement;
            expect(contentRow.children[1].children.length).toEqual(2);
            expect([contentRow.children[1].querySelector('td div.e-resource-column-wrap')].length).toEqual(1);
            const resourceRow: HTMLElement = schObj.element.querySelector('.e-resource-column-wrap tbody') as HTMLElement;
            expect(resourceRow.children.length).toEqual(15);
            expect([resourceRow.querySelector('tr td.e-resource-cells')].length).toEqual(1);
            expect([resourceRow.querySelector('tr td.e-resource-cells div.e-resource-tree-icon')].length).toEqual(1);
            expect([resourceRow.querySelector('tr td.e-resource-cells div.e-resource-collapse')].length).toEqual(1);
            expect([resourceRow.querySelector('tr td.e-parent-node')].length).toEqual(1);
            expect(resourceRow.querySelector('tr td.e-resource-cells').children.length).toEqual(2);
            expect(resourceRow.querySelector('tr td.e-resource-cells div.e-resource-text').innerHTML).toEqual('Hall 1');
            expect([resourceRow.querySelector('tr td.e-resource-cells div.e-resource-tree-icon')].length).toEqual(1);
            expect([resourceRow.querySelector('tr td.e-resource-cells div.e-resource-collapse')].length).toEqual(1);
            expect([resourceRow.querySelector('tr td.e-parent-node')].length).toEqual(1);
            expect(resourceRow.children[1].querySelector('.e-resource-cells').children.length).toEqual(2);
            expect(resourceRow.children[1].querySelector('.e-resource-cells div.e-resource-text').innerHTML).toEqual('ROOM 1');
            expect([resourceRow.children[2].querySelector('.e-child-node')].length).toEqual(1);
            expect(resourceRow.children[2].querySelector('.e-child-node').children.length).toEqual(1);
            const contentRows: HTMLElement = contentRow.children[1].children[1].querySelector('tbody');
            expect(contentRows.children.length).toEqual(15);
        });
        it('resource icon click testing', () => {
            const resourceRow: HTMLElement = schObj.element.querySelector('.e-resource-column-wrap tbody') as HTMLElement;
            const beforeExpand: NodeListOf<Element> = schObj.element.querySelectorAll('.e-resource-column-wrap tbody tr:not(.e-hidden)');
            expect(beforeExpand.length).toEqual(7);
            const firstRow: HTMLElement = resourceRow.children[1].querySelector('.e-resource-cells div.e-resource-tree-icon') as HTMLElement;
            firstRow.click();
            const afterExpand: NodeListOf<Element> = schObj.element.querySelectorAll('.e-resource-column-wrap tbody tr:not(.e-hidden)');
            expect(afterExpand.length).toEqual(11);
            expect(resourceRow.children[1].classList.contains('e-hidden')).toEqual(false);
            expect([resourceRow.children[1].querySelector('.e-resource-cells div.e-resource-collapse')].length).toEqual(1);
            expect(resourceRow.children[2].classList.contains('e-hidden')).toEqual(false);
            expect(resourceRow.children[2].querySelector('.e-resource-cells div.e-resource-text').innerHTML).toEqual('Nancy');
        });

        it('Checking events elements', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList.length).toEqual(11);
            const eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
            expect(eventWrapperList.length).toEqual(7);
        });

        it('Checking Left icon', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[1].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Recurrence Event - Greater than 24');
            expect(eventElementList[1].querySelectorAll('.e-appointment-details .e-indicator')[0].classList.contains('e-left-icon'))
                .toBeTruthy();
        });

        it('Checking recurrence icon', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[4].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Recurrence Event - Previous week');
            expect(eventElementList[4].querySelectorAll('.e-appointment-details .e-icons')[1].classList.contains('e-recurrence-icon'))
                .toBeTruthy();
        });

        it('More event element checking', () => {
            const moreIndicatorList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
            expect(moreIndicatorList.length).toEqual(12);
            const element: HTMLElement = moreIndicatorList[0] as HTMLElement;
            element.click();
            const morePopup: HTMLElement = schObj.element.querySelector('.e-more-popup-wrapper') as HTMLElement;
            const moreEventList: Element[] = [].slice.call(morePopup.querySelectorAll('.e-more-appointment-wrapper .e-appointment'));
            expect(moreEventList.length).toEqual(2);
            util.triggerMouseEvent(morePopup.querySelector('.e-more-event-close'), 'click');
        });
    });

    describe('Single level resource rendering with Template', () => {
        let schObj: Schedule;
        const restemplate: string = '<div class="tWrap"><div class="rText" style="background:pink">${getResourceName(data)}</div></div>';
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                height: '550px', width: '100%', resourceHeaderTemplate: restemplate,
                currentView: 'TimelineMonth', views: ['TimelineDay', 'TimelineWeek', 'TimelineMonth'],
                group: { resources: ['Owners'] },
                resources: [{
                    field: 'OwnerId', title: 'Owner', name: 'Owners', allowMultiple: true,
                    dataSource: [
                        { OwnerText: 'Nancy', Id: 1, OwnerColor: '#ffaa00' },
                        { OwnerText: 'Steven', Id: 2, OwnerColor: '#f8a398' },
                        { OwnerText: 'Michael', Id: 3, OwnerColor: '#7499e1' }
                    ],
                    textField: 'OwnerText', idField: 'Id', colorField: 'OwnerColor'
                }],
                selectedDate: new Date(2017, 10, 1)
            };
            schObj = util.createSchedule(model, [], done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('checking resource template rendering', () => {
            const contentRow: HTMLElement = schObj.element.querySelector('.e-timeline-month-view table tbody') as HTMLElement;
            expect([contentRow.children[1].querySelector('td div.e-resource-column-wrap')].length).toEqual(1);
            const resourceRow: HTMLElement = schObj.element.querySelector('.e-resource-column-wrap tbody') as HTMLElement;
            expect(resourceRow.children.length).toEqual(3);
            expect([resourceRow.querySelector('tr td.e-resource-cells')].length).toEqual(1);
            expect([resourceRow.querySelector('tr td.e-resource-cells div.tWrap')].length).toEqual(1);
            expect(resourceRow.querySelector('tr td.e-resource-cells div.tWrap').children.length).toEqual(1);
            const templateDiv: HTMLElement = resourceRow.querySelector('tr td.e-resource-cells div.tWrap div.rText') as HTMLElement;
            expect([templateDiv].length).toEqual(1);
            expect(templateDiv.style.backgroundColor).toEqual('pink');
            expect(templateDiv.innerHTML).toEqual('Nancy');
            const contentRows: HTMLElement = contentRow.children[1].children[1].querySelector('tbody');
            expect(contentRows.children.length).toEqual(3);
        });
    });

    describe('Multi level resource rendering with template', () => {
        let schObj: Schedule;
        const restemplate: string = '<div class="tWrap"><div class="rText" style="background:pink">${getResourceName(data)}</div></div>';
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                height: '550px', width: '100%', resourceHeaderTemplate: restemplate,
                currentView: 'TimelineMonth', views: ['TimelineDay', 'TimelineWeek', 'TimelineMonth'],
                group: { resources: ['Halls', 'Rooms', 'Owners'] },
                resources: [{
                    field: 'HallId', title: 'Hall', name: 'Halls', allowMultiple: false,
                    dataSource: [
                        { HallText: 'Hall 1', Id: 1, HallColor: '#cb6bb2' },
                        { HallText: 'Hall 2', Id: 2, HallColor: '#56ca85', Expand: false }
                    ],
                    textField: 'HallText', idField: 'Id', colorField: 'HallColor', expandedField: 'Expand'
                }, {
                    field: 'RoomId', title: 'Room', name: 'Rooms', allowMultiple: false,
                    dataSource: [
                        { RoomText: 'ROOM 1', Id: 1, RoomGroupId: 1, RoomColor: '#cb6bb2', Expand: false },
                        { RoomText: 'ROOM 2', Id: 2, RoomGroupId: 2, RoomColor: '#56ca85' },
                        { RoomText: 'ROOM 3', Id: 3, RoomGroupId: 1, RoomColor: '#56ca85' }
                    ],
                    textField: 'RoomText', idField: 'Id', groupIDField: 'RoomGroupId', colorField: 'RoomColor', expandedField: 'Expand'
                }, {
                    field: 'OwnerId', title: 'Owner', name: 'Owners', allowMultiple: true,
                    dataSource: [
                        { OwnerText: 'Nancy', Id: 1, OwnerGroupId: 1, OwnerColor: '#ffaa00' },
                        { OwnerText: 'Steven', Id: 2, OwnerGroupId: 2, OwnerColor: '#f8a398' },
                        { OwnerText: 'Michael', Id: 3, OwnerGroupId: 3, OwnerColor: '#7499e1' },
                        { OwnerText: 'Oliver', Id: 11, OwnerGroupId: 1, OwnerColor: '#ffaa00' },
                        { OwnerText: 'John', Id: 12, OwnerGroupId: 2, OwnerColor: '#f8a398' },
                        { OwnerText: 'Barry', Id: 13, OwnerGroupId: 3, OwnerColor: '#7499e1' },
                        { OwnerText: 'Felicity', Id: 21, OwnerGroupId: 1, OwnerColor: '#ffaa00' },
                        { OwnerText: 'Cisco', Id: 22, OwnerGroupId: 2, OwnerColor: '#f8a398' },
                        { OwnerText: 'Sara', Id: 23, OwnerGroupId: 3, OwnerColor: '#7499e1' },
                        { OwnerText: 'Malcolm', Id: 31, OwnerGroupId: 1, OwnerColor: '#ffaa00' }
                    ],
                    textField: 'OwnerText', idField: 'Id', groupIDField: 'OwnerGroupId',
                    colorField: 'OwnerColor', expandedField: 'Expand'
                }],
                selectedDate: new Date(2017, 10, 1)
            };
            schObj = util.createSchedule(model, [], done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('checking resource template rendering', () => {
            const contentRow: HTMLElement = schObj.element.querySelector('.e-timeline-month-view table tbody') as HTMLElement;
            expect([contentRow.children[1].querySelector('td div.e-resource-column-wrap')].length).toEqual(1);
            const resourceRow: HTMLElement = schObj.element.querySelector('.e-resource-column-wrap tbody') as HTMLElement;
            expect(resourceRow.children.length).toEqual(15);
            expect([resourceRow.querySelector('tr td.e-resource-cells')].length).toEqual(1);
            expect(resourceRow.querySelector('tr td.e-resource-cells').children.length).toEqual(2);
            expect([resourceRow.querySelector('tr td.e-resource-cells div.e-resource-tree-icon')].length).toEqual(1);
            expect([resourceRow.querySelector('tr td.e-resource-cells div.tWrap')].length).toEqual(1);
            expect(resourceRow.querySelector('tr td.e-resource-cells div.tWrap').children.length).toEqual(1);
            const templateDiv: HTMLElement = resourceRow.querySelector('tr td.e-resource-cells div.tWrap div.rText') as HTMLElement;
            expect([templateDiv].length).toEqual(1);
            expect(templateDiv.style.backgroundColor).toEqual('pink');
            expect(templateDiv.innerHTML).toEqual('Hall 1');
            const contentRows: HTMLElement = contentRow.children[1].children[1].querySelector('tbody');
            expect(contentRows.children.length).toEqual(15);
        });
    });

    describe('Group by-child multi level resource rendering with expand property', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                height: '550px', width: '100%', currentView: 'TimelineMonth',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineMonth'],
                group: {
                    byGroupID: false,
                    resources: ['Halls', 'Rooms', 'Owners']
                },
                resources: [{
                    field: 'HallId', title: 'Hall', name: 'Halls', allowMultiple: false,
                    dataSource: [
                        { HallText: 'Hall 1', Id: 1, HallColor: '#cb6bb2' },
                        { HallText: 'Hall 2', Id: 2, HallColor: '#56ca85' }
                    ],
                    textField: 'HallText', idField: 'Id', colorField: 'HallColor'
                }, {
                    field: 'RoomId', title: 'Room', name: 'Rooms', allowMultiple: false,
                    dataSource: [
                        { RoomText: 'ROOM 1', Id: 1, RoomColor: '#cb6bb2' },
                        { RoomText: 'ROOM 2', Id: 2, RoomColor: '#56ca85', Expand: false }
                    ],
                    textField: 'RoomText', idField: 'Id', colorField: 'RoomColor', expandedField: 'Expand'
                }, {
                    field: 'OwnerId', title: 'Owner', name: 'Owners', allowMultiple: true,
                    dataSource: [
                        { OwnerText: 'Nancy', Id: 1, OwnerColor: '#ffaa00' },
                        { OwnerText: 'Steven', Id: 2, OwnerColor: '#f8a398' },
                        { OwnerText: 'Michael', Id: 3, OwnerColor: '#7499e1' }
                    ],
                    textField: 'OwnerText', idField: 'Id', colorField: 'OwnerColor'
                }],
                selectedDate: new Date(2017, 10, 1)
            };
            schObj = util.createSchedule(model, [], done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('checking resource tree rendering', () => {
            const contentRow: HTMLElement = schObj.element.querySelector('.e-timeline-month-view table tbody') as HTMLElement;
            expect(contentRow.children[1].children.length).toEqual(2);
            expect([contentRow.children[1].querySelector('td div.e-resource-column-wrap')].length).toEqual(1);
            const resourceRow: HTMLElement = schObj.element.querySelector('.e-resource-column-wrap tbody') as HTMLElement;
            expect(resourceRow.children.length).toEqual(18);
            expect([resourceRow.querySelector('tr td.e-resource-cells')].length).toEqual(1);
            expect([resourceRow.querySelector('tr td.e-resource-cells div.e-resource-tree-icon')].length).toEqual(1);
            expect([resourceRow.querySelector('tr td.e-resource-cells div.e-resource-collapse')].length).toEqual(1);
            expect([resourceRow.querySelector('tr td.e-parent-node')].length).toEqual(1);
            expect(resourceRow.querySelector('tr td.e-resource-cells').children.length).toEqual(2);
            expect(resourceRow.querySelector('tr td.e-resource-cells div.e-resource-text').innerHTML).toEqual('Hall 1');
            expect(resourceRow.children[1].querySelector('.e-resource-cells').children.length).toEqual(2);
            expect(resourceRow.children[1].querySelector('.e-resource-cells div.e-resource-text').innerHTML).toEqual('ROOM 1');
            expect([resourceRow.children[2].querySelector('.e-child-node')].length).toEqual(1);
            expect(resourceRow.children[2].querySelector('.e-child-node').children.length).toEqual(1);
            expect(resourceRow.children[2].querySelector('.e-child-node div.e-resource-text').innerHTML).toEqual('Nancy');
            expect(resourceRow.children[9].querySelector('tr td.e-resource-cells div.e-resource-text').innerHTML).toEqual('Hall 2');
            expect(resourceRow.children[10].querySelector('.e-resource-cells div.e-resource-text').innerHTML).toEqual('ROOM 1');
            expect(resourceRow.children[11].querySelector('.e-child-node div.e-resource-text').innerHTML).toEqual('Nancy');
            const contentRows: HTMLElement = contentRow.children[1].children[1].querySelector('tbody');
            expect(contentRows.children.length).toEqual(18);
            const contentArea: HTMLElement = schObj.element.querySelector('.e-content-wrap') as HTMLElement;
            util.triggerScrollEvent(contentArea, 100);
            expect(contentArea.scrollTop).toEqual(100);
        });
    });

    describe('Multiple resource grouping rendering compact view in mobile device ', () => {
        let schObj: Schedule;
        const uA: string = Browser.userAgent;
        const androidUserAgent: string = 'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) ' +
            'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36';
        beforeAll((done: DoneFn) => {
            Browser.userAgent = androidUserAgent;
            const model: ScheduleModel = {
                width: 300, height: '600px', selectedDate: new Date(2018, 3, 1), currentView: 'TimelineMonth',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek', 'TimelineMonth'],
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
                        { Text: 'Nancy', Id: 1, GroupID: 1, Color: '#ffaa00' },
                        { Text: 'Steven', Id: 2, GroupID: 2, Color: '#f8a398' },
                        { Text: 'Michael', Id: 3, GroupID: 1, Color: '#7499e1' }
                    ]
                }]
            };
            schObj = util.createSchedule(model, resourceData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
            Browser.userAgent = uA;
        });
        it('initial layout testing', () => {
            const workCells: Element[] = schObj.getWorkCellElements();
            expect(workCells.length).toEqual(30);
            expect(workCells[12].getAttribute('data-date')).toEqual(new Date(2018, 3, 13).getTime().toString());
        });

        it('resource toolbar testing', () => {
            expect(schObj.element.querySelectorAll('.e-schedule-resource-toolbar-container')).toBeTruthy();
            expect(schObj.element.querySelectorAll('.e-schedule-resource-toolbar').length).toEqual(1);
            expect(schObj.element.querySelectorAll('.e-schedule-resource-toolbar .e-resource-menu').length).toEqual(1);
            expect(schObj.element.querySelectorAll('.e-schedule-resource-toolbar .e-resource-level-title').length).toEqual(1);
            expect(schObj.element.querySelectorAll('.e-resource-level-title .e-resource-name').length).toEqual(2);
            expect(schObj.element.querySelectorAll('.e-resource-level-title .e-icon-next').length).toEqual(1);
        });

        it('resource treeview testing', () => {
            expect(schObj.element.querySelectorAll('.e-resource-tree-popup').length).toEqual(1);
            expect(schObj.element.querySelectorAll('.e-resource-tree').length).toEqual(1);
            expect(schObj.element.querySelectorAll('.e-resource-tree .e-list-item.e-has-child').length).toEqual(2);
            expect(schObj.element.querySelectorAll('.e-resource-tree .e-list-item:not(.e-has-child)').length).toEqual(3);
        });

        it('resource menu click testing', () => {
            expect(schObj.element.querySelector('.e-resource-tree-popup').classList.contains('e-popup-close')).toEqual(true);
            const menuElement: HTMLElement = schObj.element.querySelector('.e-resource-menu .e-icon-menu');
            menuElement.click();
            expect(schObj.element.querySelector('.e-resource-tree-popup').classList.contains('e-popup-close')).toEqual(false);
            expect(schObj.element.querySelector('.e-resource-tree-popup').classList.contains('e-popup-open')).toEqual(true);
            expect(schObj.element.querySelector('.e-resource-tree-popup-overlay').classList.contains('e-enable')).toEqual(true);
            menuElement.click();
            expect(schObj.element.querySelector('.e-resource-tree-popup').classList.contains('e-popup-open')).toEqual(false);
            expect(schObj.element.querySelector('.e-resource-tree-popup').classList.contains('e-popup-close')).toEqual(true);
            expect(schObj.element.querySelector('.e-resource-tree-popup-overlay').classList.contains('e-enable')).toEqual(false);
        });

        it('resource node click testing', () => {
            const menuElement: HTMLElement = schObj.element.querySelector('.e-resource-menu .e-icon-menu');
            menuElement.click();
            expect(schObj.element.querySelector('.e-resource-level-title .e-resource-name:first-child').innerHTML).toEqual('Room 1');
            expect(schObj.element.querySelector('.e-resource-level-title .e-resource-name:last-child').innerHTML).toEqual('Nancy');
            const nodeElement: NodeListOf<Element> = schObj.element.querySelectorAll('.e-resource-tree .e-list-item:not(.e-has-child)');
            expect(nodeElement.length).toEqual(3);
            menuElement.click();
        });

        it('resource events checked for timeline month view testing', () => {
            expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(3);
        });

        it('resource events checked for timeline day view testing', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(1);
                done();
            };
            schObj.currentView = 'TimelineDay';
            schObj.dataBind();
        });

        it('resource events checked for timeline week view testing', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(3);
                done();
            };
            schObj.currentView = 'TimelineWeek';
            schObj.dataBind();
        });

        it('resource events checked for timeline work view testing', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(2);
                done();
            };
            schObj.currentView = 'TimelineWorkWeek';
            schObj.dataBind();
        });

        it('resource without timescale', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.getWorkCellElements().length).toEqual(30);
                expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(3);
                done();
            };
            schObj.currentView = 'TimelineMonth';
            schObj.timeScale.enable = false;
            schObj.dataBind();
        });
    });

    describe('Multiple resource grouping rendering normal view in mobile device ', () => {
        let schObj: Schedule;
        const uA: string = Browser.userAgent;
        const androidUserAgent: string = 'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) ' +
            'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36';
        beforeAll((done: DoneFn) => {
            Browser.userAgent = androidUserAgent;
            const model: ScheduleModel = {
                height: '600px', selectedDate: new Date(2018, 3, 1), currentView: 'TimelineMonth',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek', 'TimelineMonth'],
                group: {
                    enableCompactView: false,
                    resources: ['Rooms', 'Owners']
                },
                resources: [{
                    field: 'RoomId', name: 'Rooms',
                    dataSource: [
                        { Text: 'Room 1', Id: 1, Color: '#ffaa00' },
                        { Text: 'Room 2', Id: 2, Color: '#f8a398' }
                    ]
                }, {
                    field: 'OwnerId', name: 'Owners',
                    dataSource: [
                        { Text: 'Nancy', Id: 1, GroupID: 1, Color: '#ffaa00' },
                        { Text: 'Steven', Id: 2, GroupID: 2, Color: '#f8a398' },
                        { Text: 'Michael', Id: 3, GroupID: 1, Color: '#7499e1' }
                    ]
                }],
                eventSettings: { dataSource: resourceData }
            };
            schObj = util.createSchedule(model, resourceData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
            Browser.userAgent = uA;
        });
        it('initial layout testing', () => {
            const workCells: Element[] = schObj.getWorkCellElements();
            expect(workCells.length).toEqual(30 * 5);
            expect(workCells[12].getAttribute('data-date')).toEqual(new Date(2018, 3, 13).getTime().toString());
        });

        it('compact view elements empty testing', () => {
            expect(schObj.element.querySelectorAll('.e-schedule-resource-toolbar').length).toEqual(0);
            expect(schObj.element.querySelectorAll('.e-resource-tree-popup').length).toEqual(0);
            expect(schObj.element.querySelectorAll('.e-resource-tree').length).toEqual(0);
        });

        it('resource events checked for timeline monthview testing', () => {
            expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(9);
        });

        it('resource events checked for timeline day view testing', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(3);
                done();
            };
            schObj.currentView = 'TimelineDay';
            schObj.dataBind();
        });

        it('resource events checked for timeline week view testing', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(9);
                done();
            };
            schObj.currentView = 'TimelineWeek';
            schObj.dataBind();
        });

        it('resource events checked for timeline work week view testing', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(5);
                done();
            };
            schObj.currentView = 'TimelineWorkWeek';
            schObj.dataBind();
        });

        it('resource without timescale', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.getWorkCellElements().length).toEqual(30 * 5);
                expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(9);
                done();
            };
            schObj.currentView = 'TimelineMonth';
            schObj.timeScale.enable = false;
            schObj.dataBind();
        });
    });

    describe('Grouped events', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                height: '580px', width: '100%', currentView: 'TimelineMonth',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek', 'TimelineMonth'],
                group: {
                    allowGroupEdit: true,
                    resources: ['Rooms', 'Owners']
                },
                resources: [{
                    field: 'RoomId', title: 'Room', name: 'Rooms', allowMultiple: true,
                    dataSource: [
                        { RoomText: 'ROOM 1', Id: 1, RoomColor: '#cb6bb2' },
                        { RoomText: 'ROOM 2', Id: 2, RoomColor: '#56ca85' },
                        { RoomText: 'ROOM 3', Id: 3, RoomColor: '#56ca85' }
                    ],
                    textField: 'RoomText', idField: 'Id', colorField: 'RoomColor'
                }, {
                    field: 'OwnerId', title: 'Owner', name: 'Owners', allowMultiple: true,
                    dataSource: [
                        { OwnerText: 'Nancy', Id: 1, OwnerGroupId: 1, OwnerColor: '#ffaa00' },
                        { OwnerText: 'Steven', Id: 2, OwnerGroupId: 2, OwnerColor: '#f8a398' },
                        { OwnerText: 'Michael', Id: 3, OwnerGroupId: 3, OwnerColor: '#7499e1' },
                        { OwnerText: 'Oliver', Id: 4, OwnerGroupId: 1, OwnerColor: '#ffaa00' },
                        { OwnerText: 'John', Id: 5, OwnerGroupId: 2, OwnerColor: '#f8a398' },
                        { OwnerText: 'Barry', Id: 6, OwnerGroupId: 3, OwnerColor: '#7499e1' },
                        { OwnerText: 'Felicity', Id: 7, OwnerGroupId: 1, OwnerColor: '#ffaa00' },
                        { OwnerText: 'Cisco', Id: 8, OwnerGroupId: 2, OwnerColor: '#f8a398' },
                        { OwnerText: 'Sara', Id: 9, OwnerGroupId: 3, OwnerColor: '#7499e1' },
                        { OwnerText: 'Malcolm', Id: 10, OwnerGroupId: 1, OwnerColor: '#ffaa00' }
                    ],
                    textField: 'OwnerText', idField: 'Id', groupIDField: 'OwnerGroupId', colorField: 'OwnerColor'
                }],
                selectedDate: new Date(2018, 4, 1)
            };
            schObj = util.createSchedule(model, resourceGroupData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Checking events elements', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList.length).toEqual(40);
            const eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
            expect(eventWrapperList.length).toEqual(10);
        });

        it('Checking left icon', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[10].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Recurrence Event - Previous week');
            expect(eventElementList[10].querySelectorAll('.e-appointment-details .e-indicator')[0].classList.contains('e-left-icon'))
                .toBeTruthy();
        });

        it('Checking recurrence icon', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[0].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Recurrence Event - Same day');
            expect(eventElementList[0].querySelectorAll('.e-appointment-details .e-icons')[0].classList.contains('e-recurrence-icon'))
                .toBeTruthy();
        });

        it('More event element checking', () => {
            const moreIndicatorList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
            expect(moreIndicatorList.length).toEqual(48);
            expect(moreIndicatorList[0].innerHTML).toEqual('+3&nbsp;more');
            expect(moreIndicatorList[1].innerHTML).toEqual('+1&nbsp;more');
            expect(moreIndicatorList[11].innerHTML).toEqual('+2&nbsp;more');
            const element: HTMLElement = moreIndicatorList[0] as HTMLElement;
            element.click();
            const morePopup: HTMLElement = schObj.element.querySelector('.e-more-popup-wrapper') as HTMLElement;
            const moreEventList: Element[] = [].slice.call(morePopup.querySelectorAll('.e-more-appointment-wrapper .e-appointment'));
            expect(moreEventList.length).toEqual(4);
            util.triggerMouseEvent(morePopup.querySelector('.e-more-event-close'), 'click');
        });
    });

    describe('Grouped events - RTL', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                height: '580px', width: '100%', currentView: 'TimelineMonth', enableRtl: true,
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek', 'TimelineMonth'],
                group: {
                    allowGroupEdit: true,
                    resources: ['Rooms', 'Owners']
                },
                resources: [{
                    field: 'RoomId', title: 'Room', name: 'Rooms', allowMultiple: true,
                    dataSource: [
                        { RoomText: 'ROOM 1', Id: 1, RoomColor: '#cb6bb2' },
                        { RoomText: 'ROOM 2', Id: 2, RoomColor: '#56ca85' },
                        { RoomText: 'ROOM 3', Id: 3, RoomColor: '#56ca85' }
                    ],
                    textField: 'RoomText', idField: 'Id', colorField: 'RoomColor'
                }, {
                    field: 'OwnerId', title: 'Owner', name: 'Owners', allowMultiple: true,
                    dataSource: [
                        { OwnerText: 'Nancy', Id: 1, OwnerGroupId: 1, OwnerColor: '#ffaa00' },
                        { OwnerText: 'Steven', Id: 2, OwnerGroupId: 2, OwnerColor: '#f8a398' },
                        { OwnerText: 'Michael', Id: 3, OwnerGroupId: 3, OwnerColor: '#7499e1' },
                        { OwnerText: 'Oliver', Id: 4, OwnerGroupId: 1, OwnerColor: '#ffaa00' },
                        { OwnerText: 'John', Id: 5, OwnerGroupId: 2, OwnerColor: '#f8a398' },
                        { OwnerText: 'Barry', Id: 6, OwnerGroupId: 3, OwnerColor: '#7499e1' },
                        { OwnerText: 'Felicity', Id: 7, OwnerGroupId: 1, OwnerColor: '#ffaa00' },
                        { OwnerText: 'Cisco', Id: 8, OwnerGroupId: 2, OwnerColor: '#f8a398' },
                        { OwnerText: 'Sara', Id: 9, OwnerGroupId: 3, OwnerColor: '#7499e1' },
                        { OwnerText: 'Malcolm', Id: 10, OwnerGroupId: 1, OwnerColor: '#ffaa00' }
                    ],
                    textField: 'OwnerText', idField: 'Id', groupIDField: 'OwnerGroupId', colorField: 'OwnerColor'
                }],
                selectedDate: new Date(2018, 4, 1)
            };
            schObj = util.createSchedule(model, resourceGroupData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Checking events elements', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList.length).toEqual(40);
            const eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
            expect(eventWrapperList.length).toEqual(10);
        });

        it('Checking left icon', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[10].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Recurrence Event - Previous week');
            expect(eventElementList[10].querySelectorAll('.e-appointment-details .e-indicator')[0].classList.contains('e-left-icon'))
                .toBeTruthy();
        });

        it('Checking recurrence icon', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[0].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Recurrence Event - Same day');
            expect(eventElementList[0].querySelectorAll('.e-appointment-details .e-icons')[0].classList.contains('e-recurrence-icon'))
                .toBeTruthy();
        });

        it('More event element checking', () => {
            const moreIndicatorList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
            expect(moreIndicatorList.length).toEqual(48);
            expect(moreIndicatorList[0].innerHTML).toEqual('+3&nbsp;more');
            expect(moreIndicatorList[1].innerHTML).toEqual('+1&nbsp;more');
            expect(moreIndicatorList[11].innerHTML).toEqual('+2&nbsp;more');
            const element: HTMLElement = moreIndicatorList[0] as HTMLElement;
            element.click();
            const morePopup: HTMLElement = schObj.element.querySelector('.e-more-popup-wrapper') as HTMLElement;
            const moreEventList: Element[] = [].slice.call(morePopup.querySelectorAll('.e-more-appointment-wrapper .e-appointment'));
            expect(moreEventList.length).toEqual(4);
            util.triggerMouseEvent(morePopup.querySelector('.e-more-event-close'), 'click');
        });
    });

    describe('Events rendering based on levels', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                height: '550px', width: '100%', currentView: 'TimelineMonth',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek', 'TimelineMonth'],
                group: { resources: ['Floors', 'Halls', 'Rooms', 'Owners'] },
                resources: [{
                    field: 'FId', title: 'Floor', name: 'Floors', allowMultiple: false,
                    dataSource: [
                        { FloorText: 'Floor 1', Id: 1, FloorColor: '#cb6bb2' },
                        { FloorText: 'Floor 2', Id: 2, FloorColor: '#cb6bb2' },
                        { FloorText: 'Floor 3', Id: 3, FloorColor: '#cb6bb2' }
                    ],
                    textField: 'FloorText', idField: 'Id', colorField: 'FloorColor'
                }, {
                    field: 'HallId', title: 'Hall', name: 'Halls', allowMultiple: false,
                    dataSource: [
                        { HallText: 'Hall 1', Id: 1, HallGroupId: 1, HallColor: '#cb6bb2' },
                        { HallText: 'Hall 2', Id: 2, HallGroupId: 2, HallColor: '#56ca85' }
                    ],
                    textField: 'HallText', idField: 'Id', groupIDField: 'HallGroupId', colorField: 'HallColor'
                }, {
                    field: 'RoomId', title: 'Room', name: 'Rooms', allowMultiple: false,
                    dataSource: [
                        { RoomText: 'ROOM 1', Id: 1, RoomGroupId: 1, RoomColor: '#cb6bb2' },
                        { RoomText: 'ROOM 2', Id: 2, RoomGroupId: 2, RoomColor: '#56ca85' }
                    ],
                    textField: 'RoomText', idField: 'Id', groupIDField: 'RoomGroupId', colorField: 'RoomColor'
                }, {
                    field: 'OwnerId', title: 'Owner', name: 'Owners', allowMultiple: true,
                    dataSource: [
                        { OwnerText: 'Nancy', Id: 1, OwnerGroupId: 1, OwnerColor: '#ffaa00' },
                        { OwnerText: 'Steven', Id: 2, OwnerGroupId: 2, OwnerColor: '#f8a398' },
                        { OwnerText: 'Oliver', Id: 3, OwnerGroupId: 1, OwnerColor: '#ffaa00' },
                        { OwnerText: 'John', Id: 4, OwnerGroupId: 2, OwnerColor: '#f8a398' }
                    ],
                    textField: 'OwnerText', idField: 'Id', groupIDField: 'OwnerGroupId', colorField: 'OwnerColor'
                }],
                selectedDate: new Date(2018, 4, 1)
            };
            schObj = util.createSchedule(model, levelBasedData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Checking events elements', () => {
            const eventContainer: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-event-table .e-appointment-container'));
            expect(eventContainer.length).toEqual(10);
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList.length).toEqual(10);
            const eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
            expect(eventWrapperList.length).toEqual(6);
        });

        it('Checking events in top level parent node if there is no child fields mapped', () => {
            const eventContainer: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-event-table .e-appointment-container'));
            expect(eventContainer[0].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Spanned Event - Greater than 24');
        });

        it('Checking events in last level parent node if there is no child fields mapped', () => {
            const eventContainer: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-event-table .e-appointment-container'));
            expect(eventContainer[2].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Events - Within a day');
        });

        it('Checking events in child node if all fields are mapperd properly', () => {
            const eventContainer: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-event-table .e-appointment-container'));
            expect(eventContainer[3].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Spanned Event - Next week');
        });

        it('Checking left icon', () => {
            const eventContainer: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-event-table .e-appointment-container'));
            expect(eventContainer[1].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Spanned Event - Previous week');
            expect(eventContainer[1].querySelectorAll('.e-appointment-details .e-indicator')[0].classList.contains('e-left-icon'))
                .toBeTruthy();
        });

        it('Checking recurrence icon', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[5].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Recurrence  Event');
            expect(eventElementList[5].querySelectorAll('.e-appointment-details .e-icons')[0].classList.contains('e-recurrence-icon'))
                .toBeTruthy();
        });
    });

    describe('Events rendering based on levels - RTL', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                height: '550px', width: '100%', enableRtl: true, currentView: 'TimelineMonth',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek', 'TimelineMonth'],
                group: { resources: ['Floors', 'Halls', 'Rooms', 'Owners'] },
                resources: [{
                    field: 'FId', title: 'Floor', name: 'Floors', allowMultiple: false,
                    dataSource: [
                        { FloorText: 'Floor 1', Id: 1, FloorColor: '#cb6bb2' },
                        { FloorText: 'Floor 2', Id: 2, FloorColor: '#cb6bb2' },
                        { FloorText: 'Floor 3', Id: 3, FloorColor: '#cb6bb2' }
                    ],
                    textField: 'FloorText', idField: 'Id', colorField: 'FloorColor'
                }, {
                    field: 'HallId', title: 'Hall', name: 'Halls', allowMultiple: false,
                    dataSource: [
                        { HallText: 'Hall 1', Id: 1, HallGroupId: 1, HallColor: '#cb6bb2' },
                        { HallText: 'Hall 2', Id: 2, HallGroupId: 2, HallColor: '#56ca85' }
                    ],
                    textField: 'HallText', idField: 'Id', groupIDField: 'HallGroupId', colorField: 'HallColor'
                }, {
                    field: 'RoomId', title: 'Room', name: 'Rooms', allowMultiple: false,
                    dataSource: [
                        { RoomText: 'ROOM 1', Id: 1, RoomGroupId: 1, RoomColor: '#cb6bb2' },
                        { RoomText: 'ROOM 2', Id: 2, RoomGroupId: 2, RoomColor: '#56ca85' }
                    ],
                    textField: 'RoomText', idField: 'Id', groupIDField: 'RoomGroupId', colorField: 'RoomColor'
                }, {
                    field: 'OwnerId', title: 'Owner', name: 'Owners', allowMultiple: true,
                    dataSource: [
                        { OwnerText: 'Nancy', Id: 1, OwnerGroupId: 1, OwnerColor: '#ffaa00' },
                        { OwnerText: 'Steven', Id: 2, OwnerGroupId: 2, OwnerColor: '#f8a398' },
                        { OwnerText: 'Oliver', Id: 3, OwnerGroupId: 1, OwnerColor: '#ffaa00' },
                        { OwnerText: 'John', Id: 4, OwnerGroupId: 2, OwnerColor: '#f8a398' }
                    ],
                    textField: 'OwnerText', idField: 'Id', groupIDField: 'OwnerGroupId', colorField: 'OwnerColor'
                }],
                selectedDate: new Date(2018, 4, 1)
            };
            schObj = util.createSchedule(model, levelBasedData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Checking events elements', () => {
            const eventContainer: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-event-table .e-appointment-container'));
            expect(eventContainer.length).toEqual(10);
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList.length).toEqual(10);
            const eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
            expect(eventWrapperList.length).toEqual(6);
        });

        it('Checking events in top level parent node if there is no child fields mapped', () => {
            const eventContainer: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-event-table .e-appointment-container'));
            expect(eventContainer[0].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Spanned Event - Greater than 24');
        });

        it('Checking events in last level parent node if there is no child fields mapped', () => {
            const eventContainer: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-event-table .e-appointment-container'));
            expect(eventContainer[2].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Events - Within a day');
        });

        it('Checking events in child node if all fields are mapperd properly', () => {
            const eventContainer: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-event-table .e-appointment-container'));
            expect(eventContainer[3].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Spanned Event - Next week');
        });

        it('Checking left icon', () => {
            const eventContainer: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-event-table .e-appointment-container'));
            expect(eventContainer[1].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Spanned Event - Previous week');
            expect(eventContainer[1].querySelectorAll('.e-appointment-details .e-indicator')[0].classList.contains('e-left-icon'))
                .toBeTruthy();
        });

        it('Checking recurrence icon', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[5].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Recurrence  Event');
            expect(eventElementList[5].querySelectorAll('.e-appointment-details .e-icons')[0].classList.contains('e-recurrence-icon'))
                .toBeTruthy();
        });
    });

    describe('Year, Month, Week, Day, Hour header rows', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const options: ScheduleModel = {
                height: '600px', width: '1000px', currentView: 'TimelineMonth',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek', 'TimelineMonth'],
                headerRows: [{ option: 'Year' }, { option: 'Month' }, { option: 'Week' }, { option: 'Date' }, { option: 'Hour' }],
                selectedDate: new Date(2018, 4, 1)
            };
            schObj = util.createSchedule(options, timelineData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('view class on container', () => {
            expect(schObj.element.querySelector('.e-timeline-month-view')).toBeTruthy();
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-timeline-month');
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('May 2018');
        });

        it('check header rows', () => {
            expect(schObj.element.querySelectorAll('.e-date-header-wrap table col').length).toEqual(31);
            expect(schObj.element.querySelectorAll('.e-date-header-wrap table tr').length).toEqual(4);
        });

        it('check year rows', () => {
            const headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
            expect(headTrs[0].children.length).toEqual(1);
            expect(headTrs[0].children[0].getAttribute('colSpan')).toEqual('31');
            expect(headTrs[0].children[0].innerHTML).toEqual('<span class="e-header-year">2018</span>');
        });

        it('check month rows', () => {
            const headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
            expect(headTrs[1].children.length).toEqual(1);
            expect(headTrs[1].children[0].getAttribute('colSpan')).toEqual('31');
            expect(headTrs[1].children[0].innerHTML).toEqual('<span class="e-header-month">May</span>');
        });

        it('check week rows', () => {
            const headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
            expect(headTrs[2].children.length).toEqual(5);
            expect(headTrs[2].children[0].getAttribute('colSpan')).toEqual('5');
            expect(headTrs[2].children[0].innerHTML).toEqual('<span class="e-header-week">18</span>');
        });

        it('check day rows', () => {
            const headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
            expect(headTrs[3].children.length).toEqual(31);
            expect(headTrs[3].children[0].getAttribute('colSpan')).toEqual('1');
            expect(headTrs[3].children[0].innerHTML).
                toEqual('<span class="e-navigate" title="Tuesday, May 1, 2018">May 1</span>');
            expect(headTrs[3].children[0].getAttribute('data-date')).toEqual(new Date(2018, 4, 1).getTime().toString());
        });

        it('check work cells', () => {
            expect(schObj.getWorkCellElements().length).toEqual(31);
            const firstWorkCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
            expect(firstWorkCell.getAttribute('data-date')).toEqual(new Date(2018, 4, 1).getTime().toString());
            expect(firstWorkCell.innerHTML).toEqual('');

            const data: CellClickEventArgs = schObj.getCellDetails(firstWorkCell);
            expect(data.startTime.getTime()).toEqual(new Date(2018, 4, 1).getTime());
            expect(data.endTime.getTime()).toEqual(new Date(2018, 4, 2).getTime());
            expect(data.isAllDay).toEqual(true);
            expect(data.groupIndex).toBeUndefined();
        });

        it('check work hours highlight', () => {
            expect(schObj.element.querySelectorAll('.e-work-hours,.e-work-days').length).toEqual(23);
        });

        it('check events rendering', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList.length).toEqual(23);
            const eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
            expect(eventWrapperList.length).toEqual(1);

            expect(eventElementList[0].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Recurrence Event - Previous week');
            expect(eventElementList[0].querySelectorAll('.e-appointment-details .e-indicator')[0].classList).toContain('e-left-icon');
        });

        it('check more indicator', () => {
            const moreIndicators: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
            expect(moreIndicators.length).toEqual(3);
            expect(moreIndicators[0].innerHTML).toEqual('+6&nbsp;more');
            expect(moreIndicators[0].getAttribute('data-start-date')).toEqual(new Date(2018, 4, 1).getTime().toString());
            expect(moreIndicators[0].getAttribute('data-end-date')).toEqual(new Date(2018, 4, 2).getTime().toString());
            moreIndicators[0].click();
            const morePopup: HTMLElement = schObj.element.querySelector('.e-more-popup-wrapper') as HTMLElement;
            const eventElementList: Element[] = [].slice.call(morePopup.querySelectorAll('.e-more-appointment-wrapper .e-appointment'));
            expect(eventElementList.length).toEqual(15);
            expect(morePopup.classList).toContain('e-popup-open');
            util.triggerMouseEvent(morePopup.querySelector('.e-more-event-close'), 'click');
            expect(morePopup.classList).toContain('e-popup-close');
        });

        it('navigate next date', (done: DoneFn) => {
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
            schObj.dataBound = () => {
                expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-timeline-month');
                expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('June 2018');
                expect(schObj.element.querySelectorAll('.e-date-header-wrap table col').length).toEqual(30);
                const headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
                expect(headTrs[0].children.length).toEqual(1);
                expect(headTrs[0].children[0].getAttribute('colSpan')).toEqual('30');
                expect(headTrs[0].children[0].innerHTML).toEqual('<span class="e-header-year">2018</span>');
                expect(headTrs[1].children.length).toEqual(1);
                expect(headTrs[1].children[0].getAttribute('colSpan')).toEqual('30');
                expect(headTrs[1].children[0].innerHTML).toEqual('<span class="e-header-month">June</span>');
                expect(headTrs[2].children.length).toEqual(5);
                expect(headTrs[2].children[0].getAttribute('colSpan')).toEqual('2');
                expect(headTrs[2].children[0].innerHTML).toEqual('<span class="e-header-week">22</span>');
                expect(headTrs[3].children.length).toEqual(30);
                expect(headTrs[3].children[0].getAttribute('colSpan')).toEqual('1');
                expect(headTrs[3].children[0].innerHTML).toEqual('<span class="e-navigate" title="Friday, June 1, 2018">Jun 1</span>');
                expect(headTrs[3].children[0].getAttribute('data-date')).toEqual(new Date(2018, 5, 1).getTime().toString());
                expect(schObj.getWorkCellElements().length).toEqual(30);
                const firstWorkCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
                expect(firstWorkCell.getAttribute('data-date')).toEqual(new Date(2018, 5, 1).getTime().toString());
                expect(schObj.element.querySelectorAll('.e-work-hours,.e-work-days').length).toEqual(21);
                const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(eventElementList.length).toEqual(0);
                const eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
                expect(eventWrapperList.length).toEqual(0);
                done();
            };
        });

        it('navigate previous date', (done: DoneFn) => {
            (schObj.element.querySelector('.e-toolbar-item.e-prev') as HTMLElement).click();
            schObj.dataBound = () => {
                expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('May 2018');
                expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-timeline-month');
                expect(schObj.element.querySelectorAll('.e-date-header-wrap table col').length).toEqual(31);
                const headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
                expect(headTrs[0].children.length).toEqual(1);
                expect(headTrs[0].children[0].getAttribute('colSpan')).toEqual('31');
                expect(headTrs[0].children[0].innerHTML).toEqual('<span class="e-header-year">2018</span>');
                expect(headTrs[1].children.length).toEqual(1);
                expect(headTrs[1].children[0].getAttribute('colSpan')).toEqual('31');
                expect(headTrs[1].children[0].innerHTML).toEqual('<span class="e-header-month">May</span>');
                expect(headTrs[2].children.length).toEqual(5);
                expect(headTrs[2].children[0].getAttribute('colSpan')).toEqual('5');
                expect(headTrs[2].children[0].innerHTML).toEqual('<span class="e-header-week">18</span>');
                expect(headTrs[3].children.length).toEqual(31);
                expect(headTrs[3].children[0].getAttribute('colSpan')).toEqual('1');
                expect(headTrs[3].children[0].innerHTML).toEqual('<span class="e-navigate" title="Tuesday, May 1, 2018">May 1</span>');
                expect(headTrs[3].children[0].getAttribute('data-date')).toEqual(new Date(2018, 4, 1).getTime().toString());
                expect(schObj.getWorkCellElements().length).toEqual(31);
                const firstWorkCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
                expect(firstWorkCell.getAttribute('data-date')).toEqual(new Date(2018, 4, 1).getTime().toString());
                expect(firstWorkCell.innerHTML).toEqual('');
                expect(schObj.element.querySelectorAll('.e-work-hours,.e-work-days').length).toEqual(23);
                const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(eventElementList.length).toEqual(23);
                const eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
                expect(eventWrapperList.length).toEqual(1);
                done();
            };
        });
        it('Checking rowAutoHeight property', (done: DoneFn) => {
            schObj.dataBound = () => {
                const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(eventElementList.length).toEqual(29);
                const eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
                expect(eventWrapperList.length).toEqual(1);
                const moreIndicatorList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
                expect(moreIndicatorList.length).toEqual(0);
                done();
            };
            schObj.rowAutoHeight = true;
            schObj.dataBind();
        });
    });

    describe('Year, Month, Week, Day, Hour header rows with template', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const headTemplate: string = '<span>${type}</span>';
            const options: ScheduleModel = {
                height: '600px', width: '1000px', currentView: 'TimelineMonth',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek', 'TimelineMonth'],
                dateHeaderTemplate: headTemplate,
                timeScale: {
                    majorSlotTemplate: headTemplate,
                    minorSlotTemplate: headTemplate
                },
                headerRows: [
                    { option: 'Year', template: headTemplate },
                    { option: 'Month', template: headTemplate },
                    { option: 'Week', template: headTemplate },
                    { option: 'Date' },
                    { option: 'Hour' }
                ],
                selectedDate: new Date(2018, 4, 1)
            };
            schObj = util.createSchedule(options, timelineData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('check view class on container', () => {
            expect(schObj.element.querySelector('.e-timeline-month-view')).toBeTruthy();
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-timeline-month');
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('May 2018');
        });

        it('check header rows', () => {
            expect(schObj.element.querySelectorAll('.e-date-header-wrap table col').length).toEqual(31);
            expect(schObj.element.querySelectorAll('.e-date-header-wrap table tr').length).toEqual(4);
        });

        it('check year rows', () => {
            const headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
            expect(headTrs[0].children.length).toEqual(1);
            expect(headTrs[0].children[0].getAttribute('colSpan')).toEqual('31');
            expect(headTrs[0].children[0].innerHTML).toEqual('<span>yearHeader</span>');
        });

        it('check month rows', () => {
            const headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
            expect(headTrs[1].children.length).toEqual(1);
            expect(headTrs[1].children[0].getAttribute('colSpan')).toEqual('31');
            expect(headTrs[1].children[0].innerHTML).toEqual('<span>monthHeader</span>');
        });

        it('check week rows', () => {
            const headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
            expect(headTrs[2].children.length).toEqual(5);
            expect(headTrs[2].children[0].getAttribute('colSpan')).toEqual('5');
            expect(headTrs[2].children[0].innerHTML).toEqual('<span>weekHeader</span>');
        });

        it('check day rows', () => {
            const headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
            expect(headTrs[3].children.length).toEqual(31);
            expect(headTrs[3].children[0].getAttribute('colSpan')).toEqual('1');
            expect(headTrs[3].children[0].innerHTML).
                toEqual('<span>dateHeader</span>');
            expect(headTrs[3].children[0].getAttribute('data-date')).toEqual(new Date(2018, 4, 1).getTime().toString());
        });

        it('check work cells', () => {
            expect(schObj.getWorkCellElements().length).toEqual(31);
            const firstWorkCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
            expect(firstWorkCell.getAttribute('data-date')).toEqual(new Date(2018, 4, 1).getTime().toString());

            const data: CellClickEventArgs = schObj.getCellDetails(firstWorkCell);
            expect(data.startTime.getTime()).toEqual(new Date(2018, 4, 1).getTime());
            expect(data.endTime.getTime()).toEqual(new Date(2018, 4, 2).getTime());
            expect(data.isAllDay).toEqual(true);
            expect(data.groupIndex).toBeUndefined();
            expect(firstWorkCell.innerHTML).toEqual('');
            expect(schObj.element.querySelectorAll('.e-work-hours,.e-work-days').length).toEqual(23);
        });

        it('check events rendering with more indicator', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList.length).toEqual(23);
            const eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
            expect(eventWrapperList.length).toEqual(1);
            const moreIndicators: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
            expect(moreIndicators.length).toEqual(3);
            expect(moreIndicators[0].innerHTML).toEqual('+6&nbsp;more');
            expect(moreIndicators[0].getAttribute('data-start-date')).toEqual(new Date(2018, 4, 1).getTime().toString());
            expect(moreIndicators[0].getAttribute('data-end-date')).toEqual(new Date(2018, 4, 2).getTime().toString());
        });
    });

    describe('Year, Month, Week, Day header rows', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const options: ScheduleModel = {
                height: '600px', width: '1000px', currentView: 'TimelineMonth',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek', 'TimelineMonth'],
                headerRows: [{ option: 'Year' }, { option: 'Month' }, { option: 'Week' }, { option: 'Date' }],
                selectedDate: new Date(2018, 4, 1)
            };
            schObj = util.createSchedule(options, timelineData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('check view class on container', () => {
            expect(schObj.element.querySelector('.e-timeline-month-view')).toBeTruthy();
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-timeline-month');
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('May 2018');
        });

        it('check header rows', () => {
            expect(schObj.element.querySelectorAll('.e-date-header-wrap table col').length).toEqual(31);
            expect(schObj.element.querySelectorAll('.e-date-header-wrap table tr').length).toEqual(4);
        });

        it('check year rows', () => {
            const headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
            expect(headTrs[0].children.length).toEqual(1);
            expect(headTrs[0].children[0].getAttribute('colSpan')).toEqual('31');
            expect(headTrs[0].children[0].innerHTML).toEqual('<span class="e-header-year">2018</span>');
        });

        it('check month rows', () => {
            const headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
            expect(headTrs[1].children.length).toEqual(1);
            expect(headTrs[1].children[0].getAttribute('colSpan')).toEqual('31');
            expect(headTrs[1].children[0].innerHTML).toEqual('<span class="e-header-month">May</span>');
        });

        it('check week rows', () => {
            const headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
            expect(headTrs[2].children.length).toEqual(5);
            expect(headTrs[2].children[0].getAttribute('colSpan')).toEqual('5');
            expect(headTrs[2].children[0].innerHTML).toEqual('<span class="e-header-week">18</span>');
        });

        it('check day rows', () => {
            const headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
            expect(headTrs[3].children.length).toEqual(31);
            expect(headTrs[3].children[0].getAttribute('colSpan')).toEqual('1');
            expect(headTrs[3].children[0].innerHTML).
                toEqual('<span class="e-navigate" title="Tuesday, May 1, 2018">May 1</span>');
            expect(headTrs[3].children[0].getAttribute('data-date')).toEqual(new Date(2018, 4, 1).getTime().toString());
        });

        it('check work cells', () => {
            expect(schObj.getWorkCellElements().length).toEqual(31);
            const firstWorkCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
            expect(firstWorkCell.getAttribute('data-date')).toEqual(new Date(2018, 4, 1).getTime().toString());
            const data: CellClickEventArgs = schObj.getCellDetails(firstWorkCell);
            expect(data.startTime.getTime()).toEqual(new Date(2018, 4, 1).getTime());
            expect(data.endTime.getTime()).toEqual(new Date(2018, 4, 2).getTime());
            expect(data.isAllDay).toEqual(true);
            expect(data.groupIndex).toBeUndefined();
            expect(firstWorkCell.innerHTML).toEqual('');
            expect(schObj.element.querySelectorAll('.e-work-hours,.e-work-days').length).toEqual(23);
        });

        it('check events rendering with more indicator', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList.length).toEqual(23);
            const eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
            expect(eventWrapperList.length).toEqual(1);
            const moreIndicators: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
            expect(moreIndicators.length).toEqual(3);
            expect(moreIndicators[0].innerHTML).toEqual('+6&nbsp;more');
            expect(moreIndicators[0].getAttribute('data-start-date')).toEqual(new Date(2018, 4, 1).getTime().toString());
            expect(moreIndicators[0].getAttribute('data-end-date')).toEqual(new Date(2018, 4, 2).getTime().toString());
        });
    });

    describe('Year, Month, Week header rows', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const options: ScheduleModel = {
                height: '600px', width: '1000px', currentView: 'TimelineMonth',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek', 'TimelineMonth'],
                headerRows: [{ option: 'Year' }, { option: 'Month' }, { option: 'Week' }],
                selectedDate: new Date(2018, 4, 1)
            };
            schObj = util.createSchedule(options, timelineData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('check view class on container', () => {
            expect(schObj.element.querySelector('.e-timeline-month-view')).toBeTruthy();
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-timeline-month');
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('May 2018');
        });

        it('check header rows', () => {
            expect(schObj.element.querySelectorAll('.e-date-header-wrap table col').length).toEqual(31);
            expect(schObj.element.querySelectorAll('.e-date-header-wrap table tr').length).toEqual(3);
        });

        it('check year rows', () => {
            const headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
            expect(headTrs[0].children.length).toEqual(1);
            expect(headTrs[0].children[0].getAttribute('colSpan')).toEqual('31');
            expect(headTrs[0].children[0].innerHTML).toEqual('<span class="e-header-year">2018</span>');
        });

        it('check month rows', () => {
            const headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
            expect(headTrs[1].children.length).toEqual(1);
            expect(headTrs[1].children[0].getAttribute('colSpan')).toEqual('31');
            expect(headTrs[1].children[0].innerHTML).toEqual('<span class="e-header-month">May</span>');
        });

        it('check week rows', () => {
            const headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
            expect(headTrs[2].children.length).toEqual(5);
            expect(headTrs[2].children[0].getAttribute('colSpan')).toEqual('5');
            expect(headTrs[2].children[0].innerHTML).toEqual('<span class="e-header-week">18</span>');
        });

        it('check work cells', () => {
            expect(schObj.getWorkCellElements().length).toEqual(5);
            const firstWorkCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
            expect(firstWorkCell.getAttribute('data-date')).toEqual(new Date(2018, 4, 1).getTime().toString());
            const data: CellClickEventArgs = schObj.getCellDetails(firstWorkCell);
            expect(data.startTime.getTime()).toEqual(new Date(2018, 4, 1).getTime());
            expect(data.endTime.getTime()).toEqual(new Date(2018, 4, 6).getTime());
            expect(data.isAllDay).toEqual(true);
            expect(data.groupIndex).toBeUndefined();
            expect(firstWorkCell.innerHTML).toEqual('');
        });

        it('check events rendering with more indicator', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList.length).toEqual(24);
            const eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
            expect(eventWrapperList.length).toEqual(1);
            const moreIndicators: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
            expect(moreIndicators.length).toEqual(3);
            expect(moreIndicators[0].innerHTML).toEqual('+5&nbsp;more');
            expect(moreIndicators[0].getAttribute('data-start-date')).toEqual(new Date(2018, 4, 1).getTime().toString());
            expect(moreIndicators[0].getAttribute('data-end-date')).toEqual(new Date(2018, 4, 2).getTime().toString());
        });
    });

    describe('Year, Month header rows', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const options: ScheduleModel = {
                height: '600px', width: '1000px', currentView: 'TimelineMonth',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek', 'TimelineMonth'],
                headerRows: [{ option: 'Year' }, { option: 'Month' }],
                selectedDate: new Date(2018, 4, 1)
            };
            schObj = util.createSchedule(options, timelineData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('check view class on container', () => {
            expect(schObj.element.querySelector('.e-timeline-month-view')).toBeTruthy();
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-timeline-month');
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('May 2018');
        });

        it('check header rows', () => {
            expect(schObj.element.querySelectorAll('.e-date-header-wrap table col').length).toEqual(31);
            expect(schObj.element.querySelectorAll('.e-date-header-wrap table tr').length).toEqual(2);
        });

        it('check year rows', () => {
            const headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
            expect(headTrs[0].children.length).toEqual(1);
            expect(headTrs[0].children[0].getAttribute('colSpan')).toEqual('31');
            expect(headTrs[0].children[0].innerHTML).toEqual('<span class="e-header-year">2018</span>');
        });

        it('check month rows', () => {
            const headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
            expect(headTrs[1].children.length).toEqual(1);
            expect(headTrs[1].children[0].getAttribute('colSpan')).toEqual('31');
            expect(headTrs[1].children[0].innerHTML).toEqual('<span class="e-header-month">May</span>');
        });

        it('check work cells', () => {
            expect(schObj.getWorkCellElements().length).toEqual(1);
            const firstWorkCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
            expect(firstWorkCell.getAttribute('data-date')).toEqual(new Date(2018, 4, 1).getTime().toString());
            const data: CellClickEventArgs = schObj.getCellDetails(firstWorkCell);
            expect(data.startTime.getTime()).toEqual(new Date(2018, 4, 1).getTime());
            expect(data.endTime.getTime()).toEqual(new Date(2018, 5, 1).getTime());
            expect(data.isAllDay).toEqual(true);
            expect(data.groupIndex).toBeUndefined();
            expect(firstWorkCell.innerHTML).toEqual('');
        });

        it('check events rendering with more indicator', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList.length).toEqual(25);
            const eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
            expect(eventWrapperList.length).toEqual(1);
            const moreIndicators: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
            expect(moreIndicators.length).toEqual(3);
            expect(moreIndicators[0].innerHTML).toEqual('+4&nbsp;more');
            expect(moreIndicators[0].getAttribute('data-start-date')).toEqual(new Date(2018, 4, 1).getTime().toString());
            expect(moreIndicators[0].getAttribute('data-end-date')).toEqual(new Date(2018, 4, 2).getTime().toString());
        });
    });

    describe('Year header row', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const options: ScheduleModel = {
                height: '600px', width: '1000px', currentView: 'TimelineMonth',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek', 'TimelineMonth'],
                headerRows: [{ option: 'Year' }], selectedDate: new Date(2018, 4, 1)
            };
            schObj = util.createSchedule(options, timelineData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('check view class on container', () => {
            expect(schObj.element.querySelector('.e-timeline-month-view')).toBeTruthy();
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-timeline-month');
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('May 2018');
        });

        it('check header rows', () => {
            expect(schObj.element.querySelectorAll('.e-date-header-wrap table col').length).toEqual(31);
            expect(schObj.element.querySelectorAll('.e-date-header-wrap table tr').length).toEqual(1);
        });

        it('check year rows', () => {
            const headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
            expect(headTrs[0].children.length).toEqual(1);
            expect(headTrs[0].children[0].getAttribute('colSpan')).toEqual('31');
            expect(headTrs[0].children[0].innerHTML).toEqual('<span class="e-header-year">2018</span>');
        });

        it('check work cells', () => {
            expect(schObj.getWorkCellElements().length).toEqual(1);
            const firstWorkCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
            expect(firstWorkCell.getAttribute('data-date')).toEqual(new Date(2018, 4, 1).getTime().toString());
            const data: CellClickEventArgs = schObj.getCellDetails(firstWorkCell);
            expect(data.startTime.getTime()).toEqual(new Date(2018, 4, 1).getTime());
            expect(data.endTime.getTime()).toEqual(new Date(2018, 5, 1).getTime());
            expect(data.isAllDay).toEqual(true);
            expect(data.groupIndex).toBeUndefined();
            expect(firstWorkCell.innerHTML).toEqual('');
        });

        it('check events rendering with more indicator', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList.length).toEqual(26);
            const eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
            expect(eventWrapperList.length).toEqual(1);
            const moreIndicators: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
            expect(moreIndicators.length).toEqual(3);
            expect(moreIndicators[0].innerHTML).toEqual('+3&nbsp;more');
            expect(moreIndicators[0].getAttribute('data-start-date')).toEqual(new Date(2018, 4, 1).getTime().toString());
            expect(moreIndicators[0].getAttribute('data-end-date')).toEqual(new Date(2018, 4, 2).getTime().toString());
        });
    });

    describe('Year, Week, Day header rows', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const options: ScheduleModel = {
                height: '600px', width: '1000px', currentView: 'TimelineMonth',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek', 'TimelineMonth'],
                headerRows: [{ option: 'Year' }, { option: 'Week' }, { option: 'Date' }],
                selectedDate: new Date(2018, 4, 1)
            };
            schObj = util.createSchedule(options, timelineData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('check view class on container', () => {
            expect(schObj.element.querySelector('.e-timeline-month-view')).toBeTruthy();
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-timeline-month');
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('May 2018');
        });

        it('check header rows', () => {
            expect(schObj.element.querySelectorAll('.e-date-header-wrap table col').length).toEqual(31);
            expect(schObj.element.querySelectorAll('.e-date-header-wrap table tr').length).toEqual(3);
        });

        it('check year rows', () => {
            const headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
            expect(headTrs[0].children.length).toEqual(1);
            expect(headTrs[0].children[0].getAttribute('colSpan')).toEqual('31');
            expect(headTrs[0].children[0].innerHTML).toEqual('<span class="e-header-year">2018</span>');
        });

        it('check week rows', () => {
            const headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
            expect(headTrs[1].children.length).toEqual(5);
            expect(headTrs[1].children[0].getAttribute('colSpan')).toEqual('5');
            expect(headTrs[1].children[0].innerHTML).toEqual('<span class="e-header-week">18</span>');
        });

        it('check day rows', () => {
            const headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
            expect(headTrs[2].children.length).toEqual(31);
            expect(headTrs[2].children[0].getAttribute('colSpan')).toEqual('1');
            expect(headTrs[2].children[0].innerHTML).
                toEqual('<span class="e-navigate" title="Tuesday, May 1, 2018">May 1</span>');
            expect(headTrs[2].children[0].getAttribute('data-date')).toEqual(new Date(2018, 4, 1).getTime().toString());
        });

        it('check work cells', () => {
            expect(schObj.getWorkCellElements().length).toEqual(31);
            const firstWorkCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
            expect(firstWorkCell.getAttribute('data-date')).toEqual(new Date(2018, 4, 1).getTime().toString());
            const data: CellClickEventArgs = schObj.getCellDetails(firstWorkCell);
            expect(data.startTime.getTime()).toEqual(new Date(2018, 4, 1).getTime());
            expect(data.endTime.getTime()).toEqual(new Date(2018, 4, 2).getTime());
            expect(data.isAllDay).toEqual(true);
            expect(data.groupIndex).toBeUndefined();
            expect(firstWorkCell.innerHTML).toEqual('');
            expect(schObj.element.querySelectorAll('.e-work-hours,.e-work-days').length).toEqual(23);
        });

        it('check events rendering with more indicator', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList.length).toEqual(24);
            const eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
            expect(eventWrapperList.length).toEqual(1);
            const moreIndicators: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
            expect(moreIndicators.length).toEqual(3);
            expect(moreIndicators[0].innerHTML).toEqual('+5&nbsp;more');
            expect(moreIndicators[0].getAttribute('data-start-date')).toEqual(new Date(2018, 4, 1).getTime().toString());
            expect(moreIndicators[0].getAttribute('data-end-date')).toEqual(new Date(2018, 4, 2).getTime().toString());
        });
    });

    describe('Year, Month, Week, Day, Hour header rows with single resource', () => {
        let schObj: Schedule;
        const resLength: number = 10;
        beforeAll((done: DoneFn) => {
            const options: ScheduleModel = {
                height: '600px', width: '1000px', currentView: 'TimelineMonth',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek', 'TimelineMonth'],
                headerRows: [{ option: 'Year' }, { option: 'Month' }, { option: 'Week' }, { option: 'Date' }, { option: 'Hour' }],
                selectedDate: new Date(2018, 4, 1)
            };
            schObj = util.createGroupSchedule(1, options, timelineResourceData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('view class on container', () => {
            expect(schObj.element.querySelector('.e-timeline-month-view')).toBeTruthy();
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-timeline-month');
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('May 2018');
        });

        it('check header rows', () => {
            expect(schObj.element.querySelectorAll('.e-date-header-wrap table col').length).toEqual(31);
            expect(schObj.element.querySelectorAll('.e-date-header-wrap table tr').length).toEqual(4);
        });

        it('check year rows', () => {
            const headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
            expect(headTrs[0].children.length).toEqual(1);
            expect(headTrs[0].children[0].getAttribute('colSpan')).toEqual('31');
            expect(headTrs[0].children[0].innerHTML).toEqual('<span class="e-header-year">2018</span>');
        });

        it('check month rows', () => {
            const headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
            expect(headTrs[1].children.length).toEqual(1);
            expect(headTrs[1].children[0].getAttribute('colSpan')).toEqual('31');
            expect(headTrs[1].children[0].innerHTML).toEqual('<span class="e-header-month">May</span>');
        });

        it('check week rows', () => {
            const headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
            expect(headTrs[2].children.length).toEqual(5);
            expect(headTrs[2].children[0].getAttribute('colSpan')).toEqual('5');
            expect(headTrs[2].children[0].innerHTML).toEqual('<span class="e-header-week">18</span>');
        });

        it('check day rows', () => {
            const headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
            expect(headTrs[3].children.length).toEqual(31);
            expect(headTrs[3].children[0].getAttribute('colSpan')).toEqual('1');
            expect(headTrs[3].children[0].innerHTML).toEqual('<span class="e-navigate" title="Tuesday, May 1, 2018">May 1</span>');
            expect(headTrs[3].children[0].getAttribute('data-date')).toEqual(new Date(2018, 4, 1).getTime().toString());
        });

        it('check resource column', () => {
            expect(schObj.element.querySelectorAll('.e-resource-column-wrap table tbody tr').length).toEqual(resLength);
            expect(schObj.element.querySelectorAll('.e-resource-column-wrap table tbody tr td').length).toEqual(resLength);
        });

        it('check work cells', () => {
            expect(schObj.element.querySelectorAll('.e-content-wrap table tbody tr').length).toEqual(resLength);
            expect(schObj.element.querySelectorAll('.e-content-wrap table col').length).toEqual(31);
            expect(schObj.element.querySelectorAll('.e-content-wrap table td').length).toEqual(31 * resLength);
            const firstWorkCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
            expect(firstWorkCell.getAttribute('data-date')).toEqual(new Date(2018, 4, 1).getTime().toString());
            expect(firstWorkCell.getAttribute('data-group-index')).toEqual('0');
            expect(firstWorkCell.innerHTML).toEqual('');

            const data: CellClickEventArgs = schObj.getCellDetails(firstWorkCell);
            expect(data.startTime.getTime()).toEqual(new Date(2018, 4, 1).getTime());
            expect(data.endTime.getTime()).toEqual(new Date(2018, 4, 2).getTime());
            expect(data.isAllDay).toEqual(true);
            expect(data.groupIndex).toBe(0);
        });

        it('check work hours highlight', () => {
            expect(schObj.element.querySelectorAll('.e-work-hours,.e-work-days').length).toEqual(23 * resLength);
        });

        it('check events rendering', () => {
            const eventElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElements.length).toEqual(19);
            const eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
            expect(eventWrapperList.length).toEqual(9);
            expect(schObj.element.querySelectorAll('.e-event-table > div').length).toEqual(resLength);
            expect(eventElements[0].querySelector('.e-subject').innerHTML).toEqual('Events - Within a day');
            expect(eventElements[0].querySelector('.e-time').innerHTML).toEqual('10:00 AM - 12:30 PM');
            expect(eventElements[0].getAttribute('data-group-index')).toEqual('0');
            expect(eventElements[0].style.backgroundColor).toEqual('rgb(255, 170, 0)');
            expect(eventElements[1].getAttribute('data-group-index')).toEqual('1');
            expect(eventElements[1].style.backgroundColor).toEqual('rgb(248, 163, 152)');
        });

        it('check more indicator', () => {
            const moreIndicators: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
            expect(moreIndicators.length).toEqual(10);
            expect(moreIndicators[0].innerHTML).toEqual('+1&nbsp;more');
            expect(moreIndicators[0].getAttribute('data-group-index')).toEqual('4');
            expect(moreIndicators[0].getAttribute('data-start-date')).toEqual(new Date(2018, 4, 3).getTime().toString());
            expect(moreIndicators[0].getAttribute('data-end-date')).toEqual(new Date(2018, 4, 4).getTime().toString());
            moreIndicators[0].click();
            const morePopup: HTMLElement = schObj.element.querySelector('.e-more-popup-wrapper') as HTMLElement;
            const eventElementList: Element[] = [].slice.call(morePopup.querySelectorAll('.e-more-appointment-wrapper .e-appointment'));
            expect(eventElementList.length).toEqual(2);
            expect(morePopup.classList).toContain('e-popup-open');
            util.triggerMouseEvent(morePopup.querySelector('.e-more-event-close'), 'click');
            expect(morePopup.classList).toContain('e-popup-close');
        });

        it('navigate next date', (done: DoneFn) => {
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
            schObj.dataBound = () => {
                expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-timeline-month');
                expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('June 2018');
                expect(schObj.element.querySelectorAll('.e-date-header-wrap table col').length).toEqual(30);
                const headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
                expect(headTrs[0].children.length).toEqual(1);
                expect(headTrs[0].children[0].getAttribute('colSpan')).toEqual('30');
                expect(headTrs[0].children[0].innerHTML).toEqual('<span class="e-header-year">2018</span>');
                expect(headTrs[1].children.length).toEqual(1);
                expect(headTrs[1].children[0].getAttribute('colSpan')).toEqual('30');
                expect(headTrs[1].children[0].innerHTML).toEqual('<span class="e-header-month">June</span>');
                expect(headTrs[2].children.length).toEqual(5);
                expect(headTrs[2].children[0].getAttribute('colSpan')).toEqual('2');
                expect(headTrs[2].children[0].innerHTML).toEqual('<span class="e-header-week">22</span>');
                expect(headTrs[3].children.length).toEqual(30);
                expect(headTrs[3].children[0].getAttribute('colSpan')).toEqual('1');
                expect(headTrs[3].children[0].innerHTML).toEqual('<span class="e-navigate" title="Friday, June 1, 2018">Jun 1</span>');
                expect(headTrs[3].children[0].getAttribute('data-date')).toEqual(new Date(2018, 5, 1).getTime().toString());
                expect(schObj.element.querySelectorAll('.e-resource-column-wrap table tbody tr').length).toEqual(resLength);
                expect(schObj.element.querySelectorAll('.e-resource-column-wrap table tbody tr td').length).toEqual(resLength);
                expect(schObj.element.querySelectorAll('.e-content-wrap table tbody tr').length).toEqual(resLength);
                expect(schObj.element.querySelectorAll('.e-content-wrap table col').length).toEqual(30);
                expect(schObj.element.querySelectorAll('.e-content-wrap table td').length).toEqual(30 * resLength);
                const firstWorkCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
                expect(firstWorkCell.getAttribute('data-date')).toEqual(new Date(2018, 5, 1).getTime().toString());
                expect(firstWorkCell.getAttribute('data-group-index')).toEqual('0');
                expect(firstWorkCell.innerHTML).toEqual('');
                const data: CellClickEventArgs = schObj.getCellDetails(firstWorkCell);
                expect(data.startTime.getTime()).toEqual(new Date(2018, 5, 1).getTime());
                expect(data.endTime.getTime()).toEqual(new Date(2018, 5, 2).getTime());
                expect(data.isAllDay).toEqual(true);
                expect(data.groupIndex).toBe(0);
                expect(schObj.element.querySelectorAll('.e-work-hours,.e-work-days').length).toEqual(21 * resLength);
                const eventElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(eventElements.length).toEqual(0);
                const eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
                expect(eventWrapperList.length).toEqual(0);
                expect(schObj.element.querySelectorAll('.e-event-table > div').length).toEqual(resLength);
                done();
            };
        });

        it('navigate previous date', (done: DoneFn) => {
            (schObj.element.querySelector('.e-toolbar-item.e-prev') as HTMLElement).click();
            schObj.dataBound = () => {
                expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-timeline-month');
                expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('May 2018');
                expect(schObj.element.querySelectorAll('.e-date-header-wrap table col').length).toEqual(31);
                const headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
                expect(headTrs[0].children.length).toEqual(1);
                expect(headTrs[0].children[0].getAttribute('colSpan')).toEqual('31');
                expect(headTrs[0].children[0].innerHTML).toEqual('<span class="e-header-year">2018</span>');
                expect(headTrs[1].children.length).toEqual(1);
                expect(headTrs[1].children[0].getAttribute('colSpan')).toEqual('31');
                expect(headTrs[1].children[0].innerHTML).toEqual('<span class="e-header-month">May</span>');
                expect(headTrs[2].children.length).toEqual(5);
                expect(headTrs[2].children[0].getAttribute('colSpan')).toEqual('5');
                expect(headTrs[2].children[0].innerHTML).toEqual('<span class="e-header-week">18</span>');
                expect(headTrs[3].children.length).toEqual(31);
                expect(headTrs[3].children[0].getAttribute('colSpan')).toEqual('1');
                expect(headTrs[3].children[0].innerHTML).toEqual('<span class="e-navigate" title="Tuesday, May 1, 2018">May 1</span>');
                expect(headTrs[3].children[0].getAttribute('data-date')).toEqual(new Date(2018, 4, 1).getTime().toString());
                expect(schObj.element.querySelectorAll('.e-resource-column-wrap table tbody tr').length).toEqual(resLength);
                expect(schObj.element.querySelectorAll('.e-resource-column-wrap table tbody tr td').length).toEqual(resLength);
                expect(schObj.element.querySelectorAll('.e-content-wrap table tbody tr').length).toEqual(resLength);
                expect(schObj.element.querySelectorAll('.e-content-wrap table col').length).toEqual(31);
                expect(schObj.element.querySelectorAll('.e-content-wrap table td').length).toEqual(31 * resLength);
                const firstWorkCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
                expect(firstWorkCell.getAttribute('data-date')).toEqual(new Date(2018, 4, 1).getTime().toString());
                expect(firstWorkCell.getAttribute('data-group-index')).toEqual('0');
                expect(firstWorkCell.innerHTML).toEqual('');
                const data: CellClickEventArgs = schObj.getCellDetails(firstWorkCell);
                expect(data.startTime.getTime()).toEqual(new Date(2018, 4, 1).getTime());
                expect(data.endTime.getTime()).toEqual(new Date(2018, 4, 2).getTime());
                expect(data.isAllDay).toEqual(true);
                expect(data.groupIndex).toBe(0);
                expect(schObj.element.querySelectorAll('.e-work-hours,.e-work-days').length).toEqual(23 * resLength);
                const eventElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(eventElements.length).toEqual(19);
                const eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
                expect(eventWrapperList.length).toEqual(9);
                expect(schObj.element.querySelectorAll('.e-event-table > div').length).toEqual(resLength);
                expect(eventElements[0].getAttribute('data-group-index')).toEqual('0');
                expect(eventElements[0].style.backgroundColor).toEqual('rgb(255, 170, 0)');
                expect(eventElements[1].getAttribute('data-group-index')).toEqual('1');
                expect(eventElements[1].style.backgroundColor).toEqual('rgb(248, 163, 152)');
                done();
            };
        });
    });

    describe('Default schedule block events', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const schOptions: ScheduleModel = {
                width: '500px', height: '500px', currentView: 'TimelineMonth',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek', 'TimelineMonth'],
                selectedDate: new Date(2017, 10, 2)
            };
            schObj = util.createSchedule(schOptions, blockData.slice(0, 14), done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('block event initial rendering testing', () => {
            expect(schObj.element.querySelectorAll('.e-block-appointment').length).toEqual(3);
            const blockEvent: HTMLElement = schObj.element.querySelector('[data-id="Appointment_2"]') as HTMLElement;
            expect(blockEvent.offsetTop).toEqual(0);
            expect(blockEvent.offsetWidth).toEqual(69);
        });

        it('add event', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventWindow.dialogObject.visible).toEqual(false);
                const addedEvent: HTMLElement = schObj.element.querySelector('[data-id="Appointment_15"]') as HTMLElement;
                expect(addedEvent.offsetTop).toEqual(2);
                expect(addedEvent.offsetWidth).toEqual(68);
                expect(addedEvent.offsetLeft).toEqual(70);
                done();
            };
            expect(schObj.blockData.length).toEqual(7);
            util.triggerMouseEvent(schObj.element.querySelector('.e-work-cells') as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelector('.e-work-cells') as HTMLElement, 'dblclick');
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const startObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_START_CLASS) as DateTimePicker;
            startObj.value = new Date(2017, 10, 1, 10, 30);
            startObj.dataBind();
            const endObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_END_CLASS) as DateTimePicker;
            endObj.value = new Date(2017, 10, 1, 11, 30);
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
            startRevisedObj.value = new Date(2017, 10, 2, 1, 0);
            startRevisedObj.dataBind();
            const endRevisedObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_END_CLASS) as DateTimePicker;
            endRevisedObj.value = new Date(2017, 10, 2, 2, 0);
            endRevisedObj.dataBind();
            saveButton.click();
        });

        it('edit event', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventWindow.dialogObject.visible).toEqual(false);
                const editedEvent: HTMLElement = schObj.element.querySelector('[data-id="Appointment_9"]') as HTMLElement;
                expect(editedEvent.offsetTop).toEqual(2);
                expect(editedEvent.offsetWidth).toEqual(68);
                expect(editedEvent.offsetLeft).toEqual(140);
                done();
            };
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-appointment')[2] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-appointment')[2] as HTMLElement, 'dblclick');
            const startObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_START_CLASS) as DateTimePicker;
            startObj.value = new Date(2017, 10, 1, 9, 30);
            startObj.dataBind();
            const endObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_END_CLASS) as DateTimePicker;
            endObj.value = new Date(2017, 10, 1, 11, 30);
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
            startRevisedObj.value = new Date(2017, 10, 3, 9, 30);
            startRevisedObj.dataBind();
            const endRevisedObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_END_CLASS) as DateTimePicker;
            endRevisedObj.value = new Date(2017, 10, 3, 10, 0);
            endRevisedObj.dataBind();
            saveButton.click();
        });
        it('Checking rowAutoHeight property', (done: DoneFn) => {
            schObj.dataBound = () => {
                const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(eventElementList.length).toEqual(5);
                const eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
                expect(eventWrapperList.length).toEqual(1);
                const moreIndicatorList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
                expect(moreIndicatorList.length).toEqual(0);
                done();
            };
            schObj.rowAutoHeight = true;
            schObj.dataBind();
        });
        it('checking block event with enableAdativeRows property', () => {
            const blockEventElement: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-block-appointment'));
            expect(blockEventElement.length).toEqual(3);
            const cellHeight: number = (schObj.element.querySelector('.e-content-table tbody td') as HTMLElement).offsetHeight;
            expect((blockEventElement[0] as HTMLElement).offsetHeight).toBe(cellHeight - 1);
        });
    });

    describe('Multi level resource rendering in block events', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const schOptions: ScheduleModel = {
                height: '500px', width: '500px', currentView: 'TimelineMonth',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek', 'TimelineMonth'],
                selectedDate: new Date(2017, 10, 2),
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
                expect(addedEvent.offsetWidth).toEqual(68);
                expect(addedEvent.offsetLeft).toEqual(70);
                done();
            };
            expect(schObj.blockData.length).toEqual(10);
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-content-table tr')[1].childNodes[13] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-content-table tr')[1].childNodes[13] as HTMLElement, 'dblclick');
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const startObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_START_CLASS) as DateTimePicker;
            startObj.value = new Date(2017, 10, 1);
            startObj.dataBind();
            const endObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_END_CLASS) as DateTimePicker;
            endObj.value = new Date(2017, 10, 1);
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
            startRevisedObj.value = new Date(2017, 10, 2);
            startRevisedObj.dataBind();
            const endRevisedObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_END_CLASS) as DateTimePicker;
            endRevisedObj.value = new Date(2017, 10, 2);
            endRevisedObj.dataBind();
            saveButton.click();
        });

        it('resource edit event', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventWindow.dialogObject.visible).toEqual(false);
                const editedEvent: HTMLElement = schObj.element.querySelector('[data-id="Appointment_9"]') as HTMLElement;
                expect(editedEvent.offsetWidth).toEqual(68);
                expect(editedEvent.offsetLeft).toEqual(140);
                done();
            };
            util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_9"]') as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_9"]') as HTMLElement, 'dblclick');
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const startObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_START_CLASS) as DateTimePicker;
            startObj.value = new Date(2017, 10, 1, 10, 0);
            startObj.dataBind();
            const endObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_END_CLASS) as DateTimePicker;
            endObj.value = new Date(2017, 10, 1, 11, 30);
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
            startRevisedObj.value = new Date(2017, 10, 3, 9, 30);
            startRevisedObj.dataBind();
            const endRevisedObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_END_CLASS) as DateTimePicker;
            endRevisedObj.value = new Date(2017, 10, 3, 10, 0);
            endRevisedObj.dataBind();
            saveButton.click();
        });

        it('Checking rowAutoHeight property', (done: DoneFn) => {
            schObj.dataBound = () => {
                const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(eventElementList.length).toEqual(7);
                const eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
                expect(eventWrapperList.length).toEqual(3);
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
            const cellHeight: number =
                (schObj.element.querySelector('.e-content-table tbody tr:nth-child(2) td') as HTMLElement).offsetHeight;
            expect((blockEventElement[0] as HTMLElement).offsetHeight).toBe(cellHeight - 1);
            const resorucCellHeight: number =
                (schObj.element.querySelector('.e-resource-column-table tbody tr:nth-child(2) td') as HTMLElement).offsetHeight;
            expect(resorucCellHeight).toEqual(cellHeight);
            const blockIndicator: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-block-indicator'));
            expect(blockIndicator.length).toEqual(8);
            expect(blockIndicator[0].offsetTop).toEqual(141);
        });
    });

    describe('Multi level resource rendering with Timescale -  Schedule width 500', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                height: '550px', width: '500px', currentView: 'TimelineWeek',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek'],
                group: {
                    byGroupID: false,
                    resources: ['Halls', 'Rooms', 'Owners']
                },
                resources: [{
                    field: 'HallId', title: 'Hall', name: 'Halls', allowMultiple: false,
                    dataSource: [
                        { HallText: 'Hall 1', Id: 1, HallColor: '#cb6bb2' },
                        { HallText: 'Hall 2', Id: 2, HallColor: '#56ca85' }
                    ],
                    textField: 'HallText', idField: 'Id', colorField: 'HallColor'
                }, {
                    field: 'RoomId', title: 'Room', name: 'Rooms', allowMultiple: false,
                    dataSource: [
                        { RoomText: 'ROOM 1', Id: 1, RoomGroupId: 1, RoomColor: '#cb6bb2' },
                        { RoomText: 'ROOM 2', Id: 2, RoomGroupId: 2, RoomColor: '#56ca85' },
                        { RoomText: 'ROOM 3', Id: 3, RoomGroupId: 1, RoomColor: '#56ca85' }
                    ],
                    textField: 'RoomText', idField: 'Id', groupIDField: 'RoomGroupId', colorField: 'RoomColor'
                }, {
                    field: 'OwnerId', title: 'Owner', name: 'Owners', allowMultiple: true,
                    dataSource: [
                        { OwnerText: 'Nancy', Id: 1, OwnerGroupId: 1, OwnerColor: '#ffaa00' },
                        { OwnerText: 'Steven', Id: 2, OwnerGroupId: 2, OwnerColor: '#f8a398' },
                        { OwnerText: 'Michael', Id: 3, OwnerGroupId: 3, OwnerColor: '#7499e1' },
                        { OwnerText: 'Oliver', Id: 4, OwnerGroupId: 1, OwnerColor: '#ffaa00' },
                        { OwnerText: 'John', Id: 5, OwnerGroupId: 2, OwnerColor: '#f8a398' },
                        { OwnerText: 'Barry', Id: 6, OwnerGroupId: 3, OwnerColor: '#7499e1' },
                        { OwnerText: 'Felicity', Id: 7, OwnerGroupId: 1, OwnerColor: '#ffaa00' },
                        { OwnerText: 'Cisco', Id: 8, OwnerGroupId: 2, OwnerColor: '#f8a398' },
                        { OwnerText: 'Sara', Id: 9, OwnerGroupId: 3, OwnerColor: '#7499e1' },
                        { OwnerText: 'Malcolm', Id: 10, OwnerGroupId: 1, OwnerColor: '#ffaa00' }
                    ],
                    textField: 'OwnerText', idField: 'Id', groupIDField: 'OwnerGroupId', colorField: 'OwnerColor'
                }],
                selectedDate: new Date(2018, 4, 1),
                timeScale: { enable: true, interval: 1440, slotCount: 2 }
            };
            schObj = util.createSchedule(model, timelineResourceData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Check events offsetleft - slot count 2', () => {
            const colElement: HTMLElement = schObj.element.querySelector('.' + cls.CONTENT_WRAP_CLASS + ' table colgroup col:first-child');
            const tdElement: HTMLElement = schObj.element.querySelector('.' + cls.WORK_CELLS_CLASS) as HTMLElement;
            expect(colElement.offsetWidth).toEqual(tdElement.offsetWidth);
        });
        it('Check events offsetleft - slot count 6', (done: DoneFn) => {
            schObj.dataBound = () => {
                const colElement: HTMLElement =
                    schObj.element.querySelector('.' + cls.CONTENT_WRAP_CLASS + ' table colgroup col:first-child');
                const tdElement: HTMLElement = schObj.element.querySelector('.' + cls.WORK_CELLS_CLASS) as HTMLElement;
                expect(colElement.offsetWidth).toEqual(tdElement.offsetWidth);
                done();
            };
            schObj.timeScale.slotCount = 6;
            schObj.dataBind();
        });
        it('Check events offsetleft - with start hour and end hour', (done: DoneFn) => {
            schObj.dataBound = () => {
                const colElement: HTMLElement =
                    schObj.element.querySelector('.' + cls.CONTENT_WRAP_CLASS + ' table colgroup col:first-child');
                const tdElement: HTMLElement = schObj.element.querySelector('.' + cls.WORK_CELLS_CLASS) as HTMLElement;
                expect(colElement.offsetWidth).toEqual(tdElement.offsetWidth);
                done();
            };
            schObj.timeScale.slotCount = 2;
            schObj.timeScale.interval = 420;
            schObj.startHour = '04:00';
            schObj.endHour = '11:00';
            schObj.dataBind();
        });
    });

    describe('Multi level resource rendering with Timescale -  Schedule width 1900', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                height: '550px', width: '1900px', currentView: 'TimelineWeek',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek'],
                group: {
                    byGroupID: false,
                    resources: ['Halls', 'Rooms', 'Owners']
                },
                resources: [{
                    field: 'HallId', title: 'Hall', name: 'Halls', allowMultiple: false,
                    dataSource: [
                        { HallText: 'Hall 1', Id: 1, HallColor: '#cb6bb2' },
                        { HallText: 'Hall 2', Id: 2, HallColor: '#56ca85' }
                    ],
                    textField: 'HallText', idField: 'Id', colorField: 'HallColor'
                }, {
                    field: 'RoomId', title: 'Room', name: 'Rooms', allowMultiple: false,
                    dataSource: [
                        { RoomText: 'ROOM 1', Id: 1, RoomGroupId: 1, RoomColor: '#cb6bb2' },
                        { RoomText: 'ROOM 2', Id: 2, RoomGroupId: 2, RoomColor: '#56ca85' },
                        { RoomText: 'ROOM 3', Id: 3, RoomGroupId: 1, RoomColor: '#56ca85' }
                    ],
                    textField: 'RoomText', idField: 'Id', groupIDField: 'RoomGroupId', colorField: 'RoomColor'
                }, {
                    field: 'OwnerId', title: 'Owner', name: 'Owners', allowMultiple: true,
                    dataSource: [
                        { OwnerText: 'Nancy', Id: 1, OwnerGroupId: 1, OwnerColor: '#ffaa00' },
                        { OwnerText: 'Steven', Id: 2, OwnerGroupId: 2, OwnerColor: '#f8a398' },
                        { OwnerText: 'Michael', Id: 3, OwnerGroupId: 3, OwnerColor: '#7499e1' },
                        { OwnerText: 'Oliver', Id: 4, OwnerGroupId: 1, OwnerColor: '#ffaa00' },
                        { OwnerText: 'John', Id: 5, OwnerGroupId: 2, OwnerColor: '#f8a398' },
                        { OwnerText: 'Barry', Id: 6, OwnerGroupId: 3, OwnerColor: '#7499e1' },
                        { OwnerText: 'Felicity', Id: 7, OwnerGroupId: 1, OwnerColor: '#ffaa00' },
                        { OwnerText: 'Cisco', Id: 8, OwnerGroupId: 2, OwnerColor: '#f8a398' },
                        { OwnerText: 'Sara', Id: 9, OwnerGroupId: 3, OwnerColor: '#7499e1' },
                        { OwnerText: 'Malcolm', Id: 10, OwnerGroupId: 1, OwnerColor: '#ffaa00' }
                    ],
                    textField: 'OwnerText', idField: 'Id', groupIDField: 'OwnerGroupId', colorField: 'OwnerColor'
                }],
                selectedDate: new Date(2018, 4, 1),
                timeScale: { enable: true, interval: 1440, slotCount: 2 }
            };
            schObj = util.createSchedule(model, timelineResourceData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Check events offsetleft - slot count 2', () => {
            const colElement: HTMLElement =
                schObj.element.querySelector('.' + cls.CONTENT_WRAP_CLASS + ' table colgroup col:first-child') as HTMLElement;
            const tdElement: HTMLElement =
                schObj.element.querySelector('.' + cls.CONTENT_WRAP_CLASS + ' tbody tr:first-child td:first-child') as HTMLElement;
            expect(colElement.offsetWidth).toEqual(+tdElement.offsetWidth);
        });
        it('Check events offsetleft - slot count 6', (done: DoneFn) => {
            schObj.dataBound = () => {
                const colElement: HTMLElement =
                    schObj.element.querySelector('.' + cls.CONTENT_WRAP_CLASS + ' table colgroup col:first-child') as HTMLElement;
                const tdElement: HTMLElement =
                    schObj.element.querySelector('.' + cls.CONTENT_WRAP_CLASS + ' tbody tr:first-child td:first-child') as HTMLElement;
                expect(colElement.offsetWidth).toEqual(+tdElement.offsetWidth);
                done();
            };
            schObj.timeScale.slotCount = 6;
            schObj.dataBind();
        });
        it('Check events offsetleft - with start hour and end hour', (done: DoneFn) => {
            schObj.dataBound = () => {
                const colElement: HTMLElement =
                    schObj.element.querySelector('.' + cls.CONTENT_WRAP_CLASS + ' table colgroup col:first-child') as HTMLElement;
                const tdElement: HTMLElement =
                    schObj.element.querySelector('.' + cls.CONTENT_WRAP_CLASS + ' tbody tr:first-child td:first-child') as HTMLElement;
                expect(colElement.offsetWidth).toEqual(+tdElement.offsetWidth);
                done();
            };
            schObj.timeScale.slotCount = 2;
            schObj.timeScale.interval = 420;
            schObj.startHour = '04:00';
            schObj.endHour = '11:00';
            schObj.dataBind();
        });
    });

    describe('EJ2-25919 - Option to get clicked date in Month view', () => {
        let schObj: Schedule;
        let viewDate: Date;
        beforeAll((done: DoneFn) => {
            const schOptions: ScheduleModel = {
                width: '500px', height: '500px', currentView: 'TimelineMonth',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek', 'TimelineMonth'],
                selectedDate: new Date(2019, 3, 1),
                actionBegin: (args: ActionEventArgs) => {
                    if (args.requestType === 'viewNavigate') {
                        viewDate = new Date(parseInt(closest(args.event.target as Element, 'td').getAttribute('data-date'), 10));
                    }
                }
            };
            schObj = util.createSchedule(schOptions, [], done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('timeline month view to timeline day view change', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.currentView).toEqual('TimelineDay');
                expect(viewDate).toBeDefined();
                expect(viewDate.getDate()).toEqual(5);
                expect(viewDate.getMonth()).toEqual(3);
                expect(viewDate.getFullYear()).toEqual(2019);
                done();
            };
            const dateHeader: HTMLElement = schObj.element.querySelector('.e-header-cells:nth-child(5) .e-navigate') as HTMLElement;
            expect(schObj.currentView).toEqual('TimelineMonth');
            expect(viewDate).toBeUndefined();
            util.triggerMouseEvent(dateHeader, 'click');
        });
    });

    describe('Testing start and end time of longer event in timeline month view', () => {
        const testData: Record<string, any>[] = [{
            Id: 1,
            Subject: 'Event one',
            StartTime: new Date(2017, 9, 1),
            EndTime: new Date(2017, 11, 1),
            IsAllDay: true
        }, {
            Id: 2,
            Subject: 'Event two',
            StartTime: new Date(2017, 9, 12),
            EndTime: new Date(2017, 10, 12),
            IsAllDay: true
        }, {
            Id: 3,
            Subject: 'Event three',
            StartTime: new Date(2017, 10, 12),
            EndTime: new Date(2017, 11, 12),
            IsAllDay: true
        }];
        const eventTemplate: string = '<div class="time">(Start date : ${data.StartTime.getDate()}.${(data.StartTime.getMonth() + 1)})'
            + ' - (End date : ${data.EndTime.getDate()}.${(data.EndTime.getMonth() + 1)})</div>';
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const schOptions: ScheduleModel = {
                width: '500px', height: '500px', currentView: 'TimelineMonth',
                views: ['TimelineMonth'],
                selectedDate: new Date(2017, 10, 2),
                eventSettings: { template: eventTemplate }
            };
            schObj = util.createSchedule(schOptions, testData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Checking template start and end time', () => {
            const event: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(event.length).toEqual(3);
            expect(event[0].getAttribute('data-id')).toEqual('Appointment_1');
            expect(event[0].children[0].children[1].innerHTML).toEqual('(Start date : 1.10) - (End date : 1.12)');
            expect(event[1].getAttribute('data-id')).toEqual('Appointment_2');
            expect(event[1].children[0].children[1].innerHTML).toEqual('(Start date : 12.10) - (End date : 12.11)');
            expect(event[2].getAttribute('data-id')).toEqual('Appointment_3');
            expect(event[2].children[1].children[0].innerHTML).toEqual('(Start date : 12.11) - (End date : 12.12)');
        });
    });

    describe('Ensure Scroll Left for Selected Date', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                width: '500px', height: '500px', currentView: 'TimelineMonth', selectedDate: new Date(2017, 8, 24),
                views: ['Day', 'Week', 'TimelineMonth', 'Month']
            };
            schObj = util.createSchedule(model, timelineData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('horizontal scroll', (done: DoneFn) => {
            const contentArea: HTMLElement = schObj.element.querySelector('.e-content-wrap') as HTMLElement;
            (schObj.activeView as any).onContentScroll({ target: contentArea });

            expect(contentArea.scrollLeft).toEqual(1602);
            done();
        });
    });

    describe('Initial load with height auto', () => {
        let schObj: Schedule;
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Checking vertical scrollbar', (done: DoneFn) => {
            const model: ScheduleModel = {
                height: 'auto', width: 500, currentView: 'TimelineMonth',
                views: ['TimelineMonth'], selectedDate: new Date(2017, 9, 1),
                dataBound: () => {
                    const contentArea: HTMLElement = schObj.element.querySelector('.' + cls.CONTENT_WRAP_CLASS) as HTMLElement;
                    const isVerticalScrollBar: boolean = contentArea.scrollHeight > contentArea.clientHeight;
                    expect(isVerticalScrollBar).toBeFalsy();
                    done();
                }
            };
            schObj = util.createSchedule(model, []);
        });
    });

    describe('Testing the Appointment rendering for longer appointments renders after shorter one', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const monthData: Record<string, any>[] = [{
                Id: 1,
                Subject: 'Short Event',
                StartTime: new Date(2019, 1, 1, 10, 0, 0),
                EndTime: new Date(2019, 1, 5, 10, 0, 0),
                IsAllDay: true,
                OwnerId: 1
            }];
            const model: ScheduleModel = {
                width: '500px', height: '550px', selectedDate: new Date(2019, 1, 1),
                views: [{ option: 'TimelineMonth' }],
                group: {
                    byGroupID: false,
                    resources: ['Owners']
                },
                resources: [{
                    field: 'OwnerId', title: 'Owner', name: 'Owners', allowMultiple: true,
                    dataSource: [
                        { OwnerText: 'Nancy', Id: 1, OwnerGroupId: 1, OwnerColor: '#ffaa00' },
                        { OwnerText: 'Steven', Id: 2, OwnerGroupId: 2, OwnerColor: '#f8a398' },
                        { OwnerText: 'Michael', Id: 3, OwnerGroupId: 3, OwnerColor: '#7499e1' },
                        { OwnerText: 'Oliver', Id: 4, OwnerGroupId: 1, OwnerColor: '#ffaa00' },
                        { OwnerText: 'John', Id: 5, OwnerGroupId: 2, OwnerColor: '#f8a398' },
                        { OwnerText: 'Barry', Id: 6, OwnerGroupId: 3, OwnerColor: '#7499e1' },
                        { OwnerText: 'Felicity', Id: 7, OwnerGroupId: 1, OwnerColor: '#ffaa00' },
                        { OwnerText: 'Cisco', Id: 8, OwnerGroupId: 2, OwnerColor: '#f8a398' },
                        { OwnerText: 'Sara', Id: 9, OwnerGroupId: 3, OwnerColor: '#7499e1' },
                        { OwnerText: 'Malcolm', Id: 10, OwnerGroupId: 1, OwnerColor: '#ffaa00' }
                    ],
                    textField: 'OwnerText', idField: 'Id', groupIDField: 'OwnerGroupId', colorField: 'OwnerColor'
                }]
            };
            schObj = util.createSchedule(model, monthData, done);
        });

        afterAll(() => {
            util.destroy(schObj);
        });

        it('Before rendering longer appointments', () => {
            expect(schObj.element.querySelectorAll('.e-more-indicator').length).toEqual(0);
        });

        it('After rendering longer appointemnt checking', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-more-indicator').length).toEqual(9);
                done();
            };
            schObj.addEvent([{
                Id: 2,
                Subject: 'Long Event',
                StartTime: new Date(2019, 1, 2, 10, 0, 0),
                EndTime: new Date(2019, 1, 10, 10, 0, 0),
                IsAllDay: true,
                OwnerId: 1
            }]);
        });
    });

    describe('Performance checking for TimelineMonth', () => {
        let schObj: Schedule;
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Checking inital load performance for 20 resource 400 events', (done: DoneFn) => {
            const eventTemplate: string = '<div class="time">(Start date : ${data.StartTime.getDate()}.${(data.StartTime.getMonth() + 1)})'
                + ' - (End date : ${data.EndTime.getDate()}.${(data.EndTime.getMonth() + 1)})</div>';
            let eventStartTime: number = 0;
            const date: Date = new Date();
            const startDate: Date = new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate(),
                date.getHours() - 3,
                0
            );
            const res: Record<string, any>[] = generateResourceDatasource(1, 20, 'Resource');
            const events: Record<string, any>[] = generateEvents(startDate, 20, 10);
            const model: ScheduleModel = {
                height: '550px', width: '100%',
                currentView: 'TimelineWeek',
                views: [
                    { option: 'TimelineWeek', eventTemplate: eventTemplate, allowVirtualScrolling: false }
                ],
                group: {
                    resources: ['Resources']
                },
                resources: [
                    {
                        field: 'ResourceId', title: 'Resource',
                        name: 'Resources', allowMultiple: true,
                        dataSource: res,
                        textField: 'Text', idField: 'Id', colorField: 'Color'
                    }
                ],
                selectedDate: startDate,
                eventSettings: { dataSource: events },
                dataBinding: () => {
                    eventStartTime = window.performance.now();
                },
                dataBound: () => {
                    const eventEndTime: number = window.performance.now();
                    const sec: number = Math.floor((eventEndTime - eventStartTime) / 60000);
                    expect(sec).toBeLessThan(1);
                    done();
                }
            };
            schObj = util.createSchedule(model, []);
        });
    });

    describe('EJ2-56141-Timeline month view header rows cells misalignment issue', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const headTemplate: string = '<span>${type}</span>';
            const options: ScheduleModel = {
                height: '600px', width: '100%',
                views: [{ option: 'TimelineMonth', interval: 12 }],
                headerRows: [
                    { option: 'Month', template: headTemplate },
                    { option: 'Week', template: headTemplate },
                    { option: 'Date' }
                ],
                selectedDate: new Date(2021, 0, 1)
            };
            schObj = util.createSchedule(options, [], done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('check cell misalignment', () => {
            const dateHeaders: NodeListOf<Element> = schObj.element.querySelectorAll('.e-header-cells.e-date-header');
            const workCells: NodeListOf<Element> = schObj.element.querySelectorAll('.e-work-cells');
            expect(dateHeaders.length).toEqual(365);
            expect(workCells.length).toEqual(365);
            expect((dateHeaders[dateHeaders.length - 1] as HTMLElement).offsetLeft).toEqual(
                (workCells[workCells.length - 1] as HTMLElement).offsetLeft);
        });
    });

    describe('EJ2-57740 - Checking the scroll position maintenance in Timeline month view', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                width: '500px', height: '550px', selectedDate: new Date(2020, 4, 20),
                views: [{ option: 'TimelineMonth' }],
                group: {
                    byGroupID: false,
                    resources: ['Owners']
                },
                resources: [{
                    field: 'OwnerId', title: 'Owner', name: 'Owners', allowMultiple: true,
                    dataSource: [
                        { OwnerText: 'Nancy', Id: 1, OwnerColor: '#ffaa00' },
                        { OwnerText: 'Steven', Id: 2, OwnerColor: '#f8a398' },
                        { OwnerText: 'Michael', Id: 3, OwnerColor: '#7499e1' },
                        { OwnerText: 'Oliver', Id: 4, OwnerColor: '#ffaa00' },
                        { OwnerText: 'John', Id: 5, OwnerColor: '#f8a398' },
                        { OwnerText: 'Barry', Id: 6, OwnerColor: '#7499e1' },
                        { OwnerText: 'Felicity', Id: 7, OwnerColor: '#ffaa00' },
                        { OwnerText: 'Cisco', Id: 8, OwnerColor: '#f8a398' },
                        { OwnerText: 'Sara', Id: 9, OwnerColor: '#7499e1' },
                        { OwnerText: 'Malcolm', Id: 10, OwnerColor: '#ffaa00' }
                    ],
                    textField: 'OwnerText', idField: 'Id', colorField: 'OwnerColor'
                }]
            };
            schObj = util.createSchedule(model, [], done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('After the initial rendering', () => {
            const contentWrap: HTMLElement = schObj.element.querySelector('.' + cls.CONTENT_WRAP_CLASS);
            const resourceWrap: HTMLElement = schObj.element.querySelector('.' + cls.RESOURCE_COLUMN_WRAP_CLASS);
            expect(contentWrap.scrollTop).toEqual(0);
            expect(contentWrap.scrollLeft).toEqual(1330);
            expect(resourceWrap.scrollTop).toEqual(0);
        });
        it('Change the scroll position', (done: DoneFn) => {
            schObj.dataBound = () => done();
            const contentWrap: HTMLElement = schObj.element.querySelector('.' + cls.CONTENT_WRAP_CLASS);
            util.triggerScrollEvent(contentWrap, 120, 140);
            schObj.showWeekend = false;
            schObj.dataBind();
        });
        it('Ensure the changed position', () => {
            const contentArea: HTMLElement = schObj.element.querySelector('.' + cls.CONTENT_WRAP_CLASS);
            const resourceArea: HTMLElement = schObj.element.querySelector('.' + cls.RESOURCE_COLUMN_WRAP_CLASS);
            expect(contentArea.scrollTop).toEqual(120);
            expect(contentArea.scrollLeft).toEqual(140);
            expect(resourceArea.scrollTop).toEqual(120);
        });
    });

    describe('Timeline views resource rendering without horizontal scrollbar', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                height: '550px', width: '2600px', currentView: 'TimelineMonth',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineMonth'],
                group: { resources: ['Halls', 'Rooms', 'Owners'] },
                resources: [{
                    field: 'HallId', title: 'Hall', name: 'Halls', allowMultiple: false,
                    dataSource: [
                        { HallText: 'Hall 1', Id: 1, HallColor: '#cb6bb2', Expand: false },
                        { HallText: 'Hall 2', Id: 2, HallColor: '#56ca85', Expand: false }
                    ],
                    textField: 'HallText', idField: 'Id', colorField: 'HallColor', expandedField: 'Expand'
                }, {
                    field: 'RoomId', title: 'Room', name: 'Rooms', allowMultiple: false,
                    dataSource: [
                        { RoomText: 'ROOM 1', Id: 1, RoomGroupId: 1, RoomColor: '#cb6bb2' },
                        { RoomText: 'ROOM 2', Id: 2, RoomGroupId: 2, RoomColor: '#56ca85' },
                        { RoomText: 'ROOM 3', Id: 3, RoomGroupId: 1, RoomColor: '#56ca85' }
                    ],
                    textField: 'RoomText', idField: 'Id', groupIDField: 'RoomGroupId', colorField: 'RoomColor', expandedField: 'Expand'
                }, {
                    field: 'OwnerId', title: 'Owner', name: 'Owners', allowMultiple: true,
                    dataSource: [
                        { OwnerText: 'Nancy', Id: 1, OwnerGroupId: 1, OwnerColor: '#ffaa00' },
                        { OwnerText: 'Steven', Id: 2, OwnerGroupId: 2, OwnerColor: '#f8a398' },
                        { OwnerText: 'Michael', Id: 3, OwnerGroupId: 3, OwnerColor: '#7499e1' },
                        { OwnerText: 'Oliver', Id: 4, OwnerGroupId: 1, OwnerColor: '#ffaa00' },
                        { OwnerText: 'John', Id: 5, OwnerGroupId: 2, OwnerColor: '#f8a398' },
                        { OwnerText: 'Barry', Id: 6, OwnerGroupId: 3, OwnerColor: '#7499e1' },
                        { OwnerText: 'Felicity', Id: 7, OwnerGroupId: 1, OwnerColor: '#ffaa00' },
                        { OwnerText: 'Cisco', Id: 8, OwnerGroupId: 2, OwnerColor: '#f8a398' },
                        { OwnerText: 'Sara', Id: 9, OwnerGroupId: 3, OwnerColor: '#7499e1' },
                        { OwnerText: 'Malcolm', Id: 10, OwnerGroupId: 1, OwnerColor: '#ffaa00' }
                    ],
                    textField: 'OwnerText', idField: 'Id', groupIDField: 'OwnerGroupId',
                    colorField: 'OwnerColor', expandedField: 'Expand'
                }],
                selectedDate: new Date(2018, 4, 1)
            };
            schObj = util.createSchedule(model, timelineResourceData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('checking the horizontal scrollbar rendering', () => {
            const elementClick: HTMLElement = schObj.element.querySelector('.' + cls.RESOURCE_EXPAND_CLASS);
            elementClick.click();
            const contentArea: HTMLElement = schObj.element.querySelector('.' + cls.CONTENT_WRAP_CLASS);
            expect(contentArea.offsetHeight - contentArea.clientHeight).toEqual(0);
        });
    });

    describe('Schedule TimelineMonth view with maxEventsPerRow property when the row have enough height', () => {
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
                currentView: 'TimelineMonth',
                selectedDate: new Date(2023, 10, 6),
                views: [{ option: 'TimelineMonth', maxEventsPerRow: 2 }]
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

    describe('Schedule Timelinemonth view with maxEventsPerRow property when the row does not have enough height', () => {
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
                currentView: 'TimelineMonth',
                selectedDate: new Date(2023, 10, 6),
                views: [{ option: 'TimelineMonth', maxEventsPerRow: 3 }]
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
            expect(heightValue).toEqual('139px');
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

    describe('Schedule TimelineMonth view with maxEventsPerRow property and multiple resource grouping', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const moreIndicatorData: Record<string, any>[] = [{
                Id: 1,
                Subject: 'Event 1',
                StartTime: new Date(2023, 10, 6, 0, 0),
                EndTime: new Date(2023, 10, 7, 0, 0),
                IsAllDay: true,
                RoomId: 1,
                OwnerId: 1
            },
            {
                Id: 2,
                Subject: 'Event 2',
                StartTime: new Date(2023, 10, 6, 0, 0),
                EndTime: new Date(2023, 10, 7, 0, 0),
                IsAllDay: true,
                RoomId: 1,
                OwnerId: 1
            },
            {
                Id: 3,
                Subject: 'Event 3',
                StartTime: new Date(2023, 10, 6, 0, 0),
                EndTime: new Date(2023, 10, 7, 0, 0),
                IsAllDay: true,
                RoomId: 1,
                OwnerId: 1
            },
            {
                Id: 4,
                Subject: 'Event 4',
                StartTime: new Date(2023, 10, 6, 0, 0),
                EndTime: new Date(2023, 10, 7, 0, 0),
                IsAllDay: true,
                RoomId: 1,
                OwnerId: 1
            }];
            const model: ScheduleModel = {
                currentView: 'TimelineMonth',
                selectedDate: new Date(2023, 10, 6),
                views: [{ option: 'TimelineMonth', maxEventsPerRow: 2 }],
                group: {
                    resources: ['Rooms', 'Owners']
                },
                resources: [{
                    field: 'RoomId', title: 'Room',
                    name: 'Rooms', allowMultiple: false,
                    dataSource: [
                        { RoomText: 'ROOM 1', Id: 1, RoomColor: '#cb6bb2' },
                        { RoomText: 'ROOM 2', Id: 2, RoomColor: '#56ca85' }
                    ],
                    textField: 'RoomText', idField: 'Id', colorField: 'RoomColor'
                }, {
                    field: 'OwnerId', title: 'Owner',
                    name: 'Owners', allowMultiple: true,
                    dataSource: [
                        { OwnerText: 'Nancy', Id: 1, OwnerGroupId: 1, OwnerColor: '#ffaa00' },
                        { OwnerText: 'Steven', Id: 2, OwnerGroupId: 2, OwnerColor: '#f8a398' },
                        { OwnerText: 'Michael', Id: 3, OwnerGroupId: 1, OwnerColor: '#7499e1' }
                    ],
                    textField: 'OwnerText', idField: 'Id', groupIDField: 'OwnerGroupId', colorField: 'OwnerColor'
                }]
            };
            schObj = util.createSchedule(model, moreIndicatorData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('elements in DOM based on maxEventsPerRow with multiple resources', () => {
            const appointmentList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(appointmentList.length).toEqual(2);
            (schObj.element.querySelectorAll('.e-more-indicator')[0] as HTMLElement).click();
            expect(schObj.element.querySelector('.e-more-popup-wrapper').classList.contains('e-popup-open')).toEqual(true);
            const moreEvent: HTMLElement = (schObj.element.querySelector('.e-more-popup-wrapper').querySelector('.e-more-appointment-wrapper'));
            const moreAppointmentList: Element[] = [].slice.call(moreEvent.querySelectorAll('.e-appointment'));
            expect(moreAppointmentList.length).toEqual(4);
            (schObj.element.querySelector('.e-close-icon') as HTMLElement).click();
        });

        it('elements in DOM with ignoreWhiteSpace property', (done: DoneFn) => {
            schObj.dataBound = () => {
                const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(eventElementList.length).toEqual(4);
                const heightValue: string = (schObj.element.querySelector('.e-content-table tr td') as HTMLElement).style.height;
                expect(heightValue).toEqual('');
                done();
            };
            schObj.rowAutoHeight = true;
            schObj.eventSettings.ignoreWhitespace = true;
            schObj.dataBind();
        });
    });

    describe('Schedule TimelineMonth view with maxEventsPerRow property when the row does not have enough height', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const moreIndicatorData: Record<string, any>[] = [{
                Id: 1,
                Subject: 'Event 1',
                StartTime: new Date(2023, 10, 6, 0, 0),
                EndTime: new Date(2023, 10, 7, 0, 0),
                IsAllDay: true,
                RoomId: 1,
                OwnerId: 1
            },
            {
                Id: 2,
                Subject: 'Event 2',
                StartTime: new Date(2023, 10, 6, 0, 0),
                EndTime: new Date(2023, 10, 7, 0, 0),
                IsAllDay: true,
                RoomId: 1,
                OwnerId: 1
            },
            {
                Id: 3,
                Subject: 'Event 3',
                StartTime: new Date(2023, 10, 6, 0, 0),
                EndTime: new Date(2023, 10, 7, 0, 0),
                IsAllDay: true,
                RoomId: 1,
                OwnerId: 1
            },
            {
                Id: 4,
                Subject: 'Event 4',
                StartTime: new Date(2023, 10, 6, 0, 0),
                EndTime: new Date(2023, 10, 7, 0, 0),
                IsAllDay: true,
                RoomId: 1,
                OwnerId: 1
            }];
            const model: ScheduleModel = {
                currentView: 'TimelineMonth',
                selectedDate: new Date(2023, 10, 6),
                views: [{ option: 'TimelineMonth', maxEventsPerRow: 3 }],
                group: {
                    resources: ['Rooms', 'Owners']
                },
                resources: [{
                    field: 'RoomId', title: 'Room',
                    name: 'Rooms', allowMultiple: false,
                    dataSource: [
                        { RoomText: 'ROOM 1', Id: 1, RoomColor: '#cb6bb2' },
                        { RoomText: 'ROOM 2', Id: 2, RoomColor: '#56ca85' }
                    ],
                    textField: 'RoomText', idField: 'Id', colorField: 'RoomColor'
                }, {
                    field: 'OwnerId', title: 'Owner',
                    name: 'Owners', allowMultiple: true,
                    dataSource: [
                        { OwnerText: 'Nancy', Id: 1, OwnerGroupId: 1, OwnerColor: '#ffaa00' },
                        { OwnerText: 'Steven', Id: 2, OwnerGroupId: 2, OwnerColor: '#f8a398' },
                        { OwnerText: 'Michael', Id: 3, OwnerGroupId: 1, OwnerColor: '#7499e1' }
                    ],
                    textField: 'OwnerText', idField: 'Id', groupIDField: 'OwnerGroupId', colorField: 'OwnerColor'
                }]
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
            expect(heightValue).toEqual('139px');
            const resourceHeightValue: string = (schObj.element.querySelector('.e-resource-column-table tr td') as HTMLElement).style.height;
            expect(resourceHeightValue).toEqual('139px');
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
