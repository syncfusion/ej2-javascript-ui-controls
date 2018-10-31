import { createElement, remove, EmitType, Browser } from '@syncfusion/ej2-base';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import {
    Schedule, TimelineViews, TimelineMonth, EJ2Instance, CellClickEventArgs, ScheduleModel
} from '../../../src/schedule/index';
import * as cls from '../../../src/schedule/base/css-constant';
import { triggerScrollEvent, triggerMouseEvent, disableScheduleAnimation } from '../util.spec';
import {
    timelineData, resourceData, timelineResourceData, cloneDataSource, resourceGroupData, levelBasedData
} from '../base/datasource.spec';
import { createSchedule, createGroupSchedule, destroy } from '../util.spec';

/**
 * Schedule Timeline Month view spec 
 */
Schedule.Inject(TimelineViews, TimelineMonth);

describe('Schedule Month view', () => {
    describe('Initial load', () => {
        let schObj: Schedule;
        beforeAll((done: Function) => {
            let model: ScheduleModel = {
                currentView: 'TimelineMonth',
                views: ['Day', 'Week', 'TimelineMonth', 'Month'],
                selectedDate: new Date(2017, 10, 1)
            };
            schObj = createSchedule(model, timelineData, done);
        });
        afterAll(() => {
            destroy(schObj);
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
            let firstWorkCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
            expect(firstWorkCell.parentElement.getAttribute('role')).toEqual('row');
            expect(firstWorkCell.getAttribute('role')).toEqual('gridcell');
            expect(firstWorkCell.getAttribute('aria-selected')).toEqual('false');
            expect(firstWorkCell.getAttribute('data-date')).toEqual(new Date(2017, 10, 1).getTime().toString());
        });

        it('navigate next date', () => {
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
            expect(schObj.element.querySelectorAll('.e-date-header-container .e-date-header').length).toEqual(31);
        });

        it('navigate previous date', () => {
            (schObj.element.querySelector('.e-toolbar-item.e-prev') as HTMLElement).click();
            expect(schObj.element.querySelectorAll('.e-date-header-container .e-date-header').length).toEqual(30);
        });

        it('Event rendering', (done: Function) => {
            let dataBound: (args: Object) => void = (args: Object) => {
                let eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(eventElementList.length).toEqual(25);
                expect(schObj.eventsData.length).toEqual(21);
                done();
            };
            schObj.selectedDate = new Date(2018, 4, 1);
            schObj.dataBound = dataBound;
            schObj.dataBind();
        });

        it('Checking left indicator icons', () => {
            let eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[1].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Spanned  Event - Same week');
            expect(eventElementList[1].querySelectorAll('.e-appointment-details .e-indicator')[0].classList.contains('e-left-icon'))
                .toBeTruthy();
        });

        it('Checking recurrence icon', () => {
            let eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[2].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Recurrence Event - Greater than 24');
            expect(eventElementList[2].querySelectorAll('.e-appointment-details .e-icons')[1].classList.contains('e-recurrence-icon'))
                .toBeTruthy();
        });

        it('Checking more indicator', () => {
            let moreIndicatorList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
            expect(moreIndicatorList.length).toEqual(1);
            let element: HTMLElement = moreIndicatorList[0] as HTMLElement;
            element.click();
            let eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-appointment-wrapper .e-appointment'));
            expect(eventElementList.length).toEqual(15);
            let close: HTMLElement = <HTMLElement>schObj.element.querySelector('.e-more-event-close');
            close.click();
        });
        it('cell single click', () => {
            triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            let cellPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(cellPopup.classList).toContain('e-popup-open');
            let moreDetail: HTMLElement = <HTMLElement>cellPopup.querySelector('.e-event-details');
            expect(moreDetail.classList).toContain('e-btn');
            expect(moreDetail.classList).toContain('e-flat');
            expect(moreDetail.innerHTML).toEqual('More Details');
            let save: HTMLElement = cellPopup.querySelector('.e-event-create');
            expect(save.classList).toContain('e-primary');
            expect(save.innerHTML).toEqual('Save');
            let close: HTMLElement = cellPopup.querySelector('.e-close-icon');
            expect(close.classList).toContain('e-btn-icon');
            close.click();
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(0);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
        it('cell double click', () => {
            triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
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
            let cancelButton: HTMLElement = dialogElement.querySelector('.e-event-cancel') as HTMLElement;
            cancelButton.click();
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(0);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
        it('event single click', () => {
            let event: HTMLElement = schObj.element.querySelectorAll('.e-appointment')[1] as HTMLElement;
            triggerMouseEvent(event, 'click');
            let eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup.classList).toContain('e-popup-open');
            let edit: HTMLElement = eventPopup.querySelector('.e-edit');
            expect(edit.children[0].classList).toContain('e-edit-icon');
            let deleteIcon: HTMLElement = eventPopup.querySelector('.e-delete');
            expect(deleteIcon.children[0].classList).toContain('e-delete-icon');
            (eventPopup.querySelector('.e-close-icon') as HTMLElement).click();
            expect(event.classList).toContain('e-appointment-border');
            expect(event.getAttribute('aria-selected')).toEqual('true');
        });
        it('event double click', () => {
            triggerMouseEvent(schObj.element.querySelectorAll('.e-appointment')[1] as HTMLElement, 'dblclick');
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            expect(dialogElement.querySelector('.' + cls.EVENT_WINDOW_TITLE_TEXT_CLASS).innerHTML).toEqual('Edit Event');
            let cancelButton: HTMLElement = dialogElement.querySelector('.e-event-cancel') as HTMLElement;
            cancelButton.click();
        });
    });

    describe('Work hour highlight', () => {
        let schObj: Schedule;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        beforeAll(() => {
            document.body.appendChild(elem);
            schObj = new Schedule({
                selectedDate: new Date(2017, 10, 1),
                currentView: 'TimelineMonth',
                views: ['Day', 'Week', 'TimelineMonth', 'Month'],
            });
            schObj.appendTo('#Schedule');
        });
        afterAll(() => {
            if (schObj) {
                schObj.destroy();
            }
            remove(elem);
        });

        it('ensure work days highlight', () => {
            expect(schObj.element.querySelectorAll('.e-work-cells').length).toEqual(30);
            expect(schObj.element.querySelectorAll('.e-work-days').length).toEqual(22);
        });

        it('ensure highlight class names', () => {
            let workCell: Element = schObj.element.querySelectorAll('.e-work-cells')[2];
            expect(workCell.classList.contains('e-work-days'));
        });

        it('ensure not highlight class names', () => {
            let workCell: Element = schObj.element.querySelectorAll('.e-work-cells')[3];
            expect(workCell.classList.contains('e-work-days')).toBeFalsy;
        });
    });

    describe('Work days', () => {
        let schObj: Schedule;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            schObj = new Schedule({
                height: '580px',
                selectedDate: new Date(2017, 11, 1),
                workDays: [1, 3, 4, 5],
                currentView: 'TimelineMonth',
                views: ['Day', 'Week', 'TimelineMonth', 'Month'],
                eventSettings: {
                    dataSource: timelineData
                },
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

        it('ensure work days highlight count', () => {
            expect(schObj.element.querySelectorAll('.e-work-cells').length).toEqual(31);
            expect(schObj.element.querySelectorAll('.e-work-days').length).toEqual(17);
        });

        it('ensure work days', () => {
            expect(schObj.element.querySelectorAll('.e-work-cells')[5].classList.contains('e-work-days'));
        });

        it('ensure not work days', () => {
            expect(schObj.element.querySelectorAll('.e-work-cells')[6].classList.contains('e-work-days')).toBeFalsy;
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

        it('Event rendering', (done: Function) => {
            let dataBound: (args: Object) => void = (args: Object) => {
                let eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(eventElementList.length).toEqual(25);
                expect(schObj.eventsData.length).toEqual(21);
                done();
            };
            schObj.selectedDate = new Date(2018, 4, 1);
            schObj.dataBound = dataBound;
            schObj.dataBind();
        });

        it('Checking left indicator icons', () => {
            let eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[1].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Spanned  Event - Same week');
            expect(eventElementList[1].querySelectorAll('.e-appointment-details .e-indicator')[0].classList.contains('e-left-icon'))
                .toBeTruthy();
        });

        it('Checking recurrence icon', () => {
            let eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[2].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Recurrence Event - Greater than 24');
            expect(eventElementList[2].querySelectorAll('.e-appointment-details .e-icons')[1].classList.contains('e-recurrence-icon'))
                .toBeTruthy();
        });

        it('Checking more indicator', () => {
            let moreIndicatorList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
            expect(moreIndicatorList.length).toEqual(1);
        });
    });

    describe('Show weekend', () => {
        let schObj: Schedule;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            schObj = new Schedule({
                height: '580px',
                selectedDate: new Date(2018, 3, 1),
                showWeekend: false,
                currentView: 'TimelineMonth',
                views: ['Day', 'Week', 'TimelineMonth', 'Month'],
                eventSettings: {
                    dataSource: timelineData
                },
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

        it('Event rendering', (done: Function) => {
            let dataBound: (args: Object) => void = (args: Object) => {
                let eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(eventElementList.length).toEqual(24);
                expect(schObj.eventsData.length).toEqual(21);
                done();
            };
            schObj.selectedDate = new Date(2018, 4, 1);
            schObj.dataBound = dataBound;
            schObj.dataBind();
        });

        it('Checking left indicator icons', () => {
            let eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[1].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Spanned  Event - Same week');
            expect(eventElementList[1].querySelectorAll('.e-appointment-details .e-indicator')[0].classList.contains('e-left-icon'))
                .toBeTruthy();
        });

        it('Checking recurrence icon', () => {
            let eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[2].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Recurrence Event - Greater than 24');
            expect(eventElementList[2].querySelectorAll('.e-appointment-details .e-icons')[1].classList.contains('e-recurrence-icon'))
                .toBeTruthy();
        });

        it('Checking more indicator', () => {
            let moreIndicatorList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
            expect(moreIndicatorList.length).toEqual(1);
        });
    });

    describe('Show weekend and Work days', () => {
        let schObj: Schedule;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        beforeAll(() => {
            document.body.appendChild(elem);
            schObj = new Schedule({
                height: '550px',
                selectedDate: new Date(2017, 10, 1),
                showWeekend: false,
                workDays: [1, 3, 4, 5],
                currentView: 'TimelineMonth',
                views: ['Day', 'Week', 'TimelineMonth', 'Month'],
            });
            schObj.appendTo('#Schedule');
        });
        afterAll(() => {
            if (schObj) {
                schObj.destroy();
            }
            remove(elem);
        });

        it('ensure work days', () => {
            expect(schObj.element.querySelectorAll('.e-work-days').length).toEqual(18);
        });
    });

    describe('Current Day Highlight testing', () => {
        let schObj: Schedule;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        beforeAll(() => {
            document.body.appendChild(elem);
            schObj = new Schedule({
                height: '550px',
                currentView: 'TimelineMonth',
                views: ['Day', 'Week', 'TimelineMonth', 'Month'],
            });
            schObj.appendTo('#Schedule');
        });
        afterAll(() => {
            if (schObj) {
                schObj.destroy();
            }
            remove(elem);
        });

        it('checking default current day highlight', () => {
            let index: number = schObj.activeView.renderDates.map((date: Date) => date.getDate()).indexOf(new Date().getDate());
            expect(schObj.element.querySelectorAll('.e-header-cells').item(index).classList).toContain('e-current-day');
        });

        it('checking current day highlight with different firstDayOfWeek', () => {
            schObj.firstDayOfWeek = 3;
            schObj.dataBind();
            let index: number = schObj.activeView.renderDates.map((date: Date) => date.getDate()).indexOf(new Date().getDate());
            expect(schObj.element.querySelectorAll('.e-header-cells').item(index).classList).toContain('e-current-day');
        });

        it('checking current day highlight with different workDays', () => {
            schObj.workDays = [0, 1, 2, 3, 4, 5, 6];
            schObj.dataBind();
            let index: number = schObj.activeView.renderDates.map((date: Date) => date.getDate()).indexOf(new Date().getDate());
            expect(schObj.element.querySelectorAll('.e-header-cells').item(index).classList).toContain('e-current-day');
        });

        it('checking current day highlight with showWeekend property', () => {
            schObj.showWeekend = false;
            schObj.dataBind();
            let index: number = schObj.activeView.renderDates.map((date: Date) => date.getDate()).indexOf(new Date().getDate());
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
            schObj = new Schedule({
                height: '250px', width: '500px',
                currentView: 'TimelineMonth',
                views: ['Day', 'Week', 'TimelineMonth', 'Month'],
                selectedDate: new Date(2017, 10, 1)
            });
            schObj.appendTo('#Schedule');
            expect(document.getElementById('Schedule').style.width).toEqual('500px');
            expect(document.getElementById('Schedule').style.height).toEqual('250px');
            expect(document.getElementById('Schedule').offsetWidth).toEqual(500);
            expect(document.getElementById('Schedule').offsetHeight).toEqual(250);
        });

        it('start and end hour', () => {
            schObj = new Schedule({
                height: '550px',
                currentView: 'TimelineMonth',
                views: ['Day', 'Week', 'TimelineMonth', 'Month'],
                selectedDate: new Date(2017, 10, 1)
            });
            schObj.appendTo('#Schedule');
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
            schObj = new Schedule({
                height: '550px',
                currentView: 'TimelineMonth',
                views: ['Day', 'Week', 'TimelineMonth', 'Month'],
                selectedDate: new Date(2017, 10, 1)
            });
            schObj.appendTo('#Schedule');
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
            schObj = new Schedule({
                height: '550px',
                currentView: 'TimelineMonth',
                views: ['Day', 'Week', 'TimelineMonth', 'Month'],
                selectedDate: new Date(2017, 3, 1),
                showWeekend: false
            });
            schObj.appendTo('#Schedule');
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
            schObj = new Schedule({
                height: '550px',
                currentView: 'TimelineMonth',
                views: ['Day', 'Week', 'TimelineMonth', 'Month'],
                selectedDate: new Date(2017, 10, 1),
                workDays: [0, 1, 3, 4]
            });
            schObj.appendTo('#Schedule');
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
            let templateEle: HTMLElement = createElement('div', {
                innerHTML: '<span class="custom-element"></span>'
            });
            schObj = new Schedule({
                height: '550px',
                currentView: 'TimelineMonth',
                views: ['Day', 'Week', 'TimelineMonth', 'Month'],
                selectedDate: new Date(2017, 10, 1),
                cellTemplate: templateEle.innerHTML
            });
            schObj.appendTo('#Schedule');
            expect(schObj.element.querySelectorAll('.custom-element').length).toEqual(schObj.getWorkCellElements().length);
            let workCellEle: HTMLElement = createElement('div', {
                innerHTML: '<span>11/4/17, 12:00 AM</span>'
            });
            schObj.cellTemplate = '<span>${getShortDateTime(data.date)}</span>';
            schObj.dataBind();
            expect(schObj.element.querySelectorAll('.e-work-cells')[3].innerHTML).toEqual(workCellEle.innerHTML);
        });

        it('date header template', () => {
            schObj = new Schedule({
                selectedDate: new Date(2017, 9, 5),
                currentView: 'TimelineMonth',
                views: ['Day', 'Week', 'TimelineMonth', 'Month'],
                dateHeaderTemplate: '<span>${getDateHeaderText(data.date)}</span>'
            });
            schObj.appendTo('#Schedule');
            expect(schObj.element.querySelector('.e-date-header-container .e-date-header').innerHTML).toEqual('<span>Sun, 10/1</span>');

            schObj.dateHeaderTemplate = '<span>${getShortDateTime(data.date)}</span>';
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-date-header-container .e-date-header').innerHTML).
                toEqual('<span>10/1/17, 12:00 AM</span>');
        });

        it('events template', (done: Function) => {
            let dataBound: (args: Object) => void = (args: Object) => {
                let eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(eventElementList.length).toEqual(25);
                expect(schObj.eventsData.length).toEqual(21);
                expect(eventElementList[0].querySelector('.e-appointment-details').innerHTML).toEqual(
                    '<div class="e-indicator e-icons e-left-icon"></div><span>Recurrence Event - Previous week</span>' +
                    '<div class="e-icons e-recurrence-icon"></div>');
                expect(eventElementList[2].querySelector('.e-appointment-details span').innerHTML)
                    .toEqual('Recurrence Event - Greater than 24');
                expect(eventElementList[2].querySelectorAll('.e-appointment-details .e-indicator')[0].classList.contains('e-left-icon'))
                    .toBeTruthy();
                let moreIndicatorList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
                expect(moreIndicatorList.length).toEqual(1);
                expect(moreIndicatorList[0].innerHTML).toEqual('+4&nbsp;more');
                done();
            };
            schObj = new Schedule({
                height: '580px',
                selectedDate: new Date(2018, 4, 1),
                currentView: 'TimelineMonth',
                views: ['Day', 'Week', 'TimelineMonth', 'Month'],
                eventSettings: {
                    dataSource: timelineData,
                    template: '<span>${Subject}</span>'
                },
                dataBound: dataBound
            });
            schObj.appendTo('#Schedule');
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

        it('interval count', () => {
            schObj = new Schedule({
                height: '550px',
                currentView: 'TimelineMonth',
                views: [{ option: 'TimelineMonth', interval: 2 }],
                selectedDate: new Date(2017, 10, 1)
            });
            schObj.appendTo('#Schedule');
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
                renderCell: renderFn,
                height: '550px',
                currentView: 'TimelineMonth',
                views: ['TimelineMonth'],
                selectedDate: new Date(2017, 10, 1)
            });
            schObj.appendTo('#Schedule');
            (schObj.element.querySelectorAll('.e-work-cells')[3] as HTMLElement).click();
            expect(renderFn).toHaveBeenCalledTimes(60);
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
            expect(renderFn).toHaveBeenCalledTimes(122);
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
                currentView: 'TimelineMonth',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek', 'TimelineMonth'], selectedDate: new Date(2018, 5, 5),
            });
            schObj.appendTo('#Schedule');
            (schObj.element.querySelectorAll('.e-work-cells')[3] as HTMLElement).click();
            expect(cellStartTime).toEqual(new Date(2018, 5, 4).getTime());
            expect(cellEndTime).toEqual(new Date(2018, 5, 5).getTime());
            expect(eventName).toEqual('cellClick');
        });

        it('cancel cell click', () => {
            schObj = new Schedule({
                cellClick: (args: CellClickEventArgs) => {
                    args.cancel = true;
                },
                currentView: 'TimelineMonth',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek', 'TimelineMonth'],
                selectedDate: new Date(2018, 5, 5),
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
                currentView: 'TimelineMonth',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek', 'TimelineMonth'], selectedDate: new Date(2018, 5, 5),
            });
            schObj.appendTo('#Schedule');
            triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[3] as HTMLElement, 'click');
            triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[3] as HTMLElement, 'dblclick');
            expect(cellStartTime).toEqual(new Date(2018, 5, 4).getTime());
            expect(cellEndTime).toEqual(new Date(2018, 5, 5).getTime());
            expect(eventName).toEqual('cellDoubleClick');
        });

        it('cancel cell double click', () => {
            schObj = new Schedule({
                cellDoubleClick: (args: CellClickEventArgs) => {
                    args.cancel = true;
                },
                currentView: 'TimelineMonth',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek', 'TimelineMonth'], selectedDate: new Date(2018, 5, 5),
            });
            schObj.appendTo('#Schedule');
            let workCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[3] as HTMLElement;
            triggerMouseEvent(workCell, 'click');
            triggerMouseEvent(workCell, 'dblclick');
        });
    });

    describe('RTL', () => {
        let schObj: Schedule;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        beforeAll((done: Function) => {
            document.body.appendChild(elem);
            let dataBound: EmitType<Object> = () => { done(); };
            schObj = new Schedule({
                height: '580px',
                selectedDate: new Date(2017, 10, 1),
                enableRtl: true,
                currentView: 'TimelineMonth',
                views: ['Day', 'Week', 'TimelineMonth', 'Month'],
                eventSettings: { dataSource: timelineData },
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

        it('check work cell elements count', () => {
            expect(schObj.getWorkCellElements().length).toEqual(30);
        });

        it('check date header cells', () => {
            expect(schObj.element.querySelectorAll('.e-date-header-container .e-date-header').length).toEqual(30);
            expect(schObj.element.querySelectorAll('.e-date-header-container .e-date-header')[2].innerHTML)
                .toEqual('<span class="e-navigate" title="Friday, November 3, 2017">3</span>');
        });

        it('work cells', () => {
            let firstWorkCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
            expect(firstWorkCell.parentElement.getAttribute('role')).toEqual('row');
            expect(firstWorkCell.getAttribute('role')).toEqual('gridcell');
            expect(firstWorkCell.getAttribute('aria-selected')).toEqual('false');
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

        it('Event rendering', (done: Function) => {
            let dataBound: (args: Object) => void = (args: Object) => {
                let eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(eventElementList.length).toEqual(25);
                expect(schObj.eventsData.length).toEqual(21);
                done();
            };
            schObj.selectedDate = new Date(2018, 4, 1);
            schObj.dataBound = dataBound;
            schObj.dataBind();
        });

        it('Checking left indicator icons', () => {
            let eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[1].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Spanned  Event - Same week');
            expect(eventElementList[1].querySelectorAll('.e-appointment-details .e-indicator')[0].classList.contains('e-left-icon'))
                .toBeTruthy();
        });

        it('Checking recurrence icon', () => {
            let eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[2].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Recurrence Event - Greater than 24');
            expect(eventElementList[2].querySelectorAll('.e-appointment-details .e-icons')[1].classList.contains('e-recurrence-icon'))
                .toBeTruthy();
        });

        it('Checking more indicator', () => {
            let moreIndicatorList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
            expect(moreIndicatorList.length).toEqual(1);
            expect(moreIndicatorList[0].innerHTML).toEqual('+4&nbsp;more');
        });
    });

    describe('Single level resource rendering', () => {
        let schObj: Schedule;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        beforeAll((done: Function) => {
            document.body.appendChild(elem);
            let dataBound: EmitType<Object> = () => { done(); };
            schObj = new Schedule({
                height: '550px', width: '100%',
                currentView: 'TimelineMonth',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineMonth'],
                group: {
                    resources: ['Owners']
                },
                resources: [
                    {
                        field: 'OwnerId', title: 'Owner',
                        name: 'Owners', allowMultiple: true,
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
                    }
                ],
                selectedDate: new Date(2018, 4, 1),
                eventSettings: { dataSource: cloneDataSource(timelineResourceData) },
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
        it('checking resource title rendering', () => {
            let headerRow: HTMLElement = schObj.element.querySelector('.e-timeline-month-view tr') as HTMLElement;
            expect(headerRow.children.length).toEqual(2);
            let firstTD: HTMLElement = schObj.element.querySelector('.e-timeline-month-view tr td.e-resource-left-td') as HTMLElement;
            expect([firstTD].length).toEqual(1);
            expect(firstTD.querySelector('.e-resource-text').innerHTML).toEqual('');
        });
        it('checking resource tree rendering', () => {
            let contentRow: HTMLElement = schObj.element.querySelector('.e-timeline-month-view table tbody') as HTMLElement;
            expect(contentRow.children[1].children.length).toEqual(2);
            expect([contentRow.children[1].querySelector('td div.e-resource-column-wrap')].length).toEqual(1);
            let resourceRow: HTMLElement = schObj.element.querySelector('.e-resource-column-wrap tbody') as HTMLElement;
            expect(resourceRow.children.length).toEqual(10);
            expect([resourceRow.querySelector('tr td.e-resource-cells')].length).toEqual(1);
            expect([resourceRow.querySelector('tr td.e-resource-cells div.e-resource-text')].length).toEqual(1);
            expect(resourceRow.querySelector('tr td.e-resource-cells div.e-resource-text').innerHTML).toEqual('Nancy');
            let contentRows: HTMLElement = contentRow.children[1].children[1].querySelector('tbody');
            expect(contentRows.children.length).toEqual(10);
        });

        it('Checking events elements', () => {
            let eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList.length).toEqual(15);
            let eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
            expect(eventWrapperList.length).toEqual(8);
        });

        it('Checking Left icon', () => {
            let eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[1].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Spanned Event - Less than 24');
            expect(eventElementList[1].querySelectorAll('.e-appointment-details .e-indicator')[0].classList.contains('e-left-icon'))
                .toBeTruthy();
        });

        it('Checking recurrence icon', () => {
            let eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[4].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Recurrence Event - Greater than 24');
            expect(eventElementList[4].querySelectorAll('.e-appointment-details .e-icons')[0].classList.contains('e-recurrence-icon'))
                .toBeTruthy();
        });

        it('More event element checking', () => {
            let moreIndicatorList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
            expect(moreIndicatorList.length).toEqual(3);
            let element: HTMLElement = moreIndicatorList[0] as HTMLElement;
            element.click();
            let morePopup: HTMLElement = schObj.element.querySelector('.e-more-popup-wrapper') as HTMLElement;
            let moreEventList: Element[] = [].slice.call(morePopup.querySelectorAll('.e-more-appointment-wrapper .e-appointment'));
            expect(moreEventList.length).toEqual(2);
            triggerMouseEvent(morePopup.querySelector('.e-more-event-close'), 'click');
        });
    });

    describe('Multi level resource rendering', () => {
        let schObj: Schedule;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        beforeAll((done: Function) => {
            document.body.appendChild(elem);
            let dataBound: EmitType<Object> = () => { done(); };
            schObj = new Schedule({
                height: '550px', width: '100%',
                currentView: 'TimelineMonth',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineMonth'],
                group: {
                    resources: ['Halls', 'Rooms', 'Owners']
                },
                resources: [
                    {
                        field: 'HallId', title: 'Hall',
                        name: 'Halls', allowMultiple: false,
                        dataSource: [
                            { HallText: 'Hall 1', Id: 1, HallColor: '#cb6bb2' },
                            { HallText: 'Hall 2', Id: 2, HallColor: '#56ca85' }
                        ],
                        textField: 'HallText', idField: 'Id', colorField: 'HallColor'
                    },
                    {
                        field: 'RoomId', title: 'Room',
                        name: 'Rooms', allowMultiple: false,
                        dataSource: [
                            { RoomText: 'ROOM 1', Id: 1, RoomGroupId: 1, RoomColor: '#cb6bb2' },
                            { RoomText: 'ROOM 2', Id: 2, RoomGroupId: 2, RoomColor: '#56ca85' },
                            { RoomText: 'ROOM 3', Id: 3, RoomGroupId: 1, RoomColor: '#56ca85' }
                        ],
                        textField: 'RoomText', idField: 'Id', groupIDField: 'RoomGroupId', colorField: 'RoomColor'
                    },
                    {
                        field: 'OwnerId', title: 'Owner',
                        name: 'Owners', allowMultiple: true,
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
                            { OwnerText: 'Malcolm', Id: 10, OwnerGroupId: 1, OwnerColor: '#ffaa00' },
                        ],
                        textField: 'OwnerText', idField: 'Id', groupIDField: 'OwnerGroupId', colorField: 'OwnerColor'
                    }
                ],
                selectedDate: new Date(2018, 4, 1),
                eventSettings: { dataSource: cloneDataSource(timelineResourceData) },
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
        it('checking resource title rendering', () => {
            let headerRow: HTMLElement = schObj.element.querySelector('.e-timeline-month-view tr') as HTMLElement;
            expect(headerRow.children.length).toEqual(2);
            let firstTD: HTMLElement = schObj.element.querySelector('.e-timeline-month-view tr td.e-resource-left-td') as HTMLElement;
            expect([firstTD].length).toEqual(1);
            expect(firstTD.querySelector('.e-resource-text').innerHTML).toEqual('');
        });
        it('checking resource tree rendering', () => {
            let contentRow: HTMLElement = schObj.element.querySelector('.e-timeline-month-view table tbody') as HTMLElement;
            expect(contentRow.children[1].children.length).toEqual(2);
            expect([contentRow.children[1].querySelector('td div.e-resource-column-wrap')].length).toEqual(1);
            let resourceRow: HTMLElement = schObj.element.querySelector('.e-resource-column-wrap tbody') as HTMLElement;
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
            let contentRows: HTMLElement = contentRow.children[1].children[1].querySelector('tbody');
            expect(contentRows.children.length).toEqual(15);
        });
        it('Checking events elements', () => {
            let eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList.length).toEqual(15);
            let eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
            expect(eventWrapperList.length).toEqual(7);
        });

        it('Checking Left icon', () => {
            let eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[1].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Recurrence Event - Greater than 24');
            expect(eventElementList[1].querySelectorAll('.e-appointment-details .e-indicator')[0].classList.contains('e-left-icon'))
                .toBeTruthy();
        });

        it('Checking recurrence icon', () => {
            let eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[4].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Recurrence Event - Previous week');
            expect(eventElementList[4].querySelectorAll('.e-appointment-details .e-icons')[1].classList.contains('e-recurrence-icon'))
                .toBeTruthy();
        });

        it('More event element checking', () => {
            let moreIndicatorList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
            expect(moreIndicatorList.length).toEqual(3);
            let element: HTMLElement = moreIndicatorList[0] as HTMLElement;
            element.click();
            let morePopup: HTMLElement = schObj.element.querySelector('.e-more-popup-wrapper') as HTMLElement;
            let moreEventList: Element[] = [].slice.call(morePopup.querySelectorAll('.e-more-appointment-wrapper .e-appointment'));
            expect(moreEventList.length).toEqual(2);
            triggerMouseEvent(morePopup.querySelector('.e-more-event-close'), 'click');
        });
    });

    describe('Multi level resource rendering with expanded property', () => {
        let schObj: Schedule;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        beforeAll((done: Function) => {
            document.body.appendChild(elem);
            let dataBound: EmitType<Object> = () => { disableScheduleAnimation(schObj); done(); };
            schObj = new Schedule({
                height: '550px', width: '100%',
                currentView: 'TimelineMonth',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineMonth'],
                group: {
                    resources: ['Halls', 'Rooms', 'Owners']
                },
                resources: [
                    {
                        field: 'HallId', title: 'Hall',
                        name: 'Halls', allowMultiple: false,
                        dataSource: [
                            { HallText: 'Hall 1', Id: 1, HallColor: '#cb6bb2' },
                            { HallText: 'Hall 2', Id: 2, HallColor: '#56ca85', Expand: false }
                        ],
                        textField: 'HallText', idField: 'Id', colorField: 'HallColor', expandedField: 'Expand'
                    },
                    {
                        field: 'RoomId', title: 'Room',
                        name: 'Rooms', allowMultiple: false,
                        dataSource: [
                            { RoomText: 'ROOM 1', Id: 1, RoomGroupId: 1, RoomColor: '#cb6bb2', Expand: false },
                            { RoomText: 'ROOM 2', Id: 2, RoomGroupId: 2, RoomColor: '#56ca85' },
                            { RoomText: 'ROOM 3', Id: 3, RoomGroupId: 1, RoomColor: '#56ca85' }
                        ],
                        textField: 'RoomText', idField: 'Id', groupIDField: 'RoomGroupId', colorField: 'RoomColor', expandedField: 'Expand'
                    },
                    {
                        field: 'OwnerId', title: 'Owner',
                        name: 'Owners', allowMultiple: true,
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
                            { OwnerText: 'Malcolm', Id: 10, OwnerGroupId: 1, OwnerColor: '#ffaa00' },
                        ],
                        textField: 'OwnerText', idField: 'Id', groupIDField: 'OwnerGroupId',
                        colorField: 'OwnerColor', expandedField: 'Expand'
                    }
                ],
                selectedDate: new Date(2018, 4, 1),
                eventSettings: { dataSource: cloneDataSource(timelineResourceData) },
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
        it('checking resource title rendering', () => {
            let headerRow: HTMLElement = schObj.element.querySelector('.e-timeline-month-view tr') as HTMLElement;
            expect(headerRow.children.length).toEqual(2);
            expect(headerRow.children[0].classList.contains('e-resource-left-td')).toEqual(true);
            expect(headerRow.children[0].children[0].innerHTML).toEqual('');
        });
        it('checking resource tree rendering', () => {
            let contentRow: HTMLElement = schObj.element.querySelector('.e-timeline-month-view table tbody') as HTMLElement;
            expect(contentRow.children[1].children.length).toEqual(2);
            expect([contentRow.children[1].querySelector('td div.e-resource-column-wrap')].length).toEqual(1);
            let resourceRow: HTMLElement = schObj.element.querySelector('.e-resource-column-wrap tbody') as HTMLElement;
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
            let contentRows: HTMLElement = contentRow.children[1].children[1].querySelector('tbody');
            expect(contentRows.children.length).toEqual(15);
        });
        it('resource icon click testing', () => {
            let resourceRow: HTMLElement = schObj.element.querySelector('.e-resource-column-wrap tbody') as HTMLElement;
            let beforeExpand: NodeListOf<Element> = schObj.element.querySelectorAll('.e-resource-column-wrap tbody tr:not(.e-hidden)');
            expect(beforeExpand.length).toEqual(7);
            let firstRow: HTMLElement = resourceRow.children[1]
                .querySelector('.e-resource-cells div.e-resource-tree-icon') as HTMLElement;
            firstRow.click();
            let afterExpand: NodeListOf<Element> = schObj.element.querySelectorAll('.e-resource-column-wrap tbody tr:not(.e-hidden)');
            expect(afterExpand.length).toEqual(11);
            expect(resourceRow.children[1].classList.contains('e-hidden')).toEqual(false);
            expect([resourceRow.children[1].querySelector('.e-resource-cells div.e-resource-collapse')].length).toEqual(1);
            expect(resourceRow.children[2].classList.contains('e-hidden')).toEqual(false);
            expect(resourceRow.children[2].querySelector('.e-resource-cells div.e-resource-text').innerHTML).toEqual('Nancy');
        });

        it('Checking events elements', () => {
            let eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList.length).toEqual(11);
            let eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
            expect(eventWrapperList.length).toEqual(7);
        });

        it('Checking Left icon', () => {
            let eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[1].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Recurrence Event - Greater than 24');
            expect(eventElementList[1].querySelectorAll('.e-appointment-details .e-indicator')[0].classList.contains('e-left-icon'))
                .toBeTruthy();
        });

        it('Checking recurrence icon', () => {
            let eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[4].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Recurrence Event - Previous week');
            expect(eventElementList[4].querySelectorAll('.e-appointment-details .e-icons')[1].classList.contains('e-recurrence-icon'))
                .toBeTruthy();
        });

        it('More event element checking', () => {
            let moreIndicatorList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
            expect(moreIndicatorList.length).toEqual(12);
            let element: HTMLElement = moreIndicatorList[0] as HTMLElement;
            element.click();
            let morePopup: HTMLElement = schObj.element.querySelector('.e-more-popup-wrapper') as HTMLElement;
            let moreEventList: Element[] = [].slice.call(morePopup.querySelectorAll('.e-more-appointment-wrapper .e-appointment'));
            expect(moreEventList.length).toEqual(2);
            triggerMouseEvent(morePopup.querySelector('.e-more-event-close'), 'click');
        });
        it('cell single click', () => {
            triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[100] as HTMLElement, 'click');
            let cellPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(cellPopup.classList).toContain('e-popup-open');
            let moreDetail: HTMLElement = <HTMLElement>cellPopup.querySelector('.e-event-details');
            expect(moreDetail.classList).toContain('e-btn');
            expect(moreDetail.classList).toContain('e-flat');
            expect(moreDetail.innerHTML).toEqual('More Details');
            let save: HTMLElement = cellPopup.querySelector('.e-event-create');
            expect(save.classList).toContain('e-primary');
            expect(save.innerHTML).toEqual('Save');
            let close: HTMLElement = cellPopup.querySelector('.e-close-icon');
            expect(close.classList).toContain('e-btn-icon');
            close.click();
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(7);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(3);
        });
        it('cell double click', () => {
            triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[100] as HTMLElement, 'dblclick');
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
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
            let hall: DropDownList =
                (dialogElement.querySelector('.e-HallId') as EJ2Instance).ej2_instances[0] as DropDownList;
            expect(hall.text).toEqual('Hall 1');
            expect(hall.value).toEqual(1);
            let room: DropDownList =
                (dialogElement.querySelector('.e-RoomId') as EJ2Instance).ej2_instances[0] as DropDownList;
            expect(room.text).toEqual('ROOM 1');
            let owner: DropDownList =
                (dialogElement.querySelector('.e-OwnerId') as EJ2Instance).ej2_instances[0] as DropDownList;
            expect(owner.text).toEqual('Oliver');
            let cancelButton: HTMLElement = dialogElement.querySelector('.e-event-cancel') as HTMLElement;
            cancelButton.click();
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(7);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(3);
        });
        it('event single click', () => {
            let event: HTMLElement = schObj.element.querySelectorAll('.e-appointment')[0] as HTMLElement;
            triggerMouseEvent(event, 'click');
            let eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup.classList).toContain('e-popup-open');
            let edit: HTMLElement = eventPopup.querySelector('.e-edit');
            expect(edit.children[0].classList).toContain('e-edit-icon');
            let deleteIcon: HTMLElement = eventPopup.querySelector('.e-delete');
            expect(deleteIcon.children[0].classList).toContain('e-delete-icon');
            (eventPopup.querySelector('.e-close-icon') as HTMLElement).click();
            expect(event.classList).toContain('e-appointment-border');
            expect(event.getAttribute('aria-selected')).toEqual('true');
        });
        it('event double click', () => {
            let event: HTMLElement = schObj.element.querySelectorAll('.e-appointment')[0] as HTMLElement;
            triggerMouseEvent(event, 'dblclick');
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            expect(dialogElement.querySelector('.' + cls.EVENT_WINDOW_TITLE_TEXT_CLASS).innerHTML).toEqual('Edit Event');
            let hall: DropDownList =
                (dialogElement.querySelector('.e-HallId') as EJ2Instance).ej2_instances[0] as DropDownList;
            expect(hall.text).toEqual('Hall 1');
            expect(hall.value).toEqual(1);
            let room: DropDownList =
                (dialogElement.querySelector('.e-RoomId') as EJ2Instance).ej2_instances[0] as DropDownList;
            expect(room.text).toEqual('ROOM 1');
            let owner: DropDownList =
                (dialogElement.querySelector('.e-OwnerId') as EJ2Instance).ej2_instances[0] as DropDownList;
            expect(owner.text).toEqual('Nancy');
            let cancelButton: HTMLElement = dialogElement.querySelector('.e-event-cancel') as HTMLElement;
            cancelButton.click();
        });
        it('event save by clicking cell', (done: Function) => {
            let eventWrap: HTMLElement = schObj.element.querySelector('.e-event-table div:nth-child(3)');
            let event: HTMLElement[] = [].slice.call(eventWrap.querySelectorAll('.e-appointment'));
            expect(event.length).toEqual(1);
            expect(event[0].getAttribute('data-id')).toEqual('Appointment_1');
            let workCell: HTMLElement =
                schObj.element.querySelector('.e-content-table tr:nth-child(3) td:nth-child(3)') as HTMLElement;
            triggerMouseEvent(workCell, 'click');
            triggerMouseEvent(workCell, 'dblclick');
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            let saveButton: HTMLElement = dialogElement.querySelector('.' + cls.EVENT_WINDOW_SAVE_BUTTON_CLASS) as HTMLElement;
            saveButton.click();
            let dataBound: (args: Object) => void = (args: Object) => {
                let eventWrap: HTMLElement = schObj.element.querySelector('.e-event-table div:nth-child(3)');
                let event: HTMLElement[] = [].slice.call(eventWrap.querySelectorAll('.e-appointment'));
                expect(event.length).toEqual(2);
                expect(event[0].getAttribute('data-id')).toEqual('Appointment_1');
                expect(event[1].getAttribute('data-id')).toEqual('Appointment_16');
                done();
            };
            schObj.dataBound = dataBound;
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
                currentView: 'TimelineMonth',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineMonth'],
                selectedDate: new Date(2018, 7, 6),
                group: {
                    resources: ['Rooms', 'Owners']
                },
                resources: [
                    {
                        field: 'RoomId',
                        title: 'Room',
                        name: 'Rooms', allowMultiple: false,
                        dataSource: [
                            { text: 'ROOM 1', id: 1, color: '#cb6bb2', workDays: [] },
                            { text: 'ROOM 2', id: 2, color: '#56ca85', workDays: [] }
                        ],
                        textField: 'text', idField: 'id', colorField: 'color', workDaysField: 'workDays'
                    }, {
                        field: 'OwnerId',
                        title: 'Owner',
                        name: 'Owners', allowMultiple: true,
                        dataSource: [
                            { text: 'Nancy', id: 1, groupId: 1, color: '#ffaa00', workDays: [0, 1, 3] },
                            { text: 'Steven', id: 2, groupId: 2, color: '#f8a398', workDays: [1, 3, 5] },
                            { text: 'Michael', id: 3, groupId: 1, color: '#7499e1', workDays: [2, 3, 4] }
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

        it('work days count', (done: Function) => {
            expect(schObj.element.querySelectorAll('.e-work-days').length).toBe(41);
            expect((<Element>schObj.element.querySelectorAll('.e-content-table tr')[1].childNodes[1]).classList.contains('e-work-days')).toEqual(false);
            expect((<Element>schObj.element.querySelectorAll('.e-content-table tr')[1].childNodes[0]).classList.contains('e-work-days')).toEqual(true);
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
            let dataBound: (args: Object) => void = (args: Object) => {
                expect(schObj.element.querySelectorAll('.e-work-days').length).toBe(37);
                done();
            };
            schObj.dataBound = dataBound;
        });
    });

    describe('Single level resource rendering in RTL', () => {
        let schObj: Schedule;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        beforeAll((done: Function) => {
            document.body.appendChild(elem);
            let dataBound: EmitType<Object> = () => { done(); };
            schObj = new Schedule({
                height: '550px', width: '100%', enableRtl: true,
                currentView: 'TimelineMonth',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineMonth'],
                group: {
                    resources: ['Owners']
                },
                resources: [
                    {
                        field: 'OwnerId', title: 'Owner',
                        name: 'Owners', allowMultiple: true,
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
                    }
                ],
                selectedDate: new Date(2018, 4, 1),
                eventSettings: { dataSource: cloneDataSource(timelineResourceData) },
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
        it('checking resource title rendering', () => {
            let headerRow: HTMLElement = schObj.element.querySelector('.e-timeline-month-view tr') as HTMLElement;
            expect(headerRow.children.length).toEqual(2);
            expect(headerRow.children[0].classList.contains('e-resource-left-td')).toEqual(true);
            expect(headerRow.children[0].children[0].innerHTML).toEqual('');
        });
        it('checking resource tree rendering', () => {
            let contentRow: HTMLElement = schObj.element.querySelector('.e-timeline-month-view table tbody') as HTMLElement;
            expect(contentRow.children[1].children.length).toEqual(2);
            expect([contentRow.children[1].querySelector('td div.e-resource-column-wrap')].length).toEqual(1);
            let resourceRow: HTMLElement = schObj.element.querySelector('.e-resource-column-wrap tbody') as HTMLElement;
            expect(resourceRow.children.length).toEqual(10);
            expect([resourceRow.querySelector('tr td.e-resource-cells')].length).toEqual(1);
            expect([resourceRow.querySelector('tr td.e-resource-cells div.e-resource-text')].length).toEqual(1);
            expect(resourceRow.querySelector('tr td.e-resource-cells div.e-resource-text').innerHTML).toEqual('Nancy');
            let contentRows: HTMLElement = contentRow.children[1].children[1].querySelector('tbody');
            expect(contentRows.children.length).toEqual(10);
        });
        it('Checking events elements', () => {
            let eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList.length).toEqual(19);
            let eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
            expect(eventWrapperList.length).toEqual(9);
        });

        it('Checking Left icon', () => {
            let eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[1].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Spanned Event - Less than 24');
            expect(eventElementList[1].querySelectorAll('.e-appointment-details .e-indicator')[0].classList.contains('e-left-icon'))
                .toBeTruthy();
        });

        it('Checking recurrence icon', () => {
            let eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[4].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Recurrence Event - Greater than 24');
            expect(eventElementList[4].querySelectorAll('.e-appointment-details .e-icons')[0].classList.contains('e-recurrence-icon'))
                .toBeTruthy();
        });

        it('More event element checking', () => {
            let moreIndicatorList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
            expect(moreIndicatorList.length).toEqual(4);
            let element: HTMLElement = moreIndicatorList[0] as HTMLElement;
            element.click();
            let morePopup: HTMLElement = schObj.element.querySelector('.e-more-popup-wrapper') as HTMLElement;
            let moreEventList: Element[] = [].slice.call(morePopup.querySelectorAll('.e-more-appointment-wrapper .e-appointment'));
            expect(moreEventList.length).toEqual(2);
            triggerMouseEvent(morePopup.querySelector('.e-more-event-close'), 'click');
        });
    });

    describe('Multi level resource rendering in RTL', () => {
        let schObj: Schedule;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        beforeAll((done: Function) => {
            document.body.appendChild(elem);
            let dataBound: EmitType<Object> = () => { done(); };
            schObj = new Schedule({
                height: '550px', width: '100%', enableRtl: true,
                currentView: 'TimelineMonth',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineMonth'],
                group: {
                    resources: ['Halls', 'Rooms', 'Owners']
                },
                resources: [
                    {
                        field: 'HallId', title: 'Hall',
                        name: 'Halls', allowMultiple: false,
                        dataSource: [
                            { HallText: 'Hall 1', Id: 1, HallColor: '#cb6bb2' },
                            { HallText: 'Hall 2', Id: 2, HallColor: '#56ca85' }
                        ],
                        textField: 'HallText', idField: 'Id', colorField: 'HallColor'
                    },
                    {
                        field: 'RoomId', title: 'Room',
                        name: 'Rooms', allowMultiple: false,
                        dataSource: [
                            { RoomText: 'ROOM 1', Id: 1, RoomGroupId: 1, RoomColor: '#cb6bb2' },
                            { RoomText: 'ROOM 2', Id: 2, RoomGroupId: 2, RoomColor: '#56ca85' },
                            { RoomText: 'ROOM 3', Id: 3, RoomGroupId: 1, RoomColor: '#56ca85' }
                        ],
                        textField: 'RoomText', idField: 'Id', groupIDField: 'RoomGroupId', colorField: 'RoomColor'
                    },
                    {
                        field: 'OwnerId', title: 'Owner',
                        name: 'Owners', allowMultiple: true,
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
                            { OwnerText: 'Malcolm', Id: 10, OwnerGroupId: 1, OwnerColor: '#ffaa00' },
                        ],
                        textField: 'OwnerText', idField: 'Id', groupIDField: 'OwnerGroupId', colorField: 'OwnerColor'
                    }
                ],
                selectedDate: new Date(2018, 4, 1),
                eventSettings: { dataSource: cloneDataSource(timelineResourceData) },
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
        it('checking resource title rendering', () => {
            let headerRow: HTMLElement = schObj.element.querySelector('.e-timeline-month-view tr') as HTMLElement;
            expect(headerRow.children.length).toEqual(2);
            expect(headerRow.children[0].classList.contains('e-resource-left-td')).toEqual(true);
            expect(headerRow.children[0].children[0].innerHTML).toEqual('');
        });
        it('checking resource tree rendering', () => {
            let contentRow: HTMLElement = schObj.element.querySelector('.e-timeline-month-view table tbody') as HTMLElement;
            expect(contentRow.children[1].children.length).toEqual(2);
            expect([contentRow.children[1].querySelector('td div.e-resource-column-wrap')].length).toEqual(1);
            let resourceRow: HTMLElement = schObj.element.querySelector('.e-resource-column-wrap tbody') as HTMLElement;
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
            let contentRows: HTMLElement = contentRow.children[1].children[1].querySelector('tbody');
            expect(contentRows.children.length).toEqual(15);
        });
        it('Checking events elements', () => {
            let eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList.length).toEqual(15);
            let eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
            expect(eventWrapperList.length).toEqual(7);
        });

        it('Checking Left icon', () => {
            let eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[1].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Recurrence Event - Greater than 24');
            expect(eventElementList[1].querySelectorAll('.e-appointment-details .e-indicator')[0].classList.contains('e-left-icon'))
                .toBeTruthy();
        });

        it('Checking recurrence icon', () => {
            let eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[4].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Recurrence Event - Previous week');
            expect(eventElementList[4].querySelectorAll('.e-appointment-details .e-icons')[1].classList.contains('e-recurrence-icon'))
                .toBeTruthy();
        });

        it('More event element checking', () => {
            let moreIndicatorList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
            expect(moreIndicatorList.length).toEqual(3);
            let element: HTMLElement = moreIndicatorList[0] as HTMLElement;
            element.click();
            let morePopup: HTMLElement = schObj.element.querySelector('.e-more-popup-wrapper') as HTMLElement;
            let moreEventList: Element[] = [].slice.call(morePopup.querySelectorAll('.e-more-appointment-wrapper .e-appointment'));
            expect(moreEventList.length).toEqual(2);
            triggerMouseEvent(morePopup.querySelector('.e-more-event-close'), 'click');
        });
    });

    describe('Multi level resource rendering with expanded property in RTL', () => {
        let schObj: Schedule;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        beforeAll((done: Function) => {
            document.body.appendChild(elem);
            let dataBound: EmitType<Object> = () => { done(); };
            schObj = new Schedule({
                height: '550px', width: '100%', enableRtl: true,
                currentView: 'TimelineMonth',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineMonth'],
                group: {
                    resources: ['Halls', 'Rooms', 'Owners']
                },
                resources: [
                    {
                        field: 'HallId', title: 'Hall',
                        name: 'Halls', allowMultiple: false,
                        dataSource: [
                            { HallText: 'Hall 1', Id: 1, HallColor: '#cb6bb2' },
                            { HallText: 'Hall 2', Id: 2, HallColor: '#56ca85', Expand: false }
                        ],
                        textField: 'HallText', idField: 'Id', colorField: 'HallColor', expandedField: 'Expand'
                    },
                    {
                        field: 'RoomId', title: 'Room',
                        name: 'Rooms', allowMultiple: false,
                        dataSource: [
                            { RoomText: 'ROOM 1', Id: 1, RoomGroupId: 1, RoomColor: '#cb6bb2', Expand: false },
                            { RoomText: 'ROOM 2', Id: 2, RoomGroupId: 2, RoomColor: '#56ca85' },
                            { RoomText: 'ROOM 3', Id: 3, RoomGroupId: 1, RoomColor: '#56ca85' }
                        ],
                        textField: 'RoomText', idField: 'Id', groupIDField: 'RoomGroupId', colorField: 'RoomColor', expandedField: 'Expand'
                    },
                    {
                        field: 'OwnerId', title: 'Owner',
                        name: 'Owners', allowMultiple: true,
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
                            { OwnerText: 'Malcolm', Id: 10, OwnerGroupId: 1, OwnerColor: '#ffaa00' },
                        ],
                        textField: 'OwnerText', idField: 'Id', groupIDField: 'OwnerGroupId',
                        colorField: 'OwnerColor', expandedField: 'Expand'
                    }
                ],
                selectedDate: new Date(2018, 4, 1),
                eventSettings: { dataSource: cloneDataSource(timelineResourceData) },
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
        it('checking resource title rendering', () => {
            let headerRow: HTMLElement = schObj.element.querySelector('.e-timeline-month-view tr') as HTMLElement;
            expect(headerRow.children.length).toEqual(2);
            expect(headerRow.children[0].classList.contains('e-resource-left-td')).toEqual(true);
            expect(headerRow.children[0].children[0].innerHTML).toEqual('');
        });
        it('checking resource tree rendering', () => {
            let contentRow: HTMLElement = schObj.element.querySelector('.e-timeline-month-view table tbody') as HTMLElement;
            expect(contentRow.children[1].children.length).toEqual(2);
            expect([contentRow.children[1].querySelector('td div.e-resource-column-wrap')].length).toEqual(1);
            let resourceRow: HTMLElement = schObj.element.querySelector('.e-resource-column-wrap tbody') as HTMLElement;
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
            let contentRows: HTMLElement = contentRow.children[1].children[1].querySelector('tbody');
            expect(contentRows.children.length).toEqual(15);
        });
        it('resource icon click testing', () => {
            let resourceRow: HTMLElement = schObj.element.querySelector('.e-resource-column-wrap tbody') as HTMLElement;
            let beforeExpand: NodeListOf<Element> = schObj.element.querySelectorAll('.e-resource-column-wrap tbody tr:not(.e-hidden)');
            expect(beforeExpand.length).toEqual(7);
            let firstRow: HTMLElement = resourceRow.children[1]
                .querySelector('.e-resource-cells div.e-resource-tree-icon') as HTMLElement;
            firstRow.click();
            let afterExpand: NodeListOf<Element> = schObj.element.querySelectorAll('.e-resource-column-wrap tbody tr:not(.e-hidden)');
            expect(afterExpand.length).toEqual(11);
            expect(resourceRow.children[1].classList.contains('e-hidden')).toEqual(false);
            expect([resourceRow.children[1].querySelector('.e-resource-cells div.e-resource-collapse')].length).toEqual(1);
            expect(resourceRow.children[2].classList.contains('e-hidden')).toEqual(false);
            expect(resourceRow.children[2].querySelector('.e-resource-cells div.e-resource-text').innerHTML).toEqual('Nancy');
        });

        it('Checking events elements', () => {
            let eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList.length).toEqual(11);
            let eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
            expect(eventWrapperList.length).toEqual(7);
        });

        it('Checking Left icon', () => {
            let eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[1].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Recurrence Event - Greater than 24');
            expect(eventElementList[1].querySelectorAll('.e-appointment-details .e-indicator')[0].classList.contains('e-left-icon'))
                .toBeTruthy();
        });

        it('Checking recurrence icon', () => {
            let eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[4].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Recurrence Event - Previous week');
            expect(eventElementList[4].querySelectorAll('.e-appointment-details .e-icons')[1].classList.contains('e-recurrence-icon'))
                .toBeTruthy();
        });

        it('More event element checking', () => {
            let moreIndicatorList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
            expect(moreIndicatorList.length).toEqual(12);
            let element: HTMLElement = moreIndicatorList[0] as HTMLElement;
            element.click();
            let morePopup: HTMLElement = schObj.element.querySelector('.e-more-popup-wrapper') as HTMLElement;
            let moreEventList: Element[] = [].slice.call(morePopup.querySelectorAll('.e-more-appointment-wrapper .e-appointment'));
            expect(moreEventList.length).toEqual(2);
            triggerMouseEvent(morePopup.querySelector('.e-more-event-close'), 'click');
        });
    });

    describe('Single level resource rendering with Template', () => {
        let schObj: Schedule;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        let restemplate: string = '<div class="tWrap"><div class="rText" style="background:pink">${getResourceName(data)}</div></div>';
        beforeAll((done: Function) => {
            document.body.appendChild(elem);
            let dataBound: EmitType<Object> = () => { done(); };
            schObj = new Schedule({
                height: '550px', width: '100%', resourceHeaderTemplate: restemplate,
                currentView: 'TimelineMonth',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineMonth'],
                group: {
                    resources: ['Owners']
                },
                resources: [
                    {
                        field: 'OwnerId', title: 'Owner',
                        name: 'Owners', allowMultiple: true,
                        dataSource: [
                            { OwnerText: 'Nancy', Id: 1, OwnerColor: '#ffaa00' },
                            { OwnerText: 'Steven', Id: 2, OwnerColor: '#f8a398' },
                            { OwnerText: 'Michael', Id: 3, OwnerColor: '#7499e1' }
                        ],
                        textField: 'OwnerText', idField: 'Id', colorField: 'OwnerColor'
                    }
                ],
                selectedDate: new Date(2017, 10, 1),
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
        it('checking resource template rendering', () => {
            let contentRow: HTMLElement = schObj.element.querySelector('.e-timeline-month-view table tbody') as HTMLElement;
            expect([contentRow.children[1].querySelector('td div.e-resource-column-wrap')].length).toEqual(1);
            let resourceRow: HTMLElement = schObj.element.querySelector('.e-resource-column-wrap tbody') as HTMLElement;
            expect(resourceRow.children.length).toEqual(3);
            expect([resourceRow.querySelector('tr td.e-resource-cells')].length).toEqual(1);
            expect([resourceRow.querySelector('tr td.e-resource-cells div.tWrap')].length).toEqual(1);
            expect(resourceRow.querySelector('tr td.e-resource-cells div.tWrap').children.length).toEqual(1);
            let templateDiv: HTMLElement = resourceRow.querySelector('tr td.e-resource-cells div.tWrap div.rText') as HTMLElement;
            expect([templateDiv].length).toEqual(1);
            expect(templateDiv.style.backgroundColor).toEqual('pink');
            expect(templateDiv.innerHTML).toEqual('Nancy');
            let contentRows: HTMLElement = contentRow.children[1].children[1].querySelector('tbody');
            expect(contentRows.children.length).toEqual(3);
        });
    });

    describe('Multi level resource rendering with template', () => {
        let schObj: Schedule;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        let restemplate: string = '<div class="tWrap"><div class="rText" style="background:pink">${getResourceName(data)}</div></div>';
        beforeAll((done: Function) => {
            document.body.appendChild(elem);
            let dataBound: EmitType<Object> = () => { done(); };
            schObj = new Schedule({
                height: '550px', width: '100%',
                resourceHeaderTemplate: restemplate,
                currentView: 'TimelineMonth',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineMonth'],
                group: {
                    resources: ['Halls', 'Rooms', 'Owners']
                },
                resources: [
                    {
                        field: 'HallId', title: 'Hall',
                        name: 'Halls', allowMultiple: false,
                        dataSource: [
                            { HallText: 'Hall 1', Id: 1, HallColor: '#cb6bb2' },
                            { HallText: 'Hall 2', Id: 2, HallColor: '#56ca85', Expand: false }
                        ],
                        textField: 'HallText', idField: 'Id', colorField: 'HallColor', expandedField: 'Expand'
                    },
                    {
                        field: 'RoomId', title: 'Room',
                        name: 'Rooms', allowMultiple: false,
                        dataSource: [
                            { RoomText: 'ROOM 1', Id: 1, RoomGroupId: 1, RoomColor: '#cb6bb2', Expand: false },
                            { RoomText: 'ROOM 2', Id: 2, RoomGroupId: 2, RoomColor: '#56ca85' },
                            { RoomText: 'ROOM 3', Id: 3, RoomGroupId: 1, RoomColor: '#56ca85' }
                        ],
                        textField: 'RoomText', idField: 'Id', groupIDField: 'RoomGroupId', colorField: 'RoomColor', expandedField: 'Expand'
                    },
                    {
                        field: 'OwnerId', title: 'Owner',
                        name: 'Owners', allowMultiple: true,
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
                            { OwnerText: 'Malcolm', Id: 31, OwnerGroupId: 1, OwnerColor: '#ffaa00' },
                        ],
                        textField: 'OwnerText', idField: 'Id', groupIDField: 'OwnerGroupId',
                        colorField: 'OwnerColor', expandedField: 'Expand'
                    }
                ],
                selectedDate: new Date(2017, 10, 1),
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
        it('checking resource template rendering', () => {
            let contentRow: HTMLElement = schObj.element.querySelector('.e-timeline-month-view table tbody') as HTMLElement;
            expect([contentRow.children[1].querySelector('td div.e-resource-column-wrap')].length).toEqual(1);
            let resourceRow: HTMLElement = schObj.element.querySelector('.e-resource-column-wrap tbody') as HTMLElement;
            expect(resourceRow.children.length).toEqual(15);
            expect([resourceRow.querySelector('tr td.e-resource-cells')].length).toEqual(1);
            expect(resourceRow.querySelector('tr td.e-resource-cells').children.length).toEqual(2);
            expect([resourceRow.querySelector('tr td.e-resource-cells div.e-resource-tree-icon')].length).toEqual(1);
            expect([resourceRow.querySelector('tr td.e-resource-cells div.tWrap')].length).toEqual(1);
            expect(resourceRow.querySelector('tr td.e-resource-cells div.tWrap').children.length).toEqual(1);
            let templateDiv: HTMLElement = resourceRow.querySelector('tr td.e-resource-cells div.tWrap div.rText') as HTMLElement;
            expect([templateDiv].length).toEqual(1);
            expect(templateDiv.style.backgroundColor).toEqual('pink');
            expect(templateDiv.innerHTML).toEqual('Hall 1');
            let contentRows: HTMLElement = contentRow.children[1].children[1].querySelector('tbody');
            expect(contentRows.children.length).toEqual(15);
        });
    });

    describe('Group by-child multi level resource rendering with expand property', () => {
        let schObj: Schedule;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        beforeAll((done: Function) => {
            document.body.appendChild(elem);
            let dataBound: EmitType<Object> = () => { done(); };
            schObj = new Schedule({
                height: '550px', width: '100%',
                currentView: 'TimelineMonth',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineMonth'],
                group: {
                    byGroupID: false,
                    resources: ['Halls', 'Rooms', 'Owners']
                },
                resources: [
                    {
                        field: 'HallId', title: 'Hall',
                        name: 'Halls', allowMultiple: false,
                        dataSource: [
                            { HallText: 'Hall 1', Id: 1, HallColor: '#cb6bb2' },
                            { HallText: 'Hall 2', Id: 2, HallColor: '#56ca85' }
                        ],
                        textField: 'HallText', idField: 'Id', colorField: 'HallColor'
                    },
                    {
                        field: 'RoomId', title: 'Room',
                        name: 'Rooms', allowMultiple: false,
                        dataSource: [
                            { RoomText: 'ROOM 1', Id: 1, RoomColor: '#cb6bb2' },
                            { RoomText: 'ROOM 2', Id: 2, RoomColor: '#56ca85', Expand: false }
                        ],
                        textField: 'RoomText', idField: 'Id', colorField: 'RoomColor', expandedField: 'Expand'
                    },
                    {
                        field: 'OwnerId', title: 'Owner',
                        name: 'Owners', allowMultiple: true,
                        dataSource: [
                            { OwnerText: 'Nancy', Id: 1, OwnerColor: '#ffaa00' },
                            { OwnerText: 'Steven', Id: 2, OwnerColor: '#f8a398' },
                            { OwnerText: 'Michael', Id: 3, OwnerColor: '#7499e1' }
                        ],
                        textField: 'OwnerText', idField: 'Id', colorField: 'OwnerColor'
                    }
                ],
                selectedDate: new Date(2017, 10, 1),
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
        it('checking resource tree rendering', () => {
            let contentRow: HTMLElement = schObj.element.querySelector('.e-timeline-month-view table tbody') as HTMLElement;
            expect(contentRow.children[1].children.length).toEqual(2);
            expect([contentRow.children[1].querySelector('td div.e-resource-column-wrap')].length).toEqual(1);
            let resourceRow: HTMLElement = schObj.element.querySelector('.e-resource-column-wrap tbody') as HTMLElement;
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
            expect(resourceRow.children[9].querySelector('tr td.e-resource-cells div.e-resource-text').innerHTML)
                .toEqual('Hall 2');
            expect(resourceRow.children[10].querySelector('.e-resource-cells div.e-resource-text').innerHTML).toEqual('ROOM 1');
            expect(resourceRow.children[11].querySelector('.e-child-node div.e-resource-text').innerHTML).toEqual('Nancy');
            let contentRows: HTMLElement = contentRow.children[1].children[1].querySelector('tbody');
            expect(contentRows.children.length).toEqual(18);
            let contentArea: HTMLElement = schObj.element.querySelector('.e-content-wrap') as HTMLElement;
            triggerScrollEvent(contentArea, 100);
            expect(contentArea.scrollTop).toEqual(100);
        });
    });

    describe('Multiple resource grouping rendering compact view in mobile device ', () => {
        let schObj: Schedule;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        let uA: string = Browser.userAgent;
        let androidUserAgent: string = 'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) ' +
            'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36';
        beforeAll((done: Function) => {
            Browser.userAgent = androidUserAgent;
            document.body.appendChild(elem);
            let dataBound: EmitType<Object> = () => { done(); };
            schObj = new Schedule({
                width: 300,
                height: '600px',
                selectedDate: new Date(2018, 3, 1),
                currentView: 'TimelineMonth',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek', 'TimelineMonth'],
                group: {
                    resources: ['Rooms', 'Owners']
                },
                resources: [{
                    field: 'RoomId',
                    name: 'Rooms',
                    dataSource: [
                        { Text: 'Room 1', Id: 1, Color: '#ffaa00' },
                        { Text: 'Room 2', Id: 2, Color: '#f8a398' }
                    ]
                }, {
                    field: 'OwnerId',
                    name: 'Owners',
                    dataSource: [
                        { Text: 'Nancy', Id: 1, GroupID: 1, Color: '#ffaa00' },
                        { Text: 'Steven', Id: 2, GroupID: 2, Color: '#f8a398' },
                        { Text: 'Michael', Id: 3, GroupID: 1, Color: '#7499e1' }
                    ]
                }],
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
            Browser.userAgent = uA;
        });
        it('initial layout testing', () => {
            disableScheduleAnimation(schObj);
            let workCells: Element[] = schObj.getWorkCellElements();
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
            let menuElement: HTMLElement = schObj.element.querySelector('.e-resource-menu .e-icon-menu');
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
            let menuElement: HTMLElement = schObj.element.querySelector('.e-resource-menu .e-icon-menu');
            menuElement.click();
            expect(schObj.element.querySelector('.e-resource-level-title .e-resource-name:first-child').innerHTML).toEqual('Room 1');
            expect(schObj.element.querySelector('.e-resource-level-title .e-resource-name:last-child').innerHTML).toEqual('Nancy');
            let nodeElement: NodeListOf<Element> = schObj.element.querySelectorAll('.e-resource-tree .e-list-item:not(.e-has-child)');
            expect(nodeElement.length).toEqual(3);
            menuElement.click();
        });

        it('resource events checked for timeline month view testing', () => {
            expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(3);
        });

        it('resource events checked for timeline day view testing', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(1);
                done();
            };
            schObj.currentView = 'TimelineDay';
            schObj.dataBind();
        });

        it('resource events checked for timeline week view testing', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(3);
                done();
            };
            schObj.currentView = 'TimelineWeek';
            schObj.dataBind();
        });

        it('resource events checked for timeline work view testing', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(2);
                done();
            };
            schObj.currentView = 'TimelineWorkWeek';
            schObj.dataBind();
        });

        it('resource without timescale', (done: Function) => {
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
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        let uA: string = Browser.userAgent;
        let androidUserAgent: string = 'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) ' +
            'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36';
        beforeAll((done: Function) => {
            Browser.userAgent = androidUserAgent;
            document.body.appendChild(elem);
            let dataBound: EmitType<Object> = () => { done(); };
            schObj = new Schedule({
                height: '600px',
                selectedDate: new Date(2018, 3, 1),
                currentView: 'TimelineMonth',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek', 'TimelineMonth'],
                group: {
                    enableCompactView: false,
                    resources: ['Rooms', 'Owners']
                },
                resources: [{
                    field: 'RoomId',
                    name: 'Rooms',
                    dataSource: [
                        { Text: 'Room 1', Id: 1, Color: '#ffaa00' },
                        { Text: 'Room 2', Id: 2, Color: '#f8a398' }
                    ]
                }, {
                    field: 'OwnerId',
                    name: 'Owners',
                    dataSource: [
                        { Text: 'Nancy', Id: 1, GroupID: 1, Color: '#ffaa00' },
                        { Text: 'Steven', Id: 2, GroupID: 2, Color: '#f8a398' },
                        { Text: 'Michael', Id: 3, GroupID: 1, Color: '#7499e1' }
                    ]
                }],
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
            Browser.userAgent = uA;
        });
        it('initial layout testing', () => {
            let workCells: Element[] = schObj.getWorkCellElements();
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

        it('resource events checked for timeline day view testing', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(3);
                done();
            };
            schObj.currentView = 'TimelineDay';
            schObj.dataBind();
        });

        it('resource events checked for timeline week view testing', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(9);
                done();
            };
            schObj.currentView = 'TimelineWeek';
            schObj.dataBind();
        });

        it('resource events checked for timeline work week view testing', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(5);
                done();
            };
            schObj.currentView = 'TimelineWorkWeek';
            schObj.dataBind();
        });

        it('resource without timescale', (done: Function) => {
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
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        beforeAll((done: Function) => {
            document.body.appendChild(elem);
            let dataBound: EmitType<Object> = () => { done(); };
            schObj = new Schedule({
                height: '580px', width: '100%',
                currentView: 'TimelineMonth',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek', 'TimelineMonth'],
                group: {
                    allowGroupEdit: true,
                    resources: ['Rooms', 'Owners']
                },
                resources: [
                    {
                        field: 'RoomId', title: 'Room',
                        name: 'Rooms', allowMultiple: true,
                        dataSource: [
                            { RoomText: 'ROOM 1', Id: 1, RoomColor: '#cb6bb2' },
                            { RoomText: 'ROOM 2', Id: 2, RoomColor: '#56ca85' },
                            { RoomText: 'ROOM 3', Id: 3, RoomColor: '#56ca85' }
                        ],
                        textField: 'RoomText', idField: 'Id', colorField: 'RoomColor'
                    }, {
                        field: 'OwnerId', title: 'Owner',
                        name: 'Owners', allowMultiple: true,
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
                    }
                ],
                selectedDate: new Date(2018, 4, 1),
                eventSettings: { dataSource: cloneDataSource(resourceGroupData) },
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

        it('Checking events elements', () => {
            let eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList.length).toEqual(40);
            let eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
            expect(eventWrapperList.length).toEqual(10);
        });

        it('Checking left icon', () => {
            let eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[0].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Recurrence Event - Previous week');
            expect(eventElementList[0].querySelectorAll('.e-appointment-details .e-indicator')[0].classList.contains('e-left-icon'))
                .toBeTruthy();
        });

        it('Checking recurrence icon', () => {
            let eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[0].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Recurrence Event - Previous week');
            expect(eventElementList[0].querySelectorAll('.e-appointment-details .e-icons')[1].classList.contains('e-recurrence-icon'))
                .toBeTruthy();
        });

        it('More event element checking', () => {
            let moreIndicatorList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
            expect(moreIndicatorList.length).toEqual(26);
            expect(moreIndicatorList[0].innerHTML).toEqual('+2&nbsp;more');
            expect(moreIndicatorList[1].innerHTML).toEqual('+1&nbsp;more');
            expect(moreIndicatorList[11].innerHTML).toEqual('+1&nbsp;more');
            let element: HTMLElement = moreIndicatorList[0] as HTMLElement;
            element.click();
            let morePopup: HTMLElement = schObj.element.querySelector('.e-more-popup-wrapper') as HTMLElement;
            let moreEventList: Element[] = [].slice.call(morePopup.querySelectorAll('.e-more-appointment-wrapper .e-appointment'));
            expect(moreEventList.length).toEqual(3);
            triggerMouseEvent(morePopup.querySelector('.e-more-event-close'), 'click');
        });
    });

    describe('Grouped events - RTL', () => {
        let schObj: Schedule;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        beforeAll((done: Function) => {
            document.body.appendChild(elem);
            let dataBound: EmitType<Object> = () => { done(); };
            schObj = new Schedule({
                height: '580px', width: '100%',
                currentView: 'TimelineMonth',
                enableRtl: true,
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek', 'TimelineMonth'],
                group: {
                    allowGroupEdit: true,
                    resources: ['Rooms', 'Owners']
                },
                resources: [
                    {
                        field: 'RoomId', title: 'Room',
                        name: 'Rooms', allowMultiple: true,
                        dataSource: [
                            { RoomText: 'ROOM 1', Id: 1, RoomColor: '#cb6bb2' },
                            { RoomText: 'ROOM 2', Id: 2, RoomColor: '#56ca85' },
                            { RoomText: 'ROOM 3', Id: 3, RoomColor: '#56ca85' }
                        ],
                        textField: 'RoomText', idField: 'Id', colorField: 'RoomColor'
                    }, {
                        field: 'OwnerId', title: 'Owner',
                        name: 'Owners', allowMultiple: true,
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
                    }
                ],
                selectedDate: new Date(2018, 4, 1),
                eventSettings: { dataSource: cloneDataSource(resourceGroupData) },
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

        it('Checking events elements', () => {
            let eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList.length).toEqual(40);
            let eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
            expect(eventWrapperList.length).toEqual(10);
        });

        it('Checking left icon', () => {
            let eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[0].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Recurrence Event - Previous week');
            expect(eventElementList[0].querySelectorAll('.e-appointment-details .e-indicator')[0].classList.contains('e-left-icon'))
                .toBeTruthy();
        });

        it('Checking recurrence icon', () => {
            let eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[0].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Recurrence Event - Previous week');
            expect(eventElementList[0].querySelectorAll('.e-appointment-details .e-icons')[1].classList.contains('e-recurrence-icon'))
                .toBeTruthy();
        });

        it('More event element checking', () => {
            let moreIndicatorList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
            expect(moreIndicatorList.length).toEqual(26);
            expect(moreIndicatorList[0].innerHTML).toEqual('+2&nbsp;more');
            expect(moreIndicatorList[1].innerHTML).toEqual('+1&nbsp;more');
            expect(moreIndicatorList[11].innerHTML).toEqual('+1&nbsp;more');
            let element: HTMLElement = moreIndicatorList[0] as HTMLElement;
            element.click();
            let morePopup: HTMLElement = schObj.element.querySelector('.e-more-popup-wrapper') as HTMLElement;
            let moreEventList: Element[] = [].slice.call(morePopup.querySelectorAll('.e-more-appointment-wrapper .e-appointment'));
            expect(moreEventList.length).toEqual(3);
            triggerMouseEvent(morePopup.querySelector('.e-more-event-close'), 'click');
        });
    });

    describe('Events rendering based on levels', () => {
        let schObj: Schedule;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        beforeAll((done: Function) => {
            document.body.appendChild(elem);
            let dataBound: EmitType<Object> = () => { done(); };
            schObj = new Schedule({
                height: '550px', width: '100%',
                currentView: 'TimelineMonth',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek', 'TimelineMonth'],
                group: {
                    resources: ['Floors', 'Halls', 'Rooms', 'Owners']
                },
                resources: [
                    {
                        field: 'FId', title: 'Floor',
                        name: 'Floors', allowMultiple: false,
                        dataSource: [
                            { FloorText: 'Floor 1', Id: 1, FloorColor: '#cb6bb2' },
                            { FloorText: 'Floor 2', Id: 2, FloorColor: '#cb6bb2' },
                            { FloorText: 'Floor 3', Id: 3, FloorColor: '#cb6bb2' },
                        ],
                        textField: 'FloorText', idField: 'Id', colorField: 'FloorColor'
                    },
                    {
                        field: 'HallId', title: 'Hall',
                        name: 'Halls', allowMultiple: false,
                        dataSource: [
                            { HallText: 'Hall 1', Id: 1, HallGroupId: 1, HallColor: '#cb6bb2' },
                            { HallText: 'Hall 2', Id: 2, HallGroupId: 2, HallColor: '#56ca85' }
                        ],
                        textField: 'HallText', idField: 'Id', groupIDField: 'HallGroupId', colorField: 'HallColor'
                    },
                    {
                        field: 'RoomId', title: 'Room',
                        name: 'Rooms', allowMultiple: false,
                        dataSource: [
                            { RoomText: 'ROOM 1', Id: 1, RoomGroupId: 1, RoomColor: '#cb6bb2' },
                            { RoomText: 'ROOM 2', Id: 2, RoomGroupId: 2, RoomColor: '#56ca85' }
                        ],
                        textField: 'RoomText', idField: 'Id', groupIDField: 'RoomGroupId', colorField: 'RoomColor'
                    },
                    {
                        field: 'OwnerId', title: 'Owner',
                        name: 'Owners', allowMultiple: true,
                        dataSource: [
                            { OwnerText: 'Nancy', Id: 1, OwnerGroupId: 1, OwnerColor: '#ffaa00' },
                            { OwnerText: 'Steven', Id: 2, OwnerGroupId: 2, OwnerColor: '#f8a398' },
                            { OwnerText: 'Oliver', Id: 3, OwnerGroupId: 1, OwnerColor: '#ffaa00' },
                            { OwnerText: 'John', Id: 4, OwnerGroupId: 2, OwnerColor: '#f8a398' },
                        ],
                        textField: 'OwnerText', idField: 'Id', groupIDField: 'OwnerGroupId', colorField: 'OwnerColor'
                    }
                ],
                selectedDate: new Date(2018, 4, 1),
                eventSettings: { dataSource: cloneDataSource(levelBasedData) },
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

        it('Checking events elements', () => {
            let eventContainer: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-event-table .e-appointment-container'));
            expect(eventContainer.length).toEqual(10);
            let eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList.length).toEqual(10);
            let eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
            expect(eventWrapperList.length).toEqual(6);
        });

        it('Checking events in top level parent node if there is no child fields mapped', () => {
            let eventContainer: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-event-table .e-appointment-container'));
            expect(eventContainer[0].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Spanned Event - Greater than 24');
        });

        it('Checking events in last level parent node if there is no child fields mapped', () => {
            let eventContainer: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-event-table .e-appointment-container'));
            expect(eventContainer[2].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Events - Within a day');
        });

        it('Checking events in child node if all fields are mapperd properly', () => {
            let eventContainer: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-event-table .e-appointment-container'));
            expect(eventContainer[3].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Spanned Event - Next week');
        });

        it('Checking left icon', () => {
            let eventContainer: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-event-table .e-appointment-container'));
            expect(eventContainer[1].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Spanned Event - Previous week');
            expect(eventContainer[1].querySelectorAll('.e-appointment-details .e-indicator')[0].classList.contains('e-left-icon'))
                .toBeTruthy();
        });

        it('Checking recurrence icon', () => {
            let eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[5].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Recurrence  Event');
            expect(eventElementList[5].querySelectorAll('.e-appointment-details .e-icons')[0].classList.contains('e-recurrence-icon'))
                .toBeTruthy();
        });
    });

    describe('Events rendering based on levels - RTL', () => {
        let schObj: Schedule;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        beforeAll((done: Function) => {
            document.body.appendChild(elem);
            let dataBound: EmitType<Object> = () => { done(); };
            schObj = new Schedule({
                height: '550px', width: '100%',
                enableRtl: true,
                currentView: 'TimelineMonth',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek', 'TimelineMonth'],
                group: {
                    resources: ['Floors', 'Halls', 'Rooms', 'Owners']
                },
                resources: [
                    {
                        field: 'FId', title: 'Floor',
                        name: 'Floors', allowMultiple: false,
                        dataSource: [
                            { FloorText: 'Floor 1', Id: 1, FloorColor: '#cb6bb2' },
                            { FloorText: 'Floor 2', Id: 2, FloorColor: '#cb6bb2' },
                            { FloorText: 'Floor 3', Id: 3, FloorColor: '#cb6bb2' },
                        ],
                        textField: 'FloorText', idField: 'Id', colorField: 'FloorColor'
                    },
                    {
                        field: 'HallId', title: 'Hall',
                        name: 'Halls', allowMultiple: false,
                        dataSource: [
                            { HallText: 'Hall 1', Id: 1, HallGroupId: 1, HallColor: '#cb6bb2' },
                            { HallText: 'Hall 2', Id: 2, HallGroupId: 2, HallColor: '#56ca85' }
                        ],
                        textField: 'HallText', idField: 'Id', groupIDField: 'HallGroupId', colorField: 'HallColor'
                    },
                    {
                        field: 'RoomId', title: 'Room',
                        name: 'Rooms', allowMultiple: false,
                        dataSource: [
                            { RoomText: 'ROOM 1', Id: 1, RoomGroupId: 1, RoomColor: '#cb6bb2' },
                            { RoomText: 'ROOM 2', Id: 2, RoomGroupId: 2, RoomColor: '#56ca85' }
                        ],
                        textField: 'RoomText', idField: 'Id', groupIDField: 'RoomGroupId', colorField: 'RoomColor'
                    },
                    {
                        field: 'OwnerId', title: 'Owner',
                        name: 'Owners', allowMultiple: true,
                        dataSource: [
                            { OwnerText: 'Nancy', Id: 1, OwnerGroupId: 1, OwnerColor: '#ffaa00' },
                            { OwnerText: 'Steven', Id: 2, OwnerGroupId: 2, OwnerColor: '#f8a398' },
                            { OwnerText: 'Oliver', Id: 3, OwnerGroupId: 1, OwnerColor: '#ffaa00' },
                            { OwnerText: 'John', Id: 4, OwnerGroupId: 2, OwnerColor: '#f8a398' },
                        ],
                        textField: 'OwnerText', idField: 'Id', groupIDField: 'OwnerGroupId', colorField: 'OwnerColor'
                    }
                ],
                selectedDate: new Date(2018, 4, 1),
                eventSettings: { dataSource: cloneDataSource(levelBasedData) },
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

        it('Checking events elements', () => {
            let eventContainer: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-event-table .e-appointment-container'));
            expect(eventContainer.length).toEqual(10);
            let eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList.length).toEqual(10);
            let eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
            expect(eventWrapperList.length).toEqual(6);
        });

        it('Checking events in top level parent node if there is no child fields mapped', () => {
            let eventContainer: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-event-table .e-appointment-container'));
            expect(eventContainer[0].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Spanned Event - Greater than 24');
        });

        it('Checking events in last level parent node if there is no child fields mapped', () => {
            let eventContainer: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-event-table .e-appointment-container'));
            expect(eventContainer[2].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Events - Within a day');
        });

        it('Checking events in child node if all fields are mapperd properly', () => {
            let eventContainer: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-event-table .e-appointment-container'));
            expect(eventContainer[3].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Spanned Event - Next week');
        });

        it('Checking left icon', () => {
            let eventContainer: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-event-table .e-appointment-container'));
            expect(eventContainer[1].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Spanned Event - Previous week');
            expect(eventContainer[1].querySelectorAll('.e-appointment-details .e-indicator')[0].classList.contains('e-left-icon'))
                .toBeTruthy();
        });

        it('Checking recurrence icon', () => {
            let eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[5].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Recurrence  Event');
            expect(eventElementList[5].querySelectorAll('.e-appointment-details .e-icons')[0].classList.contains('e-recurrence-icon'))
                .toBeTruthy();
        });
    });

    describe('Year, Month, Week, Day, Hour header rows', () => {
        let schObj: Schedule;
        beforeAll((done: Function) => {
            let options: ScheduleModel = {
                height: '600px', width: '1000px',
                currentView: 'TimelineMonth',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek', 'TimelineMonth'],
                headerRows: [
                    { option: 'Year' },
                    { option: 'Month' },
                    { option: 'Week' },
                    { option: 'Date' },
                    { option: 'Hour' }
                ],
                selectedDate: new Date(2018, 4, 1),
            };
            schObj = createSchedule(options, timelineData, done);
        });
        afterAll(() => {
            destroy(schObj);
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
            let headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
            expect(headTrs[0].children.length).toEqual(1);
            expect(headTrs[0].children[0].getAttribute('colSpan')).toEqual('31');
            expect(headTrs[0].children[0].innerHTML).toEqual('<span class="e-header-year">2018</span>');
        });

        it('check month rows', () => {
            let headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
            expect(headTrs[1].children.length).toEqual(1);
            expect(headTrs[1].children[0].getAttribute('colSpan')).toEqual('31');
            expect(headTrs[1].children[0].innerHTML).toEqual('<span class="e-header-month">May</span>');
        });

        it('check week rows', () => {
            let headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
            expect(headTrs[2].children.length).toEqual(5);
            expect(headTrs[2].children[0].getAttribute('colSpan')).toEqual('5');
            expect(headTrs[2].children[0].innerHTML).toEqual('<span class="e-header-week">18</span>');
        });

        it('check day rows', () => {
            let headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
            expect(headTrs[3].children.length).toEqual(31);
            expect(headTrs[3].children[0].getAttribute('colSpan')).toEqual('1');
            expect(headTrs[3].children[0].innerHTML).
                toEqual('<span class="e-navigate" title="Tuesday, May 1, 2018">May 1</span>');
            expect(headTrs[3].children[0].getAttribute('data-date')).toEqual(new Date(2018, 4, 1).getTime().toString());
        });

        it('check work cells', () => {
            expect(schObj.getWorkCellElements().length).toEqual(31);
            let firstWorkCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
            expect(firstWorkCell.parentElement.getAttribute('role')).toEqual('row');
            expect(firstWorkCell.getAttribute('role')).toEqual('gridcell');
            expect(firstWorkCell.getAttribute('aria-selected')).toEqual('false');
            expect(firstWorkCell.getAttribute('data-date')).toEqual(new Date(2018, 4, 1).getTime().toString());
            expect(firstWorkCell.innerHTML).toEqual('');

            let data: CellClickEventArgs = schObj.getCellDetails(firstWorkCell);
            expect(data.startTime.getTime()).toEqual(new Date(2018, 4, 1).getTime());
            expect(data.endTime.getTime()).toEqual(new Date(2018, 4, 2).getTime());
            expect(data.isAllDay).toEqual(true);
            expect(data.groupIndex).toBeUndefined();
        });

        it('check work hours highlight', () => {
            expect(schObj.element.querySelectorAll('.e-work-hours,.e-work-days').length).toEqual(23);
        });

        it('check events rendering', () => {
            let eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList.length).toEqual(23);
            let eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
            expect(eventWrapperList.length).toEqual(1);

            expect(eventElementList[0].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Recurrence Event - Previous week');
            expect(eventElementList[0].querySelectorAll('.e-appointment-details .e-indicator')[0].classList).toContain('e-left-icon');
        });

        it('check more indicator', () => {
            let moreIndicators: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
            expect(moreIndicators.length).toEqual(1);
            expect(moreIndicators[0].innerHTML).toEqual('+6&nbsp;more');
            expect(moreIndicators[0].getAttribute('data-start-date')).toEqual(new Date(2018, 4, 1).getTime().toString());
            expect(moreIndicators[0].getAttribute('data-end-date')).toEqual(new Date(2018, 4, 2).getTime().toString());
            moreIndicators[0].click();
            let morePopup: HTMLElement = schObj.element.querySelector('.e-more-popup-wrapper') as HTMLElement;
            let eventElementList: Element[] = [].slice.call(morePopup.querySelectorAll('.e-more-appointment-wrapper .e-appointment'));
            expect(eventElementList.length).toEqual(15);
            expect(morePopup.classList).toContain('e-popup-open');
            triggerMouseEvent(morePopup.querySelector('.e-more-event-close'), 'click');
            expect(morePopup.classList).toContain('e-popup-close');
        });

        it('navigate next date', (done: Function) => {
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
            let dataBound: (args: Object) => void = (args: Object) => {
                expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-timeline-month');
                expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('June 2018');
                expect(schObj.element.querySelectorAll('.e-date-header-wrap table col').length).toEqual(30);
                let headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
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
                expect(headTrs[3].children[0].innerHTML).
                    toEqual('<span class="e-navigate" title="Friday, June 1, 2018">Jun 1</span>');
                expect(headTrs[3].children[0].getAttribute('data-date')).toEqual(new Date(2018, 5, 1).getTime().toString());
                expect(schObj.getWorkCellElements().length).toEqual(30);
                let firstWorkCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
                expect(firstWorkCell.getAttribute('data-date')).toEqual(new Date(2018, 5, 1).getTime().toString());
                expect(schObj.element.querySelectorAll('.e-work-hours,.e-work-days').length).toEqual(21);
                let eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(eventElementList.length).toEqual(0);
                let eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
                expect(eventWrapperList.length).toEqual(0);
                done();
            };
            schObj.dataBound = dataBound;
        });

        it('navigate previous date', (done: Function) => {
            (schObj.element.querySelector('.e-toolbar-item.e-prev') as HTMLElement).click();
            let dataBound: (args: Object) => void = (args: Object) => {
                expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('May 2018');
                expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-timeline-month');
                expect(schObj.element.querySelectorAll('.e-date-header-wrap table col').length).toEqual(31);
                let headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
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
                expect(headTrs[3].children[0].innerHTML).
                    toEqual('<span class="e-navigate" title="Tuesday, May 1, 2018">May 1</span>');
                expect(headTrs[3].children[0].getAttribute('data-date')).toEqual(new Date(2018, 4, 1).getTime().toString());
                expect(schObj.getWorkCellElements().length).toEqual(31);
                let firstWorkCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
                expect(firstWorkCell.getAttribute('aria-selected')).toEqual('false');
                expect(firstWorkCell.getAttribute('data-date')).toEqual(new Date(2018, 4, 1).getTime().toString());
                expect(firstWorkCell.innerHTML).toEqual('');
                expect(schObj.element.querySelectorAll('.e-work-hours,.e-work-days').length).toEqual(23);
                let eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(eventElementList.length).toEqual(23);
                let eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
                expect(eventWrapperList.length).toEqual(1);
                done();
            };
            schObj.dataBound = dataBound;
        });
    });

    describe('Year, Month, Week, Day, Hour header rows with template', () => {
        let schObj: Schedule;
        beforeAll((done: Function) => {
            let headTemplate: string = '<span>${type}</span>';
            let options: ScheduleModel = {
                height: '600px', width: '1000px',
                currentView: 'TimelineMonth',
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
                selectedDate: new Date(2018, 4, 1),
            };
            schObj = createSchedule(options, timelineData, done);
        });
        afterAll(() => {
            destroy(schObj);
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
            let headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
            expect(headTrs[0].children.length).toEqual(1);
            expect(headTrs[0].children[0].getAttribute('colSpan')).toEqual('31');
            expect(headTrs[0].children[0].innerHTML).toEqual('<span>yearHeader</span>');
        });

        it('check month rows', () => {
            let headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
            expect(headTrs[1].children.length).toEqual(1);
            expect(headTrs[1].children[0].getAttribute('colSpan')).toEqual('31');
            expect(headTrs[1].children[0].innerHTML).toEqual('<span>monthHeader</span>');
        });

        it('check week rows', () => {
            let headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
            expect(headTrs[2].children.length).toEqual(5);
            expect(headTrs[2].children[0].getAttribute('colSpan')).toEqual('5');
            expect(headTrs[2].children[0].innerHTML).toEqual('<span>weekHeader</span>');
        });

        it('check day rows', () => {
            let headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
            expect(headTrs[3].children.length).toEqual(31);
            expect(headTrs[3].children[0].getAttribute('colSpan')).toEqual('1');
            expect(headTrs[3].children[0].innerHTML).
                toEqual('<span>dateHeader</span>');
            expect(headTrs[3].children[0].getAttribute('data-date')).toEqual(new Date(2018, 4, 1).getTime().toString());
        });

        it('check work cells', () => {
            expect(schObj.getWorkCellElements().length).toEqual(31);
            let firstWorkCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
            expect(firstWorkCell.getAttribute('aria-selected')).toEqual('false');
            expect(firstWorkCell.getAttribute('data-date')).toEqual(new Date(2018, 4, 1).getTime().toString());

            let data: CellClickEventArgs = schObj.getCellDetails(firstWorkCell);
            expect(data.startTime.getTime()).toEqual(new Date(2018, 4, 1).getTime());
            expect(data.endTime.getTime()).toEqual(new Date(2018, 4, 2).getTime());
            expect(data.isAllDay).toEqual(true);
            expect(data.groupIndex).toBeUndefined();
            expect(firstWorkCell.innerHTML).toEqual('');
            expect(schObj.element.querySelectorAll('.e-work-hours,.e-work-days').length).toEqual(23);
        });

        it('check events rendering with more indicator', () => {
            let eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList.length).toEqual(23);
            let eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
            expect(eventWrapperList.length).toEqual(1);
            let moreIndicators: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
            expect(moreIndicators.length).toEqual(1);
            expect(moreIndicators[0].innerHTML).toEqual('+6&nbsp;more');
            expect(moreIndicators[0].getAttribute('data-start-date')).toEqual(new Date(2018, 4, 1).getTime().toString());
            expect(moreIndicators[0].getAttribute('data-end-date')).toEqual(new Date(2018, 4, 2).getTime().toString());
        });
    });

    describe('Year, Month, Week, Day header rows', () => {
        let schObj: Schedule;
        beforeAll((done: Function) => {
            let options: ScheduleModel = {
                height: '600px', width: '1000px',
                currentView: 'TimelineMonth',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek', 'TimelineMonth'],
                headerRows: [
                    { option: 'Year' },
                    { option: 'Month' },
                    { option: 'Week' },
                    { option: 'Date' }
                ],
                selectedDate: new Date(2018, 4, 1),
            };
            schObj = createSchedule(options, timelineData, done);
        });
        afterAll(() => {
            destroy(schObj);
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
            let headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
            expect(headTrs[0].children.length).toEqual(1);
            expect(headTrs[0].children[0].getAttribute('colSpan')).toEqual('31');
            expect(headTrs[0].children[0].innerHTML).toEqual('<span class="e-header-year">2018</span>');
        });

        it('check month rows', () => {
            let headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
            expect(headTrs[1].children.length).toEqual(1);
            expect(headTrs[1].children[0].getAttribute('colSpan')).toEqual('31');
            expect(headTrs[1].children[0].innerHTML).toEqual('<span class="e-header-month">May</span>');
        });

        it('check week rows', () => {
            let headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
            expect(headTrs[2].children.length).toEqual(5);
            expect(headTrs[2].children[0].getAttribute('colSpan')).toEqual('5');
            expect(headTrs[2].children[0].innerHTML).toEqual('<span class="e-header-week">18</span>');
        });

        it('check day rows', () => {
            let headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
            expect(headTrs[3].children.length).toEqual(31);
            expect(headTrs[3].children[0].getAttribute('colSpan')).toEqual('1');
            expect(headTrs[3].children[0].innerHTML).
                toEqual('<span class="e-navigate" title="Tuesday, May 1, 2018">May 1</span>');
            expect(headTrs[3].children[0].getAttribute('data-date')).toEqual(new Date(2018, 4, 1).getTime().toString());
        });

        it('check work cells', () => {
            expect(schObj.getWorkCellElements().length).toEqual(31);
            let firstWorkCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
            expect(firstWorkCell.getAttribute('aria-selected')).toEqual('false');
            expect(firstWorkCell.getAttribute('data-date')).toEqual(new Date(2018, 4, 1).getTime().toString());
            let data: CellClickEventArgs = schObj.getCellDetails(firstWorkCell);
            expect(data.startTime.getTime()).toEqual(new Date(2018, 4, 1).getTime());
            expect(data.endTime.getTime()).toEqual(new Date(2018, 4, 2).getTime());
            expect(data.isAllDay).toEqual(true);
            expect(data.groupIndex).toBeUndefined();
            expect(firstWorkCell.innerHTML).toEqual('');
            expect(schObj.element.querySelectorAll('.e-work-hours,.e-work-days').length).toEqual(23);
        });

        it('check events rendering with more indicator', () => {
            let eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList.length).toEqual(23);
            let eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
            expect(eventWrapperList.length).toEqual(1);
            let moreIndicators: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
            expect(moreIndicators.length).toEqual(1);
            expect(moreIndicators[0].innerHTML).toEqual('+6&nbsp;more');
            expect(moreIndicators[0].getAttribute('data-start-date')).toEqual(new Date(2018, 4, 1).getTime().toString());
            expect(moreIndicators[0].getAttribute('data-end-date')).toEqual(new Date(2018, 4, 2).getTime().toString());
        });
    });

    describe('Year, Month, Week header rows', () => {
        let schObj: Schedule;
        beforeAll((done: Function) => {
            let options: ScheduleModel = {
                height: '600px', width: '1000px',
                currentView: 'TimelineMonth',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek', 'TimelineMonth'],
                headerRows: [
                    { option: 'Year' },
                    { option: 'Month' },
                    { option: 'Week' }
                ],
                selectedDate: new Date(2018, 4, 1),
            };
            schObj = createSchedule(options, timelineData, done);
        });
        afterAll(() => {
            destroy(schObj);
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
            let headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
            expect(headTrs[0].children.length).toEqual(1);
            expect(headTrs[0].children[0].getAttribute('colSpan')).toEqual('31');
            expect(headTrs[0].children[0].innerHTML).toEqual('<span class="e-header-year">2018</span>');
        });

        it('check month rows', () => {
            let headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
            expect(headTrs[1].children.length).toEqual(1);
            expect(headTrs[1].children[0].getAttribute('colSpan')).toEqual('31');
            expect(headTrs[1].children[0].innerHTML).toEqual('<span class="e-header-month">May</span>');
        });

        it('check week rows', () => {
            let headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
            expect(headTrs[2].children.length).toEqual(5);
            expect(headTrs[2].children[0].getAttribute('colSpan')).toEqual('5');
            expect(headTrs[2].children[0].innerHTML).toEqual('<span class="e-header-week">18</span>');
        });

        it('check work cells', () => {
            expect(schObj.getWorkCellElements().length).toEqual(5);
            let firstWorkCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
            expect(firstWorkCell.getAttribute('aria-selected')).toEqual('false');
            expect(firstWorkCell.getAttribute('data-date')).toEqual(new Date(2018, 4, 1).getTime().toString());
            let data: CellClickEventArgs = schObj.getCellDetails(firstWorkCell);
            expect(data.startTime.getTime()).toEqual(new Date(2018, 4, 1).getTime());
            expect(data.endTime.getTime()).toEqual(new Date(2018, 4, 6).getTime());
            expect(data.isAllDay).toEqual(true);
            expect(data.groupIndex).toBeUndefined();
            expect(firstWorkCell.innerHTML).toEqual('');
            // expect(schObj.element.querySelectorAll('.e-work-hours,.e-work-days').length).toEqual(0);
        });

        it('check events rendering with more indicator', () => {
            let eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList.length).toEqual(24);
            let eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
            expect(eventWrapperList.length).toEqual(1);
            let moreIndicators: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
            expect(moreIndicators.length).toEqual(1);
            expect(moreIndicators[0].innerHTML).toEqual('+5&nbsp;more');
            expect(moreIndicators[0].getAttribute('data-start-date')).toEqual(new Date(2018, 4, 1).getTime().toString());
            expect(moreIndicators[0].getAttribute('data-end-date')).toEqual(new Date(2018, 4, 2).getTime().toString());
        });
    });

    describe('Year, Month header rows', () => {
        let schObj: Schedule;
        beforeAll((done: Function) => {
            let options: ScheduleModel = {
                height: '600px', width: '1000px',
                currentView: 'TimelineMonth',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek', 'TimelineMonth'],
                headerRows: [
                    { option: 'Year' },
                    { option: 'Month' }
                ],
                selectedDate: new Date(2018, 4, 1),
            };
            schObj = createSchedule(options, timelineData, done);
        });
        afterAll(() => {
            destroy(schObj);
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
            let headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
            expect(headTrs[0].children.length).toEqual(1);
            expect(headTrs[0].children[0].getAttribute('colSpan')).toEqual('31');
            expect(headTrs[0].children[0].innerHTML).toEqual('<span class="e-header-year">2018</span>');
        });

        it('check month rows', () => {
            let headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
            expect(headTrs[1].children.length).toEqual(1);
            expect(headTrs[1].children[0].getAttribute('colSpan')).toEqual('31');
            expect(headTrs[1].children[0].innerHTML).toEqual('<span class="e-header-month">May</span>');
        });

        it('check work cells', () => {
            expect(schObj.getWorkCellElements().length).toEqual(1);
            let firstWorkCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
            expect(firstWorkCell.getAttribute('aria-selected')).toEqual('false');
            expect(firstWorkCell.getAttribute('data-date')).toEqual(new Date(2018, 4, 1).getTime().toString());
            let data: CellClickEventArgs = schObj.getCellDetails(firstWorkCell);
            expect(data.startTime.getTime()).toEqual(new Date(2018, 4, 1).getTime());
            expect(data.endTime.getTime()).toEqual(new Date(2018, 5, 1).getTime());
            expect(data.isAllDay).toEqual(true);
            expect(data.groupIndex).toBeUndefined();
            expect(firstWorkCell.innerHTML).toEqual('');
            // expect(schObj.element.querySelectorAll('.e-work-hours,.e-work-days').length).toEqual(0);
        });

        it('check events rendering with more indicator', () => {
            let eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList.length).toEqual(25);
            let eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
            expect(eventWrapperList.length).toEqual(1);
            let moreIndicators: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
            expect(moreIndicators.length).toEqual(1);
            expect(moreIndicators[0].innerHTML).toEqual('+4&nbsp;more');
            expect(moreIndicators[0].getAttribute('data-start-date')).toEqual(new Date(2018, 4, 1).getTime().toString());
            expect(moreIndicators[0].getAttribute('data-end-date')).toEqual(new Date(2018, 4, 2).getTime().toString());
        });
    });

    describe('Year header row', () => {
        let schObj: Schedule;
        beforeAll((done: Function) => {
            let options: ScheduleModel = {
                height: '600px', width: '1000px',
                currentView: 'TimelineMonth',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek', 'TimelineMonth'],
                headerRows: [
                    { option: 'Year' }
                ],
                selectedDate: new Date(2018, 4, 1),
            };
            schObj = createSchedule(options, timelineData, done);
        });
        afterAll(() => {
            destroy(schObj);
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
            let headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
            expect(headTrs[0].children.length).toEqual(1);
            expect(headTrs[0].children[0].getAttribute('colSpan')).toEqual('31');
            expect(headTrs[0].children[0].innerHTML).toEqual('<span class="e-header-year">2018</span>');
        });

        it('check work cells', () => {
            expect(schObj.getWorkCellElements().length).toEqual(1);
            let firstWorkCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
            expect(firstWorkCell.getAttribute('aria-selected')).toEqual('false');
            expect(firstWorkCell.getAttribute('data-date')).toEqual(new Date(2018, 4, 1).getTime().toString());
            let data: CellClickEventArgs = schObj.getCellDetails(firstWorkCell);
            expect(data.startTime.getTime()).toEqual(new Date(2018, 4, 1).getTime());
            expect(data.endTime.getTime()).toEqual(new Date(2018, 5, 1).getTime());
            expect(data.isAllDay).toEqual(true);
            expect(data.groupIndex).toBeUndefined();
            expect(firstWorkCell.innerHTML).toEqual('');
            // expect(schObj.element.querySelectorAll('.e-work-hours,.e-work-days').length).toEqual(0);
        });

        it('check events rendering with more indicator', () => {
            let eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList.length).toEqual(26);
            let eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
            expect(eventWrapperList.length).toEqual(1);
            let moreIndicators: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
            expect(moreIndicators.length).toEqual(1);
            expect(moreIndicators[0].innerHTML).toEqual('+3&nbsp;more');
            expect(moreIndicators[0].getAttribute('data-start-date')).toEqual(new Date(2018, 4, 1).getTime().toString());
            expect(moreIndicators[0].getAttribute('data-end-date')).toEqual(new Date(2018, 4, 2).getTime().toString());
        });
    });

    describe('Year, Week, Day header rows', () => {
        let schObj: Schedule;
        beforeAll((done: Function) => {
            let options: ScheduleModel = {
                height: '600px', width: '1000px',
                currentView: 'TimelineMonth',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek', 'TimelineMonth'],
                headerRows: [
                    { option: 'Year' },
                    { option: 'Week' },
                    { option: 'Date' }
                ],
                selectedDate: new Date(2018, 4, 1),
            };
            schObj = createSchedule(options, timelineData, done);
        });
        afterAll(() => {
            destroy(schObj);
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
            let headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
            expect(headTrs[0].children.length).toEqual(1);
            expect(headTrs[0].children[0].getAttribute('colSpan')).toEqual('31');
            expect(headTrs[0].children[0].innerHTML).toEqual('<span class="e-header-year">2018</span>');
        });

        it('check week rows', () => {
            let headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
            expect(headTrs[1].children.length).toEqual(5);
            expect(headTrs[1].children[0].getAttribute('colSpan')).toEqual('5');
            expect(headTrs[1].children[0].innerHTML).toEqual('<span class="e-header-week">18</span>');
        });

        it('check day rows', () => {
            let headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
            expect(headTrs[2].children.length).toEqual(31);
            expect(headTrs[2].children[0].getAttribute('colSpan')).toEqual('1');
            expect(headTrs[2].children[0].innerHTML).
                toEqual('<span class="e-navigate" title="Tuesday, May 1, 2018">May 1</span>');
            expect(headTrs[2].children[0].getAttribute('data-date')).toEqual(new Date(2018, 4, 1).getTime().toString());
        });

        it('check work cells', () => {
            expect(schObj.getWorkCellElements().length).toEqual(31);
            let firstWorkCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
            expect(firstWorkCell.getAttribute('aria-selected')).toEqual('false');
            expect(firstWorkCell.getAttribute('data-date')).toEqual(new Date(2018, 4, 1).getTime().toString());
            let data: CellClickEventArgs = schObj.getCellDetails(firstWorkCell);
            expect(data.startTime.getTime()).toEqual(new Date(2018, 4, 1).getTime());
            expect(data.endTime.getTime()).toEqual(new Date(2018, 4, 2).getTime());
            expect(data.isAllDay).toEqual(true);
            expect(data.groupIndex).toBeUndefined();
            expect(firstWorkCell.innerHTML).toEqual('');
            expect(schObj.element.querySelectorAll('.e-work-hours,.e-work-days').length).toEqual(23);
        });

        it('check events rendering with more indicator', () => {
            let eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList.length).toEqual(24);
            let eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
            expect(eventWrapperList.length).toEqual(1);
            let moreIndicators: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
            expect(moreIndicators.length).toEqual(1);
            expect(moreIndicators[0].innerHTML).toEqual('+5&nbsp;more');
            expect(moreIndicators[0].getAttribute('data-start-date')).toEqual(new Date(2018, 4, 1).getTime().toString());
            expect(moreIndicators[0].getAttribute('data-end-date')).toEqual(new Date(2018, 4, 2).getTime().toString());
        });
    });

    describe('Year, Month, Week, Day, Hour header rows with single resource', () => {
        let schObj: Schedule;
        let resLength: number = 10;
        beforeAll((done: Function) => {
            let options: ScheduleModel = {
                height: '600px', width: '1000px',
                currentView: 'TimelineMonth',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek', 'TimelineMonth'],
                headerRows: [
                    { option: 'Year' },
                    { option: 'Month' },
                    { option: 'Week' },
                    { option: 'Date' },
                    { option: 'Hour' }
                ],
                selectedDate: new Date(2018, 4, 1),
            };
            schObj = createGroupSchedule(1, options, timelineResourceData, done);
        });
        afterAll(() => {
            destroy(schObj);
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
            let headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
            expect(headTrs[0].children.length).toEqual(1);
            expect(headTrs[0].children[0].getAttribute('colSpan')).toEqual('31');
            expect(headTrs[0].children[0].innerHTML).toEqual('<span class="e-header-year">2018</span>');
        });

        it('check month rows', () => {
            let headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
            expect(headTrs[1].children.length).toEqual(1);
            expect(headTrs[1].children[0].getAttribute('colSpan')).toEqual('31');
            expect(headTrs[1].children[0].innerHTML).toEqual('<span class="e-header-month">May</span>');
        });

        it('check week rows', () => {
            let headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
            expect(headTrs[2].children.length).toEqual(5);
            expect(headTrs[2].children[0].getAttribute('colSpan')).toEqual('5');
            expect(headTrs[2].children[0].innerHTML).toEqual('<span class="e-header-week">18</span>');
        });

        it('check day rows', () => {
            let headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
            expect(headTrs[3].children.length).toEqual(31);
            expect(headTrs[3].children[0].getAttribute('colSpan')).toEqual('1');
            expect(headTrs[3].children[0].innerHTML).
                toEqual('<span class="e-navigate" title="Tuesday, May 1, 2018">May 1</span>');
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
            let firstWorkCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
            expect(firstWorkCell.parentElement.getAttribute('role')).toEqual('row');
            expect(firstWorkCell.getAttribute('role')).toEqual('gridcell');
            expect(firstWorkCell.getAttribute('aria-selected')).toEqual('false');
            expect(firstWorkCell.getAttribute('data-date')).toEqual(new Date(2018, 4, 1).getTime().toString());
            expect(firstWorkCell.getAttribute('data-group-index')).toEqual('0');
            expect(firstWorkCell.innerHTML).toEqual('');

            let data: CellClickEventArgs = schObj.getCellDetails(firstWorkCell);
            expect(data.startTime.getTime()).toEqual(new Date(2018, 4, 1).getTime());
            expect(data.endTime.getTime()).toEqual(new Date(2018, 4, 2).getTime());
            expect(data.isAllDay).toEqual(true);
            expect(data.groupIndex).toBe(0);
        });

        it('check work hours highlight', () => {
            expect(schObj.element.querySelectorAll('.e-work-hours,.e-work-days').length).toEqual(23 * resLength);
        });

        it('check events rendering', () => {
            let eventElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElements.length).toEqual(19);
            let eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
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
            let moreIndicators: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
            expect(moreIndicators.length).toEqual(4);
            expect(moreIndicators[0].innerHTML).toEqual('+1&nbsp;more');
            expect(moreIndicators[0].getAttribute('data-group-index')).toEqual('4');
            expect(moreIndicators[0].getAttribute('data-start-date')).toEqual(new Date(2018, 4, 3).getTime().toString());
            expect(moreIndicators[0].getAttribute('data-end-date')).toEqual(new Date(2018, 4, 4).getTime().toString());
            moreIndicators[0].click();
            let morePopup: HTMLElement = schObj.element.querySelector('.e-more-popup-wrapper') as HTMLElement;
            let eventElementList: Element[] = [].slice.call(morePopup.querySelectorAll('.e-more-appointment-wrapper .e-appointment'));
            expect(eventElementList.length).toEqual(2);
            expect(morePopup.classList).toContain('e-popup-open');
            triggerMouseEvent(morePopup.querySelector('.e-more-event-close'), 'click');
            expect(morePopup.classList).toContain('e-popup-close');
        });

        it('navigate next date', (done: Function) => {
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
            let dataBound: (args: Object) => void = (args: Object) => {
                expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-timeline-month');
                expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('June 2018');
                expect(schObj.element.querySelectorAll('.e-date-header-wrap table col').length).toEqual(30);
                let headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
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
                expect(headTrs[3].children[0].innerHTML).
                    toEqual('<span class="e-navigate" title="Friday, June 1, 2018">Jun 1</span>');
                expect(headTrs[3].children[0].getAttribute('data-date')).toEqual(new Date(2018, 5, 1).getTime().toString());

                expect(schObj.element.querySelectorAll('.e-resource-column-wrap table tbody tr').length).toEqual(resLength);
                expect(schObj.element.querySelectorAll('.e-resource-column-wrap table tbody tr td').length).toEqual(resLength);

                expect(schObj.element.querySelectorAll('.e-content-wrap table tbody tr').length).toEqual(resLength);
                expect(schObj.element.querySelectorAll('.e-content-wrap table col').length).toEqual(30);
                expect(schObj.element.querySelectorAll('.e-content-wrap table td').length).toEqual(30 * resLength);

                let firstWorkCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
                expect(firstWorkCell.parentElement.getAttribute('role')).toEqual('row');
                expect(firstWorkCell.getAttribute('role')).toEqual('gridcell');
                expect(firstWorkCell.getAttribute('aria-selected')).toEqual('false');
                expect(firstWorkCell.getAttribute('data-date')).toEqual(new Date(2018, 5, 1).getTime().toString());
                expect(firstWorkCell.getAttribute('data-group-index')).toEqual('0');
                expect(firstWorkCell.innerHTML).toEqual('');

                let data: CellClickEventArgs = schObj.getCellDetails(firstWorkCell);
                expect(data.startTime.getTime()).toEqual(new Date(2018, 5, 1).getTime());
                expect(data.endTime.getTime()).toEqual(new Date(2018, 5, 2).getTime());
                expect(data.isAllDay).toEqual(true);
                expect(data.groupIndex).toBe(0);

                expect(schObj.element.querySelectorAll('.e-work-hours,.e-work-days').length).toEqual(21 * resLength);

                let eventElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(eventElements.length).toEqual(0);
                let eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
                expect(eventWrapperList.length).toEqual(0);

                expect(schObj.element.querySelectorAll('.e-event-table > div').length).toEqual(resLength);
                done();
            };
            schObj.dataBound = dataBound;
        });

        it('navigate previous date', (done: Function) => {
            (schObj.element.querySelector('.e-toolbar-item.e-prev') as HTMLElement).click();
            let dataBound: (args: Object) => void = (args: Object) => {
                expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-timeline-month');
                expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('May 2018');
                expect(schObj.element.querySelectorAll('.e-date-header-wrap table col').length).toEqual(31);
                let headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
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
                expect(headTrs[3].children[0].innerHTML).
                    toEqual('<span class="e-navigate" title="Tuesday, May 1, 2018">May 1</span>');
                expect(headTrs[3].children[0].getAttribute('data-date')).toEqual(new Date(2018, 4, 1).getTime().toString());

                expect(schObj.element.querySelectorAll('.e-resource-column-wrap table tbody tr').length).toEqual(resLength);
                expect(schObj.element.querySelectorAll('.e-resource-column-wrap table tbody tr td').length).toEqual(resLength);

                expect(schObj.element.querySelectorAll('.e-content-wrap table tbody tr').length).toEqual(resLength);
                expect(schObj.element.querySelectorAll('.e-content-wrap table col').length).toEqual(31);
                expect(schObj.element.querySelectorAll('.e-content-wrap table td').length).toEqual(31 * resLength);

                let firstWorkCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
                expect(firstWorkCell.parentElement.getAttribute('role')).toEqual('row');
                expect(firstWorkCell.getAttribute('role')).toEqual('gridcell');
                expect(firstWorkCell.getAttribute('aria-selected')).toEqual('false');
                expect(firstWorkCell.getAttribute('data-date')).toEqual(new Date(2018, 4, 1).getTime().toString());
                expect(firstWorkCell.getAttribute('data-group-index')).toEqual('0');
                expect(firstWorkCell.innerHTML).toEqual('');

                let data: CellClickEventArgs = schObj.getCellDetails(firstWorkCell);
                expect(data.startTime.getTime()).toEqual(new Date(2018, 4, 1).getTime());
                expect(data.endTime.getTime()).toEqual(new Date(2018, 4, 2).getTime());
                expect(data.isAllDay).toEqual(true);
                expect(data.groupIndex).toBe(0);

                expect(schObj.element.querySelectorAll('.e-work-hours,.e-work-days').length).toEqual(23 * resLength);

                let eventElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(eventElements.length).toEqual(19);
                let eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
                expect(eventWrapperList.length).toEqual(9);

                expect(schObj.element.querySelectorAll('.e-event-table > div').length).toEqual(resLength);

                expect(eventElements[0].getAttribute('data-group-index')).toEqual('0');
                expect(eventElements[0].style.backgroundColor).toEqual('rgb(255, 170, 0)');

                expect(eventElements[1].getAttribute('data-group-index')).toEqual('1');
                expect(eventElements[1].style.backgroundColor).toEqual('rgb(248, 163, 152)');
                done();
            };
            schObj.dataBound = dataBound;
        });
    });
});