/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * QuickPopups spec
 */
import { remove, isVisible, Browser, closest, createElement, append } from '@syncfusion/ej2-base';
import {
    Schedule, Day, Week, WorkWeek, Month, Agenda, TimelineViews, EJ2Instance,
    EventRenderedArgs, ScheduleModel, CellClickEventArgs, Timezone, MoreEventsClickArgs, CallbackFunction
} from '../../../src/schedule/index';
import { RecurrenceEditor } from '../../../src/recurrence-editor/index';
import { defaultData, resourceData, timelineData } from '../base/datasource.spec';
import { PopupOpenEventArgs, EventClickArgs } from '../../../src/index';
import * as cls from '../../../src/schedule/base/css-constant';
import * as util from '../util.spec';
import { profile, inMB, getMemoryProfile } from '../../common.spec';
import { DateTimePicker } from '@syncfusion/ej2-calendars';

Schedule.Inject(Day, Week, WorkWeek, Month, Agenda, TimelineViews);

describe('Quick Popups', () => {
    beforeAll(() => {
        const isDef: (o: any) => boolean = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            // eslint-disable-next-line no-console
            console.log('Unsupported environment, window.performance.memory is unavailable');
            (this as any).skip(); //Skips test (in Chai)
            return;
        }
    });

    describe('Tooltip and Dialog for vertical view', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = { height: '500px', selectedDate: new Date(2017, 10, 1) };
            schObj = util.createSchedule(model, defaultData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Cell Click and open event window', () => {
            const workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-hours'));
            workCells[1].click();
            const cellPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(cellPopup.classList).toContain('e-popup-open');
            (<HTMLElement>cellPopup.querySelector('.e-event-details')).click();
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            (dialogElement.querySelector('.e-event-cancel') as HTMLElement).click();
        });

        it('Event click client side event', () => {
            schObj.eventClick = (args: EventClickArgs) => args.cancel = true;
            const eventElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElements).toBeTruthy();
            eventElements[1].click();
        });

        it('Event Click and Delete event', () => {
            schObj.eventClick = (args: EventClickArgs) => args.cancel = false;
            const eventElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            eventElements[1].click();
            const eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup).toBeTruthy();
            (<HTMLElement>eventPopup.querySelector('.e-event-delete')).click();
            (<HTMLElement>document.body.querySelector('.e-quick-dialog-cancel')).click();
        });

        it('Event Click and Delete series', () => {
            const eventElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            eventElements[10].click();
            const eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup).toBeTruthy();
            (<HTMLElement>eventPopup.querySelector('.e-event-delete')).click();
            (<HTMLElement>schObj.quickPopup.quickDialog.element.querySelector('.e-dlg-closeicon-btn')).click();
        });

        it('Event click edit occurance', () => {
            const eventElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            eventElements[10].click();
            const eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup).toBeTruthy();
            (<HTMLElement>eventPopup.querySelector('.e-event-edit')).click();
            (<HTMLElement>schObj.quickPopup.quickDialog.element.querySelector('.e-dlg-closeicon-btn')).click();
        });

        it('Tooltip close', () => {
            const eventElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            eventElements[1].click();
            const eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup).toBeTruthy();
            (<HTMLElement>eventPopup.querySelector('.e-close')).click();
        });

        it('Cell Click and Save new event', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(44);
                done();
            };
            const workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-hours'));
            workCells[0].click();
            const cellPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            (<HTMLInputElement>cellPopup.querySelector('.e-subject')).value = 'Welcome';
            (<HTMLElement>cellPopup.querySelector('.e-event-create')).click();
        });

        it('Cell Click and Save new event with default value', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(45);
                done();
            };
            const workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-hours'));
            workCells[0].click();
            const cellPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            (<HTMLElement>cellPopup.querySelector('.e-event-create')).click();
        });

        it('Event Dialog Delete Click', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(44);
                done();
            };
            const eventElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            eventElements[1].click();
            const eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup).toBeTruthy();
            (<HTMLElement>eventPopup.querySelector('.e-delete')).click();
            (<HTMLElement>document.body.querySelector('.e-quick-dialog-delete')).click();
        });

        it('Event Dialog Cancel Click', () => {
            const eventElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            eventElements[1].click();
            const eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup).toBeTruthy();
            (<HTMLElement>eventPopup.querySelector('.e-delete')).click();
            (<HTMLElement>document.body.querySelector('.e-quick-dialog-cancel')).click();
        });

        it('Event Dialog Close icon click', () => {
            const eventElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            eventElements[1].click();
            const eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup).toBeTruthy();
            (<HTMLElement>eventPopup.querySelector('.e-delete')).click();
            (<HTMLElement>schObj.quickPopup.quickDialog.element.querySelector('.e-dlg-closeicon-btn')).click();
        });

        it('Prevent event click quickInfo', () => {
            schObj.popupOpen = (args: PopupOpenEventArgs) =>
                args.cancel = (args.type === 'QuickInfo' && args.target.classList.contains(cls.APPOINTMENT_CLASS));
            (schObj.element.querySelector('.e-appointment') as HTMLElement).click();
            expect(schObj.quickPopup.quickPopup.element.classList).toContain('e-popup-close');
        });

        it('Prevent cell click quickInfo', () => {
            schObj.popupOpen = (args: PopupOpenEventArgs) =>
                args.cancel = (args.type === 'QuickInfo' && args.target.classList.contains('e-work-cells'));
            (schObj.element.querySelector('.e-work-cells') as HTMLElement).click();
            expect(schObj.quickPopup.quickPopup.element.classList).toContain('e-popup-close');
        });

        it('Prevent cell click for custom work hours quickInfo', () => {
            schObj.popupOpen = (args: PopupOpenEventArgs) => {
                if (args.target && args.target.classList.contains('e-work-cells')) {
                    args.cancel = !args.target.classList.contains('e-work-hours');
                }
            };
            (schObj.element.querySelector('.e-work-cells') as HTMLElement).click();
            expect(schObj.quickPopup.quickPopup.element.classList).toContain('e-popup-close');
        });

        it('Prevent delete alert', () => {
            schObj.popupOpen = (args: PopupOpenEventArgs) => args.cancel = (args.type === 'DeleteAlert');
            (schObj.element.querySelector('.e-appointment') as HTMLElement).click();
            const eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup).toBeTruthy();
            (<HTMLElement>eventPopup.querySelector('.e-delete')).click();
            expect(isVisible(document.querySelector('.e-quick-dialog'))).toBe(false);
        });

        it('showQuickInfo property checking', () => {
            schObj.popupOpen = null;
            schObj.showQuickInfo = false;
            schObj.dataBind();
            const workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-hours'));
            workCells[0].click();
            const eventElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            eventElements[0].click();
        });

        it('Cell Click and open event window with subject value', () => {
            schObj.showQuickInfo = true;
            schObj.dataBind();
            const workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.' + cls.WORK_HOURS_CLASS));
            workCells[1].click();
            const eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            (<HTMLInputElement>eventPopup.querySelector('.' + cls.SUBJECT_CLASS)).value = 'Meeting';
            (<HTMLInputElement>eventPopup.querySelector('.' + cls.QUICK_POPUP_EVENT_DETAILS_CLASS)).click();
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const subjectElement: HTMLInputElement = dialogElement.querySelector('.' + cls.SUBJECT_CLASS);
            expect(subjectElement.value).toEqual('Meeting');
            (dialogElement.querySelector('.' + cls.EVENT_WINDOW_CANCEL_BUTTON_CLASS) as HTMLElement).click();
        });
    });

    describe('Tooltip and Dialog for timeline view', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                height: '500px', selectedDate: new Date(2017, 10, 1), currentView: 'TimelineWeek',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek']
            };
            schObj = util.createSchedule(model, defaultData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Cell Click and open event window', () => {
            const workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-hours'));
            workCells[1].click();
            const cellPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(cellPopup.classList).toContain('e-popup-open');
            (<HTMLElement>cellPopup.querySelector('.e-event-details')).click();
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            (dialogElement.querySelector('.e-event-cancel') as HTMLElement).click();
        });

        it('Event click client side event', () => {
            schObj.eventClick = (args: EventClickArgs) => args.cancel = true;
            schObj.dataBind();
            const eventElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElements).toBeTruthy();
            eventElements[1].click();
            schObj.eventClick = (args: EventClickArgs) => { args.cancel = false; };
            schObj.dataBind();
        });

        it('Event Click and Delete event', () => {
            const eventElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            eventElements[1].click();
            const eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup).toBeTruthy();
            (<HTMLElement>eventPopup.querySelector('.e-event-delete')).click();
            (<HTMLElement>document.body.querySelector('.e-quick-dialog-cancel')).click();
        });

        it('Event Click and Delete series', () => {
            const eventElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            eventElements[10].click();
            const eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup).toBeTruthy();
            (<HTMLElement>eventPopup.querySelector('.e-event-delete')).click();
            (<HTMLElement>schObj.quickPopup.quickDialog.element.querySelector('.e-dlg-closeicon-btn')).click();
        });

        it('Event click edit occurance', () => {
            const eventElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            eventElements[10].click();
            const eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup).toBeTruthy();
            (<HTMLElement>eventPopup.querySelector('.e-event-edit')).click();
            (<HTMLElement>schObj.quickPopup.quickDialog.element.querySelector('.e-dlg-closeicon-btn')).click();
        });

        it('Tooltip close', () => {
            const eventElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            eventElements[1].click();
            const eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup).toBeTruthy();
            (<HTMLElement>eventPopup.querySelector('.e-close')).click();
        });

        it('Cell Click and Save new event', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(44);
                done();
            };
            const workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-hours'));
            workCells[0].click();
            const cellPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            (<HTMLInputElement>cellPopup.querySelector('.e-subject')).value = 'Welcome';
            (<HTMLElement>cellPopup.querySelector('.e-event-create')).click();
        });

        it('Cell Click and Save new event with default value', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(45);
                done();
            };
            const workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-hours'));
            workCells[0].click();
            const cellPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            (<HTMLElement>cellPopup.querySelector('.e-event-create')).click();
        });

        it('Event Dialog Delete Click', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(44);
                done();
            };
            const eventElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            eventElements[1].click();
            const eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup).toBeTruthy();
            (<HTMLElement>eventPopup.querySelector('.e-delete')).click();
            (<HTMLElement>document.body.querySelector('.e-quick-dialog-delete')).click();
        });

        it('Event Dialog Cancel Click', () => {
            const eventElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            eventElements[1].click();
            const eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup).toBeTruthy();
            (<HTMLElement>eventPopup.querySelector('.e-delete')).click();
            (<HTMLElement>document.body.querySelector('.e-quick-dialog-cancel')).click();
        });

        it('Event Dialog Close icon click', () => {
            const eventElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            eventElements[1].click();
            const eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup).toBeTruthy();
            (<HTMLElement>eventPopup.querySelector('.e-delete')).click();
            (<HTMLElement>schObj.quickPopup.quickDialog.element.querySelector('.e-dlg-closeicon-btn')).click();
        });

        it('Prevent event click quickInfo', () => {
            schObj.popupOpen = (args: PopupOpenEventArgs) =>
                args.cancel = (args.type === 'QuickInfo' && args.target.classList.contains(cls.APPOINTMENT_CLASS));
            (schObj.element.querySelector('.e-appointment') as HTMLElement).click();
            expect(schObj.quickPopup.quickPopup.element.classList).toContain('e-popup-close');
        });

        it('Prevent cell click quickInfo', () => {
            schObj.popupOpen = (args: PopupOpenEventArgs) =>
                args.cancel = (args.type === 'QuickInfo' && args.target.classList.contains('e-work-cells'));
            (schObj.element.querySelector('.e-work-cells') as HTMLElement).click();
            expect(schObj.quickPopup.quickPopup.element.classList).toContain('e-popup-close');
        });

        it('Prevent cell click for custom work hours quickInfo', () => {
            schObj.popupOpen = (args: PopupOpenEventArgs) => {
                if (args.target && args.target.classList.contains('e-work-cells')) {
                    args.cancel = !args.target.classList.contains('e-work-hours');
                }
            };
            (schObj.element.querySelector('.e-work-cells') as HTMLElement).click();
            expect(schObj.quickPopup.quickPopup.element.classList).toContain('e-popup-close');
        });

        it('Prevent delete alert', () => {
            schObj.popupOpen = (args: PopupOpenEventArgs) => args.cancel = (args.type === 'DeleteAlert');
            (schObj.element.querySelector('.e-appointment') as HTMLElement).click();
            const eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup).toBeTruthy();
            (<HTMLElement>eventPopup.querySelector('.e-delete')).click();
            expect(isVisible(document.querySelector('.e-quick-dialog'))).toBe(false);
        });

        it('showQuickInfo property checking', () => {
            schObj.popupOpen = null;
            schObj.showQuickInfo = false;
            schObj.dataBind();
            const workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-hours'));
            workCells[0].click();
            const eventElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            eventElements[0].click();
        });

        it('Cell Click and open event window with subject value', () => {
            schObj.showQuickInfo = true;
            schObj.dataBind();
            const workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.' + cls.WORK_HOURS_CLASS));
            workCells[1].click();
            const eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            (<HTMLInputElement>eventPopup.querySelector('.' + cls.SUBJECT_CLASS)).value = 'Meeting';
            (<HTMLInputElement>eventPopup.querySelector('.' + cls.QUICK_POPUP_EVENT_DETAILS_CLASS)).click();
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const subjectElement: HTMLInputElement = dialogElement.querySelector('.' + cls.SUBJECT_CLASS);
            expect(subjectElement.value).toEqual('Meeting');
            (dialogElement.querySelector('.' + cls.EVENT_WINDOW_CANCEL_BUTTON_CLASS) as HTMLElement).click();
        });
    });

    describe('checking quickInfoTemplate for cellClick', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const headerScript: HTMLElement = createElement('script', {
                id: 'headerTemplate', attrs: { type: 'text/x-template' },
                innerHTML: '<div class="header-template">${if(elementType === "cell")}<div class="e-cell-header">' +
                    '<div class="e-header-icon-wrapper"><button class="e-close" title = "Close"></button></div></div>${else}' +
                    '<div class="e-event-header"><div class="e-header-icon-wrapper"><button class="e-close" title="CLOSE"></button></div>' +
                    '</div>${/if}</div>'
            });
            const contentScript: HTMLElement = createElement('script', {
                id: 'contentTemplate', attrs: { type: 'text/x-template' },
                innerHTML: '<div class="content-template">${if (elementType === "cell")}<div class="e-cell-content"><form class=' +
                    '"e-schedule-form"><div><input class="e-subject e-field" type="text" name="Subject" placeholder="Title"></div><div>' +
                    '<input class="e-location e-field" type="text" name="Location" placeholder="Location"></div></form></div>${else}' +
                    '<div class="e-event-content"><div class="e-subject-wrap">${if (Subject)}' +
                    '<div class="subject">${Subject}</div>${/if} ${if (Location)}<div class="location">${Location}</div>${/if} ' +
                    '${if (Description)}<div class="description">${Description}</div>${/if}</div></div>${/if}</div>'
            });
            const footerScript: HTMLElement = createElement('script', {
                id: 'footerTemplate', attrs: { type: 'text/x-template' },
                innerHTML: '<div class="footer-template">${if (elementType === "cell")}<div class="e-cell-footer"><button class=' +
                    '"e-event-details" title="Extra Details">Extra Details</button><button class="e-event-create" title="Add">Add' +
                    '</button></div>${else}<div class="e-event-footer"><button class="e-event-edit" title="Edit">Edit</button>' +
                    '<button class="e-event-delete" title="Delete">Delete</button></div>${/if}</div>'
            });
            append([headerScript, contentScript, footerScript], document.getElementsByTagName('head')[0]);
            const model: ScheduleModel = { height: '500px', currentView: 'Week', views: ['Week'], selectedDate: new Date(2017, 10, 1) };
            schObj = util.createSchedule(model, [], done);
        });
        afterAll(() => {
            util.destroy(schObj);
            document.getElementById('headerTemplate').remove();
            document.getElementById('contentTemplate').remove();
            document.getElementById('footerTemplate').remove();
        });

        it('checking header, content and footer area for cell-quick popup', () => {
            schObj.quickInfoTemplates = {
                templateType: 'Cell',
                header: '#headerTemplate',
                content: '#contentTemplate',
                footer: '#footerTemplate'
            };
            schObj.dataBind();
            const workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-hours'));
            workCells[1].click();
            const cellPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(cellPopup.classList).toContain('e-popup-open');
            expect(cellPopup.querySelector('.header-template')).toBeTruthy();
            expect(cellPopup.querySelector('.content-template')).toBeTruthy();
            const contentFieldEle: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-field'));
            expect(contentFieldEle.length).toEqual(2);
            expect(contentFieldEle[0].classList.contains('e-subject')).toEqual(true);
            expect(contentFieldEle[1].classList.contains('e-location')).toEqual(true);
            expect(cellPopup.querySelector('.footer-template')).toBeTruthy();
            const footerEle: HTMLElement = cellPopup.querySelector('.e-cell-footer') as HTMLElement;
            expect(footerEle.firstElementChild.classList).toContain('e-event-details');
            expect(footerEle.lastElementChild.classList).toContain('e-event-create');
            (<HTMLElement>cellPopup.querySelector('.e-close')).click();
        });

        it('checking header area of cell-quick popup', () => {
            schObj.quickInfoTemplates = {
                templateType: 'Cell',
                header: '#headerTemplate',
                content: null,
                footer: null
            };
            schObj.dataBind();
            const workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-hours'));
            workCells[1].click();
            const cellPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(cellPopup.classList).toContain('e-popup-open');
            expect(schObj.element.querySelector('.header-template')).toBeTruthy();
            expect(schObj.element.querySelector('.content-template')).toBeNull();
            expect(schObj.element.querySelector('.footer-template')).toBeNull();
            (<HTMLElement>cellPopup.querySelector('.e-close')).click();
        });

        it('checking content area of cell-quick popup', () => {
            schObj.quickInfoTemplates = {
                templateType: 'Cell',
                header: null,
                content: '#contentTemplate',
                footer: null
            };
            schObj.dataBind();
            const workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-hours'));
            workCells[1].click();
            const cellPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(cellPopup.classList).toContain('e-popup-open');
            expect(cellPopup.querySelector('.content-template')).toBeTruthy();
            const contentFieldEle: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-field'));
            expect(contentFieldEle.length).toEqual(2);
            expect(contentFieldEle[0].classList.contains('e-subject')).toEqual(true);
            expect(contentFieldEle[1].classList.contains('e-location')).toEqual(true);
            expect(cellPopup.querySelector('.header-template')).toBeNull();
            expect(cellPopup.querySelector('.footer-template')).toBeNull();
            (<HTMLElement>cellPopup.querySelector('.e-close')).click();
        });

        it('checking footer area of cell-quick popup', () => {
            schObj.quickInfoTemplates = {
                templateType: 'Cell',
                header: null,
                content: null,
                footer: '#footerTemplate'
            };
            schObj.dataBind();
            const workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-hours'));
            workCells[1].click();
            const cellPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(cellPopup.classList).toContain('e-popup-open');
            expect(cellPopup.querySelector('.header-template')).toBeNull();
            expect(cellPopup.querySelector('.content-template')).toBeNull();
            expect(cellPopup.querySelector('.footer-template')).toBeTruthy();
            const footerEle: HTMLElement = cellPopup.querySelector('.e-cell-footer') as HTMLElement;
            expect(footerEle.firstElementChild.classList).toContain('e-event-details');
            expect(footerEle.lastElementChild.classList).toContain('e-event-create');
            (<HTMLElement>cellPopup.querySelector('.e-close')).click();
        });

        it('checking header and content for cell-quick popup', () => {
            schObj.quickInfoTemplates = {
                templateType: 'Cell',
                header: '#headerTemplate',
                content: '#contentTemplate',
                footer: null
            };
            schObj.dataBind();
            const workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-hours'));
            workCells[1].click();
            const cellPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(cellPopup.classList).toContain('e-popup-open');
            expect(cellPopup.querySelector('.header-template')).toBeTruthy();
            expect(cellPopup.querySelector('.content-template')).toBeTruthy();
            const contentFieldEle: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-field'));
            expect(contentFieldEle.length).toEqual(2);
            expect(contentFieldEle[0].classList.contains('e-subject')).toEqual(true);
            expect(contentFieldEle[1].classList.contains('e-location')).toEqual(true);
            expect(cellPopup.querySelector('.footer-template')).toBeNull();
            (<HTMLElement>cellPopup.querySelector('.e-close')).click();
        });

        it('checking content and footer area for cell-quick popup', () => {
            schObj.quickInfoTemplates = {
                templateType: 'Cell',
                header: null,
                content: '#contentTemplate',
                footer: '#footerTemplate'
            };
            schObj.dataBind();
            const workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-hours'));
            workCells[1].click();
            const cellPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(cellPopup.classList).toContain('e-popup-open');
            expect(cellPopup.querySelector('.header-template')).toBeNull();
            expect(cellPopup.querySelector('.content-template')).toBeTruthy();
            const contentFieldEle: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-field'));
            expect(contentFieldEle.length).toEqual(2);
            expect(contentFieldEle[0].classList.contains('e-subject')).toEqual(true);
            expect(contentFieldEle[1].classList.contains('e-location')).toEqual(true);
            expect(cellPopup.querySelector('.footer-template')).toBeTruthy();
            const footerEle: HTMLElement = cellPopup.querySelector('.e-cell-footer') as HTMLElement;
            expect(footerEle.firstElementChild.classList).toContain('e-event-details');
            expect(footerEle.lastElementChild.classList).toContain('e-event-create');
            (<HTMLElement>cellPopup.querySelector('.e-close')).click();
        });

        it('checking header and footer area for cell-quick popup', () => {
            schObj.quickInfoTemplates = {
                templateType: 'Cell',
                header: '#headerTemplate',
                content: null,
                footer: '#footerTemplate'
            };
            schObj.dataBind();
            const workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-hours'));
            workCells[1].click();
            const cellPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(cellPopup.classList).toContain('e-popup-open');
            expect(cellPopup.querySelector('.header-template')).toBeTruthy();
            expect(cellPopup.querySelector('.content-template')).toBeNull();
            expect(cellPopup.querySelector('.footer-template')).toBeTruthy();
            const footerEle: HTMLElement = cellPopup.querySelector('.e-cell-footer') as HTMLElement;
            expect(footerEle.firstElementChild.classList).toContain('e-event-details');
            expect(footerEle.lastElementChild.classList).toContain('e-event-create');
            (<HTMLElement>cellPopup.querySelector('.e-close')).click();
        });

        it('checking header, content and footer area for cell-quick popup', () => {
            schObj.quickInfoTemplates = {
                templateType: 'Cell',
                header: '#headerTemplate',
                content: '#contentTemplate',
                footer: '#footerTemplate'
            };
            schObj.dataBind();
            const workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-hours'));
            workCells[1].click();
            const cellPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(cellPopup.classList).toContain('e-popup-open');
            schObj.refresh();
        });
    });

    describe('checking quickInfoTemplate for eventClick', () => {
        let schObj: Schedule;
        const eventData: Record<string, any>[] = [{
            Id: 1,
            Subject: 'Testing',
            StartTime: new Date(2017, 10, 1, 10),
            EndTime: new Date(2017, 10, 1, 12)
        }];
        beforeAll((done: DoneFn) => {
            const headerScript: HTMLElement = createElement('script', {
                id: 'headerTemplate', attrs: { type: 'text/x-template' },
                innerHTML: '<div class="header-template">${if(elementType === "cell")}<div class="e-cell-header">' +
                    '<div class="e-header-icon-wrapper"><button class="e-close" title = "Close"></button></div></div>${else}' +
                    '<div class="e-event-header"><div class="e-header-icon-wrapper"><button class="e-close" title="CLOSE"></button></div>' +
                    '</div>${/if}</div>'
            });
            const contentScript: HTMLElement = createElement('script', {
                id: 'contentTemplate', attrs: { type: 'text/x-template' },
                innerHTML: '<div class="content-template">${if (elementType === "cell")}<div class="e-cell-content"><form class=' +
                    '"e-schedule-form"><div><input class="e-subject e-field" type="text" name="Subject" placeholder="Title"></div><div>' +
                    '<input class="e-location e-field" type="text" name="Location" placeholder="Location"></div></form></div>${else}' +
                    '<div class="e-event-content"><div class="e-subject-wrap">${if (Subject)}' +
                    '<div class="subject">${Subject}</div>${/if} ${if (Location)}<div class="location">${Location}</div>${/if} ' +
                    '${if (Description)}<div class="description">${Description}</div>${/if}</div></div>${/if}</div>'
            });
            const footerScript: HTMLElement = createElement('script', {
                id: 'footerTemplate', attrs: { type: 'text/x-template' },
                innerHTML: '<div class="footer-template">${if (elementType === "cell")}<div class="e-cell-footer"><button class=' +
                    '"e-event-details" title="Extra Details">Extra Details</button><button class="e-event-create" title="Add">Add' +
                    '</button></div>${else}<div class="e-event-footer"><button class="e-event-edit" title="Edit">Edit</button>' +
                    '<button class="e-event-delete" title="Delete">Delete</button></div>${/if}</div>'
            });
            append([headerScript, contentScript, footerScript], document.getElementsByTagName('head')[0]);
            const model: ScheduleModel = {
                height: '500px', currentView: 'Week', selectedDate: new Date(2017, 10, 1),
                views: ['Day', 'Week', 'WorkWeek', 'Month']
            };
            schObj = util.createSchedule(model, eventData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
            document.getElementById('headerTemplate').remove();
            document.getElementById('contentTemplate').remove();
            document.getElementById('footerTemplate').remove();
        });

        it('checking header, content and footer area for event-quick popup', () => {
            schObj.quickInfoTemplates = {
                templateType: 'Event',
                header: '#headerTemplate',
                content: '#contentTemplate',
                footer: '#footerTemplate'
            };
            schObj.dataBind();
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-appointment')[0] as HTMLElement, 'click');
            const cellPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(cellPopup.classList).toContain('e-popup-open');
            expect(cellPopup.querySelector('.header-template')).toBeTruthy();
            expect(cellPopup.querySelector('.content-template')).toBeTruthy();
            const contentFieldEle: HTMLElement[] = [].slice.call(cellPopup.querySelectorAll('.content-template'));
            expect(contentFieldEle.length).toEqual(1);
            expect(contentFieldEle[0].innerText).toContain('Testing');
            expect(cellPopup.querySelector('.footer-template')).toBeTruthy();
            const footerEle: HTMLElement = cellPopup.querySelector('.e-event-footer') as HTMLElement;
            expect(footerEle.firstElementChild.classList).toContain('e-event-edit');
            expect(footerEle.lastElementChild.classList).toContain('e-event-delete');
            (<HTMLElement>cellPopup.querySelector('.e-close')).click();
        });

        it('checking header area of event-quick popup', () => {
            schObj.quickInfoTemplates = {
                templateType: 'Event',
                header: '#headerTemplate',
                content: null,
                footer: null
            };
            schObj.dataBind();
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-appointment')[0] as HTMLElement, 'click');
            const cellPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(cellPopup.classList).toContain('e-popup-open');
            expect(cellPopup.querySelector('.header-template')).toBeTruthy();
            expect(cellPopup.querySelector('.content-template')).toBeNull();
            expect(cellPopup.querySelector('.footer-template')).toBeNull();
            (<HTMLElement>cellPopup.querySelector('.e-close')).click();
        });

        it('checking content area of event-quick popup', () => {
            schObj.quickInfoTemplates = {
                templateType: 'Event',
                header: null,
                content: '#contentTemplate',
                footer: null
            };
            schObj.dataBind();
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-appointment')[0] as HTMLElement, 'click');
            const cellPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(cellPopup.classList).toContain('e-popup-open');
            expect(cellPopup.querySelector('.content-template')).toBeTruthy();
            const contentFieldEle: HTMLElement[] = [].slice.call(cellPopup.querySelectorAll('.content-template'));
            expect(contentFieldEle.length).toEqual(1);
            expect(contentFieldEle[0].innerText).toContain('Testing');
            expect(cellPopup.querySelector('.header-template')).toBeNull();
            expect(cellPopup.querySelector('.footer-template')).toBeNull();
            (<HTMLElement>cellPopup.querySelector('.e-close')).click();
        });

        it('checking footer area of event-quick popup', () => {
            schObj.quickInfoTemplates = {
                templateType: 'Event',
                header: null,
                content: null,
                footer: '#footerTemplate'
            };
            schObj.dataBind();
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-appointment')[0] as HTMLElement, 'click');
            const cellPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(cellPopup.classList).toContain('e-popup-open');
            expect(cellPopup.querySelector('.header-template')).toBeNull();
            expect(cellPopup.querySelector('.content-template')).toBeNull();
            expect(cellPopup.querySelector('.footer-template')).toBeTruthy();
            const footerEle: HTMLElement = cellPopup.querySelector('.e-event-footer') as HTMLElement;
            expect(footerEle.firstElementChild.classList).toContain('e-event-edit');
            expect(footerEle.lastElementChild.classList).toContain('e-event-delete');
            (<HTMLElement>cellPopup.querySelector('.e-close')).click();
        });

        it('checking header and content area for event-quick popup', () => {
            schObj.quickInfoTemplates = {
                templateType: 'Event',
                header: '#headerTemplate',
                content: '#contentTemplate',
                footer: null
            };
            schObj.dataBind();
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-appointment')[0] as HTMLElement, 'click');
            const cellPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(cellPopup.classList).toContain('e-popup-open');
            expect(cellPopup.querySelector('.header-template')).toBeTruthy();
            expect(cellPopup.querySelector('.content-template')).toBeTruthy();
            const contentFieldEle: HTMLElement[] = [].slice.call(cellPopup.querySelectorAll('.content-template'));
            expect(contentFieldEle.length).toEqual(1);
            expect(contentFieldEle[0].innerText).toContain('Testing');
            expect(cellPopup.querySelector('.footer-template')).toBeNull();
            (<HTMLElement>cellPopup.querySelector('.e-close')).click();
        });

        it('checking content and footer area for event-quick popup', () => {
            schObj.quickInfoTemplates = {
                templateType: 'Event',
                header: null,
                content: '#contentTemplate',
                footer: '#footerTemplate'
            };
            schObj.dataBind();
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-appointment')[0] as HTMLElement, 'click');
            const cellPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(cellPopup.classList).toContain('e-popup-open');
            expect(cellPopup.querySelector('.header-template')).toBeNull();
            expect(cellPopup.querySelector('.content-template')).toBeTruthy();
            const contentFieldEle: HTMLElement[] = [].slice.call(cellPopup.querySelectorAll('.content-template'));
            expect(contentFieldEle.length).toEqual(1);
            expect(contentFieldEle[0].innerText).toContain('Testing');
            expect(cellPopup.querySelector('.footer-template')).toBeTruthy();
            const footerEle: HTMLElement = cellPopup.querySelector('.e-event-footer') as HTMLElement;
            expect(footerEle.firstElementChild.classList).toContain('e-event-edit');
            expect(footerEle.lastElementChild.classList).toContain('e-event-delete');
            (<HTMLElement>cellPopup.querySelector('.e-close')).click();
        });

        it('checking header and footer area for event-quick popup', () => {
            schObj.quickInfoTemplates = {
                templateType: 'Event',
                header: '#headerTemplate',
                content: null,
                footer: '#footerTemplate'
            };
            schObj.dataBind();
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-appointment')[0] as HTMLElement, 'click');
            const cellPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(cellPopup.classList).toContain('e-popup-open');
            expect(cellPopup.querySelector('.header-template')).toBeTruthy();
            expect(cellPopup.querySelector('.content-template')).toBeNull();
            expect(cellPopup.querySelector('.footer-template')).toBeTruthy();
            const footerEle: HTMLElement = cellPopup.querySelector('.e-event-footer') as HTMLElement;
            expect(footerEle.firstElementChild.classList).toContain('e-event-edit');
            expect(footerEle.lastElementChild.classList).toContain('e-event-delete');
            (<HTMLElement>cellPopup.querySelector('.e-close')).click();
        });
    });

    describe('checking quickInfoTemplate for both cell and eventClick', () => {
        let schObj: Schedule;
        const eventData: Record<string, any>[] = [{
            Id: 1,
            Subject: 'Testing',
            StartTime: new Date(2017, 10, 1, 10),
            EndTime: new Date(2017, 10, 1, 12)
        }];
        beforeAll((done: DoneFn) => {
            const headerScript: HTMLElement = createElement('script', {
                id: 'headerTemplate', attrs: { type: 'text/x-template' },
                innerHTML: '<div class="header-template">${if(elementType === "cell")}<div class="e-cell-header">' +
                    '<div class="e-header-icon-wrapper"><button class="e-close" title = "Close"></button></div></div>${else}' +
                    '<div class="e-event-header"><div class="e-header-icon-wrapper"><button class="e-close" title="CLOSE"></button></div>' +
                    '</div>${/if}</div>'
            });
            const contentScript: HTMLElement = createElement('script', {
                id: 'contentTemplate', attrs: { type: 'text/x-template' },
                innerHTML: '<div class="content-template">${if (elementType === "cell")}<div class="e-cell-content"><form class=' +
                    '"e-schedule-form"><div><input class="e-subject e-field" type="text" name="Subject" placeholder="Title"></div><div>' +
                    '<input class="e-location e-field" type="text" name="Location" placeholder="Location"></div></form></div>${else}' +
                    '<div class="e-event-content"><div class="e-subject-wrap">${if (Subject)}' +
                    '<div class="subject">${Subject}</div>${/if} ${if (Location)}<div class="location">${Location}</div>${/if} ' +
                    '${if (Description)}<div class="description">${Description}</div>${/if}</div></div>${/if}</div>'
            });
            const footerScript: HTMLElement = createElement('script', {
                id: 'footerTemplate', attrs: { type: 'text/x-template' },
                innerHTML: '<div class="footer-template">${if (elementType === "cell")}<div class="e-cell-footer"><button class=' +
                    '"e-event-details" title="Extra Details">Extra Details</button><button class="e-event-create" title="Add">Add' +
                    '</button></div>${else}<div class="e-event-footer"><button class="e-event-edit" title="Edit">Edit</button>' +
                    '<button class="e-event-delete" title="Delete">Delete</button></div>${/if}</div>'
            });
            append([headerScript, contentScript, footerScript], document.getElementsByTagName('head')[0]);
            const model: ScheduleModel = {
                height: '500px', currentView: 'Week', views: ['Week'], selectedDate: new Date(2017, 10, 1),
                quickInfoTemplates: { header: '#headerTemplate', content: '#contentTemplate', footer: '#footerTemplate' }
            };
            schObj = util.createSchedule(model, eventData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
            document.getElementById('headerTemplate').remove();
            document.getElementById('contentTemplate').remove();
            document.getElementById('footerTemplate').remove();
        });

        it('checking header, content and footer area for cell and event quick popup', () => {
            const workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-hours'));
            workCells[1].click();
            const cellPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(cellPopup.classList).toContain('e-popup-open');
            expect(cellPopup.querySelector('.header-template')).toBeTruthy();
            expect(cellPopup.querySelector('.header-template .e-cell-header')).toBeTruthy();
            expect(cellPopup.querySelector('.header-template .e-event-header')).toBeNull();
            expect(cellPopup.querySelector('.content-template')).toBeTruthy();
            expect(cellPopup.querySelector('.content-template .e-cell-content')).toBeTruthy();
            expect(cellPopup.querySelector('.content-template .e-event-content')).toBeNull();
            expect(cellPopup.querySelector('.footer-template')).toBeTruthy();
            expect(cellPopup.querySelector('.footer-template .e-cell-footer')).toBeTruthy();
            expect(cellPopup.querySelector('.footer-template .e-event-footer')).toBeNull();
            const contentFieldEle: HTMLElement[] = [].slice.call(cellPopup.querySelectorAll('.e-field'));
            expect(contentFieldEle.length).toEqual(2);
            expect(contentFieldEle[0].classList.contains('e-subject')).toEqual(true);
            expect(contentFieldEle[1].classList.contains('e-location')).toEqual(true);
            const footerEle: HTMLElement = cellPopup.querySelector('.e-cell-footer') as HTMLElement;
            expect(footerEle.firstElementChild.classList).toContain('e-event-details');
            expect(footerEle.lastElementChild.classList).toContain('e-event-create');
            (<HTMLElement>cellPopup.querySelector('.e-close')).click();
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-appointment')[0] as HTMLElement, 'click');
            const eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup.classList).toContain('e-popup-open');
            expect(cellPopup.querySelector('.header-template')).toBeTruthy();
            expect(cellPopup.querySelector('.header-template .e-cell-header')).toBeNull();
            expect(cellPopup.querySelector('.header-template .e-event-header')).toBeTruthy();
            expect(cellPopup.querySelector('.content-template')).toBeTruthy();
            expect(cellPopup.querySelector('.content-template .e-cell-content')).toBeNull();
            expect(cellPopup.querySelector('.content-template .e-event-content')).toBeTruthy();
            expect(cellPopup.querySelector('.footer-template')).toBeTruthy();
            expect(cellPopup.querySelector('.footer-template .e-cell-footer')).toBeNull();
            expect(cellPopup.querySelector('.footer-template .e-event-footer')).toBeTruthy();
            const eventContentEle: HTMLElement[] = [].slice.call(eventPopup.querySelectorAll('.e-event-content'));
            expect(eventContentEle.length).toEqual(1);
            expect(eventContentEle[0].innerText).toContain('Testing');
            expect(eventPopup.querySelector('.e-event-footer')).toBeTruthy();
            const eventFooterEle: HTMLElement = eventPopup.querySelector('.e-event-footer') as HTMLElement;
            expect(eventFooterEle.firstElementChild.classList).toContain('e-event-edit');
            expect(eventFooterEle.lastElementChild.classList).toContain('e-event-delete');
            (<HTMLElement>eventPopup.querySelector('.e-close')).click();
        });
    });

    describe('Read only test cases', () => {
        let schObj: Schedule;
        let keyModule: any;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = { height: '500px', readonly: true, selectedDate: new Date(2017, 10, 1) };
            schObj = util.createSchedule(model, defaultData, done);
            keyModule = schObj.keyboardInteractionModule;
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Prevent delete alert', () => {
            (schObj.element.querySelector('.e-appointment') as HTMLElement).click();
            const eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(isVisible(eventPopup)).toBe(true);
            (<HTMLElement>eventPopup.querySelector('.e-delete')).click();
            expect(isVisible(document.querySelector('.e-quick-dialog'))).toBe(false);
            keyModule.keyActionHandler({ action: 'escape' });
            expect(isVisible(eventPopup)).toBe(false);
        });
        it('Delete key', () => {
            keyModule.keyActionHandler({ action: 'delete' });
            expect(isVisible(document.querySelector('.e-quick-dialog'))).toBe(false);
        });
        it('Enter key', () => {
            const firstWorkCell: HTMLElement = (schObj.element.querySelector('.e-work-cells'));
            expect(firstWorkCell.classList).not.toContain('e-selected-cell');
            keyModule.keyActionHandler({ action: 'enter', target: firstWorkCell });
            expect(schObj.element.querySelector('.e-quick-popup-wrapper').childElementCount).toBe(0);
            expect(schObj.quickPopup.quickPopup.element.classList.contains('e-popup-close')).toEqual(true);
            expect(schObj.element.querySelector('.e-work-cells').classList).not.toContain('e-selected-cell');
        });
        it('quick popup - left arrow', () => {
            const workCell: HTMLElement = schObj.element.querySelector('.e-appointment') as HTMLElement;
            util.triggerMouseEvent(workCell, 'click');
            expect(schObj.element.querySelector('.e-quick-popup-wrapper').classList.contains('e-popup-open')).toEqual(true);
            keyModule.keyActionHandler({ action: 'leftArrow', target: schObj.element.querySelector('.e-quick-popup-wrapper .e-subject') });
            keyModule.keyActionHandler({ action: 'escape' });
            expect(schObj.element.querySelector('.e-quick-popup-wrapper').childElementCount).toBe(0);
            expect(schObj.element.querySelector('.e-quick-popup-wrapper').classList.contains('e-popup-close')).toEqual(true);
        });
        it('quick popup - right arrow', () => {
            const workCell: HTMLElement = schObj.element.querySelector('.e-appointment') as HTMLElement;
            util.triggerMouseEvent(workCell, 'click');
            expect(schObj.element.querySelector('.e-quick-popup-wrapper').classList.contains('e-popup-open')).toEqual(true);
            keyModule.keyActionHandler({ action: 'rightArrow', target: schObj.element.querySelector('.e-quick-popup-wrapper .e-subject') });
            keyModule.keyActionHandler({ action: 'escape' });
            expect(schObj.element.querySelector('.e-quick-popup-wrapper').childElementCount).toBe(0);
            expect(schObj.element.querySelector('.e-quick-popup-wrapper').classList.contains('e-popup-close')).toEqual(true);
        });
    });

    describe('More Indicator Popup', () => {
        let schObj: Schedule;
        let keyModule: any;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = { height: '500px', currentView: 'Month', selectedDate: new Date(2017, 10, 1) };
            schObj = util.createSchedule(model, defaultData, done);
            keyModule = schObj.keyboardInteractionModule;
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('More Indicator click', () => {
            (schObj.element.querySelector('.e-more-indicator') as HTMLElement).click();
            const moreEventPopup: Element = schObj.element.querySelector('.e-more-popup-wrapper');
            expect(isVisible(moreEventPopup)).toBe(true);
        });
        it('Event click edit action', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(42);
                done();
            };
            const eventElements: HTMLElement = (schObj.element.querySelector('.e-more-event-content .e-appointment'));
            eventElements.click();
            const eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(isVisible(eventPopup)).toBe(true);
            (<HTMLElement>eventPopup.querySelector('.e-event-edit')).click();
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            (dialogElement.querySelector('.e-event-delete') as HTMLElement).click();
            (<HTMLElement>document.body.querySelector('.e-quick-dialog-delete')).click();
        });
        it('Event Dialog Cancel Click', () => {
            const eventElements: HTMLElement = (schObj.element.querySelector('.e-more-event-content .e-appointment'));
            eventElements.click();
            const eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(isVisible(eventPopup)).toBe(true);
            (<HTMLElement>document.body.querySelector('.e-quick-dialog-cancel')).click();
        });
        it('Event Dialog Close icon click', () => {
            const eventElements: HTMLElement = (schObj.element.querySelector('.e-more-event-content .e-appointment'));
            eventElements.click();
            const eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(isVisible(eventPopup)).toBe(true);
            (<HTMLElement>schObj.quickPopup.quickDialog.element.querySelector('.e-dlg-closeicon-btn')).click();
        });
        it('Event  Delete Click', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(41);
                done();
            };
            const eventElements: HTMLElement = (schObj.element.querySelector('.e-more-event-content .e-appointment'));
            eventElements.click();
            const eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(isVisible(eventPopup)).toBe(true);
            (<HTMLElement>eventPopup.querySelector('.e-event-delete')).click();
            (<HTMLElement>document.body.querySelector('.e-quick-dialog-delete')).click();
        });
        it('Delete key', () => {
            (schObj.element.querySelector('.e-more-indicator') as HTMLElement).click();
            const moreEventPopup: Element = schObj.element.querySelector('.e-more-popup-wrapper');
            expect(isVisible(moreEventPopup)).toBe(true);
            keyModule.keyActionHandler({ action: 'delete', target: '.e-more-appointment-wrapper' });
            (<HTMLElement>schObj.quickPopup.quickDialog.element.querySelector('.e-dlg-closeicon-btn')).click();
        });
        it('More Indicator Day view navigation click', () => {
            (schObj.element.querySelector('.e-more-indicator') as HTMLElement).click();
            const moreEventPopup: Element = schObj.element.querySelector('.e-more-popup-wrapper');
            (moreEventPopup.querySelector('.e-more-event-close') as HTMLElement).click();
            (schObj.element.querySelector('.e-more-indicator') as HTMLElement).click();
            (moreEventPopup.querySelector('.e-more-event-close') as HTMLElement).click();
            (moreEventPopup.querySelector('.e-header-date') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-day');
        });
    });

    describe('More Indicator with resource', () => {
        let schObj: Schedule;
        const eventDatas: Record<string, any>[] = [{
            Id: 1,
            Subject: 'Board Meeting',
            Description: 'Meeting to discuss business goal of 2018.',
            StartTime: new Date(2018, 11, 7, 12, 35, 26),
            EndTime: new Date(2018, 11, 7, 14, 36, 0),
            OwnerId: 1
        }, {
            Id: 2,
            Subject: 'Board Meeting1',
            Description: 'Meeting to discuss business goal of 2018.',
            StartTime: new Date(2018, 11, 7, 10, 36, 26),
            EndTime: new Date(2018, 11, 7, 12, 36, 0),
            OwnerId: 1
        }, {
            Id: 3,
            Subject: 'Time Rounded',
            StartTime: new Date(2018, 11, 7, 10),
            EndTime: new Date(2018, 11, 7, 11, 30),
            IsAllDay: false,
            OwnerId: 3
        }, {
            Id: 4,
            Subject: 'In-Between time',
            StartTime: new Date(2018, 11, 7, 10, 12),
            EndTime: new Date(2018, 11, 7, 11, 38),
            IsAllDay: false,
            OwnerId: 3
        }, {
            Id: 5,
            Subject: 'spanned event',
            StartTime: new Date(2018, 11, 7, 11),
            EndTime: new Date(2018, 11, 8, 11),
            IsAllDay: false,
            OwnerId: 5
        }, {
            Id: 6,
            Subject: 'Recurrence Summary Checking',
            StartTime: new Date(2018, 11, 7, 10),
            EndTime: new Date(2018, 11, 8, 12),
            RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=5',
            IsAllDay: false,
            OwnerId: 6
        }];
        beforeAll((done: DoneFn) => {
            const schOptions: ScheduleModel = {
                height: '550px', width: '100%',
                selectedDate: new Date(2018, 11, 7),
                currentView: 'TimelineWeek',
                views: ['TimelineWeek'],
                group: { resources: ['Owners'] },
                resources: [{
                    field: 'OwnerId', title: 'Owner', name: 'Owners', allowMultiple: true,
                    dataSource: [
                        { OwnerText: 'Nancy', Id: 1, OwnerColor: '#ffaa00' },
                        { OwnerText: 'Steven', Id: 2, OwnerColor: '#f8a398' },
                        { OwnerText: 'Michael', Id: 3, OwnerColor: '#7499e1' },
                        { OwnerText: 'Phoenix', Id: 4, OwnerColor: '#fec200' },
                        { OwnerText: 'Mission', Id: 5, OwnerColor: '#df5286' },
                        { OwnerText: 'Hangout', Id: 6, OwnerColor: '#00bdae' }
                    ],
                    textField: 'OwnerText', idField: 'Id', colorField: 'OwnerColor'
                }]
            };
            schObj = util.createSchedule(schOptions, eventDatas, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('CR Issue EJ2-21532 - Appointment time was wrong when it move on to the more indicator popup', () => {
            (schObj.element.querySelectorAll('.e-more-indicator')[1] as HTMLElement).click();
            expect(schObj.quickPopup.morePopup.element.classList.contains('e-popup-open')).toEqual(true);
            const morePopupEvents: NodeListOf<Element> = schObj.quickPopup.morePopup.element.querySelectorAll('.e-appointment');
            expect(morePopupEvents.length).toEqual(2);
            (morePopupEvents[0] as HTMLElement).click();
            const popupEle: HTMLElement = schObj.quickPopup.quickPopup.element as HTMLElement;
            expect(popupEle.classList.contains('e-popup-open')).toEqual(true);
            expect(popupEle.querySelector('.e-date-time-details').textContent).toEqual('December 7, 2018 (10:00 AM - 11:30 AM)');
            (morePopupEvents[1] as HTMLElement).click();
            expect(popupEle.querySelector('.e-date-time-details').textContent).toEqual('December 7, 2018 (10:12 AM - 11:38 AM)');
            (popupEle.querySelector('.e-close') as HTMLElement).click();
            expect(popupEle.classList.contains('e-popup-close')).toEqual(true);
            (schObj.quickPopup.morePopup.element.querySelector('.e-more-event-close') as HTMLElement).click();
            expect(schObj.quickPopup.morePopup.element.classList.contains('e-popup-close')).toEqual(true);
        });

        it('CR Issue EJ2-21478 - Spanned Appointment with Same Hours, Minutes and Seconds Do not display correctly in quick popup', () => {
            const spanEventEle: HTMLElement = schObj.element.querySelector('[data-id="Appointment_5"]') as HTMLElement;
            spanEventEle.click();
            const popupEle: HTMLElement = schObj.quickPopup.quickPopup.element as HTMLElement;
            expect(popupEle.classList.contains('e-popup-open')).toEqual(true);
            expect(popupEle.querySelector('.e-date-time-details').textContent).
                toEqual('December 7, 2018 (11:00 AM) - December 8, 2018 (11:00 AM)');
            (popupEle.querySelector('.e-close') as HTMLElement).click();
            expect(popupEle.classList.contains('e-popup-close')).toEqual(true);
        });

        it('CR Issue EJ2-21478 - Recurrence event summary in quick popup', () => {
            const spanEventEle: HTMLElement = schObj.element.querySelector('[data-id="Appointment_6"]') as HTMLElement;
            spanEventEle.click();
            const popupEle: HTMLElement = schObj.quickPopup.quickPopup.element as HTMLElement;
            expect(popupEle.classList.contains('e-popup-open')).toEqual(true);
            expect(popupEle.querySelector('.e-recurrence-summary ').textContent).toEqual('Every day(s), 5 time(s)');
            (popupEle.querySelector('.e-close') as HTMLElement).click();
            expect(popupEle.classList.contains('e-popup-close')).toEqual(true);
        });

        it('CR Issue EJ2-19844 - timeline week more popup display position', () => {
            const proxy: Schedule = schObj;
            schObj.popupOpen = (args: PopupOpenEventArgs) => {
                const target: Element = closest((<any>args.data).element, '.' + cls.MORE_INDICATOR_CLASS);
                const gIndex: string = target.getAttribute('data-group-index');
                const startDate: Date = new Date(parseInt(target.getAttribute('data-start-date'), 10));
                startDate.setHours(startDate.getHours(), startDate.getMinutes(), 0);
                const tdDate: string = startDate.getTime().toString();
                const element: Element = proxy.element.querySelector('.' + cls.CONTENT_WRAP_CLASS +
                    ' tbody tr td[data-group-index="' + gIndex + '"][data-date="' + tdDate + '"]') as HTMLElement;
                const currentCellData: CellClickEventArgs = proxy.getCellDetails(element);
                expect(element).toBeTruthy();
                expect(parseInt(element.getAttribute('data-date'), 10)).toEqual(new Date(2018, 11, 7, 12, 30).getTime());
                expect(element.getAttribute('data-group-index')).toEqual('0');
                expect(element.classList.contains('e-work-cells')).toBe(true);
                expect(currentCellData.groupIndex).toEqual(0);
                expect(currentCellData.startTime.getTime()).toEqual(new Date(2018, 11, 7, 12, 30).getTime());
                expect(currentCellData.endTime.getTime()).toEqual(new Date(2018, 11, 7, 13, 0).getTime());
            };
            (schObj.element.querySelector('.e-more-indicator') as HTMLElement).click();
        });
    });

    describe('Quick Popup validation', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                height: '500px', selectedDate: new Date(2017, 10, 1),
                eventSettings: {
                    fields: { subject: { name: 'Subject', validation: { required: true } } }
                }
            };
            schObj = util.createSchedule(model, defaultData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Cell click and insert event', () => {
            (schObj.element.querySelector('.' + cls.WORK_HOURS_CLASS) as HTMLElement).click();
            const eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            (<HTMLInputElement>eventPopup.querySelector('.' + cls.SUBJECT_CLASS)).value = '';
            (<HTMLInputElement>eventPopup.querySelector('.' + cls.EVENT_CREATE_CLASS)).click();
            expect((<HTMLElement>document.querySelector('.e-schedule-error')).style.display).toEqual('');
        });
    });

    describe('Popup for recurrence rule appointment for vertical view', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = { height: '500px', selectedDate: new Date(2017, 10, 2) };
            schObj = util.createSchedule(model, defaultData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Single appointment select using click or tap', () => {
            const target: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            (target[2] as HTMLElement).click();
            const eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup).toBeTruthy();
        });
        it('recurrence delete dialog', () => {
            const eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup).toBeTruthy();
            (eventPopup.querySelector('.e-delete') as HTMLElement).click();
            (<HTMLElement>schObj.quickPopup.quickDialog.element.querySelector('.e-dlg-closeicon-btn')).click();
        });
    });

    describe('Popup for recurrence rule appointment for timeline view', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                height: '500px', selectedDate: new Date(2017, 10, 2), currentView: 'TimelineWeek',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek']
            };
            schObj = util.createSchedule(model, defaultData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Single appointment select using click or tap & recurrence delete dialog', () => {
            const target: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            (target[target.length - 1] as HTMLElement).click();
            const eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup).toBeTruthy();
            (eventPopup.querySelector('.e-delete') as HTMLElement).click();
            (<HTMLElement>schObj.quickPopup.quickDialog.element.querySelector('.e-dlg-closeicon-btn')).click();
        });
    });

    describe('Quick info display for vertical view', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = { height: '500px', selectedDate: new Date(2017, 10, 2) };
            schObj = util.createSchedule(model, defaultData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Normal appointment click', () => {
            const appointment: HTMLElement = schObj.element.querySelector('[data-id="Appointment_2"]') as HTMLElement;
            appointment.click();
            const eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup.querySelector('.e-date-time-details').textContent)
                .toEqual('October 30, 2017 (10:00 AM - 12:30 PM)');
            (<HTMLElement>eventPopup.querySelector('.e-close')).click();
        });

        it('All day appointment click', () => {
            const appointment: HTMLElement = schObj.element.querySelector('[data-id="Appointment_4"]') as HTMLElement;
            appointment.click();
            const eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup.querySelector('.e-date-time-details').textContent).toEqual('October 31, 2017 (All day)');
            (<HTMLElement>eventPopup.querySelector('.e-close')).click();
        });

        it('Spanned appointment click', () => {
            const appointment: HTMLElement = schObj.element.querySelector('[data-id="Appointment_12"]') as HTMLElement;
            appointment.click();
            const eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup.querySelector('.e-date-time-details').textContent).
                toEqual('November 4, 2017 (9:30 AM) - November 5, 2017 (5:45 AM)');
            (<HTMLElement>eventPopup.querySelector('.e-close')).click();
        });

        it('Spanned single day appointment click', () => {
            const appointment: HTMLElement = schObj.element.querySelector('[data-id="Appointment_5"]') as HTMLElement;
            appointment.click();
            const eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup.querySelector('.e-date-time-details').textContent).
                toEqual('October 31, 2017 (10:00 PM) - November 1, 2017 (12:00 AM)');
            (<HTMLElement>eventPopup.querySelector('.e-close')).click();
        });
    });

    describe('Quick info display for timeline view', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                height: '500px', selectedDate: new Date(2017, 10, 2), currentView: 'TimelineWeek',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek']
            };
            schObj = util.createSchedule(model, defaultData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Normal appointment click', () => {
            const appointment: HTMLElement = schObj.element.querySelector('[data-id="Appointment_2"]') as HTMLElement;
            appointment.click();
            const eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup.querySelector('.e-date-time-details').textContent)
                .toEqual('October 30, 2017 (10:00 AM - 12:30 PM)');
            (<HTMLElement>eventPopup.querySelector('.e-close')).click();
        });

        it('Spanned appointment click', () => {
            const appointment: HTMLElement = schObj.element.querySelector('[data-id="Appointment_12"]') as HTMLElement;
            appointment.click();
            const eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup.querySelector('.e-date-time-details').textContent).
                toEqual('November 4, 2017 (9:30 AM) - November 5, 2017 (5:45 AM)');
            (<HTMLElement>eventPopup.querySelector('.e-close')).click();
        });

        it('Spanned single day appointment click', () => {
            const appointment: HTMLElement = schObj.element.querySelector('[data-id="Appointment_5"]') as HTMLElement;
            appointment.click();
            const eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup.querySelector('.e-date-time-details').textContent).
                toEqual('October 31, 2017 (10:00 PM) - November 1, 2017 (12:00 AM)');
            (<HTMLElement>eventPopup.querySelector('.e-close')).click();
        });
    });

    describe('Popup for mobile view', () => {
        let schObj: Schedule;
        const datasource: Record<string, any>[] = [{
            Id: 1,
            Subject: 'AllDay Event',
            StartTime: new Date(2017, 9, 18),
            EndTime: new Date(2017, 9, 19),
            IsAllDay: true,
            Location: 'India',
            Description: 'Summer vacation planned for outstation.',
            StartTimezone: 'America/New_York',
            EndTimezone: 'America/New_York'
        }, {
            Id: 2,
            StartTime: new Date(2017, 9, 16, 10, 0),
            EndTime: new Date(2017, 9, 16, 12, 30),
            IsAllDay: false,
            RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=5'
        }, {
            Id: 3,
            Subject: 'Normal Event',
            StartTime: new Date(2017, 9, 15, 11, 0),
            EndTime: new Date(2017, 9, 15, 12, 30),
            IsAllDay: false
        }];
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = { selectedDate: new Date(2017, 9, 18), width: 300 };
            schObj = util.createSchedule(model, datasource, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Single appointment select using click or tap and close', () => {
            const target: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
            schObj.isAdaptive = true;
            target.click();
            const eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup).toBeTruthy();
            (eventPopup.querySelector('.e-close') as HTMLElement).click();
            expect(eventPopup).toBeTruthy();
        });
        it('Recurrence appointment checking in mobile', () => {
            const target: HTMLElement = schObj.element.querySelector('.e-recurrence-icon') as HTMLElement;
            schObj.isAdaptive = true;
            target.click();
            const eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup).toBeTruthy();
            (eventPopup.querySelector('.e-close') as HTMLElement).click();
            expect(eventPopup).toBeTruthy();
        });
        it('Appointment select with details', () => {
            const target: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
            schObj.isAdaptive = true;
            target.click();
            const eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup).toBeTruthy();
            expect(eventPopup.querySelector('.e-location-details').textContent).toEqual('India');
            (eventPopup.querySelector('.e-close') as HTMLElement).click();
        });
        it('Single appointment select using click or tap and edit event', () => {
            const target: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
            target.click();
            const eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup).toBeTruthy();
            (eventPopup.querySelector('.e-edit-icon') as HTMLElement).click();
            expect(eventPopup).toBeTruthy();
        });
        it('Single appointment select using click or tap and delete event', () => {
            const target: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
            target.click();
            const eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup).toBeTruthy();
            (eventPopup.querySelector('.e-delete-icon') as HTMLElement).click();
            expect(eventPopup).toBeTruthy();
        });
    });

    describe('Multiple resource grouping', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                width: '100%', height: '550px',
                selectedDate: new Date(2018, 3, 1),
                group: {
                    byGroupID: false,
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
        });

        it('resource event checking', () => {
            util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_1"]'), 'click');
            const eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup.classList).toContain('e-popup-open');
            const resourceElement: HTMLElement = eventPopup.querySelector('.e-resource') as HTMLElement;
            expect(resourceElement).toBeTruthy();
            expect(resourceElement.querySelector('.e-resource-details').innerHTML).toEqual('Nancy');
            (<HTMLElement>eventPopup.querySelector('.e-close')).click();
        });

        it('quick event popup checking', () => {
            schObj.popupOpen = (args: PopupOpenEventArgs) => {
                (<HTMLElement>args.element.querySelector('.e-popup-header .e-edit')).style.display = 'none';
                (<HTMLElement>args.element.querySelector('.e-popup-header .e-delete')).style.display = 'none';
                (<HTMLElement>args.element.querySelector('.e-popup-footer')).style.display = 'block';
            };
            util.triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_1"]'), 'click');
            const eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup.classList).toContain('e-popup-open');
            const resourceElement: HTMLElement = eventPopup.querySelector('.e-resource') as HTMLElement;
            expect(resourceElement).toBeTruthy();
            expect(resourceElement.querySelector('.e-resource-details').innerHTML).toEqual('Nancy');
            (<HTMLElement>eventPopup.querySelector('.e-close')).click();
        });

        it('enable resource byGroupID', (done: DoneFn) => {
            schObj.dataBound = () => done();
            schObj.popupOpen = () => { /** Null */ };
            schObj.group.byGroupID = true;
            schObj.dataBind();
        });

        it('more events checking in multiple resource grouping', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(10);
                util.triggerMouseEvent(schObj.element.querySelector('.e-more-indicator'), 'click');
                const morePopup: HTMLElement = schObj.element.querySelector('.e-more-popup-wrapper') as HTMLElement;
                expect(morePopup.classList).toContain('e-popup-open');
                const appElement: Element = morePopup.querySelector('.e-appointment');
                expect(appElement.getAttribute('data-group-index')).toEqual('1');
                util.triggerMouseEvent(morePopup.querySelector('.e-more-event-close'), 'click');
                expect(morePopup.classList).toContain('e-popup-close');
                done();
            };
            schObj.currentView = 'Month';
            schObj.dataBind();
            util.disableScheduleAnimation(schObj);
            expect(schObj.eventsData.length).toEqual(9);
            const workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            util.triggerMouseEvent(workCells[9], 'click');
            const eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup.classList).toContain('e-popup-open');
            const resourceElement: HTMLElement = eventPopup.querySelector('.e-resource') as HTMLElement;
            expect(resourceElement).toBeTruthy();
            expect(resourceElement.querySelector('.e-resource-details').innerHTML).toEqual('Michael');
            (<HTMLInputElement>eventPopup.querySelector('.e-subject')).value = 'Conference Meeting';
            util.triggerMouseEvent(eventPopup.querySelector('.e-event-create'), 'click');
        });

        it('normal event edit checking in more events with multiple resource grouping', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(10);
                expect(morePopup.classList).toContain('e-popup-open');
                const recurrenceIcon: Element = morePopup.querySelector('.e-recurrence-icon');
                expect(recurrenceIcon).toBeTruthy();
                util.triggerMouseEvent(morePopup.querySelector('.e-more-event-close'), 'click');
                expect(morePopup.classList).toContain('e-popup-close');
                done();
            };
            expect(schObj.eventsData.length).toEqual(10);
            util.triggerMouseEvent(schObj.element.querySelector('.e-more-indicator'), 'click');
            const morePopup: HTMLElement = schObj.element.querySelector('.e-more-popup-wrapper') as HTMLElement;
            expect(morePopup.classList).toContain('e-popup-open');
            const appElement: HTMLElement = morePopup.querySelector('.e-appointment') as HTMLElement;
            expect(appElement.getAttribute('data-group-index')).toEqual('1');
            util.triggerMouseEvent(appElement, 'click');
            const eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup.classList).toContain('e-popup-open');
            util.triggerMouseEvent(eventPopup.querySelector('.e-edit'), 'click');
            expect(eventPopup.classList).toContain('e-popup-close');
            const eventWindow: HTMLElement = schObj.eventWindow.dialogObject.element;
            expect(eventWindow.classList).toContain('e-popup-open');
            const recObj: RecurrenceEditor = (eventWindow.querySelector('.e-recurrenceeditor') as EJ2Instance).
                ej2_instances[0] as RecurrenceEditor;
            recObj.value = 'FREQ=DAILY;INTERVAL=1;COUNT=5';
            recObj.dataBind();
            util.triggerMouseEvent(eventWindow.querySelector('.e-event-save'), 'click');
            expect(eventWindow.classList).toContain('e-popup-close');
        });

        it('recurrence event edit checking in more events with multiple resource grouping', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(11);
                expect(morePopup.classList).toContain('e-popup-open');
                const recurrenceIcon: Element = morePopup.querySelector('.e-recurrence-edit-icon');
                expect(recurrenceIcon).toBeTruthy();
                util.triggerMouseEvent(morePopup.querySelector('.e-more-event-close'), 'click');
                expect(morePopup.classList).toContain('e-popup-close');
                done();
            };
            expect(schObj.eventsData.length).toEqual(10);
            util.triggerMouseEvent(schObj.element.querySelector('.e-more-indicator'), 'click');
            const morePopup: HTMLElement = schObj.element.querySelector('.e-more-popup-wrapper') as HTMLElement;
            expect(morePopup.classList).toContain('e-popup-open');
            const appElement: HTMLElement = closest(morePopup.querySelector('.e-recurrence-icon'), '.e-appointment') as HTMLElement;
            expect(appElement.getAttribute('data-group-index')).toEqual('1');
            util.triggerMouseEvent(appElement, 'click');
            util.triggerMouseEvent(appElement, 'dblclick');
            const quickDialog: HTMLElement = schObj.quickPopup.quickDialog.element;
            remove(morePopup.querySelector('.e-more-event-content'));
            expect(quickDialog.classList).toContain('e-popup-open');
            util.triggerMouseEvent(quickDialog.querySelector('.e-quick-dialog-occurrence-event'), 'click');
            expect(quickDialog.classList).toContain('e-popup-close');
            const eventWindow: HTMLElement = schObj.eventWindow.dialogObject.element;
            expect(eventWindow.classList).toContain('e-popup-open');
            util.triggerMouseEvent(eventWindow.querySelector('.e-event-save'), 'click');
            expect(eventWindow.classList).toContain('e-popup-close');
        });

        it('eventRendered event checking for more event popup with multiple resource grouping', () => {
            schObj.eventRendered = (args: EventRenderedArgs) => args.cancel = true;
            util.triggerMouseEvent(schObj.element.querySelector('.e-more-indicator'), 'click');
            const morePopup: HTMLElement = schObj.element.querySelector('.e-more-popup-wrapper') as HTMLElement;
            expect(morePopup.classList).toContain('e-popup-open');
            const appElement: HTMLElement[] = [].slice.call(morePopup.querySelectorAll('.e-appointment'));
            expect(appElement.length).toEqual(0);
            util.triggerMouseEvent(morePopup.querySelector('.e-more-event-close'), 'click');
            expect(morePopup.classList).toContain('e-popup-close');
        });

        it('popupOpen event checking in more events with multiple resource grouping', () => {
            schObj.eventRendered = (args: EventRenderedArgs) => args.cancel = false;
            schObj.popupOpen = (args: PopupOpenEventArgs) => args.cancel = true;
            util.triggerMouseEvent(schObj.element.querySelector('.e-more-indicator'), 'click');
            expect(schObj.element.querySelector('.e-more-popup-wrapper').classList).toContain('e-popup-close');
        });

        it('selected date changed to current date', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-header-cells.e-current-day').length).toEqual(3);
                done();
            };
            schObj.popupOpen = (args: PopupOpenEventArgs) => args.cancel = false;
            schObj.selectedDate = new Date();
            schObj.dataBind();
        });

        it('more event popup checking with current date ', (done: DoneFn) => {
            schObj.dataBound = () => {
                util.triggerMouseEvent(schObj.element.querySelector('.e-more-indicator'), 'click');
                const morePopup: HTMLElement = schObj.element.querySelector('.e-more-popup-wrapper') as HTMLElement;
                expect(morePopup.classList).toContain('e-popup-open');
                expect(morePopup.querySelectorAll('.e-appointment').length).toEqual(5);
                util.triggerMouseEvent(morePopup.querySelector('.e-more-event-close'), 'click');
                expect(morePopup.classList).toContain('e-popup-close');
                done();
            };
            const generateData: CallbackFunction = () => {
                const dataCol: Record<string, any>[] = [];
                const currentDate: Date = new Date(new Date().setHours(0, 0, 0, 0));
                for (let i: number = 0; i < 5; i++) {
                    dataCol.push({
                        Id: i + 1, Subject: (i + 1).toString(),
                        StartTime: new Date(currentDate.getTime() + ((i * 60) * (1000 * 60))),
                        EndTime: new Date(currentDate.getTime() + (((i * 60) + 60) * (1000 * 60))),
                        IsAllDay: false, RoomId: 1, OwnerId: 3
                    });
                }
                return dataCol;
            };
            schObj.eventSettings.dataSource = generateData();
            schObj.dataBind();
        });
    });

    describe('Event actions in mobile device', () => {
        let schObj: Schedule;
        const uA: string = Browser.userAgent;
        const androidUserAgent: string = 'Mozilla/5.0 (Linux; Android 9; Pixel 2 Build/PPR1.180610.009)' +
            'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.85 Mobile Safari/537.36';
        beforeAll((done: DoneFn) => {
            Browser.userAgent = androidUserAgent;
            const model: ScheduleModel = { width: 300, height: '500px', selectedDate: new Date(2017, 10, 1) };
            schObj = util.createSchedule(model, defaultData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
            Browser.userAgent = uA;
        });

        it('checking multiple events delete in mobile', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(40);
                done();
            };
            expect(schObj.eventsData.length).toEqual(43);
            const appElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            (schObj.scheduleTouchModule as any).tapHoldHandler({ originalEvent: { target: appElements[0], type: 'touchstart' } });
            const eventPopup: HTMLElement = document.body.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup.classList).toContain('e-popup-open');
            util.triggerMouseEvent(appElements[1], 'click');
            util.triggerMouseEvent(appElements[2], 'click');
            util.triggerMouseEvent(eventPopup.querySelector('.e-delete-icon'), 'click');
            const quickDialog: Element = document.querySelector('.e-quick-dialog');
            expect(quickDialog.classList).toContain('e-popup-open');
            expect(quickDialog.querySelector('.e-dlg-header').innerHTML).toEqual('Delete Multiple Events');
            expect(quickDialog.querySelector('.e-dlg-content').innerHTML).toEqual('Are you sure you want to delete the selected events?');
            const deleteButton: HTMLElement = quickDialog.querySelector('.e-quick-dialog-delete') as HTMLElement;
            util.triggerMouseEvent(deleteButton, 'click');
            expect(quickDialog.classList).toContain('e-popup-close');
        });
    });

    describe('Ignore Edited Occurrences Scenarios', () => {
        let schObj: Schedule;
        const eventData: Record<string, any>[] = [{
            Id: 1,
            Subject: 'Recurrence',
            StartTime: new Date(2019, 1, 4, 10),
            EndTime: new Date(2019, 1, 4, 11, 30),
            IsAllDay: false,
            RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=5'
        }];
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = { height: '500px', selectedDate: new Date(2019, 1, 5) };
            schObj = util.createSchedule(model, eventData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Edit Single Occurrence', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(2);
                done();
            };
            expect(schObj.eventsData.length).toEqual(1);
            const appElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            util.triggerMouseEvent(appElements[1], 'click');
            util.triggerMouseEvent(appElements[1], 'dblclick');
            const quickDialog: HTMLElement = schObj.quickPopup.quickDialog.element;
            expect(quickDialog.classList.contains('e-popup-open')).toEqual(true);
            util.triggerMouseEvent(quickDialog.querySelector('.e-quick-dialog-occurrence-event'), 'click');
            expect(quickDialog.classList.contains('e-popup-open')).toEqual(false);
            const eventWindow: HTMLElement = schObj.eventWindow.dialogObject.element;
            expect(eventWindow.classList.contains('e-popup-open')).toEqual(true);
            (eventWindow.querySelector('.e-subject') as HTMLInputElement).value = 'Recurrence - Edited';
            util.triggerMouseEvent(eventWindow.querySelector('.e-event-save'), 'click');
            expect(eventWindow.classList.contains('e-popup-open')).toEqual(false);
        });

        it('Edit Single Occurrence as Series and ignore edited occurrence', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(2);
                done();
            };
            expect(schObj.eventsData.length).toEqual(2);
            const appElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            util.triggerMouseEvent(appElements[2], 'click');
            util.triggerMouseEvent(appElements[2], 'dblclick');
            const quickDialog: HTMLElement = schObj.quickPopup.quickDialog.element;
            expect(quickDialog.classList.contains('e-popup-open')).toEqual(true);
            util.triggerMouseEvent(quickDialog.querySelector('.e-quick-dialog-series-event'), 'click');
            expect(quickDialog.classList.contains('e-popup-open')).toEqual(false);
            const eventWindow: HTMLElement = schObj.eventWindow.dialogObject.element;
            expect(eventWindow.classList.contains('e-popup-open')).toEqual(true);
            (eventWindow.querySelector('.e-subject') as HTMLInputElement).value = 'Ignored Edited Occurrences';
            util.triggerMouseEvent(eventWindow.querySelector('.e-event-save'), 'click');
            expect(eventWindow.classList.contains('e-popup-open')).toEqual(true);
            expect(quickDialog.classList.contains('e-popup-open')).toEqual(true);
            expect(quickDialog.querySelectorAll('.e-footer-content button').length).toEqual(3);
            util.triggerMouseEvent(quickDialog.querySelector('.e-quick-dialog-cancel'), 'click');
            expect(quickDialog.classList.contains('e-popup-open')).toEqual(false);
            expect(eventWindow.classList.contains('e-popup-open')).toEqual(true);
            util.triggerMouseEvent(quickDialog.querySelector('.e-quick-alertcancel '), 'click');
            expect(quickDialog.classList.contains('e-popup-open')).toEqual(false);
            expect(eventWindow.classList.contains('e-popup-open')).toEqual(false);
        });

        it('Edit Single Occurrence as Series and include edited occurrence', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(1);
                done();
            };
            expect(schObj.eventsData.length).toEqual(2);
            const appElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            util.triggerMouseEvent(appElements[2], 'click');
            util.triggerMouseEvent(appElements[2], 'dblclick');
            const quickDialog: HTMLElement = schObj.quickPopup.quickDialog.element;
            expect(quickDialog.classList.contains('e-popup-open')).toEqual(true);
            util.triggerMouseEvent(quickDialog.querySelector('.e-quick-dialog-series-event'), 'click');
            expect(quickDialog.classList.contains('e-popup-open')).toEqual(false);
            const eventWindow: HTMLElement = schObj.eventWindow.dialogObject.element;
            expect(eventWindow.classList.contains('e-popup-open')).toEqual(true);
            (eventWindow.querySelector('.e-subject') as HTMLInputElement).value = 'Include Edited Occurrences';
            util.triggerMouseEvent(eventWindow.querySelector('.e-event-save'), 'click');
            expect(eventWindow.classList.contains('e-popup-open')).toEqual(true);
            expect(quickDialog.classList.contains('e-popup-open')).toEqual(true);
            expect(quickDialog.querySelectorAll('.e-footer-content button').length).toEqual(3);
            util.triggerMouseEvent(quickDialog.querySelector('.e-quick-dialog-cancel'), 'click');
            expect(quickDialog.classList.contains('e-popup-open')).toEqual(false);
            expect(eventWindow.classList.contains('e-popup-open')).toEqual(true);
            util.triggerMouseEvent(quickDialog.querySelector('.e-quick-alertok '), 'click');
            expect(quickDialog.classList.contains('e-popup-open')).toEqual(false);
            expect(eventWindow.classList.contains('e-popup-open')).toEqual(false);
        });
    });

    describe('Edit Following Events', () => {
        let schObj: Schedule;
        const timezone: Timezone = new Timezone();
        const eventData: Record<string, any>[] = [{
            Id: 1,
            Subject: 'Recurrence',
            StartTime: timezone.removeLocalOffset(new Date(2019, 1, 4, 10)),
            EndTime: timezone.removeLocalOffset(new Date(2019, 1, 4, 11)),
            IsAllDay: false,
            RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=10'
        }];
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                height: '500px', selectedDate: new Date(2019, 1, 4),
                eventSettings: { editFollowingEvents: true }
            };
            schObj = util.createSchedule(model, eventData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Edit Series without following events', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.currentAction).toEqual('EditSeries');
                expect(schObj.eventsData.length).toEqual(1);
                const dataObj: Record<string, any>[] = schObj.eventsData;
                expect(dataObj[0].Subject).toEqual('Recurrence - Series Edit');
                expect(dataObj[0].RecurrenceException).toBeNull();
                expect(dataObj[0].RecurrenceID).toBeNull();
                expect(dataObj[0].FollowingID).toBeNull();
                done();
            };
            expect(schObj.eventsData.length).toEqual(1);
            const appElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            util.triggerMouseEvent(appElements[1], 'click');
            util.triggerMouseEvent(appElements[1], 'dblclick');
            const quickDialog: HTMLElement = schObj.quickPopup.quickDialog.element;
            expect(quickDialog.classList.contains('e-popup-open')).toEqual(true);
            util.triggerMouseEvent(quickDialog.querySelector('.e-quick-dialog-series-event'), 'click');
            expect(quickDialog.classList.contains('e-popup-open')).toEqual(false);
            const eventWindow: HTMLElement = schObj.eventWindow.dialogObject.element;
            expect(eventWindow.classList.contains('e-popup-open')).toEqual(true);
            (eventWindow.querySelector('.e-subject') as HTMLInputElement).value = 'Recurrence - Series Edit';
            util.triggerMouseEvent(eventWindow.querySelector('.e-event-save'), 'click');
            expect(eventWindow.classList.contains('e-popup-open')).toEqual(false);
            expect(quickDialog.classList.contains('e-popup-open')).toEqual(false);
            expect(quickDialog.querySelectorAll('.e-footer-content button').length).toEqual(4);
        });

        it('Edit Single Occurrence', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(2);
                done();
            };
            expect(schObj.eventsData.length).toEqual(1);
            const appElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            util.triggerMouseEvent(appElements[1], 'click');
            util.triggerMouseEvent(appElements[1], 'dblclick');
            const quickDialog: HTMLElement = schObj.quickPopup.quickDialog.element;
            expect(quickDialog.classList.contains('e-popup-open')).toEqual(true);
            util.triggerMouseEvent(quickDialog.querySelector('.e-quick-dialog-occurrence-event'), 'click');
            expect(quickDialog.classList.contains('e-popup-open')).toEqual(false);
            const eventWindow: HTMLElement = schObj.eventWindow.dialogObject.element;
            expect(eventWindow.classList.contains('e-popup-open')).toEqual(true);
            (eventWindow.querySelector('.e-subject') as HTMLInputElement).value = 'Recurrence - Edited';
            util.triggerMouseEvent(eventWindow.querySelector('.e-event-save'), 'click');
            expect(eventWindow.classList.contains('e-popup-open')).toEqual(false);
        });

        it('Edit Series excluding with ignore occurrence event and without following events', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.currentAction).toEqual('EditSeries');
                expect(schObj.eventsData.length).toEqual(2);
                const dataObj: Record<string, any>[] = schObj.eventsData as Record<string, any>[];
                expect((<string>dataObj[0].RecurrenceException).split(',').length).toEqual(1);
                expect(dataObj[0].Subject).toEqual('Recurrence Series');
                expect(dataObj[0].RecurrenceException as string).toEqual('20190205T100000Z');
                expect(dataObj[1].Id).toEqual(2);
                expect(dataObj[1].RecurrenceID).toEqual(1);
                expect(dataObj[1].Subject).toEqual('Recurrence - Edited');
                done();
            };
            expect(schObj.eventsData.length).toEqual(2);
            const appElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            util.triggerMouseEvent(appElements[1], 'click');
            util.triggerMouseEvent(appElements[1], 'dblclick');
            const quickDialog: HTMLElement = schObj.quickPopup.quickDialog.element;
            expect(quickDialog.classList.contains('e-popup-open')).toEqual(true);
            util.triggerMouseEvent(quickDialog.querySelector('.e-quick-dialog-series-event'), 'click');
            expect(quickDialog.classList.contains('e-popup-open')).toEqual(false);
            const eventWindow: HTMLElement = schObj.eventWindow.dialogObject.element;
            expect(eventWindow.classList.contains('e-popup-open')).toEqual(true);
            (eventWindow.querySelector('.e-subject') as HTMLInputElement).value = 'Recurrence Series';
            util.triggerMouseEvent(eventWindow.querySelector('.e-event-save'), 'click');
            expect(eventWindow.classList.contains('e-popup-open')).toEqual(true);
            expect(quickDialog.classList.contains('e-popup-open')).toEqual(true);
            expect(quickDialog.querySelectorAll('.e-footer-content button').length).toEqual(4);
            util.triggerMouseEvent(quickDialog.querySelector('.e-quick-alertcancel '), 'click');
            expect(quickDialog.classList.contains('e-popup-open')).toEqual(false);
            expect(eventWindow.classList.contains('e-popup-open')).toEqual(false);
        });

        it('Edit Following Event', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.currentAction).toEqual('EditFollowingEvents');
                expect(schObj.eventsData.length).toEqual(3);
                const dataObj: Record<string, any>[] = schObj.eventsData as Record<string, any>[];
                expect((<string>dataObj[0].RecurrenceException).split(',').length).toEqual(1);
                expect(dataObj[0].Subject).toEqual('Recurrence Series');
                expect(dataObj[0].RecurrenceException as string).toEqual('20190205T100000Z');
                expect(dataObj[0].Id).toEqual(1);
                expect(dataObj[1].Id).toEqual(2);
                expect(dataObj[1].RecurrenceID).toEqual(1);
                expect(dataObj[1].Subject).toEqual('Recurrence - Edited');
                expect(dataObj[2].Id).toEqual(3);
                expect(dataObj[2].Subject).toEqual('Recurrence - Following Edited');
                expect(dataObj[2].FollowingID).toEqual(1);
                done();
            };
            expect(schObj.eventsData.length).toEqual(2);
            const appElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            util.triggerMouseEvent(appElements[3], 'click');
            util.triggerMouseEvent(appElements[3], 'dblclick');
            const quickDialog: HTMLElement = schObj.quickPopup.quickDialog.element;
            expect(quickDialog.classList.contains('e-popup-open')).toEqual(true);
            util.triggerMouseEvent(quickDialog.querySelector('.e-quick-dialog-following-events'), 'click');
            expect(quickDialog.classList.contains('e-popup-open')).toEqual(false);
            const eventWindow: HTMLElement = schObj.eventWindow.dialogObject.element;
            expect(eventWindow.classList.contains('e-popup-open')).toEqual(true);
            (eventWindow.querySelector('.e-subject') as HTMLInputElement).value = 'Recurrence - Following Edited';
            util.triggerMouseEvent(eventWindow.querySelector('.e-event-save'), 'click');
            expect(eventWindow.classList.contains('e-popup-open')).toEqual(false);
        });

        it('Edit single occurrence in following series', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.currentAction).toEqual('EditOccurrence');
                expect(schObj.eventsData.length).toEqual(4);
                const dataObj: Record<string, any>[] = schObj.eventsData as Record<string, any>[];
                expect((<string>dataObj[0].RecurrenceException).split(',').length).toEqual(1);
                expect(dataObj[2].Id).toEqual(3);
                expect(dataObj[2].RecurrenceException).toEqual('20190209T100000Z');
                expect(dataObj[3].Subject).toEqual('Recurrence - Edited in following series');
                expect(dataObj[3].Id).toEqual(4);
                expect(dataObj[3].RecurrenceID).toEqual(3);
                done();
            };
            expect(schObj.eventsData.length).toEqual(3);
            const appElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            util.triggerMouseEvent(appElements[5], 'click');
            util.triggerMouseEvent(appElements[5], 'dblclick');
            const quickDialog: HTMLElement = schObj.quickPopup.quickDialog.element;
            expect(quickDialog.classList.contains('e-popup-open')).toEqual(true);
            util.triggerMouseEvent(quickDialog.querySelector('.e-quick-dialog-occurrence-event'), 'click');
            expect(quickDialog.classList.contains('e-popup-open')).toEqual(false);
            const eventWindow: HTMLElement = schObj.eventWindow.dialogObject.element;
            expect(eventWindow.classList.contains('e-popup-open')).toEqual(true);
            (eventWindow.querySelector('.e-subject') as HTMLInputElement).value = 'Recurrence - Edited in following series';
            util.triggerMouseEvent(eventWindow.querySelector('.e-event-save'), 'click');
            expect(eventWindow.classList.contains('e-popup-open')).toEqual(false);
        });

        it('Edit Following Series and include edited occurrence', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(4);
                const dataObj: Record<string, any>[] = schObj.eventsData as Record<string, any>[];
                expect(dataObj[3].RecurrenceException).toBeNull();
                expect(dataObj[3].Subject).toEqual('Include Edited Occurrences in Following Edit');
                expect(dataObj[3].Id).toEqual(5);
                expect(dataObj[3].FollowingID).toEqual(3);
                done();
            };
            expect(schObj.eventsData.length).toEqual(4);
            const appElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            util.triggerMouseEvent(appElements[4], 'click');
            util.triggerMouseEvent(appElements[4], 'dblclick');
            const quickDialog: HTMLElement = schObj.quickPopup.quickDialog.element;
            expect(quickDialog.classList.contains('e-popup-open')).toEqual(true);
            util.triggerMouseEvent(quickDialog.querySelector('.e-quick-dialog-following-events'), 'click');
            expect(quickDialog.classList.contains('e-popup-open')).toEqual(false);
            const eventWindow: HTMLElement = schObj.eventWindow.dialogObject.element;
            expect(eventWindow.classList.contains('e-popup-open')).toEqual(true);
            (eventWindow.querySelector('.e-subject') as HTMLInputElement).value = 'Include Edited Occurrences in Following Edit';
            util.triggerMouseEvent(eventWindow.querySelector('.e-event-save'), 'click');
            expect(eventWindow.classList.contains('e-popup-open')).toEqual(true);
            expect(quickDialog.classList.contains('e-popup-open')).toEqual(true);
            expect(quickDialog.querySelectorAll('.e-footer-content button').length).toEqual(4);
            util.triggerMouseEvent(quickDialog.querySelector('.e-quick-alertok '), 'click');
            expect(quickDialog.classList.contains('e-popup-open')).toEqual(false);
            expect(eventWindow.classList.contains('e-popup-open')).toEqual(false);
        });

        it('Edit Single Occurrence as Series', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.currentAction).toEqual('EditSeries');
                expect(schObj.eventsData.length).toEqual(4);
                const dataObj: Record<string, any>[] = schObj.eventsData as Record<string, any>[];
                expect((<string>dataObj[0].RecurrenceException).split(',').length).toEqual(1);
                expect(dataObj[0].Id).toEqual(1);
                expect(dataObj[0].RecurrenceException).toEqual('20190205T100000Z');
                expect(dataObj[0].Subject).toEqual('Ignored Edited Occurrences');
                expect(dataObj[1].Id).toEqual(2);
                expect(dataObj[1].Subject).toEqual('Recurrence - Edited');
                expect(dataObj[1].RecurrenceID).toEqual(1);
                done();
            };
            expect(schObj.eventsData.length).toEqual(4);
            const appElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            util.triggerMouseEvent(appElements[5], 'click');
            util.triggerMouseEvent(appElements[5], 'dblclick');
            const quickDialog: HTMLElement = schObj.quickPopup.quickDialog.element;
            expect(quickDialog.classList.contains('e-popup-open')).toEqual(true);
            util.triggerMouseEvent(quickDialog.querySelector('.e-quick-dialog-series-event'), 'click');
            expect(quickDialog.classList.contains('e-popup-open')).toEqual(false);
            const eventWindow: HTMLElement = schObj.eventWindow.dialogObject.element;
            expect(eventWindow.classList.contains('e-popup-open')).toEqual(true);
            (eventWindow.querySelector('.e-subject') as HTMLInputElement).value = 'Ignored Edited Occurrences';
            util.triggerMouseEvent(eventWindow.querySelector('.e-event-save'), 'click');
            expect(eventWindow.classList.contains('e-popup-open')).toEqual(true);
            expect(quickDialog.classList.contains('e-popup-open')).toEqual(true);
            expect(quickDialog.querySelectorAll('.e-footer-content button').length).toEqual(4);
            util.triggerMouseEvent(quickDialog.querySelector('.e-quick-alertcancel '), 'click');
            expect(quickDialog.classList.contains('e-popup-open')).toEqual(false);
            expect(eventWindow.classList.contains('e-popup-open')).toEqual(false);
        });

        it('Edit Single Occurrence as Series with include edited occurrence', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.currentAction).toEqual('EditSeries');
                expect(schObj.eventsData.length).toEqual(1);
                const dataObj: Record<string, any>[] = schObj.eventsData as Record<string, any>[];
                expect(dataObj[0].Id).toEqual(1);
                expect(dataObj[0].RecurrenceException).toBeNull();
                expect(dataObj[0].Subject).toEqual('Recurrence');
                done();
            };
            expect(schObj.eventsData.length).toEqual(4);
            const appElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            util.triggerMouseEvent(appElements[5], 'click');
            util.triggerMouseEvent(appElements[5], 'dblclick');
            const quickDialog: HTMLElement = schObj.quickPopup.quickDialog.element;
            expect(quickDialog.classList.contains('e-popup-open')).toEqual(true);
            util.triggerMouseEvent(quickDialog.querySelector('.e-quick-dialog-series-event'), 'click');
            expect(quickDialog.classList.contains('e-popup-open')).toEqual(false);
            const eventWindow: HTMLElement = schObj.eventWindow.dialogObject.element;
            expect(eventWindow.classList.contains('e-popup-open')).toEqual(true);
            (eventWindow.querySelector('.e-subject') as HTMLInputElement).value = 'Recurrence';
            util.triggerMouseEvent(eventWindow.querySelector('.e-event-save'), 'click');
            expect(eventWindow.classList.contains('e-popup-open')).toEqual(true);
            expect(quickDialog.classList.contains('e-popup-open')).toEqual(true);
            expect(quickDialog.querySelectorAll('.e-footer-content button').length).toEqual(4);
            util.triggerMouseEvent(quickDialog.querySelector('.e-quick-alertok '), 'click');
            expect(quickDialog.classList.contains('e-popup-open')).toEqual(false);
            expect(eventWindow.classList.contains('e-popup-open')).toEqual(false);
        });

        it('Edit Single Occurrence to ensure Delete Functionality', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(2);
                const dataObj: Record<string, any>[] = schObj.eventsData as Record<string, any>[];
                expect((<string>dataObj[0].RecurrenceException).split(',').length).toEqual(1);
                expect(dataObj[0].Id).toEqual(1);
                expect(dataObj[0].RecurrenceException).toEqual('20190205T100000Z');
                expect(dataObj[0].Subject).toEqual('Recurrence');
                expect(dataObj[1].Id).toEqual(2);
                expect(dataObj[1].RecurrenceID).toEqual(1);
                expect(dataObj[1].Subject).toEqual('Recurrence - Edited1');
                done();
            };
            expect(schObj.eventsData.length).toEqual(1);
            const appElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            util.triggerMouseEvent(appElements[1], 'click');
            util.triggerMouseEvent(appElements[1], 'dblclick');
            const quickDialog: HTMLElement = schObj.quickPopup.quickDialog.element;
            expect(quickDialog.classList.contains('e-popup-open')).toEqual(true);
            util.triggerMouseEvent(quickDialog.querySelector('.e-quick-dialog-occurrence-event'), 'click');
            expect(quickDialog.classList.contains('e-popup-open')).toEqual(false);
            const eventWindow: HTMLElement = schObj.eventWindow.dialogObject.element;
            expect(eventWindow.classList.contains('e-popup-open')).toEqual(true);
            (eventWindow.querySelector('.e-subject') as HTMLInputElement).value = 'Recurrence - Edited1';
            util.triggerMouseEvent(eventWindow.querySelector('.e-event-save'), 'click');
        });

        it('Edit More Single Occurrence to ensure Delete Functionality', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(3);
                const dataObj: Record<string, any>[] = schObj.eventsData as Record<string, any>[];
                expect((<string>dataObj[0].RecurrenceException).split(',').length).toEqual(2);
                expect(dataObj[0].Id).toEqual(1);
                expect(dataObj[0].RecurrenceException).toEqual('20190205T100000Z,20190208T100000Z');
                expect(dataObj[0].Subject).toEqual('Recurrence');
                expect(dataObj[1].Id).toEqual(2);
                expect(dataObj[1].RecurrenceID).toEqual(1);
                expect(dataObj[1].Subject).toEqual('Recurrence - Edited1');
                expect(dataObj[2].Id).toEqual(3);
                expect(dataObj[2].RecurrenceID).toEqual(1);
                expect(dataObj[2].Subject).toEqual('Recurrence - Edited2');
                done();
            };
            expect(schObj.eventsData.length).toEqual(2);
            const appElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            util.triggerMouseEvent(appElements[4], 'click');
            util.triggerMouseEvent(appElements[4], 'dblclick');
            const quickDialog: HTMLElement = schObj.quickPopup.quickDialog.element;
            expect(quickDialog.classList.contains('e-popup-open')).toEqual(true);
            util.triggerMouseEvent(quickDialog.querySelector('.e-quick-dialog-occurrence-event'), 'click');
            expect(quickDialog.classList.contains('e-popup-open')).toEqual(false);
            const eventWindow: HTMLElement = schObj.eventWindow.dialogObject.element;
            expect(eventWindow.classList.contains('e-popup-open')).toEqual(true);
            (eventWindow.querySelector('.e-subject') as HTMLInputElement).value = 'Recurrence - Edited2';
            util.triggerMouseEvent(eventWindow.querySelector('.e-event-save'), 'click');
            expect(eventWindow.classList.contains('e-popup-open')).toEqual(false);
        });

        it('Delete Single Occurrence', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(3);
                const dataObj: Record<string, any>[] = schObj.eventsData as Record<string, any>[];
                expect((<string>dataObj[0].RecurrenceException).split(',').length).toEqual(3);
                expect(dataObj[0].Id).toEqual(1);
                expect(dataObj[0].RecurrenceException).toEqual('20190205T100000Z,20190208T100000Z,20190209T100000Z');
                expect(dataObj[0].Subject).toEqual('Recurrence');
                done();
            };
            expect(schObj.eventsData.length).toEqual(3);
            const appElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            util.triggerMouseEvent(appElements[5], 'click');
            const eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup).toBeTruthy();
            (<HTMLElement>eventPopup.querySelector('.e-event-delete')).click();
            const quickDialog: HTMLElement = schObj.quickPopup.quickDialog.element;
            expect(quickDialog.classList.contains('e-popup-open')).toEqual(true);
            util.triggerMouseEvent(quickDialog.querySelector('.e-quick-dialog-occurrence-event'), 'click');
            expect(quickDialog.classList.contains('e-popup-open')).toEqual(false);
        });

        it('Delete Following Events', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(2);
                const dataObj: Record<string, any>[] = schObj.eventsData as Record<string, any>[];
                expect(dataObj[0].Id).toEqual(1);
                expect(dataObj[0].Subject).toEqual('Recurrence');
                expect((<string>dataObj[0].RecurrenceException).split(',').length).toEqual(3);
                expect(dataObj[0].RecurrenceException).toEqual('20190205T100000Z,20190208T100000Z,20190209T100000Z');
                expect(dataObj[1].Id).toEqual(2);
                expect(dataObj[1].RecurrenceID).toEqual(1);
                expect(dataObj[1].RecurrenceException).toEqual('20190205T100000Z');
                expect((<string>dataObj[1].RecurrenceException).split(',').length).toEqual(1);
                expect(dataObj[1].Subject).toEqual('Recurrence - Edited1');
                done();
            };
            expect(schObj.eventsData.length).toEqual(3);
            const appElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            util.triggerMouseEvent(appElements[3], 'click');
            const eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup).toBeTruthy();
            (<HTMLElement>eventPopup.querySelector('.e-event-delete')).click();
            const quickDialog: HTMLElement = schObj.quickPopup.quickDialog.element;
            expect(quickDialog.classList.contains('e-popup-open')).toEqual(true);
            util.triggerMouseEvent(quickDialog.querySelector('.e-quick-dialog-following-events'), 'click');
            expect(quickDialog.classList.contains('e-popup-open')).toEqual(false);
        });

        it('Delete Series', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(0);
                done();
            };
            expect(schObj.eventsData.length).toEqual(2);
            const appElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            util.triggerMouseEvent(appElements[1], 'click');
            const eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup).toBeTruthy();
            (<HTMLElement>eventPopup.querySelector('.e-event-delete')).click();
            const quickDialog: HTMLElement = schObj.quickPopup.quickDialog.element;
            expect(quickDialog.classList.contains('e-popup-open')).toEqual(true);
            util.triggerMouseEvent(quickDialog.querySelector('.e-quick-dialog-series-event'), 'click');
            expect(quickDialog.classList.contains('e-popup-open')).toEqual(false);
        });
    });

    describe('Create Following Events as Separate Series When Time Changes', () => {
        let schObj: Schedule;
        const timezone: Timezone = new Timezone();
        const eventData: Record<string, any>[] = [{
            Id: 1,
            Subject: 'Recurrence',
            StartTime: timezone.removeLocalOffset(new Date(2019, 1, 4, 10)),
            EndTime: timezone.removeLocalOffset(new Date(2019, 1, 4, 11)),
            IsAllDay: false,
            RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=10'
        }];
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                height: '500px', selectedDate: new Date(2019, 1, 4),
                eventSettings: { editFollowingEvents: true }
            };
            schObj = util.createSchedule(model, eventData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Edit Single Occurrence', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(2);
                const dataObj: Record<string, any>[] = schObj.eventsData as Record<string, any>[];
                expect((<string>dataObj[0].RecurrenceException).split(',').length).toEqual(1);
                expect(dataObj[0].Subject).toEqual('Recurrence');
                expect(dataObj[0].RecurrenceException as string).toEqual('20190205T100000Z');
                expect(dataObj[0].Id).toEqual(1);
                expect(dataObj[1].Id).toEqual(2);
                expect(dataObj[1].Subject).toEqual('Recurrence - Edited');
                expect(dataObj[1].RecurrenceID).toEqual(1);
                done();
            };
            expect(schObj.eventsData.length).toEqual(1);
            const appElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            util.triggerMouseEvent(appElements[1], 'click');
            util.triggerMouseEvent(appElements[1], 'dblclick');
            const quickDialog: HTMLElement = schObj.quickPopup.quickDialog.element;
            expect(quickDialog.classList.contains('e-popup-open')).toEqual(true);
            util.triggerMouseEvent(quickDialog.querySelector('.e-quick-dialog-occurrence-event'), 'click');
            expect(quickDialog.classList.contains('e-popup-open')).toEqual(false);
            const eventWindow: HTMLElement = schObj.eventWindow.dialogObject.element;
            expect(eventWindow.classList.contains('e-popup-open')).toEqual(true);
            (eventWindow.querySelector('.e-subject') as HTMLInputElement).value = 'Recurrence - Edited';
            util.triggerMouseEvent(eventWindow.querySelector('.e-event-save'), 'click');
            expect(eventWindow.classList.contains('e-popup-open')).toEqual(false);
        });
        it('Check Following Edit Button Availability for Recurrenece Edited Event', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(2);
                done();
            };
            expect(schObj.eventsData.length).toEqual(2);
            const appElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            util.triggerMouseEvent(appElements[1], 'click');
            const eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup).toBeTruthy();
            (<HTMLElement>eventPopup.querySelector('.e-event-edit')).click();
            const quickDialog: HTMLElement = schObj.quickPopup.quickDialog.element;
            expect(quickDialog.classList.contains('e-popup-open')).toEqual(true);
            expect(quickDialog.querySelector('.e-footer-content .e-quick-dialog-following-events').classList.contains('e-disable'))
                .toEqual(true);
            util.triggerMouseEvent(quickDialog.querySelector('.e-quick-dialog-occurrence-event'), 'click');
            expect(quickDialog.classList.contains('e-popup-open')).toEqual(false);
            const eventWindow: HTMLElement = schObj.eventWindow.dialogObject.element;
            expect(eventWindow.classList.contains('e-popup-open')).toEqual(true);
            (eventWindow.querySelector('.e-subject') as HTMLInputElement).value = 'Recurrence - Edited';
            util.triggerMouseEvent(eventWindow.querySelector('.e-event-save'), 'click');
            expect(eventWindow.classList.contains('e-popup-open')).toEqual(false);
        });
        it('Check Following Edit Button Availability for Normal Event', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(3);
                done();
            };
            expect(schObj.eventsData.length).toEqual(2);
            const appElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            util.triggerMouseEvent(appElements[0], 'click');
            const eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup).toBeTruthy();
            (<HTMLElement>eventPopup.querySelector('.e-event-edit')).click();
            const quickDialog: HTMLElement = schObj.quickPopup.quickDialog.element;
            expect(quickDialog.classList.contains('e-popup-open')).toEqual(true);
            expect(quickDialog.querySelector('.e-footer-content .e-quick-dialog-following-events').classList.contains('e-disable'))
                .toEqual(false);
            util.triggerMouseEvent(quickDialog.querySelector('.e-quick-dialog-occurrence-event'), 'click');
            expect(quickDialog.classList.contains('e-popup-open')).toEqual(false);
            const eventWindow: HTMLElement = schObj.eventWindow.dialogObject.element;
            expect(eventWindow.classList.contains('e-popup-open')).toEqual(true);
            (eventWindow.querySelector('.e-subject') as HTMLInputElement).value = 'Recurrence - Edited1';
            util.triggerMouseEvent(eventWindow.querySelector('.e-event-save'), 'click');
            expect(eventWindow.classList.contains('e-popup-open')).toEqual(false);
        });
        it('Edit Following Event', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.currentAction).toEqual('EditFollowingEvents');
                expect(schObj.eventsData.length).toEqual(4);
                const dataObj: Record<string, any>[] = schObj.eventsData as Record<string, any>[];
                expect((<string>dataObj[0].RecurrenceException).split(',').length).toEqual(2);
                expect(dataObj[0].Subject).toEqual('Recurrence');
                expect(dataObj[0].RecurrenceException as string).toEqual('20190205T100000Z,20190204T100000Z');
                expect(dataObj[0].Id).toEqual(1);
                expect(dataObj[1].Id).toEqual(2);
                expect(dataObj[1].RecurrenceID).toEqual(1);
                expect(dataObj[1].Subject).toEqual('Recurrence - Edited');
                expect(dataObj[2].Id).toEqual(3);
                expect(dataObj[2].Subject).toEqual('Recurrence - Edited1');
                expect(dataObj[2].FollowingID).toBeNull();
                expect(dataObj[2].RecurrenceID).toEqual(1);
                expect(dataObj[3].Id).toEqual(4);
                expect(dataObj[3].Subject).toEqual('Recurrence - Following Edited');
                expect(dataObj[3].FollowingID).toBeNull();
                expect(dataObj[3].RecurrenceID).toBeNull();
                done();
            };
            expect(schObj.eventsData.length).toEqual(3);
            const appElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            util.triggerMouseEvent(appElements[2], 'click');
            util.triggerMouseEvent(appElements[2], 'dblclick');
            const quickDialog: HTMLElement = schObj.quickPopup.quickDialog.element;
            expect(quickDialog.classList.contains('e-popup-open')).toEqual(true);
            util.triggerMouseEvent(quickDialog.querySelector('.e-quick-dialog-following-events'), 'click');
            expect(quickDialog.classList.contains('e-popup-open')).toEqual(false);
            const eventWindow: HTMLElement = schObj.eventWindow.dialogObject.element;
            expect(eventWindow.classList.contains('e-popup-open')).toEqual(true);
            (eventWindow.querySelector('.e-subject') as HTMLInputElement).value = 'Recurrence - Following Edited';
            const dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            const startDate: DateTimePicker = (<HTMLElement>dialogElement.querySelector('.e-start') as EJ2Instance).
                ej2_instances[0] as DateTimePicker;
            startDate.value = timezone.removeLocalOffset(new Date(2019, 1, 5, 8));
            startDate.dataBind();
            const endDate: DateTimePicker = (<HTMLElement>dialogElement.querySelector('.e-end') as EJ2Instance).
                ej2_instances[0] as DateTimePicker;
            endDate.value = timezone.removeLocalOffset(new Date(2019, 1, 5, 9));
            endDate.dataBind();
            util.triggerMouseEvent(eventWindow.querySelector('.e-event-save'), 'click');
            expect(eventWindow.classList.contains('e-popup-open')).toEqual(false);
            expect(quickDialog.classList.contains('e-popup-open')).toEqual(false);
        });
    });

    describe('Checking Public method GetEvents scenarios', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const schOptions: ScheduleModel = { width: '500px', height: '500px', selectedDate: new Date(2017, 10, 1) };
            schObj = util.createSchedule(schOptions, defaultData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('GetEvents with ignore occurrences based on start and end date ', () => {
            const startDate: Date = new Date(2017, 9, 29);
            const endDate: Date = new Date(2017, 9, 31);
            expect(schObj.getEvents(startDate, endDate).length).toEqual(3);
        });

        it('GetEvents with include occurrences based on start and end date ', () => {
            const startDate: Date = new Date(2017, 9, 29);
            const endDate: Date = new Date(2017, 9, 31);
            expect(schObj.getEvents(startDate, endDate, true).length).toEqual(3);
        });

        it('GetEvents with ignore occurrences based on start date alone', () => {
            const startDate: Date = new Date(2017, 9, 29);
            expect(schObj.getEvents(startDate).length).toEqual(43);
        });

        it('GetEvents with include occurrences based on start date alone', () => {
            const startDate: Date = new Date(2017, 9, 29);
            expect(schObj.getEvents(startDate, null, true).length).toEqual(47);
        });

        it('GetEvents with ignore occurrences based on end date alone', () => {
            const endDate: Date = new Date(2017, 9, 31);
            expect(schObj.getEvents(null, endDate).length).toEqual(3);
        });

        it('GetEvents with include occurrences based on end date alone', () => {
            const endDate: Date = new Date(2017, 9, 29);
            expect(schObj.getEvents(null, endDate, true).length).toEqual(0);
        });
    });

    describe('CR Issue EJ2-22846 Casing of popup open event argument mismatch', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const schOptions: ScheduleModel = { width: '500px', height: '500px', selectedDate: new Date(2017, 10, 1) };
            schObj = util.createSchedule(schOptions, defaultData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Cell click QuickInfo popup type', () => {
            schObj.popupOpen = (args: PopupOpenEventArgs) => {
                if (args.type === 'QuickInfo') {
                    const data: Record<string, any> = args.data as Record<string, any>;
                    expect(+data.startTime).toBe(+new Date('2017-10-29T00:00:00.000'));
                    expect(+data.endTime).toBe(+new Date('2017-10-29T00:30:00.000'));
                    expect(data.isAllDay).toBe(false);
                    expect(+data.StartTime).toBe(+new Date('2017-10-29T00:00:00.000'));
                    expect(+data.EndTime).toBe(+new Date('2017-10-29T00:30:00.000'));
                    expect(data.IsAllDay).toBe(false);
                    args.cancel = true;
                }
            };
            (schObj.element.querySelector('.e-work-cells') as HTMLElement).click();
        });
        it('Event click QuickInfo popup type', () => {
            schObj.popupOpen = (args: PopupOpenEventArgs) => {
                if (args.type === 'QuickInfo') {
                    const data: Record<string, any> = args.data as Record<string, any>;
                    expect(data.startTime).toBeUndefined();
                    expect(data.endTime).toBeUndefined();
                    expect(data.isAllDay).toBeUndefined();
                    expect(+data.StartTime).toBe(+new Date('2017-10-31T00:00:00.000'));
                    expect(+data.EndTime).toBe(+new Date('2017-11-01T00:00:00.000'));
                    expect(data.IsAllDay).toBe(true);
                    args.cancel = true;
                }
            };
            (schObj.element.querySelector('.e-appointment') as HTMLElement).click();
        });
        it('Editor popup type', () => {
            schObj.popupOpen = (args: PopupOpenEventArgs) => {
                if (args.type === 'Editor') {
                    const data: Record<string, any> = args.data as Record<string, any>;
                    expect(data.startTime).toBeUndefined();
                    expect(data.endTime).toBeUndefined();
                    expect(data.isAllDay).toBeUndefined();
                    expect(+data.StartTime).toBe(+new Date('2017-10-29T00:00:00.000'));
                    expect(+data.EndTime).toBe(+new Date('2017-10-29T00:30:00.000'));
                    expect(data.IsAllDay).toBe(false);
                    args.cancel = true;
                }
            };
            util.triggerMouseEvent(schObj.element.querySelector('.e-work-cells') as HTMLElement, 'click');
            util.triggerMouseEvent(schObj.element.querySelector('.e-work-cells') as HTMLElement, 'dblclick');
        });
    });

    describe('Multiple resource grouping without enableRtl', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                width: '100%', height: '550px',
                selectedDate: new Date(2018, 3, 1),
                currentView: 'Agenda',
                group: {
                    byGroupID: false,
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
        });

        it('agenda view quick popup backgroud check without enableRtl', () => {
            const resourceEvent: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
            expect(resourceEvent.style.borderLeftColor).toEqual('rgb(255, 170, 0)');
        });

        it('agenda view quick popup backgroud check with enableRtl', (done: DoneFn) => {
            schObj.dataBound = () => {
                const resourceEvent: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
                expect(resourceEvent.style.borderRightColor).toEqual('rgb(255, 170, 0)');
                done();
            };
            schObj.enableRtl = true;
            schObj.dataBind();
        });
    });

    describe('closeQuickInfoPopup public method testing', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const schOptions: ScheduleModel = { height: '500px', selectedDate: new Date(2017, 10, 1) };
            schObj = util.createSchedule(schOptions, defaultData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Checking for cell click quick info popup', () => {
            const workCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
            util.triggerMouseEvent(workCell, 'click');
            expect(schObj.quickPopup.quickPopup.element.querySelectorAll('.e-cell-popup').length).toEqual(1);
            schObj.closeQuickInfoPopup();
            expect(schObj.quickPopup.quickPopup.element.querySelectorAll('.e-cell-popup').length).toEqual(0);
        });

        it('Checking for event click quick info popup', () => {
            const eventElements: HTMLElement = schObj.element.querySelector('.e-appointment') as HTMLElement;
            util.triggerMouseEvent(eventElements, 'click');
            expect(schObj.quickPopup.quickPopup.element.querySelectorAll('.e-event-popup').length).toEqual(1);
            schObj.closeQuickInfoPopup();
            expect(schObj.quickPopup.quickPopup.element.querySelectorAll('.e-event-popup').length).toEqual(0);
        });
    });


    describe('CRUD Actions Using API', () => {
        let schObj: Schedule;
        const data: Record<string, any>[] = [
            {
                Id: 1,
                Subject: 'Paris',
                StartTime: new Date(2017, 9, 29, 10, 0),
                EndTime: new Date(2017, 9, 29, 11, 30),
                IsAllDay: false
            }, {
                Id: 2,
                Subject: 'Meeting - 1',
                StartTime: new Date(2017, 9, 30, 10, 0),
                EndTime: new Date(2017, 9, 30, 12, 30),
                IsAllDay: false
            }, {
                Id: 3,
                Subject: 'Meeting - 2',
                StartTime: new Date(2017, 9, 30, 11, 0),
                EndTime: new Date(2017, 9, 30, 14, 30),
                IsAllDay: false
            }, {
                Id: 4,
                StartTime: new Date(2017, 9, 31),
                EndTime: new Date(2017, 10, 1),
                IsAllDay: true
            }, {
                Id: 5,
                Subject: 'Conference - 2',
                StartTime: new Date(2017, 9, 31, 22, 0),
                EndTime: new Date(2017, 10, 1, 0, 0),
                IsAllDay: false
            }
        ];
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                height: '500px', selectedDate: new Date(2017, 10, 1),
                eventSettings: { allowAdding: false, allowEditing: false, allowDeleting: false }
            };
            schObj = util.createSchedule(model, data, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Cell click and insert event', () => {
            util.triggerMouseEvent(schObj.element.querySelector('.' + cls.WORK_HOURS_CLASS), 'click');
            expect(schObj.element.querySelector('.e-quick-popup-wrapper').classList.contains('e-popup-close')).toEqual(true);
            expect(schObj.element.querySelector('.e-quick-popup-wrapper').classList.contains('e-popup-open')).toEqual(false);
        });

        it('Event Click and Delete event', () => {
            util.triggerMouseEvent(schObj.element.querySelector('.e-appointment:nth-child(2)'), 'click');
            expect(schObj.element.querySelector('.e-quick-popup-wrapper').classList.contains('e-popup-close')).toEqual(false);
            expect(schObj.element.querySelector('.e-quick-popup-wrapper').classList.contains('e-popup-open')).toEqual(true);
            util.triggerMouseEvent(schObj.quickPopup.quickPopup.element.querySelector('.e-delete'), 'click');
            expect(schObj.element.querySelector('.e-quick-popup-wrapper').classList.contains('e-popup-close')).toEqual(false);
            expect(schObj.element.querySelector('.e-quick-popup-wrapper').classList.contains('e-popup-open')).toEqual(true);
        });
    });

    describe('isMorePopup property checking on mobile view', () => {
        let schObj: Schedule;
        const uA: string = Browser.userAgent;
        const androidUserAgent: string = 'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) ' +
            'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36';

        beforeAll((done: DoneFn) => {
            Browser.userAgent = androidUserAgent;
            const model: ScheduleModel = {
                currentView: 'Month',
                views: ['Day', 'Month', 'Agenda', 'TimelineDay', 'TimelineMonth'],
                selectedDate: new Date(2018, 4, 1)
            };
            schObj = util.createSchedule(model, timelineData, done);
        });

        afterAll(() => {
            util.destroy(schObj);
            Browser.userAgent = uA;
        });

        it('More event popup checking on the month view', () => {
            (schObj.element.querySelectorAll('.e-more-indicator')[2] as HTMLElement).click();
            const moreEventPopup: Element = document.querySelector('.e-more-popup-wrapper');
            expect(isVisible(moreEventPopup)).toBe(true);
            const moreEventWrapper: HTMLElement = document.querySelector('.e-more-appointment-wrapper') as HTMLElement;
            const moreEventCount: number = moreEventWrapper.childElementCount;
            expect(moreEventCount).toEqual(15);
            (document.querySelector('.e-more-event-close') as HTMLElement).click();
        });

        it('More event popup checking on timeline month view', (done: DoneFn) => {
            schObj.dataBound = () => {
                (schObj.element.querySelector('.e-more-indicator') as HTMLElement).click();
                const moreEventPopup: Element = document.querySelector('.e-more-popup-wrapper');
                expect(isVisible(moreEventPopup)).toBe(true);
                const moreEventWrapper: HTMLElement = document.querySelector('.e-more-appointment-wrapper') as HTMLElement;
                const moreEventCount: number = moreEventWrapper.childElementCount;
                expect(moreEventCount).toEqual(15);
                (document.querySelector('.e-more-event-close') as HTMLElement).click();
                done();
            };
            schObj.currentView = 'TimelineMonth';
            schObj.dataBind();
        });

        it('isMorePopup property is set to false and check the more indicator click navigation on timeline day view', (done: DoneFn) => {
            schObj.moreEventsClick = (args: MoreEventsClickArgs) => args.isPopupOpen = false;
            schObj.dataBound = () => {
                expect(schObj.currentView).toEqual('TimelineDay');
                expect(isVisible(document.querySelector('.e-more-popup-wrapper'))).toBe(false);
                done();
            };
            (schObj.element.querySelector('.e-more-indicator') as HTMLElement).click();
        });

        it('isMorePopup property is set to false and check the more indicator click navigation on day view', (done: DoneFn) => {
            schObj.dataBound = () => {
                (schObj.element.querySelectorAll('.e-more-indicator')[2] as HTMLElement).click();
                expect(schObj.currentView).toEqual('Day');
                done();
            };
            schObj.currentView = 'Month';
            schObj.dataBind();
        });
    });

    describe('isMorePopup property checking on Desktop mode', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                currentView: 'Month',
                views: ['Day', 'Month', 'Agenda', 'TimelineDay', 'TimelineMonth'],
                selectedDate: new Date(2018, 4, 1)
            };
            schObj = util.createSchedule(model, timelineData, done);
        });

        afterAll(() => {
            util.destroy(schObj);
        });

        it('More event popup checking on the month view', () => {
            (schObj.element.querySelectorAll('.e-more-indicator')[2] as HTMLElement).click();
            const moreEventPopup: Element = document.querySelector('.e-more-popup-wrapper');
            expect(isVisible(moreEventPopup)).toBe(true);
            const moreEventWrapper: HTMLElement = document.querySelector('.e-more-appointment-wrapper') as HTMLElement;
            expect(moreEventWrapper.childElementCount).toEqual(15);
            (document.querySelector('.e-more-event-close') as HTMLElement).click();
        });

        it('More event popup checking on timeline month view', (done: DoneFn) => {
            schObj.dataBound = () => {
                (schObj.element.querySelector('.e-more-indicator') as HTMLElement).click();
                const moreEventPopup: Element = document.querySelector('.e-more-popup-wrapper');
                expect(isVisible(moreEventPopup)).toBe(true);
                const moreEventWrapper: HTMLElement = document.querySelector('.e-more-appointment-wrapper') as HTMLElement;
                expect(moreEventWrapper.childElementCount).toEqual(15);
                (document.querySelector('.e-more-event-close') as HTMLElement).click();
                done();
            };
            schObj.currentView = 'TimelineMonth';
            schObj.dataBind();
        });

        it('isMorePopup property is set to false and check the more indicator click navigation on timeline day view', (done: DoneFn) => {
            schObj.moreEventsClick = (args: MoreEventsClickArgs) => args.isPopupOpen = false;
            schObj.dataBound = () => {
                expect(schObj.currentView).toEqual('TimelineDay');
                expect(isVisible(document.querySelector('.e-more-popup-wrapper'))).toBe(false);
                done();
            };
            (schObj.element.querySelector('.e-more-indicator') as HTMLElement).click();
        });

        it('isMorePopup property is set to false and check the more indicator click navigation on day view', (done: DoneFn) => {
            schObj.dataBound = () => {
                (schObj.element.querySelectorAll('.e-more-indicator')[2] as HTMLElement).click();
                expect(schObj.currentView).toEqual('Day');
                done();
            };
            schObj.currentView = 'Month';
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
