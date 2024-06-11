/* eslint-disable @typescript-eslint/no-explicit-any */
import { createElement, Browser, Internationalization, extend } from '@syncfusion/ej2-base';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import {
    Schedule, ScheduleModel, TimelineViews, TimelineMonth, EJ2Instance,
    CellClickEventArgs, SelectEventArgs, PopupOpenEventArgs
} from '../../../src/schedule/index';
import * as cls from '../../../src/schedule/base/css-constant';
import {
    timelineData, resourceData, timelineResourceData, resourceGroupData, levelBasedData
} from '../base/datasource.spec';
import { DateTimePicker } from '@syncfusion/ej2-calendars';
import { blockData } from '../base/datasource.spec';
import * as util from '../util.spec';
import { profile, inMB, getMemoryProfile } from '../../common.spec';

/**
 * Schedule Timeline Week view spec
 */
Schedule.Inject(TimelineViews, TimelineMonth);
const instance: Internationalization = new Internationalization();

describe('Schedule Timeline Week view', () => {
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
                currentView: 'TimelineWeek', views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek'],
                selectedDate: new Date(2017, 9, 4)
            };
            schObj = util.createSchedule(model, timelineData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('view class on container', () => {
            expect(schObj.element.querySelector('.e-timeline-view')).toBeTruthy();
        });

        it('check active view class on toolbar views', () => {
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-timeline-week');
        });

        it('check work cell elements count', () => {
            expect(schObj.getWorkCellElements().length).toEqual(48 * 7);
        });

        it('check all day row element', () => {
            expect(schObj.getAllDayRow()).toBeFalsy();
        });

        it('check date header cells text', () => {
            expect(schObj.element.querySelectorAll('.e-date-header-container .e-header-cells').length).toEqual(1 * 7);
            expect(schObj.element.querySelector('.e-header-date.e-navigate').innerHTML).toEqual('Oct 1, Sunday');
        });

        it('time cells', () => {
            expect(schObj.element.querySelectorAll('.e-header-row .e-time-cells').length * 2).
                toEqual(schObj.element.querySelectorAll('.e-content-wrap .e-content-table tbody td').length);
            expect(schObj.element.querySelectorAll('.e-header-row td')[7].innerHTML).toEqual('<span>12:00 AM</span>');
        });

        it('work cells', () => {
            const firstWorkCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
            expect(firstWorkCell.getAttribute('aria-selected')).toEqual('false');
            expect(firstWorkCell.getAttribute('aria-label')).toEqual('Sunday, October 1, 2017 at 12:00:00 AM GMT Ends At Sunday, October 1, 2017 at 12:30:00 AM GMT');
            expect(firstWorkCell.getAttribute('data-date')).toEqual(new Date(2017, 9, 1).getTime().toString());
            expect(firstWorkCell.innerHTML).toEqual('');
        });

        it('navigate next date', () => {
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
            expect(schObj.element.querySelectorAll('.e-date-header-container .e-header-cells').length).toEqual(1 * 7);
            expect(schObj.element.querySelector('.e-header-date.e-navigate').innerHTML).toEqual('Oct 8, Sunday');
        });

        it('navigate previous date', () => {
            (schObj.element.querySelector('.e-toolbar-item.e-prev') as HTMLElement).click();
            expect(schObj.element.querySelectorAll('.e-date-header-container .e-header-cells').length).toEqual(1 * 7);
            expect(schObj.element.querySelector('.e-header-date.e-navigate').innerHTML).toEqual('Oct 1, Sunday');
        });

        it('date header position', () => {
            const contentArea: HTMLElement = schObj.element.querySelector('.e-content-wrap') as HTMLElement;
            expect(contentArea.scrollLeft).toEqual(8100);
        });

        it('work hours highlight', () => {
            expect(schObj.element.querySelectorAll('.e-work-hours').length).toEqual(18 * 5);
        });

        it('Checking events elements', (done: DoneFn) => {
            schObj.dataBound = () => {
                const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(eventElementList.length).toEqual(25);
                const eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
                expect(eventWrapperList.length).toEqual(1);
                done();
            };
            schObj.selectedDate = new Date(2018, 4, 1);
            schObj.dataBind();
        });

        it('Checking left indicator icons', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[1].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Spanned Event - Previous week');
            expect(eventElementList[1].querySelectorAll('.e-appointment-details .e-indicator')[0].classList.contains('e-left-icon'))
                .toBeTruthy();
        });

        it('Checking right indicator icon', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[21].querySelectorAll('.e-appointment-details .e-indicator')[0].classList.contains('e-right-icon'))
                .toBeTruthy();
        });

        it('Checking recurrence icon', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[2].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Recurrence Event - Previous week');
            expect(eventElementList[2].querySelectorAll('.e-appointment-details .e-icons')[1].classList.contains('e-recurrence-icon'))
                .toBeTruthy();
        });

        it('Checking more indicator', () => {
            const moreIndicatorList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
            expect(moreIndicatorList.length).toEqual(2);
            const element: HTMLElement = moreIndicatorList[0] as HTMLElement;
            element.click();
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-appointment-wrapper .e-appointment'));
            expect(eventElementList.length).toEqual(11);
            const close: HTMLElement = <HTMLElement>schObj.element.querySelector('.e-more-event-close');
            close.click();
        });
        it('cell single click', () => {
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[120] as HTMLElement, 'click');
            const cellPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(cellPopup.classList).toContain('e-popup-open');
            (<HTMLInputElement>cellPopup.querySelector('.e-subject')).innerText = '';
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
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(120);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
        it('cell double click', () => {
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[120] as HTMLElement, 'dblclick');
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
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(120);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
        it('event single click', () => {
            const event: HTMLElement = schObj.element.querySelectorAll('.e-appointment')[1] as HTMLElement;
            util.triggerMouseEvent(event, 'click');
            const eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup.classList).toContain('e-popup-open');
            (<HTMLInputElement>eventPopup.querySelector('.' + cls.SUBJECT_CLASS)).innerText = 'Spanned Event - Same week';
            (<HTMLInputElement>eventPopup.querySelector('.e-date-time-details')).innerText =
                'April 30, 2018 (10:00 AM) - May 3, 2018 (1:00 PM)';
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
            (<HTMLInputElement>dialogElement.querySelector('.' + cls.SUBJECT_CLASS)).value = 'Spanned Event - Same week';
            const cancelButton: HTMLElement = dialogElement.querySelector('.e-event-cancel') as HTMLElement;
            cancelButton.click();
        });
    });

    describe('Start and End hour', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                height: '580px', currentView: 'TimelineWeek', startHour: '04:00', endHour: '11:00',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek'], selectedDate: new Date(2017, 9, 4)
            };
            schObj = util.createSchedule(model, timelineData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Checking elements', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-header-row .e-time-cells').length * 2).
                    toEqual(schObj.element.querySelectorAll('.e-content-wrap .e-content-table tbody td').length);
                expect(schObj.element.querySelectorAll('.e-header-row td')[7].innerHTML).toEqual('<span>8:00 AM</span>');
                expect(schObj.getWorkCellElements().length).toEqual(16 * 7);
                expect(schObj.element.querySelectorAll('.e-work-hours').length).toEqual(14 * 5);
                done();
            };
            expect(schObj.getWorkCellElements().length).toEqual(14 * 7);
            expect(schObj.element.querySelectorAll('.e-work-hours').length).toEqual(4 * 5);
            expect(schObj.element.querySelectorAll('.e-header-row .e-time-cells').length * 2).
                toEqual(schObj.element.querySelectorAll('.e-content-wrap .e-content-table tbody td').length);
            expect(schObj.element.querySelectorAll('.e-header-row td')[7].innerHTML).toEqual('<span>4:00 AM</span>');
            schObj.startHour = '08:00';
            schObj.endHour = '16:00';
            schObj.dataBind();
        });

        it('Checking events elements', (done: DoneFn) => {
            schObj.dataBound = () => {
                const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(eventElementList.length).toEqual(25);
                const eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
                expect(eventWrapperList.length).toEqual(1);
                done();
            };
            schObj.selectedDate = new Date(2018, 4, 1);
            schObj.dataBind();
        });

        it('Checking left indicator icons', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[1].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Spanned Event - Previous week');
            expect(eventElementList[1].querySelectorAll('.e-appointment-details .e-indicator')[0].classList.contains('e-left-icon'))
                .toBeTruthy();
        });

        it('Checking right indicator icon', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[21].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('All Day Event - Next week');
            expect(eventElementList[21].querySelectorAll('.e-appointment-details .e-indicator')[0].classList.contains('e-right-icon'))
                .toBeTruthy();
        });

        it('Checking recurrence icon', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[2].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Recurrence Event - Previous week');
            expect(eventElementList[2].querySelectorAll('.e-appointment-details .e-icons')[1].classList.contains('e-recurrence-icon'))
                .toBeTruthy();
        });

        it('Checking more indicator', () => {
            const moreIndicatorList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
            expect(moreIndicatorList.length).toEqual(2);
        });

        it('Checking right indicator icon between dates', (done: DoneFn) => {
            schObj.dataBound = () => {
                const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(eventElementList[17].querySelectorAll('.e-appointment-details .e-indicator')[0].classList.contains('e-right-icon'))
                    .toBeTruthy();
                expect((eventElementList[17] as HTMLElement).offsetWidth).toEqual(200);
                done();
            };
            const eventData: Record<string, any> = {
                Id: 1,
                Subject: 'Two days spanned',
                StartTime: new Date(2018, 4, 2, 14, 0),
                EndTime: new Date(2018, 4, 3, 6, 0)
            };
            schObj.addEvent(eventData);
        });
    });

    describe('Show Weekend', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                height: '580px', currentView: 'TimelineWeek', views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek'],
                selectedDate: new Date(2017, 9, 5), showWeekend: false
            };
            schObj = util.createSchedule(model, timelineData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Checking elements - initial', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelector('.e-header-date.e-navigate').innerHTML).toEqual('Oct 9, Monday');
                done();
            };
            expect(schObj.getWorkCellElements().length).toEqual(48 * 5);
            expect(schObj.element.querySelector('.e-header-date.e-navigate').innerHTML).toEqual('Oct 2, Monday');
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
        });

        it('Checking elements - date navigation-1', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelector('.e-header-date.e-navigate').innerHTML).toEqual('Oct 16, Monday');
                done();
            };
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
        });

        it('Checking elements - date navigation-2', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelector('.e-header-date.e-navigate').innerHTML).toEqual('Oct 9, Monday');
                done();
            };
            (schObj.element.querySelector('.e-toolbar-item.e-prev') as HTMLElement).click();
        });

        it('Checking elements - show weekend as true', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.getWorkCellElements().length).toEqual(48 * 7);
                expect(schObj.element.querySelector('.e-header-date.e-navigate').innerHTML).toEqual('Oct 8, Sunday');
                done();
            };
            schObj.showWeekend = true;
            schObj.dataBind();
        });

        it('Checking events elements', (done: DoneFn) => {
            schObj.dataBound = () => {
                const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(eventElementList.length).toEqual(25);
                const eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
                expect(eventWrapperList.length).toEqual(1);
                done();
            };
            schObj.selectedDate = new Date(2018, 4, 1);
            schObj.dataBind();
        });

        it('Checking left indicator icons', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[1].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Spanned Event - Previous week');
            expect(eventElementList[1].querySelectorAll('.e-appointment-details .e-indicator')[0].classList.contains('e-left-icon'))
                .toBeTruthy();
        });

        it('Checking right indicator icon', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[21].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('All Day Event - Next week');
            expect(eventElementList[21].querySelectorAll('.e-appointment-details .e-indicator')[0].classList.contains('e-right-icon'))
                .toBeTruthy();
        });

        it('Checking recurrence icon', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[2].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Recurrence Event - Previous week');
            expect(eventElementList[2].querySelectorAll('.e-appointment-details .e-icons')[1].classList.contains('e-recurrence-icon'))
                .toBeTruthy();
        });

        it('Checking more indicator', () => {
            const moreIndicatorList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
            expect(moreIndicatorList.length).toEqual(2);
        });
    });

    describe('Work Days', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                height: '580px', currentView: 'TimelineWeek', views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek'],
                selectedDate: new Date(2017, 9, 5), workDays: [0, 1, 3, 4]
            };
            schObj = util.createSchedule(model, timelineData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Checking elements - initial', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.getWorkCellElements().length).toEqual(48 * 7);
                expect(schObj.element.querySelectorAll('.e-work-hours').length).toEqual(18 * 3);
                done();
            };
            expect(schObj.getWorkCellElements().length).toEqual(48 * 7);
            expect(schObj.element.querySelectorAll('.e-work-hours').length).toEqual(18 * 4);
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
            expect(schObj.element.querySelectorAll('.e-work-hours').length).toEqual(18 * 4);
            schObj.workDays = [0, 2, 3];
            schObj.dataBind();
        });

        it('Checking elements - setmodel testing', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.getWorkCellElements().length).toEqual(48 * 3);
                expect(schObj.element.querySelectorAll('.e-work-hours').length).toEqual(18 * 3);
                done();
            };
            schObj.showWeekend = false;
            schObj.dataBind();
        });

        it('Checking events elements', (done: DoneFn) => {
            schObj.dataBound = () => {
                const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(eventElementList.length).toEqual(23);
                const eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
                expect(eventWrapperList.length).toEqual(1);
                done();
            };
            schObj.selectedDate = new Date(2018, 4, 1);
            schObj.workDays = [1, 2, 3, 4, 5];
            schObj.dataBind();
        });

        it('Checking left indicator icons', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[0].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('All Day Event - Previous week');
            expect(eventElementList[0].querySelectorAll('.e-appointment-details .e-indicator')[0].classList.contains('e-left-icon'))
                .toBeTruthy();
        });

        it('Checking right indicator icon', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[20].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Recurrence Event - Next week');
            expect(eventElementList[20].querySelectorAll('.e-appointment-details .e-indicator')[0].classList.contains('e-right-icon'))
                .toBeTruthy();
        });

        it('Checking recurrence icon', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[2].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Recurrence Event - Previous week');
            expect(eventElementList[2].querySelectorAll('.e-appointment-details .e-icons')[1].classList.contains('e-recurrence-icon'))
                .toBeTruthy();
        });

        it('Checking more indicator', () => {
            const moreIndicatorList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
            expect(moreIndicatorList.length).toEqual(2);
        });
    });

    describe('First Day of Week', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                height: '580px', currentView: 'TimelineWeek', views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek'],
                selectedDate: new Date(2017, 9, 5), firstDayOfWeek: 2
            };
            schObj = util.createSchedule(model, timelineData, done);
        });
        afterAll(() => {
            const activeView: any = schObj.activeView;
            util.destroy(schObj);
            activeView.changeCurrentTimePosition();
        });

        it('Checking elements', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelector('.e-header-date.e-navigate').innerHTML).toEqual('Oct 2, Monday');
                done();
            };
            expect(schObj.getWorkCellElements().length).toEqual(48 * 7);
            expect(schObj.element.querySelector('.e-header-date.e-navigate').innerHTML).toEqual('Oct 3, Tuesday');
            schObj.firstDayOfWeek = 1;
            schObj.dataBind();
        });

        it('Checking events elements', (done: DoneFn) => {
            schObj.dataBound = () => {
                const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(eventElementList.length).toEqual(25);
                const eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
                expect(eventWrapperList.length).toEqual(1);
                done();
            };
            schObj.selectedDate = new Date(2018, 4, 1);
            schObj.dataBind();
        });

        it('Checking left indicator icons', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[0].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('All Day Event - Previous week');
            expect(eventElementList[0].querySelectorAll('.e-appointment-details .e-indicator')[0].classList.contains('e-left-icon'))
                .toBeTruthy();
        });

        it('Checking right indicator icon', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[20].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Recurrence Event - Next week');
            expect(eventElementList[20].querySelectorAll('.e-appointment-details .e-indicator')[0].classList.contains('e-right-icon'))
                .toBeTruthy();
        });

        it('Checking recurrence icon', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[2].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Recurrence Event - Previous week');
            expect(eventElementList[2].querySelectorAll('.e-appointment-details .e-icons')[1].classList.contains('e-recurrence-icon'))
                .toBeTruthy();
        });

        it('Checking more indicator', () => {
            const moreIndicatorList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
            expect(moreIndicatorList.length).toEqual(2);
        });

        it('Checking current time indicator with different firstDayOfWeek', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-current-time').length).toEqual(1);
                done();
            };
            schObj.selectedDate = new Date();
            schObj.dataBind();
        });
    });

    describe('Getting Week numbers while changing weekRule property', () => {
        let schObj: Schedule;
        beforeAll(() => {
            const schOptions: ScheduleModel = {
                selectedDate: new Date(2020, 11, 29),
                height: '600px', width: '1000px', currentView: 'TimelineWeek',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek', 'TimelineMonth'],
                headerRows: [{ option: 'Year' }, { option: 'Month' }, { option: 'Week' }, { option: 'Date' }, { option: 'Hour' }],
                showWeekNumber: true
            };
            schObj = util.createSchedule(schOptions, []);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Week number testing for when weekRule set to FirstDay', () => {
            schObj.weekRule = 'FirstDay';
            expect((schObj.element.querySelector('.e-header-week-cell') as HTMLElement).innerText).toBe('1');
        });
        it('Week number testing for when weekRule set to FirstFourDayWeek', () => {
            schObj.weekRule = 'FirstFourDayWeek';
            schObj.dataBind();
            expect((schObj.element.querySelector('.e-header-week-cell') as HTMLElement).innerText).toBe('53');
        });
        it('Week number testing for when weekRule set to FirstFullWeek', () => {
            schObj.weekRule = 'FirstFullWeek';
            schObj.dataBind();
            expect((schObj.element.querySelector('.e-header-week-cell') as HTMLElement).innerText).toBe('52');
        });
    });

    describe('Event rendering- RTL', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                height: '580px', currentView: 'TimelineWeek', enableRtl: true,
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek'], selectedDate: new Date(2018, 4, 1)
            };
            schObj = util.createSchedule(model, timelineData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Initial Load', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList.length).toEqual(25);
            const eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
            expect(eventWrapperList.length).toEqual(1);
        });

        it('Checking left indicator icons', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[1].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Spanned Event - Previous week');
            expect(eventElementList[1].querySelectorAll('.e-appointment-details .e-indicator')[0].classList.contains('e-left-icon'))
                .toBeTruthy();
        });

        it('Checking right indicator icon', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[21].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('All Day Event - Next week');
            expect(eventElementList[21].querySelectorAll('.e-appointment-details .e-indicator')[0].classList.contains('e-right-icon'))
                .toBeTruthy();
        });

        it('Checking recurrence icon', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[2].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Recurrence Event - Previous week');
            expect(eventElementList[2].querySelectorAll('.e-appointment-details .e-icons')[1].classList.contains('e-recurrence-icon'))
                .toBeTruthy();
        });

        it('Checking more indicator', () => {
            const moreIndicatorList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
            expect(moreIndicatorList.length).toEqual(2);
        });
    });

    describe('Dependent properties', () => {
        let schObj: Schedule;
        beforeEach(() => {
            schObj = undefined;
            jasmine.clock().install();
        });
        afterEach(() => {
            util.destroy(schObj);
            jasmine.clock().uninstall();
        });

        it('width and height', () => {
            const model: ScheduleModel = {
                height: '600px', width: '500px', currentView: 'TimelineWeek',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek'], selectedDate: new Date(2017, 9, 4)
            };
            schObj = util.createSchedule(model, []);
            expect(schObj.element.style.width).toEqual('500px');
            expect(schObj.element.style.height).toEqual('600px');
            expect(schObj.element.offsetWidth).toEqual(500);
            expect(schObj.element.offsetHeight).toEqual(600);
        });

        it('work hours start and end', () => {
            const model: ScheduleModel = {
                currentView: 'TimelineWeek', views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek'], selectedDate: new Date(2017, 9, 4),
                workHours: { highlight: true, start: '10:00', end: '16:00' }
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

        it('date format', () => {
            const model: ScheduleModel = {
                currentView: 'TimelineWeek', views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek'],
                selectedDate: new Date(2017, 9, 5), dateFormat: 'MMM dd yyyy'
            };
            schObj = util.createSchedule(model, []);
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('Oct 01 2017 - Oct 07 2017');

            schObj.dateFormat = 'dd MMM yyyy';
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('01 Oct 2017 - 07 Oct 2017');
        });

        it('date header template', () => {
            const model: ScheduleModel = {
                currentView: 'TimelineWeek', views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek'], selectedDate: new Date(2017, 9, 5),
                dateHeaderTemplate: '<span>${getDateHeaderText(data.date)}</span>'
            };
            schObj = util.createSchedule(model, []);
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML).toEqual('<span>Sun, 10/1</span>');
            schObj.dateHeaderTemplate = '<span>${getShortDateTime(data.date)}</span>';
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML).
                toEqual('<span>10/1/17, 12:00 AM</span>');
        });

        it('dateRange template', () => {
            const model: ScheduleModel = {
                currentView: 'TimelineWeek', views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek'],
                selectedDate: new Date(2017, 9, 5),
                dateRangeTemplate: '<div class="date-text">${(data.startDate).getMonth()}-${(data.endDate).getMonth()}</div>'
            };
            schObj = util.createSchedule(model, []);
            expect(schObj.element.querySelector('.e-tbar-btn-text').innerHTML).toEqual('<div class="date-text">9-9</div>');
            schObj.dateRangeTemplate = '<div>${getShortDateTime(data.startDate)}-${getShortDateTime(data.endDate)}</div>';
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-tbar-btn-text').innerHTML).toEqual('<div>10/1/17, 12:00 AM-10/7/17, 12:00 AM</div>');
        });

        it('cell template', () => {
            const templateEle: HTMLElement = createElement('div', { innerHTML: '<span class="custom-element"></span>' });
            const model: ScheduleModel = {
                currentView: 'TimelineWeek', views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek'],
                selectedDate: new Date(2017, 9, 5), cellTemplate: templateEle.innerHTML
            };
            schObj = util.createSchedule(model, []);
            expect(schObj.element.querySelectorAll('.custom-element').length).toEqual(48 * 7);
            schObj.cellTemplate = '<span>${getShortDateTime(data.date)}</span>';
            schObj.dataBind();
            expect(schObj.element.querySelectorAll('.e-work-cells')[3].innerHTML).toEqual('<span>10/1/17, 1:30 AM</span>');
        });

        it('check current date class', () => {
            const model: ScheduleModel = { currentView: 'TimelineWeek', views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek'] };
            schObj = util.createSchedule(model, []);
            expect(schObj.element.querySelector('.e-date-header-container .e-current-day').classList).toContain('e-header-cells');
        });

        it('current time indicator', () => {
            const model: ScheduleModel = { currentView: 'TimelineWeek', views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek'] };
            schObj = util.createSchedule(model, []);
            const date: string = instance.formatDate(new Date(), { format: schObj.activeViewOptions.timeFormat, type: 'time' });
            expect(schObj.element.querySelector('.e-date-header-wrap .e-current-time').innerHTML).toEqual(date);
            expect(schObj.element.querySelectorAll('.e-current-time').length).toEqual(1);
            jasmine.clock().tick(60050);
            expect(schObj.element.querySelectorAll('.e-current-time').length).toEqual(1);
            schObj.showTimeIndicator = false;
            schObj.dataBind();
            expect(schObj.element.querySelectorAll('.e-current-time').length).toEqual(0);
        });

        it('work cell click', () => {
            const model: ScheduleModel = {
                currentView: 'TimelineWeek', views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek'], selectedDate: new Date(2017, 9, 5)
            };
            schObj = util.createSchedule(model, []);
            const firstWorkCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
            expect(firstWorkCell.classList).not.toContain('e-selected-cell');
            expect(firstWorkCell.getAttribute('aria-selected')).toEqual('false');
            firstWorkCell.click();
            expect(firstWorkCell.classList).toContain('e-selected-cell');
            expect(firstWorkCell.getAttribute('aria-selected')).toEqual('true');
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
        });

        it('minDate and maxDate', () => {
            const model: ScheduleModel = {
                currentView: 'TimelineWeek',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek', 'Agenda'],
                minDate: new Date(2017, 8, 28),
                selectedDate: new Date(2017, 9, 5),
                maxDate: new Date(2017, 9, 12)
            };
            schObj = util.createSchedule(model, []);
            const prevButton: HTMLElement = schObj.element.querySelector('.' + cls.PREVIOUS_DATE_CLASS + ' button');
            const nextButton: HTMLElement = schObj.element.querySelector('.' + cls.NEXT_DATE_CLASS + ' button');
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
            (schObj.element.querySelectorAll('.e-header-cells .e-navigate')[0] as HTMLElement).click();
            expect(schObj.currentView).toEqual('Agenda');
            schObj.currentView = 'TimelineWeek';
            schObj.minDate = new Date(2017, 9, 2);
            schObj.selectedDate = new Date(2017, 9, 4);
            schObj.maxDate = new Date(2017, 9, 6);
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('October 01 - 07, 2017');
            expect(prevButton.getAttribute('aria-disabled')).toEqual('true');
            expect(nextButton.getAttribute('aria-disabled')).toEqual('true');
            (schObj.element.querySelectorAll('.e-header-cells .e-navigate')[0] as HTMLElement).click();
            expect(schObj.currentView).toEqual('TimelineWeek');
        });
    });

    describe('Template', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                height: '580px', selectedDate: new Date(2018, 4, 1), currentView: 'TimelineWeek',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek'], eventSettings: { template: '<span>${Subject}</span>' }
            };
            schObj = util.createSchedule(model, timelineData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Events template', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList.length).toEqual(25);
            expect(eventElementList[0].querySelector('.e-appointment-details').innerHTML).toEqual(
                '<div class="e-indicator e-icons e-left-icon"></div><span>All Day Event - Previous week</span>');
            expect(eventElementList[2].querySelector('.e-appointment-details span').innerHTML).toEqual('Recurrence Event - Previous week');
            expect(eventElementList[2].querySelectorAll('.e-appointment-details .e-indicator')[0].classList.contains('e-left-icon'))
                .toBeTruthy();
            const moreIndicatorList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
            expect(moreIndicatorList.length).toEqual(2);
            expect(moreIndicatorList[0].innerHTML).toEqual('+1&nbsp;more');
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

        it('cell select', () => {
            let eventName1: string;
            let eventName2: string;
            let eventName3: string;
            const model: ScheduleModel = {
                select: (args: SelectEventArgs) => eventName1 = args.name,
                cellClick: (args: CellClickEventArgs) => eventName2 = args.name,
                popupOpen: (args: PopupOpenEventArgs) => eventName3 = args.name,
                currentView: 'TimelineWeek', views: ['TimelineWeek'], selectedDate: new Date(2018, 5, 5)
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

        it('multi cell select', () => {
            let eventName: string;
            const model: ScheduleModel = {
                select: (args: SelectEventArgs) => eventName = args.name,
                currentView: 'TimelineWeek', views: ['TimelineWeek'], selectedDate: new Date(2018, 5, 5)
            };
            schObj = util.createSchedule(model, []);
            const workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(0);
            util.triggerMouseEvent(workCells[3], 'mousedown');
            util.triggerMouseEvent(workCells[5], 'mousemove');
            util.triggerMouseEvent(workCells[5], 'mouseup');
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
                currentView: 'TimelineWeek', views: ['TimelineWeek'], selectedDate: new Date(2018, 5, 5)
            };
            schObj = util.createSchedule(model, []);
            const workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(0);
            util.triggerMouseEvent(workCells[3], 'mousedown');
            util.triggerMouseEvent(workCells[5], 'mousemove');
            util.triggerMouseEvent(workCells[5], 'mouseup');
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(3);
            expect(schObj.activeCellsData.startTime).toEqual(new Date(2018, 5, 3, 1, 30, 0));
            expect(schObj.activeCellsData.endTime).toEqual(new Date(2018, 5, 3, 3, 0, 0));
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
                currentView: 'TimelineWeek', views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek'],
                selectedDate: new Date(2018, 5, 5)
            };
            schObj = util.createSchedule(model, []);
            (schObj.element.querySelectorAll('.e-work-cells')[3] as HTMLElement).click();
            expect(cellStartTime).toEqual(new Date(2018, 5, 3, 1, 30).getTime());
            expect(cellEndTime).toEqual(new Date(2018, 5, 3, 2).getTime());
            expect(eventName).toEqual('cellClick');
        });

        it('cancel cell click', () => {
            const model: ScheduleModel = {
                cellClick: (args: CellClickEventArgs) => args.cancel = true,
                currentView: 'TimelineWeek', views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek'],
                selectedDate: new Date(2018, 5, 5)
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
                currentView: 'TimelineWeek', views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek'],
                selectedDate: new Date(2018, 5, 5)
            };
            schObj = util.createSchedule(model, []);
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[3] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[3] as HTMLElement, 'dblclick');
            expect(cellStartTime).toEqual(new Date(2018, 5, 3, 1, 30).getTime());
            expect(cellEndTime).toEqual(new Date(2018, 5, 3, 2).getTime());
            expect(eventName).toEqual('cellDoubleClick');
        });

        it('cancel cell double click', () => {
            const model: ScheduleModel = {
                cellDoubleClick: (args: CellClickEventArgs) => args.cancel = true,
                currentView: 'TimelineWeek',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek'], selectedDate: new Date(2018, 5, 5)
            };
            schObj = util.createSchedule(model, []);
            const workCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[3] as HTMLElement;
            util.triggerMouseEvent(workCell, 'click');
            util.triggerMouseEvent(workCell, 'dblclick');
        });
    });

    describe('Public methods', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                height: '500px', selectedDate: new Date(2017, 9, 4),
                currentView: 'TimelineWeek', views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek']
            };
            schObj = util.createSchedule(model, [], done);
        });
        afterAll((): void => {
            util.destroy(schObj);
        });

        it('getCellDetails', () => {
            const data: CellClickEventArgs = schObj.getCellDetails(schObj.element.querySelector('.e-work-cells'));
            expect(data.startTime.getTime()).toEqual(new Date(2017, 9, 1).getTime());
            expect(data.endTime.getTime()).toEqual(new Date(2017, 9, 1, 0, 30).getTime());
            expect(data.isAllDay).toEqual(false);
        });

        it('setWorkHours', () => {
            schObj.workHours.highlight = false;
            schObj.dataBind();
            schObj.setWorkHours([new Date(2017, 9, 5)], '04:00', '08:00');
            const workHourCells: HTMLTableCellElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-hours'));
            expect(workHourCells.length).toEqual(8);
            expect(workHourCells[0].cellIndex).toEqual(200);
            expect(workHourCells[workHourCells.length - 1].cellIndex).toEqual(207);
            schObj.setWorkHours([new Date(2017, 9, 5)], '16:00', '20:00');
            expect(schObj.element.querySelectorAll('.e-work-hours').length).toEqual(16);
            schObj.setWorkHours([new Date(2017, 9, 5)], '16', '20');
            expect(schObj.element.querySelectorAll('.e-work-hours').length).toEqual(16);
        });

        it('setWorkHours while start and end hour set', () => {
            schObj.startHour = '04:00';
            schObj.endHour = '17:00';
            schObj.dataBind();
            schObj.setWorkHours([new Date(2017, 9, 5)], '03:00', '07:00');
            expect(schObj.element.querySelectorAll('.e-work-hours').length).toEqual(6);
            schObj.setWorkHours([new Date(2017, 9, 5)], '16:00', '20:00');
            expect(schObj.element.querySelectorAll('.e-work-hours').length).toEqual(8);
        });

        it('setWorkHours while date not in range', () => {
            schObj.startHour = '04:00';
            schObj.endHour = '16:00';
            schObj.dataBind();
            schObj.setWorkHours([new Date(2017, 9, 6)], '03:00', '07:00');
            expect(schObj.element.querySelectorAll('.e-work-hours').length).toEqual(6);
        });

        it('scrollTo', () => {
            schObj.scrollTo('06:00');
            const contentArea: HTMLElement = schObj.element.querySelector('.e-content-wrap') as HTMLElement;
            expect(contentArea.scrollLeft).toEqual(200);
        });

        it('scrollTo empty hour', () => {
            schObj.scrollTo('');
            const contentArea: HTMLElement = schObj.element.querySelector('.e-content-wrap') as HTMLElement;
            expect(contentArea.scrollLeft).toEqual(200);
        });

        it('scrollTo particular date and hour', () => {
            schObj.scrollTo('04:00', new Date(2017, 9, 6));
            const contentArea: HTMLElement = schObj.element.querySelector('.e-content-wrap') as HTMLElement;
            expect(contentArea.scrollLeft).toEqual(6000);
        });

        it('addEvent & getEventDetails', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(1);
                const appElem: Element = schObj.element.querySelector('.e-appointment');
                const app: Record<string, any> = schObj.getEventDetails(appElem);
                expect(app.Subject).toEqual('added');
                done();
            };
            schObj.addEvent({
                Id: 1,
                Subject: 'added',
                StartTime: new Date(2017, 9, 5, 10, 30),
                EndTime: new Date(2017, 9, 5, 13, 0)
            });
        });

        it('deleteEvent', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(0);
                done();
            };
            schObj.deleteEvent(1);
        });

        it('getCurrentViewEvents & getEvents', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.getCurrentViewEvents().length).toEqual(1);
                done();
            };
            schObj.addEvent({
                Id: 1,
                Subject: 'added',
                StartTime: new Date(2017, 9, 5, 10, 30),
                EndTime: new Date(2017, 9, 5, 13, 0)
            });
        });

        it('getEvents', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.getEvents().length).toEqual(2);
                done();
            };
            schObj.addEvent({
                Id: 1,
                Subject: 'added',
                StartTime: new Date(2017, 9, 5, 10, 30),
                EndTime: new Date(2017, 9, 5, 13, 0)
            });
        });

        it('getCurrentViewDates', () => {
            const dateLength: number = schObj.getCurrentViewDates().length;
            expect(schObj.element.querySelectorAll('.e-header-cells').length).toEqual(dateLength);
        });

        it('isSlotAvailable', (done: DoneFn) => {
            schObj.dataBound = () => {
                const startTime: Date = new Date(2017, 9, 5, 10, 0);
                const endTime: Date = new Date(2017, 9, 5, 13, 0);
                expect(schObj.isSlotAvailable(startTime, endTime)).toEqual(false);
                done();
            };
            schObj.addEvent({
                Id: 1,
                Subject: 'added',
                StartTime: new Date(2017, 9, 5, 10, 30),
                EndTime: new Date(2017, 9, 5, 13, 0)
            });
        });
    });

    describe('Scroll to workhour when currentDate set to selectedDate', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                height: '500px', selectedDate: new Date(2020, 0, 22, 10, 30, 30),
                currentView: 'TimelineWeek', views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek'],
                workHours: {
                    highlight: true,
                    start: '06:00'
                }
            };
            schObj = util.createSchedule(model, [], done);
        });
        afterAll((): void => {
            util.destroy(schObj);
        });

        it('ScrollLeft', () => {
            const contentArea: HTMLElement = schObj.element.querySelector('.e-content-wrap') as HTMLElement;
            expect(contentArea.scrollLeft).toEqual(7800);
        });
    });

    describe('Public methods with resource rendering', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                height: '550px', width: '100%', currentView: 'TimelineWeek',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek'],
                group: { resources: ['Owners'] },
                resources: [{
                    field: 'OwnerId', title: 'Owner', name: 'Owners', allowMultiple: true,
                    dataSource: [
                        { OwnerText: 'Nancy', Id: 1, OwnerColor: '#ffaa00' },
                        { OwnerText: 'Steven', Id: 2, OwnerColor: '#f8a398' },
                        { OwnerText: 'Michael', Id: 3, OwnerColor: '#7499e1' },
                        { OwnerText: 'Oliver', Id: 4, OwnerColor: '#ffaa00' },
                        { OwnerText: 'John', Id: 5, OwnerColor: '#f8a398' }
                    ],
                    textField: 'OwnerText', idField: 'Id', colorField: 'OwnerColor'
                }],
                selectedDate: new Date(2017, 9, 4)
            };
            schObj = util.createSchedule(model, [], done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('getCellDetails', () => {
            const data: CellClickEventArgs = schObj.getCellDetails(schObj.element.querySelector('.e-work-cells'));
            expect(data.startTime.getTime()).toEqual(new Date(2017, 9, 1).getTime());
            expect(data.endTime.getTime()).toEqual(new Date(2017, 9, 1, 0, 30).getTime());
            expect(data.isAllDay).toEqual(false);
            expect(data.groupIndex).toEqual(0);
        });

        it('setWorkHours', () => {
            schObj.workHours.highlight = false;
            schObj.dataBind();
            schObj.setWorkHours([new Date(2017, 9, 5)], '04:00', '08:00', 0);
            const workHourCells: HTMLTableCellElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-hours'));
            expect(workHourCells.length).toEqual(8);
            expect(workHourCells[0].cellIndex).toEqual(200);
            expect(workHourCells[workHourCells.length - 1].cellIndex).toEqual(207);
            schObj.setWorkHours([new Date(2017, 9, 5)], '16:00', '20:00', 0);
            expect(schObj.element.querySelectorAll('.e-work-hours[data-group-index="0"]').length).toEqual(16);
            expect(schObj.element.querySelectorAll('.e-work-hours').length).toEqual(16);
            schObj.setWorkHours([new Date(2017, 9, 5)], '16', '20', 0);
            expect(schObj.element.querySelectorAll('.e-work-hours').length).toEqual(16);
        });

        it('setWorkHours while start and end hour set', () => {
            schObj.startHour = '04:00';
            schObj.endHour = '17:00';
            schObj.dataBind();
            schObj.setWorkHours([new Date(2017, 9, 5)], '03:00', '07:00', 0);
            expect(schObj.element.querySelectorAll('.e-work-hours').length).toEqual(6);
            schObj.setWorkHours([new Date(2017, 9, 5)], '16:00', '20:00', 0);
            expect(schObj.element.querySelectorAll('.e-work-hours').length).toEqual(8);
        });

        it('setWorkHours while date not in range', () => {
            schObj.startHour = '04:00';
            schObj.endHour = '16:00';
            schObj.dataBind();
            schObj.setWorkHours([new Date(2017, 9, 6)], '03:00', '07:00', 0);
            expect(schObj.element.querySelectorAll('.e-work-hours').length).toEqual(6);
        });

        it('scrollTo', () => {
            schObj.scrollTo('06:00');
            const contentArea: HTMLElement = schObj.element.querySelector('.e-content-wrap') as HTMLElement;
            expect(contentArea.scrollLeft).toEqual(200);
        });

        it('scrollTo empty hour', () => {
            schObj.scrollTo('');
            const contentArea: HTMLElement = schObj.element.querySelector('.e-content-wrap') as HTMLElement;
            expect(contentArea.scrollLeft).toEqual(200);
        });

        it('addEvent & getEventDetails', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(1);
                const appElem: Element = schObj.element.querySelector('.e-appointment');
                const app: Record<string, any> = schObj.getEventDetails(appElem);
                expect(app.Subject).toEqual('added');
                done();
            };
            schObj.addEvent({
                Id: 1,
                Subject: 'added',
                StartTime: new Date(2017, 9, 5, 10, 30),
                EndTime: new Date(2017, 9, 5, 13, 0),
                OwnerId: 1
            });
        });

        it('deleteEvent', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(0);
                done();
            };
            schObj.deleteEvent(1);
        });

        it('getCurrentViewEvents', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.getCurrentViewEvents().length).toEqual(1);
                done();
            };
            schObj.addEvent({
                Id: 1,
                Subject: 'added',
                StartTime: new Date(2017, 9, 5, 10, 30),
                EndTime: new Date(2017, 9, 5, 13, 0),
                OwnerId: 1
            });
        });

        it('getEvents', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.getEvents().length).toEqual(2);
                done();
            };
            schObj.addEvent({
                Id: 1,
                Subject: 'added',
                StartTime: new Date(2017, 9, 5, 10, 30),
                EndTime: new Date(2017, 9, 5, 13, 0),
                OwnerId: 1
            });
        });

        it('getCurrentViewDates', () => {
            const dateLength: number = schObj.getCurrentViewDates().length;
            expect(schObj.element.querySelectorAll('.e-header-cells').length).toEqual(dateLength);
        });

        it('isSlotAvailable', (done: DoneFn) => {
            schObj.dataBound = () => {
                const startTime: Date = new Date(2017, 9, 5, 10, 0);
                const endTime: Date = new Date(2017, 9, 5, 13, 0);
                expect(schObj.isSlotAvailable(startTime, endTime, 0)).toEqual(false);
                done();
            };
            schObj.addEvent({
                Id: 1,
                Subject: 'added',
                StartTime: new Date(2017, 9, 5, 10, 30),
                EndTime: new Date(2017, 9, 5, 13, 0),
                OwnerId: 1
            });
        });
    });

    describe('Single level resource rendering', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                height: '550px', width: '100%', currentView: 'TimelineWeek',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek'],
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
            const headerRow: HTMLElement = schObj.element.querySelector('.e-timeline-view tr') as HTMLElement;
            expect(headerRow.children.length).toEqual(2);
            const firstTD: HTMLElement = schObj.element.querySelector('.e-timeline-view tr td.e-resource-left-td') as HTMLElement;
            expect([firstTD].length).toEqual(1);
            expect(firstTD.querySelector('.e-resource-text').innerHTML).toEqual('');
        });
        it('checking resource tree rendering', () => {
            const contentRow: HTMLElement = schObj.element.querySelector('.e-timeline-view table tbody') as HTMLElement;
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
            expect(eventElementList.length).toEqual(18);
            const eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
            expect(eventWrapperList.length).toEqual(10);
        });

        it('Checking Left icon', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[13].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('All Day Event - Previous week');
            expect(eventElementList[13].querySelectorAll('.e-appointment-details .e-indicator')[0].classList.contains('e-left-icon'))
                .toBeTruthy();
        });

        it('Checking right icon', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[8].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Recurrence Event - Less than 24');
            expect(eventElementList[8].querySelectorAll('.e-appointment-details .e-indicator')[0].classList.contains('e-right-icon'))
                .toBeTruthy();
        });

        it('Checking right icon', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[8].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Recurrence Event - Less than 24');
            expect(eventElementList[8].querySelectorAll('.e-appointment-details .e-icons')[0].classList.contains('e-recurrence-icon'))
                .toBeTruthy();
        });

        it('More event element checking', () => {
            const moreIndicatorList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
            expect(moreIndicatorList.length).toEqual(101);
            const element: HTMLElement = moreIndicatorList[0] as HTMLElement;
            element.click();
            const morePopup: HTMLElement = schObj.element.querySelector('.e-more-popup-wrapper') as HTMLElement;
            const moreEventList: Element[] = [].slice.call(morePopup.querySelectorAll('.e-more-appointment-wrapper .e-appointment'));
            expect(moreEventList.length).toEqual(2);
            util.triggerMouseEvent(morePopup.querySelector('.e-more-event-close'), 'click');
        });
    });

    describe('Multi level resource rendering', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                height: '550px', width: '100%', currentView: 'TimelineWeek',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek'],
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
            const headerRow: HTMLElement = schObj.element.querySelector('.e-timeline-view tr') as HTMLElement;
            expect(headerRow.children.length).toEqual(2);
            const firstTD: HTMLElement = schObj.element.querySelector('.e-timeline-view tr td.e-resource-left-td') as HTMLElement;
            expect([firstTD].length).toEqual(1);
            expect(firstTD.querySelector('.e-resource-text').innerHTML).toEqual('');
        });
        it('checking resource tree rendering', () => {
            const contentRow: HTMLElement = schObj.element.querySelector('.e-timeline-view table tbody') as HTMLElement;
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
            expect(eventElementList[1].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Spanned Event - Previous week');
            expect(eventElementList[1].querySelectorAll('.e-appointment-details .e-indicator')[0].classList.contains('e-left-icon'))
                .toBeTruthy();
        });

        it('Checking right icon', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[8].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('All Day Event - Next week');
            expect(eventElementList[8].querySelectorAll('.e-appointment-details .e-indicator')[0].classList.contains('e-right-icon'))
                .toBeTruthy();
        });

        it('Checking right icon', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[2].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Recurrence Event - Greater than 24');
            expect(eventElementList[2].querySelectorAll('.e-appointment-details .e-icons')[0].classList.contains('e-recurrence-icon'))
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
    });

    describe('Multi level resource rendering with expanded property', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                height: '550px', width: '100%', currentView: 'TimelineWeek',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek'],
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
            const headerRow: HTMLElement = schObj.element.querySelector('.e-timeline-view tr') as HTMLElement;
            expect(headerRow.children.length).toEqual(2);
            const firstTD: HTMLElement = schObj.element.querySelector('.e-timeline-view tr td.e-resource-left-td') as HTMLElement;
            expect([firstTD].length).toEqual(1);
            expect(firstTD.querySelector('.e-resource-text').innerHTML).toEqual('');
        });
        it('checking resource tree rendering', () => {
            const contentRow: HTMLElement = schObj.element.querySelector('.e-timeline-view table tbody') as HTMLElement;
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
            expect(resourceRow.children[1].classList.contains('e-hidden')).toEqual(false);
            const parentRow: HTMLElement = <HTMLElement>resourceRow.children[10].querySelector('.e-resource-cells div.e-resource-tree-icon');
            parentRow.click();
            const afterExpand: NodeListOf<Element> = schObj.element.querySelectorAll('.e-resource-column-wrap tbody tr:not(.e-hidden)');
            expect(afterExpand.length).toEqual(11);
            expect([resourceRow.children[10].querySelector('.e-resource-cells div.e-resource-collapse')].length).toEqual(1);
            expect(resourceRow.children[11].classList.contains('e-hidden')).toEqual(false);
            expect(resourceRow.children[11].querySelector('.e-resource-cells div.e-resource-text').innerHTML).toEqual('ROOM 2');
            parentRow.click();
            const afterCollapse: NodeListOf<Element> = schObj.element.querySelectorAll('.e-resource-column-wrap tbody tr:not(.e-hidden)');
            expect(afterCollapse.length).toEqual(7);

        });
        it('Checking events elements', () => {
            const resourceRow: HTMLElement = schObj.element.querySelector('.e-resource-column-wrap tbody') as HTMLElement;
            const parentRow: HTMLElement = <HTMLElement>resourceRow.children[1].querySelector('.e-resource-cells div.e-resource-tree-icon');
            parentRow.click();
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList.length).toEqual(9);
            const eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
            expect(eventWrapperList.length).toEqual(7);
        });

        it('Checking left icon', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[1].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Spanned Event - Previous week');
            expect(eventElementList[1].querySelectorAll('.e-appointment-details .e-icons')[0].classList.contains('e-left-icon'))
                .toBeTruthy();
        });

        it('Checking right icon', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[4].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Recurrence Event - Previous week');
            expect(eventElementList[4].querySelectorAll('.e-appointment-details .e-icons')[1].classList.contains('e-right-icon'))
                .toBeTruthy();
        });

        it('Checking recurrence icon', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[4].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Recurrence Event - Previous week');
            expect(eventElementList[4].querySelectorAll('.e-appointment-details .e-icons')[0].classList.contains('e-recurrence-icon'))
                .toBeTruthy();
        });

        it('More event element checking', () => {
            const moreIndicatorList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
            expect(moreIndicatorList.length).toEqual(621);
            const element: HTMLElement = moreIndicatorList[0] as HTMLElement;
            element.click();
            const morePopup: HTMLElement = schObj.element.querySelector('.e-more-popup-wrapper') as HTMLElement;
            const moreEventList: Element[] = [].slice.call(morePopup.querySelectorAll('.e-more-appointment-wrapper .e-appointment'));
            expect(moreEventList.length).toEqual(2);
            util.triggerMouseEvent(morePopup.querySelector('.e-more-event-close'), 'click');
        });
        it('cell single click', () => {
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[720] as HTMLElement, 'click');
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
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(48);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(2);
        });
        it('cell double click', () => {
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[720] as HTMLElement, 'dblclick');
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
            expect(owner.text).toEqual('Nancy');
            const cancelButton: HTMLElement = dialogElement.querySelector('.e-event-cancel') as HTMLElement;
            cancelButton.click();
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(48);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(2);
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
            const hall: DropDownList = (dialogElement.querySelector('.e-HallId') as EJ2Instance).ej2_instances[0] as DropDownList;
            expect(hall.text).toEqual('Hall 1');
            expect(hall.value).toEqual(1);
            const room: DropDownList = (dialogElement.querySelector('.e-RoomId') as EJ2Instance).ej2_instances[0] as DropDownList;
            expect(room.text).toEqual('ROOM 1');
            const owner: DropDownList = (dialogElement.querySelector('.e-OwnerId') as EJ2Instance).ej2_instances[0] as DropDownList;
            expect(owner.text).toEqual('Oliver');
            const cancelButton: HTMLElement = dialogElement.querySelector('.e-event-cancel') as HTMLElement;
            cancelButton.click();
        });
    });

    describe('Custom work days of Resources in group', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                width: '100%', height: '550px', currentView: 'TimelineWeek',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineMonth'],
                selectedDate: new Date(2018, 7, 6),
                group: { resources: ['Rooms', 'Owners'] },
                resources: [{
                    field: 'RoomId', title: 'Room', name: 'Rooms', allowMultiple: false,
                    dataSource: [
                        { text: 'ROOM 1', id: 1, color: '#cb6bb2', startHour: '0:00', endHour: '0:00' },
                        { text: 'ROOM 2', id: 2, color: '#56ca85', startHour: '0:00', endHour: '0:00' }
                    ],
                    textField: 'text', idField: 'id', colorField: 'color', startHourField: 'startHour', endHourField: 'endHour'
                }, {
                    field: 'OwnerId', title: 'Owner', name: 'Owners', allowMultiple: true,
                    dataSource: [
                        { text: 'Nancy', id: 1, groupId: 1, color: '#ffaa00', startHour: '08:00', endHour: '12:00' },
                        { text: 'Steven', id: 2, groupId: 2, color: '#f8a398', startHour: '04:00', endHour: '07:00' },
                        { text: 'Michael', id: 3, groupId: 1, color: '#7499e1', startHour: '10:00', endHour: '12:00' }
                    ],
                    textField: 'text', idField: 'id', groupIDField: 'groupId', colorField: 'color',
                    startHourField: 'startHour', endHourField: 'endHour'
                }]
            };
            schObj = util.createSchedule(model, [], done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('work hours count', () => {
            expect(schObj.element.querySelectorAll('.e-work-hours').length).toBe(90);
            expect((<HTMLTableCellElement>schObj.element.querySelector('.e-work-hours')).cellIndex).toBe(64);
            const contentTable: NodeListOf<Element> = schObj.element.querySelectorAll('.e-content-table tr');
            expect((<Element>contentTable[1].childNodes[63]).classList.contains('e-work-hours')).toEqual(false);
            expect((<Element>contentTable[1].childNodes[64]).classList.contains('e-work-hours')).toEqual(true);
        });
    });

    describe('Single level resource rendering in RTL', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                height: '550px', width: '100%', enableRtl: true, currentView: 'TimelineWeek',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek'],
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
            const headerRow: HTMLElement = schObj.element.querySelector('.e-timeline-view tr') as HTMLElement;
            expect(headerRow.children.length).toEqual(2);
            const firstTD: HTMLElement = schObj.element.querySelector('.e-timeline-view tr td.e-resource-left-td') as HTMLElement;
            expect([firstTD].length).toEqual(1);
            expect(firstTD.querySelector('.e-resource-text').innerHTML).toEqual('');
        });
        it('checking resource tree rendering', () => {
            const contentRow: HTMLElement = schObj.element.querySelector('.e-timeline-view table tbody') as HTMLElement;
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
            expect(eventElementList.length).toEqual(18);
            const eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
            expect(eventWrapperList.length).toEqual(10);
        });

        it('Checking Left icon', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[13].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('All Day Event - Previous week');
            expect(eventElementList[13].querySelectorAll('.e-appointment-details .e-indicator')[0].classList.contains('e-left-icon'))
                .toBeTruthy();
        });

        it('Checking right icon', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[8].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Recurrence Event - Less than 24');
            expect(eventElementList[8].querySelectorAll('.e-appointment-details .e-indicator')[0].classList.contains('e-right-icon'))
                .toBeTruthy();
        });

        it('Checking right icon', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[8].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Recurrence Event - Less than 24');
            expect(eventElementList[8].querySelectorAll('.e-appointment-details .e-icons')[0].classList.contains('e-recurrence-icon'))
                .toBeTruthy();
        });

        it('More event element checking', () => {
            const moreIndicatorList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
            expect(moreIndicatorList.length).toEqual(101);
            const element: HTMLElement = moreIndicatorList[0] as HTMLElement;
            element.click();
            const morePopup: HTMLElement = schObj.element.querySelector('.e-more-popup-wrapper') as HTMLElement;
            const moreEventList: Element[] = [].slice.call(morePopup.querySelectorAll('.e-more-appointment-wrapper .e-appointment'));
            expect(moreEventList.length).toEqual(2);
            util.triggerMouseEvent(morePopup.querySelector('.e-more-event-close'), 'click');
        });
    });

    describe('Multi level resource rendering in RTL', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                height: '550px', width: '100%', enableRtl: true, currentView: 'TimelineWeek',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek'],
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
            const headerRow: HTMLElement = schObj.element.querySelector('.e-timeline-view tr') as HTMLElement;
            expect(headerRow.children.length).toEqual(2);
            const firstTD: HTMLElement = schObj.element.querySelector('.e-timeline-view tr td.e-resource-left-td') as HTMLElement;
            expect([firstTD].length).toEqual(1);
            expect(firstTD.querySelector('.e-resource-text').innerHTML).toEqual('');
        });
        it('checking resource tree rendering', () => {
            const contentRow: HTMLElement = schObj.element.querySelector('.e-timeline-view table tbody') as HTMLElement;
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
            expect(eventElementList[1].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Spanned Event - Previous week');
            expect(eventElementList[1].querySelectorAll('.e-appointment-details .e-indicator')[0].classList.contains('e-left-icon'))
                .toBeTruthy();
        });

        it('Checking right icon', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[8].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('All Day Event - Next week');
            expect(eventElementList[8].querySelectorAll('.e-appointment-details .e-indicator')[0].classList.contains('e-right-icon'))
                .toBeTruthy();
        });

        it('Checking right icon', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[2].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Recurrence Event - Greater than 24');
            expect(eventElementList[2].querySelectorAll('.e-appointment-details .e-icons')[0].classList.contains('e-recurrence-icon'))
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
    });

    describe('Multi level resource rendering with expanded property in RTL', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                height: '550px', width: '100%', enableRtl: true, currentView: 'TimelineWeek',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek'],
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
            const headerRow: HTMLElement = schObj.element.querySelector('.e-timeline-view tr') as HTMLElement;
            expect(headerRow.children.length).toEqual(2);
            const firstTD: HTMLElement = schObj.element.querySelector('.e-timeline-view tr td.e-resource-left-td') as HTMLElement;
            expect([firstTD].length).toEqual(1);
            expect(firstTD.querySelector('.e-resource-text').innerHTML).toEqual('');
        });
        it('checking resource tree rendering', () => {
            const contentRow: HTMLElement = schObj.element.querySelector('.e-timeline-view table tbody') as HTMLElement;
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
            expect(eventElementList.length).toEqual(9);
            const eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
            expect(eventWrapperList.length).toEqual(7);
        });

        it('Checking left icon', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[1].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Spanned Event - Previous week');
            expect(eventElementList[1].querySelectorAll('.e-appointment-details .e-icons')[0].classList.contains('e-left-icon'))
                .toBeTruthy();
        });

        it('Checking right icon', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[4].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Recurrence Event - Previous week');
            expect(eventElementList[4].querySelectorAll('.e-appointment-details .e-icons')[1].classList.contains('e-right-icon'))
                .toBeTruthy();
        });

        it('Checking recurrence icon', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[4].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Recurrence Event - Previous week');
            expect(eventElementList[4].querySelectorAll('.e-appointment-details .e-icons')[0].classList.contains('e-recurrence-icon'))
                .toBeTruthy();
        });

        it('More event element checking', () => {
            const moreIndicatorList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
            expect(moreIndicatorList.length).toEqual(621);
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
                currentView: 'TimelineWeek', views: ['TimelineDay', 'TimelineWeek', 'TimelineMonth'],
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
            const contentRow: HTMLElement = schObj.element.querySelector('.e-timeline-view table tbody') as HTMLElement;
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
                currentView: 'TimelineWeek', views: ['TimelineDay', 'TimelineWeek', 'TimelineMonth'],
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
            const contentRow: HTMLElement = schObj.element.querySelector('.e-timeline-view table tbody') as HTMLElement;
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
                height: '550px', width: '100%', currentView: 'TimelineWeek',
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
            const contentRow: HTMLElement = schObj.element.querySelector('.e-timeline-view table tbody') as HTMLElement;
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
                width: 300, height: '600px', selectedDate: new Date(2018, 3, 1),
                currentView: 'TimelineWeek', views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek', 'TimelineMonth'],
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
            expect(workCells.length).toEqual(336);
            expect(workCells[126].getAttribute('data-date')).toEqual(new Date(2018, 3, 3, 15, 0).getTime().toString());
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

        it('resource events checked for timeline week view testing', () => {
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

        it('resource events checked for timeline workweek view testing', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(2);
                done();
            };
            schObj.currentView = 'TimelineWorkWeek';
            schObj.dataBind();
        });

        it('resource events checked for timeline month view testing', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(3);
                done();
            };
            schObj.currentView = 'TimelineMonth';
            schObj.dataBind();
        });

        it('resource without timescale', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.getWorkCellElements().length).toEqual(7);
                expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(3);
                done();
            };
            schObj.currentView = 'TimelineWeek';
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
                height: '600px', selectedDate: new Date(2018, 3, 1), currentView: 'TimelineWeek',
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
            expect(workCells.length).toEqual(336 * 5);
            expect(workCells[126].getAttribute('data-date')).toEqual(new Date(2018, 3, 3, 15, 0).getTime().toString());
        });

        it('compact view elements empty testing', () => {
            expect(schObj.element.querySelectorAll('.e-schedule-resource-toolbar').length).toEqual(0);
            expect(schObj.element.querySelectorAll('.e-resource-tree-popup').length).toEqual(0);
            expect(schObj.element.querySelectorAll('.e-resource-tree').length).toEqual(0);
        });

        it('resource events checked for timeline week view testing', () => {
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

        it('resource events checked for timeline workweek view testing', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(5);
                done();
            };
            schObj.currentView = 'TimelineWorkWeek';
            schObj.dataBind();
        });

        it('resource events checked for timeline month view testing', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(9);
                done();
            };
            schObj.currentView = 'TimelineMonth';
            schObj.dataBind();
        });

        it('resource without timescale', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.getWorkCellElements().length).toEqual(7 * 5);
                expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(9);
                done();
            };
            schObj.currentView = 'TimelineWeek';
            schObj.timeScale.enable = false;
            schObj.dataBind();
        });
    });

    describe('Grouped events', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                height: '550px', width: '100%', currentView: 'TimelineWeek',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek'],
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
            expect(eventElementList.length).toEqual(33);
            const eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
            expect(eventWrapperList.length).toEqual(10);
        });

        it('Checking left icon', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[0].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('All Day Event - Previous week');
            expect(eventElementList[0].querySelectorAll('.e-appointment-details .e-indicator')[0].classList.contains('e-left-icon'))
                .toBeTruthy();
        });

        it('Checking right icon', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[21].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('All Day Event - Next week');
            expect(eventElementList[21].querySelectorAll('.e-appointment-details .e-indicator')[0].classList.contains('e-right-icon'))
                .toBeTruthy();
        });

        it('Checking recurrence icon', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[2].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Recurrence Event - Same day');
            expect(eventElementList[2].querySelectorAll('.e-appointment-details .e-icons')[0].classList.contains('e-recurrence-icon'))
                .toBeTruthy();
        });

        it('More event element checking', () => {
            const moreIndicatorList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
            expect(moreIndicatorList.length).toEqual(1016);
            expect(moreIndicatorList[0].innerHTML).toEqual('+1&nbsp;more');
            expect(moreIndicatorList[1].innerHTML).toEqual('+1&nbsp;more');
            expect(moreIndicatorList[18].innerHTML).toEqual('+1&nbsp;more');
            const element: HTMLElement = moreIndicatorList[0] as HTMLElement;
            element.click();
            const morePopup: HTMLElement = schObj.element.querySelector('.e-more-popup-wrapper') as HTMLElement;
            const moreEventList: Element[] = [].slice.call(morePopup.querySelectorAll('.e-more-appointment-wrapper .e-appointment'));
            expect(moreEventList.length).toEqual(2);
            util.triggerMouseEvent(morePopup.querySelector('.e-more-event-close'), 'click');
        });
    });

    describe('Grouped events - RTL', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                height: '550px', width: '100%', currentView: 'TimelineWeek', enableRtl: true,
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek'],
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
            expect(eventElementList.length).toEqual(33);
            const eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
            expect(eventWrapperList.length).toEqual(10);
        });

        it('Checking left icon', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[0].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('All Day Event - Previous week');
            expect(eventElementList[0].querySelectorAll('.e-appointment-details .e-indicator')[0].classList.contains('e-left-icon'))
                .toBeTruthy();
        });

        it('Checking right icon', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[21].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('All Day Event - Next week');
            expect(eventElementList[21].querySelectorAll('.e-appointment-details .e-indicator')[0].classList.contains('e-right-icon'))
                .toBeTruthy();
        });

        it('Checking recurrence icon', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[2].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Recurrence Event - Same day');
            expect(eventElementList[2].querySelectorAll('.e-appointment-details .e-icons')[0].classList.contains('e-recurrence-icon'))
                .toBeTruthy();
        });

        it('More event element checking', () => {
            const moreIndicatorList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
            expect(moreIndicatorList.length).toEqual(1016);
            expect(moreIndicatorList[0].innerHTML).toEqual('+1&nbsp;more');
            expect(moreIndicatorList[1].innerHTML).toEqual('+1&nbsp;more');
            expect(moreIndicatorList[18].innerHTML).toEqual('+1&nbsp;more');
            const element: HTMLElement = moreIndicatorList[0] as HTMLElement;
            element.click();
            const morePopup: HTMLElement = schObj.element.querySelector('.e-more-popup-wrapper') as HTMLElement;
            const moreEventList: Element[] = [].slice.call(morePopup.querySelectorAll('.e-more-appointment-wrapper .e-appointment'));
            expect(moreEventList.length).toEqual(2);
            util.triggerMouseEvent(morePopup.querySelector('.e-more-event-close'), 'click');
        });
    });

    describe('Events rendering based on levels', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                height: '550px', width: '100%', currentView: 'TimelineWeek',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek'],
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
                }
                ],
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

        it('Checking right icon', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[3].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Spanned Event - Next week');
            expect(eventElementList[3].querySelectorAll('.e-appointment-details .e-indicator')[0].classList.contains('e-right-icon'))
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
                height: '550px', width: '100%', enableRtl: true, currentView: 'TimelineWeek',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek'],
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

        it('Checking right icon', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList[3].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('Spanned Event - Next week');
            expect(eventElementList[3].querySelectorAll('.e-appointment-details .e-indicator')[0].classList.contains('e-right-icon'))
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
        const daysLength: number = 7;
        beforeAll((done: DoneFn) => {
            const options: ScheduleModel = {
                height: '600px', width: '1000px', currentView: 'TimelineWeek',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek'],
                headerRows: [{ option: 'Year' }, { option: 'Month' }, { option: 'Week' }, { option: 'Date' }, { option: 'Hour' }],
                selectedDate: new Date(2018, 4, 1)
            };
            schObj = util.createSchedule(options, timelineData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('view class on container', () => {
            expect(schObj.element.querySelector('.e-timeline-view')).toBeTruthy();
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-timeline-week');
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('Apr 29 - May 05, 2018');
        });

        it('check header rows', () => {
            expect(schObj.element.querySelectorAll('.e-date-header-wrap table col').length).toEqual(48 * daysLength);
            expect(schObj.element.querySelectorAll('.e-date-header-wrap table tr').length).toEqual(5);
        });

        it('check year rows', () => {
            const headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
            expect(headTrs[0].children.length).toEqual(1);
            expect(headTrs[0].children[0].getAttribute('colSpan')).toEqual('336');
            expect(headTrs[0].children[0].innerHTML).toEqual('<span class="e-header-year" style="left: 5700px;">2018</span>');
        });

        it('check month rows', () => {
            const headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
            expect(headTrs[1].children.length).toEqual(2);
            expect(headTrs[1].children[0].getAttribute('colSpan')).toEqual('96');
            expect(headTrs[1].children[1].getAttribute('colSpan')).toEqual('240');
            expect(headTrs[1].children[0].innerHTML).toEqual('<span class="e-header-month">April</span>');
        });

        it('check week rows', () => {
            const headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
            expect(headTrs[2].children.length).toEqual(1);
            expect(headTrs[2].children[0].getAttribute('colSpan')).toEqual('336');
            expect(headTrs[2].children[0].innerHTML).toEqual('<span class="e-header-week" style="left: 5700px;">18</span>');
        });

        it('check day rows', () => {
            const headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
            expect(headTrs[3].children.length).toEqual(7);
            expect(headTrs[3].children[0].getAttribute('colSpan')).toEqual('48');
            expect(headTrs[3].children[0].innerHTML).toEqual('<span class="e-header-date e-navigate">Apr 29, Sunday</span>');
            expect(headTrs[3].children[0].getAttribute('data-date')).toEqual(new Date(2018, 3, 29).getTime().toString());
        });

        it('check hour rows', () => {
            const headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tbody tr'));
            expect(headTrs[4].children.length).toEqual(48 * daysLength);
            expect(headTrs[4].children[0].getAttribute('colSpan')).toBeNull();
            expect(headTrs[4].children[0].innerHTML).toEqual('<span>12:00 AM</span>');
            expect(headTrs[4].children[1].innerHTML).toEqual('');
        });

        it('check work cells', () => {
            expect(schObj.getWorkCellElements().length).toEqual(48 * daysLength);
            const firstWorkCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
            expect(firstWorkCell.getAttribute('aria-selected')).toEqual('false');
            expect(firstWorkCell.getAttribute('data-date')).toEqual(new Date(2018, 3, 29).getTime().toString());
            expect(firstWorkCell.innerHTML).toEqual('');
            const data: CellClickEventArgs = schObj.getCellDetails(firstWorkCell);
            expect(data.startTime.getTime()).toEqual(new Date(2018, 3, 29).getTime());
            expect(data.endTime.getTime()).toEqual(new Date(2018, 3, 29, 0, 30).getTime());
            expect(data.isAllDay).toEqual(false);
            expect(data.groupIndex).toBeUndefined();
        });

        it('check work hours highlight', () => {
            expect(schObj.element.querySelectorAll('.e-work-hours,.e-work-days').length).toEqual(18 * 5);
        });

        it('check events rendering', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList.length).toEqual(23);
            const eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
            expect(eventWrapperList.length).toEqual(1);
            expect(eventElementList[0].querySelector('.e-inner-wrap .e-subject').innerHTML).toEqual('All Day Event - Previous week');
            expect(eventElementList[0].querySelectorAll('.e-appointment-details .e-indicator')[0].classList).toContain('e-left-icon');
        });

        it('check more indicator', () => {
            const moreIndicators: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
            expect(moreIndicators.length).toEqual(2);
            expect(moreIndicators[0].innerHTML).toEqual('+3&nbsp;more');
            expect(moreIndicators[0].getAttribute('data-start-date')).toEqual(new Date(2018, 4, 1, 13).getTime().toString());
            expect(moreIndicators[0].getAttribute('data-end-date')).toEqual(new Date(2018, 4, 1, 13, 30).getTime().toString());
            moreIndicators[0].click();
            const morePopup: HTMLElement = schObj.element.querySelector('.e-more-popup-wrapper') as HTMLElement;
            const eventElementList: Element[] = [].slice.call(morePopup.querySelectorAll('.e-more-appointment-wrapper .e-appointment'));
            expect(eventElementList.length).toEqual(11);
            expect(morePopup.classList).toContain('e-popup-open');
            util.triggerMouseEvent(morePopup.querySelector('.e-more-event-close'), 'click');
            expect(morePopup.classList).toContain('e-popup-close');
        });

        it('navigate next date', (done: DoneFn) => {
            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
            schObj.dataBound = () => {
                expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-timeline-week');
                expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('May 06 - 12, 2018');
                expect(schObj.element.querySelectorAll('.e-date-header-wrap table col').length).toEqual(336);
                const headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
                expect(headTrs[0].children.length).toEqual(1);
                expect(headTrs[0].children[0].getAttribute('colSpan')).toEqual('336');
                expect(headTrs[0].children[0].innerHTML).toEqual('<span class="e-header-year" style="left: 5700px;">2018</span>');
                expect(headTrs[1].children.length).toEqual(1);
                expect(headTrs[1].children[0].getAttribute('colSpan')).toEqual('336');
                expect(headTrs[1].children[0].innerHTML).toEqual('<span class="e-header-month" style="left: 5700px;">May</span>');
                expect(headTrs[2].children.length).toEqual(1);
                expect(headTrs[2].children[0].getAttribute('colSpan')).toEqual('336');
                expect(headTrs[2].children[0].innerHTML).toEqual('<span class="e-header-week" style="left: 5700px;">19</span>');
                expect(headTrs[3].children.length).toEqual(7);
                expect(headTrs[3].children[0].getAttribute('colSpan')).toEqual('48');
                expect(headTrs[3].children[0].innerHTML).toEqual('<span class="e-header-date e-navigate">May 6, Sunday</span>');
                expect(headTrs[3].children[0].getAttribute('data-date')).toEqual(new Date(2018, 4, 6).getTime().toString());
                expect(headTrs[4].children.length).toEqual(48 * daysLength);
                expect(headTrs[4].children[0].getAttribute('colSpan')).toBeNull();
                expect(headTrs[4].children[0].innerHTML).toEqual('<span>12:00 AM</span>');
                expect(headTrs[4].children[1].innerHTML).toEqual('');
                expect(schObj.getWorkCellElements().length).toEqual(48 * daysLength);
                const firstWorkCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
                expect(firstWorkCell.getAttribute('data-date')).toEqual(new Date(2018, 4, 6).getTime().toString());
                expect(schObj.element.querySelectorAll('.e-work-hours,.e-work-days').length).toEqual(90);
                const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(eventElementList.length).toEqual(8);
                const eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
                expect(eventWrapperList.length).toEqual(1);
                done();
            };
        });

        it('navigate previous date', (done: DoneFn) => {
            (schObj.element.querySelector('.e-toolbar-item.e-prev') as HTMLElement).click();
            schObj.dataBound = () => {
                expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('Apr 29 - May 05, 2018');
                expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-timeline-week');
                expect(schObj.element.querySelectorAll('.e-date-header-wrap table col').length).toEqual(336);
                const headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
                expect(headTrs[0].children.length).toEqual(1);
                expect(headTrs[0].children[0].getAttribute('colSpan')).toEqual('336');
                expect(headTrs[0].children[0].innerHTML).toEqual('<span class="e-header-year" style="left: 5700px;">2018</span>');
                expect(headTrs[1].children.length).toEqual(2);
                expect(headTrs[1].children[0].getAttribute('colSpan')).toEqual('96');
                expect(headTrs[1].children[0].innerHTML).toEqual('<span class="e-header-month">April</span>');
                expect(headTrs[2].children.length).toEqual(1);
                expect(headTrs[2].children[0].getAttribute('colSpan')).toEqual('336');
                expect(headTrs[2].children[0].innerHTML).toEqual('<span class="e-header-week" style="left: 5700px;">18</span>');
                expect(headTrs[3].children.length).toEqual(7);
                expect(headTrs[3].children[0].getAttribute('colSpan')).toEqual('48');
                expect(headTrs[3].children[0].innerHTML).toEqual('<span class="e-header-date e-navigate">Apr 29, Sunday</span>');
                expect(headTrs[3].children[0].getAttribute('data-date')).toEqual(new Date(2018, 3, 29).getTime().toString());
                expect(headTrs[4].children.length).toEqual(48 * daysLength);
                expect(headTrs[4].children[0].getAttribute('colSpan')).toBeNull();
                expect(headTrs[4].children[0].innerHTML).toEqual('<span>12:00 AM</span>');
                expect(headTrs[4].children[1].innerHTML).toEqual('');
                expect(schObj.getWorkCellElements().length).toEqual(48 * daysLength);
                const firstWorkCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
                expect(firstWorkCell.getAttribute('aria-selected')).toEqual('false');
                expect(firstWorkCell.getAttribute('data-date')).toEqual(new Date(2018, 3, 29).getTime().toString());
                expect(firstWorkCell.innerHTML).toEqual('');
                expect(schObj.element.querySelectorAll('.e-work-hours,.e-work-days').length).toEqual(90);
                const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(eventElementList.length).toEqual(23);
                const eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
                expect(eventWrapperList.length).toEqual(1);
                done();
            };
        });
    });

    describe('Year, Month, Week, Day, Hour header rows with template', () => {
        let schObj: Schedule;
        const daysLength: number = 7;
        beforeAll((done: DoneFn) => {
            const headTemplate: string = '<span>${type}</span>';
            const options: ScheduleModel = {
                height: '600px', width: '1000px', currentView: 'TimelineWeek',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek'],
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
            expect(schObj.element.querySelector('.e-timeline-view')).toBeTruthy();
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-timeline-week');
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('Apr 29 - May 05, 2018');
        });

        it('check header rows', () => {
            expect(schObj.element.querySelectorAll('.e-date-header-wrap table col').length).toEqual(48 * daysLength);
            expect(schObj.element.querySelectorAll('.e-date-header-wrap table tr').length).toEqual(5);
        });

        it('check year rows', () => {
            const headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
            expect(headTrs[0].children.length).toEqual(1);
            expect(headTrs[0].children[0].getAttribute('colSpan')).toEqual('336');
            expect(headTrs[0].children[0].innerHTML).toEqual('<span style="left: 5700px;">yearHeader</span>');
        });

        it('check month rows', () => {
            const headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
            expect(headTrs[1].children.length).toEqual(2);
            expect(headTrs[1].children[0].getAttribute('colSpan')).toEqual('96');
            expect(headTrs[1].children[0].innerHTML).toEqual('<span>monthHeader</span>');
        });

        it('check week rows', () => {
            const headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
            expect(headTrs[2].children.length).toEqual(1);
            expect(headTrs[2].children[0].getAttribute('colSpan')).toEqual('336');
            expect(headTrs[2].children[0].innerHTML).toEqual('<span style="left: 5700px;">weekHeader</span>');
        });

        it('check day rows', () => {
            const headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
            expect(headTrs[3].children.length).toEqual(7);
            expect(headTrs[3].children[0].getAttribute('colSpan')).toEqual('48');
            expect(headTrs[3].children[0].innerHTML).toEqual('<span>dateHeader</span>');
            expect(headTrs[3].children[0].getAttribute('data-date')).toEqual(new Date(2018, 3, 29).getTime().toString());
        });

        it('check hour rows', () => {
            const headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tbody tr'));
            expect(headTrs[4].children.length).toEqual(336);
            expect(headTrs[4].children[0].getAttribute('colSpan')).toBeNull();
            expect(headTrs[4].children[0].innerHTML).toEqual('<span>majorSlot</span>');
            expect(headTrs[4].children[1].innerHTML).toEqual('<span>minorSlot</span>');
        });

        it('check work cells', () => {
            expect(schObj.getWorkCellElements().length).toEqual(336);
            const firstWorkCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
            expect(firstWorkCell.getAttribute('aria-selected')).toEqual('false');
            expect(firstWorkCell.getAttribute('data-date')).toEqual(new Date(2018, 3, 29).getTime().toString());
            const data: CellClickEventArgs = schObj.getCellDetails(firstWorkCell);
            expect(data.startTime.getTime()).toEqual(new Date(2018, 3, 29).getTime());
            expect(data.endTime.getTime()).toEqual(new Date(2018, 3, 29, 0, 30).getTime());
            expect(data.isAllDay).toEqual(false);
            expect(data.groupIndex).toBeUndefined();
            expect(firstWorkCell.innerHTML).toEqual('');
            expect(schObj.element.querySelectorAll('.e-work-hours,.e-work-days').length).toEqual(90);
        });

        it('check events rendering with more indicator', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList.length).toEqual(23);
            const eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
            expect(eventWrapperList.length).toEqual(1);
            const moreIndicators: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
            expect(moreIndicators.length).toEqual(2);
            expect(moreIndicators[0].innerHTML).toEqual('+3&nbsp;more');
            expect(moreIndicators[0].getAttribute('data-start-date')).toEqual(new Date(2018, 4, 1, 13).getTime().toString());
            expect(moreIndicators[0].getAttribute('data-end-date')).toEqual(new Date(2018, 4, 1, 13, 30).getTime().toString());
        });
    });

    describe('Year, Month, Week, Day header rows', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const options: ScheduleModel = {
                height: '600px', width: '1000px', currentView: 'TimelineWeek',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek'],
                headerRows: [{ option: 'Year' }, { option: 'Month' }, { option: 'Week' }, { option: 'Date' }],
                selectedDate: new Date(2018, 4, 1)
            };
            schObj = util.createSchedule(options, timelineData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('check view class on container', () => {
            expect(schObj.element.querySelector('.e-timeline-view')).toBeTruthy();
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-timeline-week');
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('Apr 29 - May 05, 2018');
        });

        it('check header rows', () => {
            expect(schObj.element.querySelectorAll('.e-date-header-wrap table col').length).toEqual(7);
            expect(schObj.element.querySelectorAll('.e-date-header-wrap table tr').length).toEqual(4);
        });

        it('check year rows', () => {
            const headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
            expect(headTrs[0].children.length).toEqual(1);
            expect(headTrs[0].children[0].getAttribute('colSpan')).toEqual('7');
            expect(headTrs[0].children[0].innerHTML).toEqual('<span class="e-header-year">2018</span>');
        });

        it('check month rows', () => {
            const headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
            expect(headTrs[1].children.length).toEqual(2);
            expect(headTrs[1].children[0].getAttribute('colSpan')).toEqual('2');
            expect(headTrs[1].children[0].innerHTML).toEqual('<span class="e-header-month">April</span>');
        });

        it('check week rows', () => {
            const headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
            expect(headTrs[2].children.length).toEqual(1);
            expect(headTrs[2].children[0].getAttribute('colSpan')).toEqual('7');
            expect(headTrs[2].children[0].innerHTML).toEqual('<span class="e-header-week">18</span>');
        });

        it('check day rows', () => {
            const headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
            expect(headTrs[3].children.length).toEqual(7);
            expect(headTrs[3].children[0].getAttribute('colSpan')).toEqual('1');
            expect(headTrs[3].children[0].innerHTML).toEqual('<span class="e-header-date e-navigate">Apr 29, Sunday</span>');
            expect(headTrs[3].children[0].getAttribute('data-date')).toEqual(new Date(2018, 3, 29).getTime().toString());
        });

        it('check work cells', () => {
            expect(schObj.getWorkCellElements().length).toEqual(7);
            const firstWorkCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
            expect(firstWorkCell.getAttribute('aria-selected')).toEqual('false');
            expect(firstWorkCell.getAttribute('data-date')).toEqual(new Date(2018, 3, 29).getTime().toString());
            const data: CellClickEventArgs = schObj.getCellDetails(firstWorkCell);
            expect(data.startTime.getTime()).toEqual(new Date(2018, 3, 29).getTime());
            expect(data.endTime.getTime()).toEqual(new Date(2018, 3, 30).getTime());
            expect(data.isAllDay).toEqual(true);
            expect(data.groupIndex).toBeUndefined();
            expect(firstWorkCell.innerHTML).toEqual('');
            expect(schObj.element.querySelectorAll('.e-work-hours,.e-work-days').length).toEqual(0);
        });

        it('check events rendering with more indicator', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList.length).toEqual(20);
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
                height: '600px', width: '1000px', currentView: 'TimelineWeek',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek'],
                headerRows: [{ option: 'Year' }, { option: 'Month' }, { option: 'Week' }],
                selectedDate: new Date(2018, 4, 1)
            };
            schObj = util.createSchedule(options, timelineData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('check view class on container', () => {
            expect(schObj.element.querySelector('.e-timeline-view')).toBeTruthy();
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-timeline-week');
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('Apr 29 - May 05, 2018');
        });

        it('check header rows', () => {
            expect(schObj.element.querySelectorAll('.e-date-header-wrap table col').length).toEqual(7);
            expect(schObj.element.querySelectorAll('.e-date-header-wrap table tr').length).toEqual(3);
        });

        it('check year rows', () => {
            const headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
            expect(headTrs[0].children.length).toEqual(1);
            expect(headTrs[0].children[0].getAttribute('colSpan')).toEqual('7');
            expect(headTrs[0].children[0].innerHTML).toEqual('<span class="e-header-year">2018</span>');
        });

        it('check month rows', () => {
            const headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
            expect(headTrs[1].children.length).toEqual(2);
            expect(headTrs[1].children[0].getAttribute('colSpan')).toEqual('2');
            expect(headTrs[1].children[0].innerHTML).toEqual('<span class="e-header-month">April</span>');
        });

        it('check week rows', () => {
            const headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
            expect(headTrs[2].children.length).toEqual(1);
            expect(headTrs[2].children[0].getAttribute('colSpan')).toEqual('7');
            expect(headTrs[2].children[0].innerHTML).toEqual('<span class="e-header-week">18</span>');
        });

        it('check work cells', () => {
            expect(schObj.getWorkCellElements().length).toEqual(1);
            const firstWorkCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
            expect(firstWorkCell.getAttribute('aria-selected')).toEqual('false');
            expect(firstWorkCell.getAttribute('data-date')).toEqual(new Date(2018, 3, 29).getTime().toString());
            const data: CellClickEventArgs = schObj.getCellDetails(firstWorkCell);
            expect(data.startTime.getTime()).toEqual(new Date(2018, 3, 29).getTime());
            expect(data.endTime.getTime()).toEqual(new Date(2018, 4, 6).getTime());
            expect(data.isAllDay).toEqual(true);
            expect(data.groupIndex).toBeUndefined();
            expect(firstWorkCell.innerHTML).toEqual('');
            expect(schObj.element.querySelectorAll('.e-work-hours,.e-work-days').length).toEqual(0);
        });

        it('check events rendering with more indicator', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList.length).toEqual(21);
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
                height: '600px', width: '1000px', currentView: 'TimelineWeek',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek'],
                headerRows: [{ option: 'Year' }, { option: 'Month' }],
                selectedDate: new Date(2018, 4, 1)
            };
            schObj = util.createSchedule(options, timelineData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('check view class on container', () => {
            expect(schObj.element.querySelector('.e-timeline-view')).toBeTruthy();
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-timeline-week');
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('Apr 29 - May 05, 2018');
        });

        it('check header rows', () => {
            expect(schObj.element.querySelectorAll('.e-date-header-wrap table col').length).toEqual(7);
            expect(schObj.element.querySelectorAll('.e-date-header-wrap table tr').length).toEqual(2);
        });

        it('check year rows', () => {
            const headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
            expect(headTrs[0].children.length).toEqual(1);
            expect(headTrs[0].children[0].getAttribute('colSpan')).toEqual('7');
            expect(headTrs[0].children[0].innerHTML).toEqual('<span class="e-header-year">2018</span>');
        });

        it('check month rows', () => {
            const headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
            expect(headTrs[1].children.length).toEqual(2);
            expect(headTrs[1].children[0].getAttribute('colSpan')).toEqual('2');
            expect(headTrs[1].children[0].innerHTML).toEqual('<span class="e-header-month">April</span>');
        });

        it('check work cells', () => {
            expect(schObj.getWorkCellElements().length).toEqual(2);
            const firstWorkCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
            expect(firstWorkCell.getAttribute('aria-selected')).toEqual('false');
            expect(firstWorkCell.getAttribute('data-date')).toEqual(new Date(2018, 3, 29).getTime().toString());
            const data: CellClickEventArgs = schObj.getCellDetails(firstWorkCell);
            expect(data.startTime.getTime()).toEqual(new Date(2018, 3, 29).getTime());
            expect(data.endTime.getTime()).toEqual(new Date(2018, 4, 1).getTime());
            expect(data.isAllDay).toEqual(true);
            expect(data.groupIndex).toBeUndefined();
            expect(firstWorkCell.innerHTML).toEqual('');
            expect(schObj.element.querySelectorAll('.e-work-hours,.e-work-days').length).toEqual(0);
        });

        it('check events rendering with more indicator', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList.length).toEqual(22);
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
                height: '600px', width: '1000px', currentView: 'TimelineWeek',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek'],
                headerRows: [{ option: 'Year' }],
                selectedDate: new Date(2018, 4, 1)
            };
            schObj = util.createSchedule(options, timelineData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('check view class on container', () => {
            expect(schObj.element.querySelector('.e-timeline-view')).toBeTruthy();
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-timeline-week');
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('Apr 29 - May 05, 2018');
        });

        it('check header rows', () => {
            expect(schObj.element.querySelectorAll('.e-date-header-wrap table col').length).toEqual(7);
            expect(schObj.element.querySelectorAll('.e-date-header-wrap table tr').length).toEqual(1);
        });

        it('check year rows', () => {
            const headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
            expect(headTrs[0].children.length).toEqual(1);
            expect(headTrs[0].children[0].getAttribute('colSpan')).toEqual('7');
            expect(headTrs[0].children[0].innerHTML).toEqual('<span class="e-header-year">2018</span>');
        });

        it('check work cells', () => {
            expect(schObj.getWorkCellElements().length).toEqual(1);
            const firstWorkCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
            expect(firstWorkCell.getAttribute('aria-selected')).toEqual('false');
            expect(firstWorkCell.getAttribute('data-date')).toEqual(new Date(2018, 3, 29).getTime().toString());
            const data: CellClickEventArgs = schObj.getCellDetails(firstWorkCell);
            expect(data.startTime.getTime()).toEqual(new Date(2018, 3, 29).getTime());
            expect(data.endTime.getTime()).toEqual(new Date(2018, 4, 6).getTime());
            expect(data.isAllDay).toEqual(true);
            expect(data.groupIndex).toBeUndefined();
            expect(firstWorkCell.innerHTML).toEqual('');
            expect(schObj.element.querySelectorAll('.e-work-hours,.e-work-days').length).toEqual(0);
        });

        it('check events rendering with more indicator', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList.length).toEqual(23);
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
                height: '600px', width: '1000px', currentView: 'TimelineWeek',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek'],
                headerRows: [{ option: 'Year' }, { option: 'Week' }, { option: 'Date' }],
                selectedDate: new Date(2018, 4, 1)
            };
            schObj = util.createSchedule(options, timelineData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('check view class on container', () => {
            expect(schObj.element.querySelector('.e-timeline-view')).toBeTruthy();
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-timeline-week');
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('Apr 29 - May 05, 2018');
        });

        it('check header rows', () => {
            expect(schObj.element.querySelectorAll('.e-date-header-wrap table col').length).toEqual(7);
            expect(schObj.element.querySelectorAll('.e-date-header-wrap table tr').length).toEqual(3);
        });

        it('check year rows', () => {
            const headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
            expect(headTrs[0].children.length).toEqual(1);
            expect(headTrs[0].children[0].getAttribute('colSpan')).toEqual('7');
            expect(headTrs[0].children[0].innerHTML).toEqual('<span class="e-header-year">2018</span>');
        });

        it('check week rows', () => {
            const headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
            expect(headTrs[1].children.length).toEqual(1);
            expect(headTrs[1].children[0].getAttribute('colSpan')).toEqual('7');
            expect(headTrs[1].children[0].innerHTML).toEqual('<span class="e-header-week">18</span>');
        });

        it('check day rows', () => {
            const headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
            expect(headTrs[2].children.length).toEqual(7);
            expect(headTrs[2].children[0].getAttribute('colSpan')).toEqual('1');
            expect(headTrs[2].children[0].innerHTML).toEqual('<span class="e-header-date e-navigate">Apr 29, Sunday</span>');
            expect(headTrs[2].children[0].getAttribute('data-date')).toEqual(new Date(2018, 3, 29).getTime().toString());
        });

        it('check work cells', () => {
            expect(schObj.getWorkCellElements().length).toEqual(7);
            const firstWorkCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
            expect(firstWorkCell.getAttribute('aria-selected')).toEqual('false');
            expect(firstWorkCell.getAttribute('data-date')).toEqual(new Date(2018, 3, 29).getTime().toString());
            const data: CellClickEventArgs = schObj.getCellDetails(firstWorkCell);
            expect(data.startTime.getTime()).toEqual(new Date(2018, 3, 29).getTime());
            expect(data.endTime.getTime()).toEqual(new Date(2018, 3, 30).getTime());
            expect(data.isAllDay).toEqual(true);
            expect(data.groupIndex).toBeUndefined();
            expect(firstWorkCell.innerHTML).toEqual('');
            expect(schObj.element.querySelectorAll('.e-work-hours,.e-work-days').length).toEqual(0);
        });

        it('check events rendering with more indicator', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList.length).toEqual(21);
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
                height: '600px', width: '1000px', currentView: 'TimelineWeek',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek'],
                headerRows: [{ option: 'Year' }, { option: 'Month' }, { option: 'Week' }, { option: 'Date' }, { option: 'Hour' }],
                selectedDate: new Date(2018, 4, 1)
            };
            schObj = util.createGroupSchedule(1, options, timelineResourceData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('view class on container', () => {
            expect(schObj.element.querySelector('.e-timeline-view')).toBeTruthy();
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-timeline-week');
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('Apr 29 - May 05, 2018');
        });

        it('check header rows', () => {
            expect(schObj.element.querySelectorAll('.e-date-header-wrap table col').length).toEqual(336);
            expect(schObj.element.querySelectorAll('.e-date-header-wrap table tr').length).toEqual(5);
        });

        it('check year rows', () => {
            const headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
            expect(headTrs[0].children.length).toEqual(1);
            expect(headTrs[0].children[0].getAttribute('colSpan')).toEqual('336');
            expect(headTrs[0].children[0].innerHTML).toEqual('<span class="e-header-year" style="left: 5700px;">2018</span>');
        });

        it('check month rows', () => {
            const headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
            expect(headTrs[1].children.length).toEqual(2);
            expect(headTrs[1].children[0].getAttribute('colSpan')).toEqual('96');
            expect(headTrs[1].children[0].innerHTML).toEqual('<span class="e-header-month">April</span>');
        });

        it('check week rows', () => {
            const headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
            expect(headTrs[2].children.length).toEqual(1);
            expect(headTrs[2].children[0].getAttribute('colSpan')).toEqual('336');
            expect(headTrs[2].children[0].innerHTML).toEqual('<span class="e-header-week" style="left: 5700px;">18</span>');
        });

        it('check day rows', () => {
            const headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
            expect(headTrs[3].children.length).toEqual(7);
            expect(headTrs[3].children[0].getAttribute('colSpan')).toEqual('48');
            expect(headTrs[3].children[0].innerHTML).toEqual('<span class="e-header-date e-navigate">Apr 29, Sunday</span>');
            expect(headTrs[3].children[0].getAttribute('data-date')).toEqual(new Date(2018, 3, 29).getTime().toString());
        });

        it('check hour rows', () => {
            const headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tbody tr'));
            expect(headTrs[4].children.length).toEqual(336);
            expect(headTrs[4].children[0].getAttribute('colSpan')).toBeNull();
            expect(headTrs[4].children[0].innerHTML).toEqual('<span>12:00 AM</span>');
            expect(headTrs[4].children[1].innerHTML).toEqual('');
        });

        it('check resource column', () => {
            expect(schObj.element.querySelectorAll('.e-resource-column-wrap table tbody tr').length).toEqual(resLength);
            expect(schObj.element.querySelectorAll('.e-resource-column-wrap table tbody tr td').length).toEqual(resLength);
        });

        it('check work cells', () => {
            expect(schObj.element.querySelectorAll('.e-content-wrap table tbody tr').length).toEqual(resLength);
            expect(schObj.element.querySelectorAll('.e-content-wrap table col').length).toEqual(336);
            expect(schObj.element.querySelectorAll('.e-content-wrap table td').length).toEqual(336 * resLength);
            const firstWorkCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
            expect(firstWorkCell.getAttribute('aria-selected')).toEqual('false');
            expect(firstWorkCell.getAttribute('data-date')).toEqual(new Date(2018, 3, 29).getTime().toString());
            expect(firstWorkCell.getAttribute('data-group-index')).toEqual('0');
            expect(firstWorkCell.innerHTML).toEqual('');
            const data: CellClickEventArgs = schObj.getCellDetails(firstWorkCell);
            expect(data.startTime.getTime()).toEqual(new Date(2018, 3, 29).getTime());
            expect(data.endTime.getTime()).toEqual(new Date(2018, 3, 29, 0, 30).getTime());
            expect(data.isAllDay).toEqual(false);
            expect(data.groupIndex).toBe(0);
        });

        it('check work hours highlight', () => {
            expect(schObj.element.querySelectorAll('.e-work-hours,.e-work-days').length).toEqual(90 * resLength);
        });

        it('check events rendering', () => {
            const eventElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElements.length).toEqual(18);
            const eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
            expect(eventWrapperList.length).toEqual(10);
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
            expect(moreIndicators.length).toEqual(101);
            expect(moreIndicators[0].innerHTML).toEqual('+1&nbsp;more');
            expect(moreIndicators[0].getAttribute('data-group-index')).toEqual('5');
            expect(moreIndicators[0].getAttribute('data-start-date')).toEqual(new Date(2018, 4, 4, 2).getTime().toString());
            expect(moreIndicators[0].getAttribute('data-end-date')).toEqual(new Date(2018, 4, 4, 2, 30).getTime().toString());
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
                expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-timeline-week');
                expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('May 06 - 12, 2018');
                expect(schObj.element.querySelectorAll('.e-date-header-wrap table col').length).toEqual(336);
                const headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
                expect(headTrs[0].children.length).toEqual(1);
                expect(headTrs[0].children[0].getAttribute('colSpan')).toEqual('336');
                expect(headTrs[0].children[0].innerHTML).toEqual('<span class="e-header-year" style="left: 5700px;">2018</span>');
                expect(headTrs[1].children.length).toEqual(1);
                expect(headTrs[1].children[0].getAttribute('colSpan')).toEqual('336');
                expect(headTrs[1].children[0].innerHTML).toEqual('<span class="e-header-month" style="left: 5700px;">May</span>');
                expect(headTrs[2].children.length).toEqual(1);
                expect(headTrs[2].children[0].getAttribute('colSpan')).toEqual('336');
                expect(headTrs[2].children[0].innerHTML).toEqual('<span class="e-header-week" style="left: 5700px;">19</span>');
                expect(headTrs[3].children.length).toEqual(7);
                expect(headTrs[3].children[0].getAttribute('colSpan')).toEqual('48');
                expect(headTrs[3].children[0].innerHTML).toEqual('<span class="e-header-date e-navigate">May 6, Sunday</span>');
                expect(headTrs[3].children[0].getAttribute('data-date')).toEqual(new Date(2018, 4, 6).getTime().toString());
                expect(headTrs[4].children.length).toEqual(336);
                expect(headTrs[4].children[0].getAttribute('colSpan')).toBeNull();
                expect(headTrs[4].children[0].innerHTML).toEqual('<span>12:00 AM</span>');
                expect(headTrs[4].children[1].innerHTML).toEqual('');
                expect(schObj.element.querySelectorAll('.e-resource-column-wrap table tbody tr').length).toEqual(resLength);
                expect(schObj.element.querySelectorAll('.e-resource-column-wrap table tbody tr td').length).toEqual(resLength);
                expect(schObj.element.querySelectorAll('.e-content-wrap table tbody tr').length).toEqual(resLength);
                expect(schObj.element.querySelectorAll('.e-content-wrap table col').length).toEqual(336);
                expect(schObj.element.querySelectorAll('.e-content-wrap table td').length).toEqual(336 * resLength);
                const firstWorkCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
                expect(firstWorkCell.getAttribute('aria-selected')).toEqual('false');
                expect(firstWorkCell.getAttribute('data-date')).toEqual(new Date(2018, 4, 6).getTime().toString());
                expect(firstWorkCell.getAttribute('data-group-index')).toEqual('0');
                expect(firstWorkCell.innerHTML).toEqual('');
                const data: CellClickEventArgs = schObj.getCellDetails(firstWorkCell);
                expect(data.startTime.getTime()).toEqual(new Date(2018, 4, 6).getTime());
                expect(data.endTime.getTime()).toEqual(new Date(2018, 4, 6, 0, 30).getTime());
                expect(data.isAllDay).toEqual(false);
                expect(data.groupIndex).toBe(0);
                expect(schObj.element.querySelectorAll('.e-work-hours,.e-work-days').length).toEqual(90 * resLength);
                const eventElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(eventElements.length).toEqual(7);
                const eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
                expect(eventWrapperList.length).toEqual(5);
                expect(schObj.element.querySelectorAll('.e-event-table > div').length).toEqual(resLength);
                expect(eventElements[0].getAttribute('data-group-index')).toEqual('3');
                expect(eventElements[0].style.backgroundColor).toEqual('rgb(255, 170, 0)');
                expect(eventElements[1].getAttribute('data-group-index')).toEqual('4');
                expect(eventElements[1].style.backgroundColor).toEqual('rgb(248, 163, 152)');
                done();
            };
        });

        it('navigate previous date', (done: DoneFn) => {
            (schObj.element.querySelector('.e-toolbar-item.e-prev') as HTMLElement).click();
            schObj.dataBound = () => {
                expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-timeline-week');
                expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('Apr 29 - May 05, 2018');
                expect(schObj.element.querySelectorAll('.e-date-header-wrap table col').length).toEqual(336);
                const headTrs: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-wrap tr'));
                expect(headTrs[0].children.length).toEqual(1);
                expect(headTrs[0].children[0].getAttribute('colSpan')).toEqual('336');
                expect(headTrs[0].children[0].innerHTML).toEqual('<span class="e-header-year" style="left: 5700px;">2018</span>');
                expect(headTrs[1].children.length).toEqual(2);
                expect(headTrs[1].children[0].getAttribute('colSpan')).toEqual('96');
                expect(headTrs[1].children[0].innerHTML).toEqual('<span class="e-header-month">April</span>');
                expect(headTrs[2].children.length).toEqual(1);
                expect(headTrs[2].children[0].getAttribute('colSpan')).toEqual('336');
                expect(headTrs[2].children[0].innerHTML).toEqual('<span class="e-header-week" style="left: 5700px;">18</span>');
                expect(headTrs[3].children.length).toEqual(7);
                expect(headTrs[3].children[0].getAttribute('colSpan')).toEqual('48');
                expect(headTrs[3].children[0].innerHTML).toEqual('<span class="e-header-date e-navigate">Apr 29, Sunday</span>');
                expect(headTrs[3].children[0].getAttribute('data-date')).toEqual(new Date(2018, 3, 29).getTime().toString());
                expect(headTrs[4].children.length).toEqual(336);
                expect(headTrs[4].children[0].getAttribute('colSpan')).toBeNull();
                expect(headTrs[4].children[0].innerHTML).toEqual('<span>12:00 AM</span>');
                expect(headTrs[4].children[1].innerHTML).toEqual('');
                expect(schObj.element.querySelectorAll('.e-resource-column-wrap table tbody tr').length).toEqual(resLength);
                expect(schObj.element.querySelectorAll('.e-resource-column-wrap table tbody tr td').length).toEqual(resLength);
                expect(schObj.element.querySelectorAll('.e-content-wrap table tbody tr').length).toEqual(resLength);
                expect(schObj.element.querySelectorAll('.e-content-wrap table col').length).toEqual(336);
                expect(schObj.element.querySelectorAll('.e-content-wrap table td').length).toEqual(336 * resLength);
                const firstWorkCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
                expect(firstWorkCell.getAttribute('aria-selected')).toEqual('false');
                expect(firstWorkCell.getAttribute('data-date')).toEqual(new Date(2018, 3, 29).getTime().toString());
                expect(firstWorkCell.getAttribute('data-group-index')).toEqual('0');
                expect(firstWorkCell.innerHTML).toEqual('');
                const data: CellClickEventArgs = schObj.getCellDetails(firstWorkCell);
                expect(data.startTime.getTime()).toEqual(new Date(2018, 3, 29).getTime());
                expect(data.endTime.getTime()).toEqual(new Date(2018, 3, 29, 0, 30).getTime());
                expect(data.isAllDay).toEqual(false);
                expect(data.groupIndex).toBe(0);
                expect(schObj.element.querySelectorAll('.e-work-hours,.e-work-days').length).toEqual(90 * resLength);
                const eventElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(eventElements.length).toEqual(18);
                const eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
                expect(eventWrapperList.length).toEqual(10);
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
                width: '500px', height: '500px', currentView: 'TimelineWeek',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek', 'TimelineMonth'],
                selectedDate: new Date(2017, 9, 30)
            };
            schObj = util.createSchedule(schOptions, blockData.slice(0, 14), done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('block event initial rendering testing', () => {
            expect(schObj.element.querySelectorAll('.e-block-appointment').length).toEqual(4);
            const blockEvent: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
            expect(blockEvent.offsetWidth).toEqual(150);
            expect(blockEvent.offsetLeft).toEqual(3400);
        });

        it('add event', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventWindow.dialogObject.visible).toEqual(false);
                const addedEvent: HTMLElement = schObj.element.querySelector('[data-id="Appointment_15"]') as HTMLElement;
                expect(addedEvent.offsetTop).toEqual(2);
                expect(addedEvent.offsetWidth).toEqual(100);
                expect(addedEvent.offsetHeight).toEqual(38);
                expect(addedEvent.offsetLeft).toEqual(2500);
                done();
            };
            expect(schObj.blockData.length).toEqual(7);
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'dblclick');
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
                const editedEvent: HTMLElement = schObj.element.querySelector('[data-id="Appointment_15"]') as HTMLElement;
                expect(editedEvent.offsetTop).toEqual(2);
                expect(editedEvent.offsetWidth).toEqual(100);
                expect(editedEvent.offsetHeight).toEqual(38);
                expect(editedEvent.offsetLeft).toEqual(5000);
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
            startRevisedObj.value = new Date(2017, 9, 31, 2, 0);
            startRevisedObj.dataBind();
            const endRevisedObj: DateTimePicker = util.getInstance(cls.EVENT_WINDOW_END_CLASS) as DateTimePicker;
            endRevisedObj.value = new Date(2017, 9, 31, 3, 0);
            endRevisedObj.dataBind();
            saveButton.click();
        });
    });

    describe('Multi level resource rendering in block events', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const schOptions: ScheduleModel = {
                height: '500px', width: '500px', currentView: 'TimelineWeek',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek', 'TimelineMonth'],
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
                expect(addedEvent.offsetWidth).toEqual(100);
                expect(addedEvent.offsetHeight).toEqual(38);
                expect(addedEvent.offsetLeft).toEqual(2500);
                done();
            };
            expect(schObj.blockData.length).toEqual(10);
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-content-table tr')[1].childNodes[73] as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-content-table tr')[1].childNodes[73] as HTMLElement, 'dblclick');
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
                expect(editedEvent.offsetWidth).toEqual(50);
                expect(editedEvent.offsetHeight).toEqual(38);
                expect(editedEvent.offsetLeft).toEqual(5750);
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
            endRevisedObj.value = new Date(2017, 9, 31, 10, 0);
            endRevisedObj.dataBind();
            saveButton.click();
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
            const colElement: HTMLElement =
                schObj.element.querySelector('.' + cls.CONTENT_WRAP_CLASS + ' table colgroup col:first-child') as HTMLElement;
            const tdElement: HTMLElement = schObj.element.querySelector('.' + cls.WORK_CELLS_CLASS) as HTMLElement;
            expect(colElement.offsetWidth).toEqual(tdElement.offsetWidth);
        });
        it('Check events offsetleft - slot count 6', (done: DoneFn) => {
            schObj.dataBound = () => {
                const colElement: HTMLElement =
                    schObj.element.querySelector('.' + cls.CONTENT_WRAP_CLASS + ' table colgroup col:first-child') as HTMLElement;
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
                    schObj.element.querySelector('.' + cls.CONTENT_WRAP_CLASS + ' table colgroup col:first-child') as HTMLElement;
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

    describe('checking indent template with resources', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                height: '580px', selectedDate: new Date(2018, 4, 1), currentView: 'TimelineWeek',
                group: { resources: ['Owners'] },
                resources: [{
                    field: 'OwnerId', title: 'Owner', name: 'Owners', allowMultiple: true,
                    dataSource: [
                        { OwnerText: 'Nancy', Id: 1, OwnerColor: '#ffaa00' },
                        { OwnerText: 'Steven', Id: 2, OwnerColor: '#f8a398' },
                        { OwnerText: 'Michael', Id: 3, OwnerColor: '#7499e1' },
                        { OwnerText: 'Oliver', Id: 4, OwnerColor: '#ffaa00' },
                        { OwnerText: 'John', Id: 5, OwnerColor: '#f8a398' }
                    ],
                    textField: 'OwnerText', idField: 'Id', colorField: 'OwnerColor'
                }],
                views: [
                    { option: 'TimelineDay' },
                    { option: 'TimelineWeek' },
                    { option: 'TimelineWorkWeek' },
                    { option: 'TimelineMonth' },
                    { option: 'TimelineYear', orientation: 'Vertical', displayName: 'VerticalYear' },
                    { option: 'TimelineYear', orientation: 'Horizontal', displayName: 'HorizontalYear' }
                ],
                headerIndentTemplate: '<div class="temp-wrap">Resources</div>'
            };
            schObj = util.createSchedule(model, [], done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Resource indent template', () => {
            expect(schObj.element.querySelector('.e-timeline-view')).toBeTruthy();
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-timeline-week');
            expect((schObj.element.querySelector('.e-resource-left-td') as HTMLElement).innerHTML).toEqual(
                '<div class="temp-wrap">Resources</div>');
            expect((schObj.element.querySelector('.e-resource-left-td') as HTMLElement).firstElementChild.classList.contains('temp-wrap'))
                .toBeTruthy();
        });

        it('changing current view and check resource indent template', () => {
            schObj.currentView = 'TimelineDay';
            schObj.dataBind();
            expect((schObj.element.querySelector('.e-resource-left-td') as HTMLElement).innerHTML).toEqual(
                '<div class="temp-wrap">Resources</div>');
            expect((schObj.element.querySelector('.e-resource-left-td') as HTMLElement).firstElementChild.classList.contains('temp-wrap'))
                .toBeTruthy();
            schObj.currentView = 'TimelineWorkWeek';
            schObj.dataBind();
            expect((schObj.element.querySelector('.e-resource-left-td') as HTMLElement).innerHTML).toEqual(
                '<div class="temp-wrap">Resources</div>');
            expect((schObj.element.querySelector('.e-resource-left-td') as HTMLElement).firstElementChild.classList.contains('temp-wrap'))
                .toBeTruthy();
            schObj.currentView = 'TimelineMonth';
            schObj.dataBind();
            expect((schObj.element.querySelector('.e-resource-left-td') as HTMLElement).innerHTML).toEqual(
                '<div class="temp-wrap">Resources</div>');
            expect((schObj.element.querySelector('.e-resource-left-td') as HTMLElement).firstElementChild.classList.contains('temp-wrap'))
                .toBeTruthy();
            schObj.currentView = 'TimelineYear';
            schObj.dataBind();
            expect((schObj.element.querySelector('.e-resource-left-td') as HTMLElement).innerHTML).toEqual(
                '<div class="temp-wrap">Resources</div>');
            expect((schObj.element.querySelector('.e-resource-left-td') as HTMLElement).firstElementChild.classList.contains('temp-wrap'))
                .toBeTruthy();
            schObj.changeCurrentView('TimelineYear', 1);
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-resource-cells').innerHTML).toEqual('<div class="temp-wrap">Resources</div>');
            expect(schObj.element.querySelector('.e-resource-cells').firstElementChild.classList.contains('temp-wrap'))
                .toBeTruthy();
        });

        it('checking indentTemplate property', () => {
            schObj.currentView = 'TimelineDay';
            schObj.headerIndentTemplate = '<div class="template-wrap">Testing</div>';
            schObj.dataBind();
            expect((schObj.element.querySelector('.e-resource-left-td') as HTMLElement).innerHTML).toEqual(
                '<div class="template-wrap">Testing</div>');
            expect((schObj.element.querySelector('.e-resource-left-td') as HTMLElement).firstElementChild.classList.contains('template-wrap'))
                .toBeTruthy();
        });
    });

    describe('checking indent template without resources', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                height: '580px', selectedDate: new Date(2018, 4, 1),
                views: [
                    { option: 'TimelineYear', isSelected: true, orientation: 'Vertical', displayName: 'VerticalYear' },
                    { option: 'TimelineYear', orientation: 'Horizontal', displayName: 'HorizontalYear' }
                ],
                headerIndentTemplate: '<div class="temp-wrap">Resources</div>'
            };
            schObj = util.createSchedule(model, [], done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('checking indent template', () => {
            expect(schObj.element.querySelector('.e-timeline-year-view')).toBeTruthy();
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-timeline-year');
            expect(schObj.element.querySelector('.e-header-cells').innerHTML).toEqual('<div class="temp-wrap">Resources</div>');
            expect(schObj.element.querySelector('.e-header-cells').firstElementChild.classList.contains('temp-wrap'))
                .toBeTruthy();
            schObj.changeCurrentView('TimelineYear', 1);
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-header-cells').innerHTML).toEqual('<div class="temp-wrap">Resources</div>');
            expect(schObj.element.querySelector('.e-header-cells').firstElementChild.classList.contains('temp-wrap'))
                .toBeTruthy();
        });

        it('checking indentTemplate property', () => {
            schObj.headerIndentTemplate = '<div class="template-wrap">Testing</div>';
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-header-cells').innerHTML).toEqual('<div class="template-wrap">Testing</div>');
            expect(schObj.element.querySelector('.e-header-cells').firstElementChild.classList.contains('template-wrap'))
                .toBeTruthy();
        });
    });

    describe('minimumEventDuration property', () => {
        let schObj: Schedule;
        const appointments: Record<string, any>[] = [{
            Id: 1,
            Subject: 'Paris',
            StartTime: new Date(2017, 10, 1, 10, 0),
            EndTime: new Date(2017, 10, 1, 10, 3),
            IsAllDay: false
        }, {
            Id: 2,
            Subject: 'Meeting',
            StartTime: new Date(2017, 10, 1, 10, 0),
            EndTime: new Date(2017, 10, 1, 10, 45),
            IsAllDay: false
        }];
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                height: '500px', selectedDate: new Date(2017, 10, 1),
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek'],
                currentView: 'TimelineWeek',
                eventSettings: { minimumEventDuration: 30 }
            };
            schObj = util.createSchedule(model, appointments, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Checking appointment width by setting minimumEventDuration property to 30 minutes', () => {
            const appointmentWrapper: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
            expect(appointmentWrapper.length).toEqual(1);
            const firstEvent: HTMLElement = schObj.element.querySelector('[data-id ="Appointment_1"]');
            expect(firstEvent.style.width).toEqual('50px');
            const secondEvent: HTMLElement = schObj.element.querySelector('[data-id ="Appointment_2"]');
            expect(secondEvent.style.width).toEqual('75px');
        });
        it('Checking appointment width by setting minimumEventDuration property to 1 minute (default)', () => {
            schObj.dataBound = null;
            schObj.eventSettings.minimumEventDuration = 1;
            schObj.dataBind();
            const appointmentWrapper: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
            expect(appointmentWrapper.length).toEqual(1);
            const firstEvent: HTMLElement = schObj.element.querySelector('[data-id ="Appointment_1"]');
            expect(firstEvent.style.width).toEqual('5px');
            const secondEvent: HTMLElement = schObj.element.querySelector('[data-id ="Appointment_2"]');
            expect(secondEvent.style.width).toEqual('75px');
        });
    });

    describe('EJ2-57866-Cell height is wrong while row auto height is set to true', () => {
        let schObj: Schedule;
        const appointments: Record<string, any>[] = [{
            Id: 1,
            Subject: 'App 1',
            StartTime: new Date(2021, 7, 2, 9),
            EndTime: new Date(2021, 7, 2, 11),
            RoomId: 1
        }, {
            Id: 2,
            Subject: 'App 2',
            StartTime: new Date(2021, 7, 2, 9),
            EndTime: new Date(2021, 7, 2, 9, 30),
            RoomId: 1
        }, {
            Id: 3,
            Subject: 'App 3',
            StartTime: new Date(2021, 7, 2, 9),
            EndTime: new Date(2021, 7, 2, 9, 30),
            RoomId: 1
        }, {
            Id: 4,
            Subject: 'App 4',
            StartTime: new Date(2021, 7, 2, 10, 30),
            EndTime: new Date(2021, 7, 2, 11),
            RoomId: 1
        }];
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                height: '500px',
                selectedDate: new Date(2021, 7, 2),
                rowAutoHeight: true,
                views: ['TimelineWeek'],
                group: { resources: ['MeetingRoom'] },
                resources: [{
                    field: 'RoomId', title: 'Room Type', name: 'MeetingRoom', allowMultiple: true,
                    dataSource: [
                        { text: 'Room A', id: 1, color: '#98AFC7' },
                        { text: 'Room B', id: 2, color: '#99c68e' },
                        { text: 'Room C', id: 3, color: '#C2B280' },
                        { text: 'Room D', id: 4, color: '#3090C7' },
                        { text: 'Room E', id: 5, color: '#95b9' },
                        { text: 'Room F', id: 6, color: '#95b9c7' },
                        { text: 'Room G', id: 7, color: '#deb887' },
                        { text: 'Room H', id: 8, color: '#3090C7' },
                        { text: 'Room I', id: 9, color: '#98AFC7' },
                        { text: 'Room J', id: 10, color: '#778899' }
                    ],
                    textField: 'text', idField: 'id', colorField: 'color'
                }]
            };
            schObj = util.createSchedule(model, appointments, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Checking the cell height', () => {
            const cell: HTMLElement = schObj.element.querySelector('.' + cls.WORK_CELLS_CLASS);
            const apps: NodeListOf<Element> = schObj.element.querySelectorAll('.' + cls.APPOINTMENT_CLASS);
            expect(cell.style.height).toEqual('139px');
            expect(apps.length).toEqual(4);
        });
    });

    describe('EJ2-62147 - CR Issue scrollTo', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                height: '500px', width: '400px', selectedDate: new Date(2018, 4, 1),
                views: [
                    { option: 'TimelineDay' },
                    { option: 'TimelineWeek', interval: 3 },
                    { option: 'Agenda' },
                    { option: 'Year' }
                ],
                currentView: 'TimelineWeek',
                timeScale: { enable: false }
            };
            schObj = util.createSchedule(model, timelineData, done);
            const contentWrap: HTMLElement = schObj.element.querySelector('.e-content-wrap');
            expect(contentWrap.scrollLeft).toEqual(0);
            schObj.scrollTo(null, new Date(2018, 4, 3));
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Checking with timescale disabled in timeline week view', () => {
            const contentWrap: HTMLElement = schObj.element.querySelector('.e-content-wrap');
            expect(contentWrap.scrollLeft).toEqual(200);
        });
        it('Checking with timescale disabled in timeline week view with rtl enabled', (done: DoneFn) => {
            schObj.enableRtl = true;
            schObj.dataBind();
            schObj.dataBound = () => {
                const contentWrap: HTMLElement = schObj.element.querySelector('.e-content-wrap');
                expect(contentWrap.scrollLeft).toEqual(0);
                schObj.scrollTo(null, new Date(2018, 4, 3));
                expect(contentWrap.scrollLeft).toEqual(-200);
                done();
            };
        });
        it('Checking in Agenda view', (done: DoneFn) => {
            schObj.currentView = 'Agenda';
            schObj.dataBind();
            schObj.dataBound = () => {
                const contentWrap: HTMLElement = schObj.element.querySelector('.e-content-wrap');
                expect(contentWrap.scrollTop).toEqual(1);
                schObj.scrollTo(null, new Date(2018, 4, 3));
                expect(contentWrap.scrollTop).toEqual(1286);
                done();
            };
        });
        it('Checking in Year view', (done: DoneFn) => {
            schObj.currentView = 'Year';
            schObj.dataBind();
            schObj.dataBound = () => {
                const contentWrap: HTMLElement = schObj.element.querySelector('.e-content-wrap');
                expect(contentWrap.scrollTop).toEqual(0);
                schObj.scrollTo(null, new Date(2018, 4, 3));
                expect(contentWrap.scrollTop).toEqual(1256);
                done();
            };
        });
        it('Changing the views for Checking in Agenda view with virtual scroll', (done: DoneFn) => {
            util.destroy(schObj);
            const model: ScheduleModel = {
                height: '500px', width: '400px', selectedDate: new Date(2018, 4, 1),
                views: [
                    { option: 'Agenda', allowVirtualScrolling: true }
                ]
            };
            schObj = util.createSchedule(model, timelineData, done);
        });
        it('Checking scrollTo with agenda virtual scroll', () => {
            const contentWrap: HTMLElement = schObj.element.querySelector('.e-content-wrap');
            expect(contentWrap.scrollTop).toEqual(1);
            schObj.scrollTo(null, new Date(2018, 4, 3));
            schObj.dataBound = () => {
                const contentWrap: HTMLElement = schObj.element.querySelector('.e-content-wrap');
                expect(contentWrap.scrollTop).toEqual(1);
            };
        });
    });

    describe('ES-826421 - Appointment misalignment issue', () => {
        let schObj: Schedule;
        const data: Record<string, any>[] = [{
            Id: 7,
            Subject: 'Project Review',
            StartTime: new Date(2023, 0, 4, 11, 15),
            EndTime: new Date(2023, 0, 4, 13, 0),
            TaskId: 1
        }, {
            Id: 13,
            Subject: 'Resolution-based testing',
            StartTime: new Date(2023, 0, 7, 13, 0),
            EndTime: new Date(2023, 0, 7, 15, 15),
            TaskId: 1
        }, {
            Id: 45,
            Subject: 'Timeline estimation',
            StartTime: new Date(2023, 0, 4, 9),
            EndTime: new Date(2023, 0, 4, 11),
            TaskId: 1
        }, {
            Id: 47,
            Subject: 'Project Review',
            StartTime: new Date(2023, 0, 4, 14),
            EndTime: new Date(2023, 0, 4, 16),
            TaskId: 1
        }, {
            Id: 49,
            Subject: 'Project Preview',
            StartTime: new Date(2023, 0, 4, 18, 0),
            EndTime: new Date(2023, 0, 4, 20),
            TaskId: 1
        }];
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                height: '200px',
                selectedDate: new Date(2023, 0, 4),
                timeScale: { enable: false },
                rowAutoHeight: true,
                views: ['TimelineWeek'],
                group: { resources: ['Categories'] },
                resources: [{
                    field: 'TaskId', title: 'Category',
                    name: 'Categories', allowMultiple: true,
                    dataSource: [{ text: 'Nancy', id: 1, groupId: 1, color: '#df5286' }],
                    textField: 'text', idField: 'id', groupIDField: 'groupId', colorField: 'color'
                }]
            };
            schObj = util.createSchedule(model, data, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Checking the scroll width of the col elements', () => {
            const contentWrap: HTMLElement = schObj.element.querySelector('.e-content-wrap');
            expect(contentWrap.style.height).toEqual('117px');
            expect(contentWrap.offsetWidth > contentWrap.clientWidth).toBeTruthy();
            const appEle: HTMLElement = schObj.element.querySelector('.e-appointment[data-id="Appointment_45"]') as HTMLElement;
            const workCell: HTMLElement = schObj.element.querySelector('.e-work-cells[data-date="1672790400000"]') as HTMLElement;
            expect(appEle.offsetLeft).toEqual(workCell.offsetLeft);
        });
    });

    describe('ES-844069 - Checking Current Time indicator', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                height: '500px',
                views: ['TimelineWeek'],
            };
            schObj = util.createSchedule(model, [], done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('with header rows', () => {
            const contentWrap: HTMLElement = schObj.element.querySelector('.e-content-wrap');
            expect(contentWrap.querySelector('.e-current-timeline')).toBeDefined();
            const timeIndicatorLeft: number = (contentWrap.querySelector('.e-current-timeline') as HTMLElement).offsetLeft;
            const contentTableWidth: number = (schObj.element.querySelector('.e-content-table') as HTMLElement).offsetWidth;
            expect(timeIndicatorLeft).toBeLessThanOrEqual(contentTableWidth);
        });
    });

    describe('Schedule TimelineWeek view with maxEventsPerRow property when the row have enough height', () => {
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
                currentView: 'TimelineWeek',
                selectedDate: new Date(2023, 10, 6),
                views: [{ option: 'TimelineWeek', maxEventsPerRow: 2 }]
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

    describe('Schedule TimelineWeek view with maxEventsPerRow property when the row does not have enough height', () => {
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
                currentView: 'TimelineWeek',
                selectedDate: new Date(2023, 10, 6),
                views: [{ option: 'TimelineWeek', maxEventsPerRow: 3 }]
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

    describe('Schedule TimelineWeek view with maxEventsPerRow property and multiple resource grouping', () => {
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
                currentView: 'TimelineWeek',
                selectedDate: new Date(2023, 10, 6),
                views: [{ option: 'TimelineWeek', maxEventsPerRow: 2 }],    
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
                }],
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

    describe('Schedule TimelineWeek view with maxEventsPerRow property when the row does not have enough height', () => {
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
                currentView: 'TimelineWeek',
                selectedDate: new Date(2023, 10, 6),
                views: [{ option: 'TimelineWeek', maxEventsPerRow: 3 }],    
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
                }],
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

    describe('EJ2-853941 - Appointments positioned incorrectly when using firstDayOfWeek with different time slot intervals', () => {
        let schObj: Schedule;
        const data: Record<string, any>[] = [{
            Id: 1,
            Subject: 'Explosion of Betelgeuse Star',
            Location: 'Space Centre USA',
            StartTime: new Date(2019, 0, 6, 12, 0),
            EndTime: new Date(2019, 1, 6, 15, 0),
            RoomId: 1,
            OwnerId: 1
        }, {
            Id: 2,
            Subject: 'Thule Air Crash Report',
            Location: 'Newyork City',
            StartTime: new Date(2019, 0, 6, 13, 0),
            EndTime: new Date(2019, 0, 6, 15, 0),
            RoomId: 1,
            OwnerId: 3
        }];
        beforeAll((done: DoneFn) => {
            const schOptions: ScheduleModel = {
                width: '100%',
                height: '550px',
                selectedDate: new Date(2019, 0, 6),
                currentView: 'TimelineWeek', views: [ 'TimelineWeek'],
                timeScale: { enable: true, interval: 300, slotCount: 4 },
                firstDayOfWeek: 1,
                eventSettings: { dataSource: data },
                group: { resources: ['Rooms', 'Owners'] },
                resources: [{
                    field: 'RoomId', title: 'Room', name: 'Rooms', allowMultiple: true,
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
            schObj = util.createSchedule(schOptions, data, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('checking appointment rendering', () => {
            expect(schObj.eventsData.length).toEqual(2);
            const eventList: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventList[0].style.left).toBe('6180px');
            expect(eventList[1].style.left).toBe('6220px');
        });
    });

    describe('ES-867036 - More indicator count incorrect on different time slots', () => {
        let schObj: Schedule;
        const data: Record<string, any>[] = [{
            Id: 1,
            Subject: '1',
            StartTime: new Date(2024, 0, 9, 7),
            EndTime: new Date(2024, 0, 9, 8),
            OwnerId: 1,
            RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;'
        },
        {
            Id: 2,
            Subject: '2',
            StartTime: new Date(2024, 0, 9, 8),
            EndTime: new Date(2024, 0, 9, 9),
            OwnerId: 1,
            RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;'
        },
        {
            Id: 3,
            Subject: '3',
            StartTime: new Date(2024, 0, 9, 9),
            EndTime: new Date(2024, 0, 9, 12),
            OwnerId: 1,
            RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;'
        },
        {
            Id: 4,
            Subject: '4',
            StartTime: new Date(2024, 0, 9, 8),
            EndTime: new Date(2024, 0, 9, 9),
            OwnerId: 1,
            RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;'
        }];
        beforeAll((done: DoneFn) => {
            const schOptions: ScheduleModel = {
                width: '100%',
                height: '550px',
                selectedDate: new Date(2024, 0, 9),
                timeScale: { enable: true, slotCount: 1, interval: 240 },
                views: [
                    { option: 'TimelineDay' }
                ],
                group: {
                    byGroupID: false,
                    resources: ['Owners']
                },
                resources: [
                    {
                        field: 'OwnerId', title: 'Owner', name: 'Owners', allowMultiple: true,
                        dataSource: [
                            { OwnerText: 'Nancy', Id: 1, OwnerColor: '#ffaa00' },
                            { OwnerText: 'Steven', Id: 2, OwnerColor: '#f8a398' },
                            { OwnerText: 'Michael', Id: 3, OwnerColor: '#7499e1' }
                        ],
                        textField: 'OwnerText', idField: 'Id', colorField: 'OwnerColor'
                    }
                ],
                eventSettings: {
                    dataSource: data,
                    enableMaxHeight: true,
                    enableIndicator: true
                }
            };
            schObj = util.createSchedule(schOptions, data, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('checking appointment rendering', () => {
            expect(schObj.eventsData.length).toEqual(4);
            const eventList: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventList.length).toEqual(3);
            const indicator: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
            expect(indicator.length).toEqual(1);
            expect(indicator[0].innerHTML).toEqual('+2&nbsp;more');
        });
    });

    describe('ES-866125 - Appointment disappearing issue', () => {
        let schObj: Schedule;
        const data: Record<string, any>[] = [{
            Id: 1,
            Subject: '1',
            StartTime: new Date(2024, 0, 28),
            EndTime: new Date(2024, 1, 4),
            IsAllDay: true
        }, {
            Id: 2,
            Subject: '2',
            StartTime: new Date(2024, 1, 4),
            EndTime: new Date(2024, 1, 11),
            IsAllDay: true
        }, {
            Id: 3,
            Subject: '3',
            StartTime: new Date(2024, 0, 28),
            EndTime: new Date(2024, 1, 4),
            IsAllDay: true
        }, {
            Id: 4,
            Subject: '4',
            StartTime: new Date(2024, 0, 28),
            EndTime: new Date(2024, 1, 4),
            IsAllDay: true
        }];
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                width: '100%',
                height: '250px',
                selectedDate: new Date(2024, 0, 28),
                currentView: 'TimelineWeek',
                views: [{ option: 'TimelineWeek', interval: 2 }],
                headerRows: [
                    { option: 'Year' },
                    { option: 'Week' }
                ],
                rowAutoHeight: true,
            };
            schObj = util.createSchedule(model, data, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Checking the scroll width of the col elements and appointment position', () => {
            const contentWrap: HTMLElement = schObj.element.querySelector('.e-content-wrap');
            expect(contentWrap.style.height).toEqual('131px');
            expect(contentWrap.offsetWidth > contentWrap.clientWidth).toBeTruthy();
            const appEle: HTMLElement = schObj.element.querySelector('.e-appointment[data-id="Appointment_2"]') as HTMLElement;
            const workCell: HTMLElement = schObj.element.querySelector('.e-work-cells[data-date="1707004800000"]') as HTMLElement;
            expect(appEle.offsetLeft).toEqual(workCell.offsetLeft);
        });
    });

    describe('ES-886455 - Overlap with same event duration', () => {
        let schObj: Schedule;
        const data: Record<string, any>[] = [{
            Id: 1,
            Subject: 'Workflow Analysis',
            StartTime: new Date(2023, 1, 4, 9, 30),
            EndTime: new Date(2023, 1, 4, 9, 30)
        }, {
            Id: 2,
            Subject: 'New Analysis',
            StartTime: new Date(2023, 1, 4, 9, 30),
            EndTime: new Date(2023, 1, 4, 9, 30)
        }];
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                width: '100%',
                height: '250px',
                selectedDate: new Date(2023, 1, 4),
                currentView: 'TimelineDay',
                views: [{ option: 'TimelineDay' }]
            };
            schObj = util.createSchedule(model, data, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Checking overlapping events when events having same duration', () => {
            const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList.length).toEqual(2);
            expect((eventElementList[0] as HTMLElement).style.top).toEqual('2px');
            expect((eventElementList[0] as HTMLElement).style.width).toEqual('50px');
            expect((eventElementList[1] as HTMLElement).style.top).toEqual('42px');
            expect((eventElementList[1] as HTMLElement).style.width).toEqual('50px');
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
