/**
 * QuickPopups spec
 */
import { createElement, remove, EmitType, extend, isVisible, Browser, closest } from '@syncfusion/ej2-base';
import { Schedule, Day, Week, WorkWeek, Month, Agenda, TimelineViews, EJ2Instance, EventRenderedArgs } from '../../../src/schedule/index';
import { RecurrenceEditor } from '../../../src/recurrence-editor/index';
import { defaultData, resourceData } from '../base/datasource.spec';
import { PopupOpenEventArgs, EventClickArgs } from '../../../src/index';
import * as cls from '../../../src/schedule/base/css-constant';
import { disableScheduleAnimation, triggerMouseEvent } from '../util.spec';

Schedule.Inject(Day, Week, WorkWeek, Month, Agenda, TimelineViews);

describe('Quick Popups', () => {
    let getDataSource: Function = (): Object[] => {
        let datasrc: Object[] = [];
        for (let i: number = 0; i < 43; i++) {
            datasrc.push(extend({}, defaultData[i]));
        }
        return datasrc;
    };

    describe('Tooltip and Dialog for vertical view', () => {
        let schObj: Schedule;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            schObj = new Schedule({
                height: '500px', selectedDate: new Date(2017, 10, 1),
                eventSettings: { dataSource: getDataSource() },
                dataBound: dataBound
            });
            schObj.appendTo('#Schedule');
            disableScheduleAnimation(schObj);
        });
        afterAll(() => {
            if (schObj) {
                schObj.destroy();
            }
            remove(elem);
        });

        it('Cell Click and open event window', () => {
            let workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-hours'));
            workCells[1].click();
            let cellPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(cellPopup.classList).toContain('e-popup-open');
            (<HTMLElement>cellPopup.querySelector('.e-event-details')).click();
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            (dialogElement.querySelector('.e-event-cancel') as HTMLElement).click();
        });

        it('Event click client side event', () => {
            schObj.eventClick = (args: EventClickArgs) => args.cancel = true;
            schObj.dataBind();
            let eventElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElements).toBeTruthy();
            eventElements[1].click();
            schObj.eventClick = (args: EventClickArgs) => { args.cancel = false; };
            schObj.dataBind();
        });

        it('Event Click and Delete event', () => {
            let eventElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            eventElements[1].click();
            let eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup).toBeTruthy();
            (<HTMLElement>eventPopup.querySelector('.e-event-delete')).click();
            (<HTMLElement>document.body.querySelector('.e-quick-dialog-cancel')).click();
        });

        it('Event Click and Delete series', () => {
            let eventElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            eventElements[10].click();
            let eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup).toBeTruthy();
            (<HTMLElement>eventPopup.querySelector('.e-event-delete')).click();
            (<HTMLElement>schObj.quickPopup.quickDialog.element.querySelector('.e-dlg-closeicon-btn')).click();
        });

        it('Event click edit occurance', () => {
            let eventElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            eventElements[10].click();
            let eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup).toBeTruthy();
            (<HTMLElement>eventPopup.querySelector('.e-event-edit')).click();
            (<HTMLElement>schObj.quickPopup.quickDialog.element.querySelector('.e-dlg-closeicon-btn')).click();
        });

        it('Tooltip close', () => {
            let eventElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            eventElements[1].click();
            let eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup).toBeTruthy();
            (<HTMLElement>eventPopup.querySelector('.e-close')).click();
        });

        it('Cell Click and Save new event', (done: Function) => {
            let dataBound: (args: Object) => void = (args: Object) => {
                expect(schObj.eventsData.length).toEqual(44);
                done();
            };
            schObj.dataBound = dataBound;
            let workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-hours'));
            workCells[0].click();
            let cellPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            (<HTMLInputElement>cellPopup.querySelector('.e-subject')).value = 'Welcome';
            (<HTMLElement>cellPopup.querySelector('.e-event-create')).click();
        });

        it('Cell Click and Save new event with default value', (done: Function) => {
            let dataBound: (args: Object) => void = (args: Object) => {
                expect(schObj.eventsData.length).toEqual(45);
                done();
            };
            schObj.dataBound = dataBound;
            let workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-hours'));
            workCells[0].click();
            let cellPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            (<HTMLElement>cellPopup.querySelector('.e-event-create')).click();
        });

        it('Event Dialog Delete Click', (done: Function) => {
            let dataBound: () => void = () => {
                expect(schObj.eventsData.length).toEqual(44);
                done();
            };
            schObj.dataBound = dataBound;
            let eventElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            eventElements[1].click();
            let eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup).toBeTruthy();
            (<HTMLElement>eventPopup.querySelector('.e-delete')).click();
            (<HTMLElement>document.body.querySelector('.e-quick-dialog-delete')).click();
        });

        it('Event Dialog Cancel Click', () => {
            let eventElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            eventElements[1].click();
            let eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup).toBeTruthy();
            (<HTMLElement>eventPopup.querySelector('.e-delete')).click();
            (<HTMLElement>document.body.querySelector('.e-quick-dialog-cancel')).click();
        });

        it('Event Dialog Close icon click', () => {
            let eventElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            eventElements[1].click();
            let eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup).toBeTruthy();
            (<HTMLElement>eventPopup.querySelector('.e-delete')).click();
            (<HTMLElement>schObj.quickPopup.quickDialog.element.querySelector('.e-dlg-closeicon-btn')).click();
        });

        it('Prevent event click quickInfo', () => {
            schObj.popupOpen = (args: PopupOpenEventArgs) => {
                if (args.type === 'QuickInfo' && args.target.classList.contains(cls.APPOINTMENT_CLASS)) {
                    args.cancel = true;
                }
            };
            (schObj.element.querySelector('.e-appointment') as HTMLElement).click();
            expect(schObj.quickPopup.quickPopup.element.classList).toContain('e-popup-close');
        });

        it('Prevent cell click quickInfo', () => {
            schObj.popupOpen = (args: PopupOpenEventArgs) => {
                if (args.type === 'QuickInfo' && args.target.classList.contains('e-work-cells')) {
                    args.cancel = true;
                }
            };
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
            schObj.popupOpen = (args: PopupOpenEventArgs) => {
                if (args.type === 'DeleteAlert') {
                    args.cancel = true;
                }
            };
            (schObj.element.querySelector('.e-appointment') as HTMLElement).click();
            let eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup).toBeTruthy();
            (<HTMLElement>eventPopup.querySelector('.e-delete')).click();
            expect(isVisible(document.querySelector('.e-quick-dialog'))).toBe(false);
        });

        it('showQuickInfo property checking', () => {
            schObj.popupOpen = null;
            schObj.showQuickInfo = false;
            schObj.dataBind();
            let workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-hours'));
            workCells[0].click();
            let eventElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            eventElements[0].click();
        });

        it('Cell Click and open event window with subject value', () => {
            schObj.showQuickInfo = true;
            schObj.dataBind();
            let workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.' + cls.WORK_HOURS_CLASS));
            workCells[1].click();
            let eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            (<HTMLInputElement>eventPopup.querySelector('.' + cls.SUBJECT_CLASS)).value = 'Meeting';
            (<HTMLInputElement>eventPopup.querySelector('.' + cls.QUICK_POPUP_EVENT_DETAILS_CLASS)).click();
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            let subjectElement: HTMLInputElement = dialogElement.querySelector('.' + cls.SUBJECT_CLASS);
            expect(subjectElement.value).toEqual('Meeting');
            (dialogElement.querySelector('.' + cls.EVENT_WINDOW_CANCEL_BUTTON_CLASS) as HTMLElement).click();
        });
    });
    describe('Tooltip and Dialog for timeline view', () => {
        let schObj: Schedule;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            schObj = new Schedule({
                height: '500px', selectedDate: new Date(2017, 10, 1),
                currentView: 'TimelineWeek',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek'],
                eventSettings: { dataSource: getDataSource() },
                dataBound: dataBound
            });
            schObj.appendTo('#Schedule');
            disableScheduleAnimation(schObj);
        });
        afterAll(() => {
            if (schObj) {
                schObj.destroy();
            }
            remove(elem);
        });

        it('Cell Click and open event window', () => {
            let workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-hours'));
            workCells[1].click();
            let cellPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(cellPopup.classList).toContain('e-popup-open');
            (<HTMLElement>cellPopup.querySelector('.e-event-details')).click();
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            (dialogElement.querySelector('.e-event-cancel') as HTMLElement).click();
        });

        it('Event click client side event', () => {
            schObj.eventClick = (args: EventClickArgs) => args.cancel = true;
            schObj.dataBind();
            let eventElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElements).toBeTruthy();
            eventElements[1].click();
            schObj.eventClick = (args: EventClickArgs) => { args.cancel = false; };
            schObj.dataBind();
        });

        it('Event Click and Delete event', () => {
            let eventElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            eventElements[1].click();
            let eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup).toBeTruthy();
            (<HTMLElement>eventPopup.querySelector('.e-event-delete')).click();
            (<HTMLElement>document.body.querySelector('.e-quick-dialog-cancel')).click();
        });

        it('Event Click and Delete series', () => {
            let eventElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            eventElements[10].click();
            let eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup).toBeTruthy();
            (<HTMLElement>eventPopup.querySelector('.e-event-delete')).click();
            (<HTMLElement>schObj.quickPopup.quickDialog.element.querySelector('.e-dlg-closeicon-btn')).click();
        });

        it('Event click edit occurance', () => {
            let eventElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            eventElements[10].click();
            let eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup).toBeTruthy();
            (<HTMLElement>eventPopup.querySelector('.e-event-edit')).click();
            (<HTMLElement>schObj.quickPopup.quickDialog.element.querySelector('.e-dlg-closeicon-btn')).click();
        });

        it('Tooltip close', () => {
            let eventElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            eventElements[1].click();
            let eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup).toBeTruthy();
            (<HTMLElement>eventPopup.querySelector('.e-close')).click();
        });

        it('Cell Click and Save new event', (done: Function) => {
            let dataBound: (args: Object) => void = (args: Object) => {
                expect(schObj.eventsData.length).toEqual(44);
                done();
            };
            schObj.dataBound = dataBound;
            let workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-hours'));
            workCells[0].click();
            let cellPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            (<HTMLInputElement>cellPopup.querySelector('.e-subject')).value = 'Welcome';
            (<HTMLElement>cellPopup.querySelector('.e-event-create')).click();
        });

        it('Cell Click and Save new event with default value', (done: Function) => {
            let dataBound: (args: Object) => void = (args: Object) => {
                expect(schObj.eventsData.length).toEqual(45);
                done();
            };
            schObj.dataBound = dataBound;
            let workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-hours'));
            workCells[0].click();
            let cellPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            (<HTMLElement>cellPopup.querySelector('.e-event-create')).click();
        });

        it('Event Dialog Delete Click', (done: Function) => {
            let dataBound: () => void = () => {
                expect(schObj.eventsData.length).toEqual(44);
                done();
            };
            schObj.dataBound = dataBound;
            let eventElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            eventElements[1].click();
            let eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup).toBeTruthy();
            (<HTMLElement>eventPopup.querySelector('.e-delete')).click();
            (<HTMLElement>document.body.querySelector('.e-quick-dialog-delete')).click();
        });

        it('Event Dialog Cancel Click', () => {
            let eventElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            eventElements[1].click();
            let eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup).toBeTruthy();
            (<HTMLElement>eventPopup.querySelector('.e-delete')).click();
            (<HTMLElement>document.body.querySelector('.e-quick-dialog-cancel')).click();
        });

        it('Event Dialog Close icon click', () => {
            let eventElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            eventElements[1].click();
            let eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup).toBeTruthy();
            (<HTMLElement>eventPopup.querySelector('.e-delete')).click();
            (<HTMLElement>schObj.quickPopup.quickDialog.element.querySelector('.e-dlg-closeicon-btn')).click();
        });

        it('Prevent event click quickInfo', () => {
            schObj.popupOpen = (args: PopupOpenEventArgs) => {
                if (args.type === 'QuickInfo' && args.target.classList.contains(cls.APPOINTMENT_CLASS)) {
                    args.cancel = true;
                }
            };
            (schObj.element.querySelector('.e-appointment') as HTMLElement).click();
            expect(schObj.quickPopup.quickPopup.element.classList).toContain('e-popup-close');
        });

        it('Prevent cell click quickInfo', () => {
            schObj.popupOpen = (args: PopupOpenEventArgs) => {
                if (args.type === 'QuickInfo' && args.target.classList.contains('e-work-cells')) {
                    args.cancel = true;
                }
            };
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
            schObj.popupOpen = (args: PopupOpenEventArgs) => {
                if (args.type === 'DeleteAlert') {
                    args.cancel = true;
                }
            };
            (schObj.element.querySelector('.e-appointment') as HTMLElement).click();
            let eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup).toBeTruthy();
            (<HTMLElement>eventPopup.querySelector('.e-delete')).click();
            expect(isVisible(document.querySelector('.e-quick-dialog'))).toBe(false);
        });

        it('showQuickInfo property checking', () => {
            schObj.popupOpen = null;
            schObj.showQuickInfo = false;
            schObj.dataBind();
            let workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-hours'));
            workCells[0].click();
            let eventElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            eventElements[0].click();
        });

        it('Cell Click and open event window with subject value', () => {
            schObj.showQuickInfo = true;
            schObj.dataBind();
            let workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.' + cls.WORK_HOURS_CLASS));
            workCells[1].click();
            let eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            (<HTMLInputElement>eventPopup.querySelector('.' + cls.SUBJECT_CLASS)).value = 'Meeting';
            (<HTMLInputElement>eventPopup.querySelector('.' + cls.QUICK_POPUP_EVENT_DETAILS_CLASS)).click();
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            let subjectElement: HTMLInputElement = dialogElement.querySelector('.' + cls.SUBJECT_CLASS);
            expect(subjectElement.value).toEqual('Meeting');
            (dialogElement.querySelector('.' + cls.EVENT_WINDOW_CANCEL_BUTTON_CLASS) as HTMLElement).click();
        });
    });

    describe('checking quickInfoTemplate for cellClick', () => {
        let schObj: Schedule;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        beforeAll((done: Function) => {
            let hT: string = '<div>${if (elementType === "cell")}<div class="e-cell-header"><div class="e-header-icon-wrapper">' +
                '<button class="e-close" title="Close"></button></div></div>${/if}</div>';
            let scriptEleHeader: HTMLScriptElement = document.createElement('script');
            scriptEleHeader.type = 'text/x-template';
            scriptEleHeader.id = 'headerTemplate';
            scriptEleHeader.appendChild(document.createTextNode(hT));
            document.getElementsByTagName('head')[0].appendChild(scriptEleHeader);
            let cT: string = '<div>${if (elementType === "cell")}<div class="e-cell-content"><form class="e-schedule-form"><div>' +
                '<input class="subject e-field" type="text" name="Subject" placeholder="Title"></div><div>' +
                '<input class="location e-field" type="text" name="Location" placeholder="Location"></div></form></div>${/if}</div>';
            let scriptEleContent: HTMLScriptElement = document.createElement('script');
            scriptEleContent.type = 'text/x-template';
            scriptEleContent.id = 'contentTemplate';
            scriptEleContent.appendChild(document.createTextNode(cT));
            document.getElementsByTagName('head')[0].appendChild(scriptEleContent);
            let fT: string = '<div>${if (elementType === "cell")}<div class="e-cell-footer"><button class="e-event-details"' +
                'title="Extra Details">Extra Details</button><button class="e-event-create" title="Add">Add</button></div>${/if}</div>';
            let scriptEleFooter: HTMLScriptElement = document.createElement('script');
            scriptEleFooter.type = 'text/x-template';
            scriptEleFooter.id = 'footerTemplate';
            scriptEleFooter.appendChild(document.createTextNode(fT));
            document.getElementsByTagName('head')[0].appendChild(scriptEleFooter);
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            schObj = new Schedule({
                height: '500px', currentView: 'Week', views: ['Week'],
                selectedDate: new Date(2017, 10, 1), eventSettings: { dataSource: [] },
                dataBound: dataBound
            });
            schObj.appendTo(elem);
            disableScheduleAnimation(schObj);
        });
        afterAll(() => {
            if (schObj) {
                schObj.destroy();
            }
            document.getElementById('headerTemplate').remove();
            document.getElementById('contentTemplate').remove();
            document.getElementById('footerTemplate').remove();
            remove(elem);
        });

        it('checking header, content and footer area for cell-quick popup', () => {
            schObj.quickInfoTemplates = {
                header: '#headerTemplate',
                content: '#contentTemplate',
                footer: '#footerTemplate'
            };
            schObj.dataBind();
            let workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-hours'));
            workCells[1].click();
            let cellPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(cellPopup.classList).toContain('e-popup-open');
            expect(schObj.element.querySelector('.e-cell-header')).toBeTruthy();
            expect(schObj.element.querySelector('.e-popup-header')).toBeNull();
            expect(schObj.element.querySelector('.e-cell-content')).toBeTruthy();
            expect(schObj.element.querySelector('.e-popup-content')).toBeNull();
            let contentFieldEle: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-field'));
            expect(contentFieldEle.length).toEqual(2);
            expect(contentFieldEle[0].classList).toContain('subject');
            expect(contentFieldEle[1].classList).toContain('location');
            expect(schObj.element.querySelector('.e-cell-footer')).toBeTruthy();
            expect(schObj.element.querySelector('.e-popup-footer')).toBeNull();
            let footerEle: HTMLElement = schObj.element.querySelector('.e-cell-footer') as HTMLElement;
            expect(footerEle.firstElementChild.classList).toContain('e-event-details');
            expect(footerEle.lastElementChild.classList).toContain('e-event-create');
            (<HTMLElement>cellPopup.querySelector('.e-close')).click();
        });

        it('checking header area of cell-quick popup', () => {
            schObj.quickInfoTemplates = {
                header: '#headerTemplate',
                content: '',
                footer: ''
            };
            schObj.dataBind();
            let workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-hours'));
            workCells[1].click();
            let cellPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(cellPopup.classList).toContain('e-popup-open');
            expect(schObj.element.querySelector('.e-popup-header')).toBeNull();
            expect(schObj.element.querySelector('.e-cell-header')).toBeTruthy();
            expect(schObj.element.querySelector('.e-popup-content')).toBeTruthy();
            expect(schObj.element.querySelector('.e-cell-content')).toBeNull();
            expect(schObj.element.querySelector('.e-popup-footer')).toBeTruthy();
            expect(schObj.element.querySelector('.e-cell-footer')).toBeNull();
            (<HTMLElement>cellPopup.querySelector('.e-close')).click();
        });

        it('checking content area of cell-quick popup', () => {
            schObj.quickInfoTemplates = {
                header: '',
                content: '#contentTemplate',
                footer: ''
            };
            schObj.dataBind();
            let workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-hours'));
            workCells[1].click();
            let cellPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(cellPopup.classList).toContain('e-popup-open');
            expect(schObj.element.querySelector('.e-cell-content')).toBeTruthy();
            expect(schObj.element.querySelector('.e-popup-content')).toBeNull();
            let contentFieldEle: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-field'));
            expect(contentFieldEle.length).toEqual(2);
            expect(contentFieldEle[0].classList).toContain('subject');
            expect(contentFieldEle[1].classList).toContain('location');
            expect(schObj.element.querySelector('.e-popup-header')).toBeTruthy();
            expect(schObj.element.querySelector('.e-cell-header')).toBeNull();
            expect(schObj.element.querySelector('.e-popup-footer')).toBeTruthy();
            expect(schObj.element.querySelector('.e-cell-footer')).toBeNull();
            (<HTMLElement>cellPopup.querySelector('.e-close')).click();
        });

        it('checking footer area of cell-quick popup', () => {
            schObj.quickInfoTemplates = {
                header: '',
                content: '',
                footer: '#footerTemplate'
            };
            schObj.dataBind();
            let workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-hours'));
            workCells[1].click();
            let cellPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(cellPopup.classList).toContain('e-popup-open');
            expect(schObj.element.querySelector('.e-popup-header')).toBeTruthy();
            expect(schObj.element.querySelector('.e-cell-header')).toBeNull();
            expect(schObj.element.querySelector('.e-popup-content')).toBeTruthy();
            expect(schObj.element.querySelector('.e-cell-content')).toBeNull();
            expect(schObj.element.querySelector('.e-cell-footer')).toBeTruthy();
            expect(schObj.element.querySelector('.e-popup-footer')).toBeNull();
            let footerEle: HTMLElement = schObj.element.querySelector('.e-cell-footer') as HTMLElement;
            expect(footerEle.firstElementChild.classList).toContain('e-event-details');
            expect(footerEle.lastElementChild.classList).toContain('e-event-create');
            (<HTMLElement>cellPopup.querySelector('.e-close')).click();
        });

        it('checking header and content for cell-quick popup', () => {
            schObj.quickInfoTemplates = {
                header: '#headerTemplate',
                content: '#contentTemplate',
                footer: ''
            };
            schObj.dataBind();
            let workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-hours'));
            workCells[1].click();
            let cellPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(cellPopup.classList).toContain('e-popup-open');
            expect(schObj.element.querySelector('.e-cell-header')).toBeTruthy();
            expect(schObj.element.querySelector('.e-popup-header')).toBeNull();
            expect(schObj.element.querySelector('.e-cell-content')).toBeTruthy();
            expect(schObj.element.querySelector('.e-popup-content')).toBeNull();
            let contentFieldEle: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-field'));
            expect(contentFieldEle.length).toEqual(2);
            expect(contentFieldEle[0].classList).toContain('subject');
            expect(contentFieldEle[1].classList).toContain('location');
            expect(schObj.element.querySelector('.e-popup-footer')).toBeTruthy();
            expect(schObj.element.querySelector('.e-cell-footer')).toBeNull();
            (<HTMLElement>cellPopup.querySelector('.e-close')).click();
        });

        it('checking content and footer area for cell-quick popup', () => {
            schObj.quickInfoTemplates = {
                header: '',
                content: '#contentTemplate',
                footer: '#footerTemplate'
            };
            schObj.dataBind();
            let workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-hours'));
            workCells[1].click();
            let cellPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(cellPopup.classList).toContain('e-popup-open');
            expect(schObj.element.querySelector('.e-popup-header')).toBeTruthy();
            expect(schObj.element.querySelector('.e-cell-header')).toBeNull();
            expect(schObj.element.querySelector('.e-cell-content')).toBeTruthy();
            expect(schObj.element.querySelector('.e-popup-content')).toBeNull();
            let contentFieldEle: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-field'));
            expect(contentFieldEle.length).toEqual(2);
            expect(contentFieldEle[0].classList).toContain('subject');
            expect(contentFieldEle[1].classList).toContain('location');
            expect(schObj.element.querySelector('.e-cell-footer')).toBeTruthy();
            expect(schObj.element.querySelector('.e-popup-footer')).toBeNull();
            let footerEle: HTMLElement = schObj.element.querySelector('.e-cell-footer') as HTMLElement;
            expect(footerEle.firstElementChild.classList).toContain('e-event-details');
            expect(footerEle.lastElementChild.classList).toContain('e-event-create');
            (<HTMLElement>cellPopup.querySelector('.e-close')).click();
        });

        it('checking header and footer area for cell-quick popup', () => {
            schObj.quickInfoTemplates = {
                header: '#headerTemplate',
                content: '',
                footer: '#footerTemplate'
            };
            schObj.dataBind();
            let workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-hours'));
            workCells[1].click();
            let cellPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(cellPopup.classList).toContain('e-popup-open');
            expect(schObj.element.querySelector('.e-cell-header')).toBeTruthy();
            expect(schObj.element.querySelector('.e-popup-header')).toBeNull();
            expect(schObj.element.querySelector('.e-popup-content')).toBeTruthy();
            expect(schObj.element.querySelector('.e-cell-content')).toBeNull();
            expect(schObj.element.querySelector('.e-cell-footer')).toBeTruthy();
            expect(schObj.element.querySelector('.e-popup-footer')).toBeNull();
            let footerEle: HTMLElement = schObj.element.querySelector('.e-cell-footer') as HTMLElement;
            expect(footerEle.firstElementChild.classList).toContain('e-event-details');
            expect(footerEle.lastElementChild.classList).toContain('e-event-create');
            (<HTMLElement>cellPopup.querySelector('.e-close')).click();
        });
    });

    describe('checking quickInfoTemplate for eventClick', () => {
        let schObj: Schedule;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        beforeAll((done: Function) => {
            let hT: string = '<div>${if(elementType === "event")}<div class="e-event-header"><div class="e-header-icon-wrapper">' +
                '<button class="e-close" title="CLOSE"></button></div></div>${/if}</div>';
            let scriptEleHeader: HTMLScriptElement = document.createElement('script');
            scriptEleHeader.type = 'text/x-template';
            scriptEleHeader.id = 'headerTemplate';
            scriptEleHeader.appendChild(document.createTextNode(hT));
            document.getElementsByTagName('head')[0].appendChild(scriptEleHeader);
            let cT: string = '<div>${if(elementType === "event")}<div class="e-event-content"><div class="e-subject-wrap">${if (Subject)}' +
                '<div class="subject">${Subject}</div>${/if} ${if (Location)}<div class="location">${Location}</div>${/if} ' +
                '${if (Description)}<div class="description">${Description}</div>${/if}</div></div>${/if}</div>';
            let scriptEleContent: HTMLScriptElement = document.createElement('script');
            scriptEleContent.type = 'text/x-template';
            scriptEleContent.id = 'contentTemplate';
            scriptEleContent.appendChild(document.createTextNode(cT));
            document.getElementsByTagName('head')[0].appendChild(scriptEleContent);
            let fT: string = '<div>${if(elementType === "event")}<div class="e-event-footer"><button class="e-event-edit" title="Edit">' +
                'Edit</button><button class="e-event-delete" title="Delete">Delete</button></div>${/if}</div>';
            let scriptEleFooter: HTMLScriptElement = document.createElement('script');
            scriptEleFooter.type = 'text/x-template';
            scriptEleFooter.id = 'footerTemplate';
            scriptEleFooter.appendChild(document.createTextNode(fT));
            document.getElementsByTagName('head')[0].appendChild(scriptEleFooter);
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            schObj = new Schedule({
                height: '500px', currentView: 'Week', views: ['Day', 'Week', 'WorkWeek', 'Month'],
                selectedDate: new Date(2017, 10, 1),
                eventSettings: {
                    dataSource: [
                        {
                            Id: 1,
                            Subject: 'Testing',
                            StartTime: new Date(2017, 10, 1, 10),
                            EndTime: new Date(2017, 10, 1, 12),
                        }
                    ]
                },
                dataBound: dataBound
            });
            schObj.appendTo(elem);
            disableScheduleAnimation(schObj);
        });
        afterAll(() => {
            if (schObj) {
                schObj.destroy();
            }
            document.getElementById('headerTemplate').remove();
            document.getElementById('contentTemplate').remove();
            document.getElementById('footerTemplate').remove();
            remove(elem);
        });

        it('checking header, content and footer area for event-quick popup', () => {
            schObj.quickInfoTemplates = {
                header: '#headerTemplate',
                content: '#contentTemplate',
                footer: '#footerTemplate'
            };
            schObj.dataBind();
            triggerMouseEvent(schObj.element.querySelectorAll('.e-appointment')[0] as HTMLElement, 'click');
            let cellPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(cellPopup.classList).toContain('e-popup-open');
            expect(schObj.element.querySelector('.e-event-header')).toBeTruthy();
            expect(schObj.element.querySelector('.e-popup-header')).toBeNull();
            expect(schObj.element.querySelector('.e-event-content')).toBeTruthy();
            expect(schObj.element.querySelector('.e-popup-content')).toBeNull();
            let contentFieldEle: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-event-content'));
            expect(contentFieldEle.length).toEqual(1);
            expect(contentFieldEle[0].innerText).toContain('Testing');
            expect(schObj.element.querySelector('.e-event-footer')).toBeTruthy();
            expect(schObj.element.querySelector('.e-popup-footer')).toBeNull();
            let footerEle: HTMLElement = schObj.element.querySelector('.e-event-footer') as HTMLElement;
            expect(footerEle.firstElementChild.classList).toContain('e-event-edit');
            expect(footerEle.lastElementChild.classList).toContain('e-event-delete');
            (<HTMLElement>cellPopup.querySelector('.e-close')).click();
        });

        it('checking header area of event-quick popup', () => {
            schObj.quickInfoTemplates = {
                header: '#headerTemplate',
                content: '',
                footer: ''
            };
            schObj.dataBind();
            triggerMouseEvent(schObj.element.querySelectorAll('.e-appointment')[0] as HTMLElement, 'click');
            let cellPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(cellPopup.classList).toContain('e-popup-open');
            expect(schObj.element.querySelector('.e-popup-header')).toBeNull();
            expect(schObj.element.querySelector('.e-event-header')).toBeTruthy();
            expect(schObj.element.querySelector('.e-popup-content')).toBeTruthy();
            expect(schObj.element.querySelector('.e-event-content')).toBeNull();
            expect(schObj.element.querySelector('.e-popup-footer')).toBeTruthy();
            expect(schObj.element.querySelector('.e-event-footer')).toBeNull();
            (<HTMLElement>cellPopup.querySelector('.e-close')).click();
        });

        it('checking content area of event-quick popup', () => {
            schObj.quickInfoTemplates = {
                header: '',
                content: '#contentTemplate',
                footer: ''
            };
            schObj.dataBind();
            triggerMouseEvent(schObj.element.querySelectorAll('.e-appointment')[0] as HTMLElement, 'click');
            let cellPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(cellPopup.classList).toContain('e-popup-open');
            expect(schObj.element.querySelector('.e-event-content')).toBeTruthy();
            expect(schObj.element.querySelector('.e-popup-content')).toBeNull();
            let contentFieldEle: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-event-content'));
            expect(contentFieldEle.length).toEqual(1);
            expect(contentFieldEle[0].innerText).toContain('Testing');
            expect(schObj.element.querySelector('.e-popup-header')).toBeTruthy();
            expect(schObj.element.querySelector('.e-event-header')).toBeNull();
            expect(schObj.element.querySelector('.e-popup-footer')).toBeTruthy();
            expect(schObj.element.querySelector('.e-event-footer')).toBeNull();
            (<HTMLElement>cellPopup.querySelector('.e-close')).click();
        });

        it('checking footer area of event-quick popup', () => {
            schObj.quickInfoTemplates = {
                header: '',
                content: '',
                footer: '#footerTemplate'
            };
            schObj.dataBind();
            triggerMouseEvent(schObj.element.querySelectorAll('.e-appointment')[0] as HTMLElement, 'click');
            let cellPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(cellPopup.classList).toContain('e-popup-open');
            expect(schObj.element.querySelector('.e-popup-header')).toBeTruthy();
            expect(schObj.element.querySelector('.e-event-header')).toBeNull();
            expect(schObj.element.querySelector('.e-popup-content')).toBeTruthy();
            expect(schObj.element.querySelector('.e-event-content')).toBeNull();
            expect(schObj.element.querySelector('.e-event-footer')).toBeTruthy();
            expect(schObj.element.querySelector('.e-popup-footer')).toBeNull();
            let footerEle: HTMLElement = schObj.element.querySelector('.e-event-footer') as HTMLElement;
            expect(footerEle.firstElementChild.classList).toContain('e-event-edit');
            expect(footerEle.lastElementChild.classList).toContain('e-event-delete');
            (<HTMLElement>cellPopup.querySelector('.e-close')).click();
        });

        it('checking header and content area for event-quick popup', () => {
            schObj.quickInfoTemplates = {
                header: '#headerTemplate',
                content: '#contentTemplate',
                footer: ''
            };
            schObj.dataBind();
            triggerMouseEvent(schObj.element.querySelectorAll('.e-appointment')[0] as HTMLElement, 'click');
            let cellPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(cellPopup.classList).toContain('e-popup-open');
            expect(schObj.element.querySelector('.e-event-header')).toBeTruthy();
            expect(schObj.element.querySelector('.e-popup-header')).toBeNull();
            expect(schObj.element.querySelector('.e-event-content')).toBeTruthy();
            expect(schObj.element.querySelector('.e-popup-content')).toBeNull();
            let contentFieldEle: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-event-content'));
            expect(contentFieldEle.length).toEqual(1);
            expect(contentFieldEle[0].innerText).toContain('Testing');
            expect(schObj.element.querySelector('.e-popup-footer')).toBeTruthy();
            expect(schObj.element.querySelector('.e-event-footer')).toBeNull();
            (<HTMLElement>cellPopup.querySelector('.e-close')).click();
        });

        it('checking content and footer area for event-quick popup', () => {
            schObj.quickInfoTemplates = {
                header: '',
                content: '#contentTemplate',
                footer: '#footerTemplate'
            };
            schObj.dataBind();
            triggerMouseEvent(schObj.element.querySelectorAll('.e-appointment')[0] as HTMLElement, 'click');
            let cellPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(cellPopup.classList).toContain('e-popup-open');
            expect(schObj.element.querySelector('.e-popup-header')).toBeTruthy();
            expect(schObj.element.querySelector('.e-event-header')).toBeNull();
            expect(schObj.element.querySelector('.e-event-content')).toBeTruthy();
            expect(schObj.element.querySelector('.e-popup-content')).toBeNull();
            let contentFieldEle: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-event-content'));
            expect(contentFieldEle.length).toEqual(1);
            expect(contentFieldEle[0].innerText).toContain('Testing');
            expect(schObj.element.querySelector('.e-event-footer')).toBeTruthy();
            expect(schObj.element.querySelector('.e-popup-footer')).toBeNull();
            let footerEle: HTMLElement = schObj.element.querySelector('.e-event-footer') as HTMLElement;
            expect(footerEle.firstElementChild.classList).toContain('e-event-edit');
            expect(footerEle.lastElementChild.classList).toContain('e-event-delete');
            (<HTMLElement>cellPopup.querySelector('.e-close')).click();
        });

        it('checking header and footer area for event-quick popup', () => {
            schObj.quickInfoTemplates = {
                header: '#headerTemplate',
                content: '',
                footer: '#footerTemplate'
            };
            schObj.dataBind();
            triggerMouseEvent(schObj.element.querySelectorAll('.e-appointment')[0] as HTMLElement, 'click');
            let cellPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(cellPopup.classList).toContain('e-popup-open');
            expect(schObj.element.querySelector('.e-event-header')).toBeTruthy();
            expect(schObj.element.querySelector('.e-popup-header')).toBeNull();
            expect(schObj.element.querySelector('.e-popup-content')).toBeTruthy();
            expect(schObj.element.querySelector('.e-event-content')).toBeNull();
            expect(schObj.element.querySelector('.e-event-footer')).toBeTruthy();
            expect(schObj.element.querySelector('.e-popup-footer')).toBeNull();
            let footerEle: HTMLElement = schObj.element.querySelector('.e-event-footer') as HTMLElement;
            expect(footerEle.firstElementChild.classList).toContain('e-event-edit');
            expect(footerEle.lastElementChild.classList).toContain('e-event-delete');
            (<HTMLElement>cellPopup.querySelector('.e-close')).click();
        });
    });

    describe('checking quickInfoTemplate for both cell and eventClick', () => {
        let schObj: Schedule;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        beforeAll((done: Function) => {
            let hT: string = '<div>${if(elementType === "cell")}<div class="e-cell-header"><div class="e-header-icon-wrapper">' +
                '<button class="e-close" title="Close"></button></div></div>${else}<div class="e-event-header">' +
                '<div class="e-header-icon-wrapper"><button class="e-close" title="CLOSE"></button></div></div>${/if}</div>';
            let scriptEleHeader: HTMLScriptElement = document.createElement('script');
            scriptEleHeader.type = 'text/x-template';
            scriptEleHeader.id = 'headerTemplate';
            scriptEleHeader.appendChild(document.createTextNode(hT));
            document.getElementsByTagName('head')[0].appendChild(scriptEleHeader);
            let cT: string = '<div>${if(elementType === "cell")}<div class="e-cell-content"><form class="e-schedule-form"><div>' +
                '<input class="subject e-field" type="text" name="Subject" placeholder="Title"></div><div><input class="location ' +
                'e-field" type="text" name="Location" placeholder="Location"></div></form></div>${else}<div class="e-event-content">' +
                '<div class="e-subject-wrap">${if (Subject)}<div class="subject">${Subject}</div>${/if}${if (Location)}' +
                '<div class="location">${Location}</div>${/if}${if (Description)}<div class="description">${Description}</div>${/if}' +
                '</div></div>${/if}</div>';
            let scriptEleContent: HTMLScriptElement = document.createElement('script');
            scriptEleContent.type = 'text/x-template';
            scriptEleContent.id = 'contentTemplate';
            scriptEleContent.appendChild(document.createTextNode(cT));
            document.getElementsByTagName('head')[0].appendChild(scriptEleContent);
            let fT: string = '<div>${if(elementType === "cell")}<div class="e-cell-footer"><button class="e-event-details" ' +
                'title="Extra Details">Extra Details</button><button class="e-event-create" title="Add">Add</button></div>${else}' +
                '<div class="e-event-footer"><button class="e-event-edit" title="Edit">Edit</button><button class="e-event-delete" ' +
                'title="Delete">Delete</button></div>${/if}</div>';
            let scriptEleFooter: HTMLScriptElement = document.createElement('script');
            scriptEleFooter.type = 'text/x-template';
            scriptEleFooter.id = 'footerTemplate';
            scriptEleFooter.appendChild(document.createTextNode(fT));
            document.getElementsByTagName('head')[0].appendChild(scriptEleFooter);
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            schObj = new Schedule({
                height: '500px', currentView: 'Week', views: ['Week'],
                selectedDate: new Date(2017, 10, 1),
                quickInfoTemplates: {
                    header: '#headerTemplate',
                    content: '#contentTemplate',
                    footer: '#footerTemplate'
                },
                eventSettings: {
                    dataSource: [
                        {
                            Id: 1,
                            Subject: 'Testing',
                            StartTime: new Date(2017, 10, 1, 10),
                            EndTime: new Date(2017, 10, 1, 12),
                        }
                    ]
                },
                dataBound: dataBound
            });
            schObj.appendTo(elem);
            disableScheduleAnimation(schObj);
        });
        afterAll(() => {
            if (schObj) {
                schObj.destroy();
            }
            document.getElementById('headerTemplate').remove();
            document.getElementById('contentTemplate').remove();
            document.getElementById('footerTemplate').remove();
            remove(elem);
        });

        it('checking header, content and footer area for cell and event quick popup', () => {
            let workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-hours'));
            workCells[1].click();
            let cellPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(cellPopup.classList).toContain('e-popup-open');
            expect(schObj.element.querySelector('.e-cell-header')).toBeTruthy();
            expect(schObj.element.querySelector('.e-event-header')).toBeNull();
            expect(schObj.element.querySelector('.e-popup-header')).toBeNull();
            expect(schObj.element.querySelector('.e-cell-content')).toBeTruthy();
            expect(schObj.element.querySelector('.e-event-content')).toBeNull();
            expect(schObj.element.querySelector('.e-popup-content')).toBeNull();
            let contentFieldEle: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-field'));
            expect(contentFieldEle.length).toEqual(2);
            expect(contentFieldEle[0].classList).toContain('subject');
            expect(contentFieldEle[1].classList).toContain('location');
            expect(schObj.element.querySelector('.e-cell-footer')).toBeTruthy();
            expect(schObj.element.querySelector('.e-event-footer')).toBeNull();
            expect(schObj.element.querySelector('.e-popup-footer')).toBeNull();
            let footerEle: HTMLElement = schObj.element.querySelector('.e-cell-footer') as HTMLElement;
            expect(footerEle.firstElementChild.classList).toContain('e-event-details');
            expect(footerEle.lastElementChild.classList).toContain('e-event-create');
            (<HTMLElement>cellPopup.querySelector('.e-close')).click();
            triggerMouseEvent(schObj.element.querySelectorAll('.e-appointment')[0] as HTMLElement, 'click');
            let eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup.classList).toContain('e-popup-open');
            expect(schObj.element.querySelector('.e-event-header')).toBeTruthy();
            expect(schObj.element.querySelector('.e-cell-header')).toBeNull();
            expect(schObj.element.querySelector('.e-popup-header')).toBeNull();
            expect(schObj.element.querySelector('.e-event-content')).toBeTruthy();
            expect(schObj.element.querySelector('.e-cell-content')).toBeNull();
            expect(schObj.element.querySelector('.e-popup-content')).toBeNull();
            let eventContentEle: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-event-content'));
            expect(eventContentEle.length).toEqual(1);
            expect(eventContentEle[0].innerText).toContain('Testing');
            expect(schObj.element.querySelector('.e-event-footer')).toBeTruthy();
            expect(schObj.element.querySelector('.e-cell-footer')).toBeNull();
            expect(schObj.element.querySelector('.e-popup-footer')).toBeNull();
            let eventFooterEle: HTMLElement = schObj.element.querySelector('.e-event-footer') as HTMLElement;
            expect(eventFooterEle.firstElementChild.classList).toContain('e-event-edit');
            expect(eventFooterEle.lastElementChild.classList).toContain('e-event-delete');
            (<HTMLElement>eventPopup.querySelector('.e-close')).click();
        });
    });

    describe('Read only test cases', () => {
        let schObj: Schedule;
        let keyModule: any;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            schObj = new Schedule({
                height: '500px',
                readonly: true,
                selectedDate: new Date(2017, 10, 1),
                eventSettings: {
                    dataSource: defaultData,
                },
                dataBound: dataBound
            });
            schObj.appendTo('#Schedule');
            keyModule = schObj.keyboardInteractionModule;
            disableScheduleAnimation(schObj);
        });
        afterAll(() => {
            if (schObj) {
                schObj.destroy();
            }
            remove(elem);
        });
        it('Prevent delete alert', () => {
            (schObj.element.querySelector('.e-appointment') as HTMLElement).click();
            let eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
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
            let firstWorkCell: HTMLElement = (schObj.element.querySelector('.e-work-cells'));
            expect(firstWorkCell.classList).not.toContain('e-selected-cell');
            keyModule.keyActionHandler({ action: 'enter', target: firstWorkCell });
            expect(schObj.element.querySelector('.e-quick-popup-wrapper').childElementCount).toBe(0);
            expect(schObj.quickPopup.quickPopup.element.classList.contains('e-popup-close')).toEqual(true);
            expect(schObj.element.querySelector('.e-work-cells').classList).not.toContain('e-selected-cell');
        });
        it('quick popup - left arrow', () => {
            let workCell: HTMLElement = schObj.element.querySelector('.e-appointment') as HTMLElement;
            triggerMouseEvent(workCell, 'click');
            expect(schObj.element.querySelector('.e-quick-popup-wrapper').classList.contains('e-popup-open')).toEqual(true);
            keyModule.keyActionHandler({ action: 'leftArrow', target: schObj.element.querySelector('.e-quick-popup-wrapper .e-subject') });
            keyModule.keyActionHandler({ action: 'escape' });
            expect(schObj.element.querySelector('.e-quick-popup-wrapper').childElementCount).toBe(0);
            expect(schObj.element.querySelector('.e-quick-popup-wrapper').classList.contains('e-popup-close')).toEqual(true);
        });
        it('quick popup - right arrow', () => {
            let workCell: HTMLElement = schObj.element.querySelector('.e-appointment') as HTMLElement;
            triggerMouseEvent(workCell, 'click');
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
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            schObj = new Schedule({
                height: '500px', currentView: 'Month',
                selectedDate: new Date(2017, 10, 1),
                eventSettings: { dataSource: getDataSource() },
                dataBound: dataBound
            });
            schObj.appendTo('#Schedule');
            keyModule = schObj.keyboardInteractionModule;
            disableScheduleAnimation(schObj);
        });
        afterAll(() => {
            if (schObj) {
                schObj.destroy();
            }
            remove(elem);
        });
        it('More Indicator click', () => {
            (schObj.element.querySelector('.e-more-indicator') as HTMLElement).click();
            let moreEventPopup: Element = schObj.element.querySelector('.e-more-popup-wrapper');
            expect(isVisible(moreEventPopup)).toBe(true);
        });
        it('Event click edit action', (done: Function) => {
            let dataBound: () => void = () => {
                expect(schObj.eventsData.length).toEqual(42);
                done();
            };
            schObj.dataBound = dataBound;
            let eventElements: HTMLElement = (schObj.element.querySelector('.e-more-event-content .e-appointment'));
            eventElements.click();
            let eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(isVisible(eventPopup)).toBe(true);
            (<HTMLElement>eventPopup.querySelector('.e-event-edit')).click();
            let dialogElement: HTMLElement = document.querySelector('.' + cls.EVENT_WINDOW_DIALOG_CLASS) as HTMLElement;
            (dialogElement.querySelector('.e-event-delete') as HTMLElement).click();
            (<HTMLElement>document.body.querySelector('.e-quick-dialog-delete')).click();
        });
        it('Event Dialog Cancel Click', () => {
            let eventElements: HTMLElement = (schObj.element.querySelector('.e-more-event-content .e-appointment'));
            eventElements.click();
            let eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(isVisible(eventPopup)).toBe(true);
            (<HTMLElement>document.body.querySelector('.e-quick-dialog-cancel')).click();
        });

        it('Event Dialog Close icon click', () => {
            let eventElements: HTMLElement = (schObj.element.querySelector('.e-more-event-content .e-appointment'));
            eventElements.click();
            let eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(isVisible(eventPopup)).toBe(true);
            (<HTMLElement>schObj.quickPopup.quickDialog.element.querySelector('.e-dlg-closeicon-btn')).click();
        });
        it('Event  Delete Click', (done: Function) => {
            let dataBound: () => void = () => {
                expect(schObj.eventsData.length).toEqual(41);
                done();
            };
            schObj.dataBound = dataBound;
            let eventElements: HTMLElement = (schObj.element.querySelector('.e-more-event-content .e-appointment'));
            eventElements.click();
            let eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(isVisible(eventPopup)).toBe(true);
            (<HTMLElement>eventPopup.querySelector('.e-event-delete')).click();
            (<HTMLElement>document.body.querySelector('.e-quick-dialog-delete')).click();
        });
        it('Delete key', () => {
            (schObj.element.querySelector('.e-more-indicator') as HTMLElement).click();
            let moreEventPopup: Element = schObj.element.querySelector('.e-more-popup-wrapper');
            expect(isVisible(moreEventPopup)).toBe(true);
            keyModule.keyActionHandler({ action: 'delete', target: '.e-more-appointment-wrapper' });
            (<HTMLElement>schObj.quickPopup.quickDialog.element.querySelector('.e-dlg-closeicon-btn')).click();
        });

        it('More Indicator Day view navigation click', () => {
            (schObj.element.querySelector('.e-more-indicator') as HTMLElement).click();
            let moreEventPopup: Element = schObj.element.querySelector('.e-more-popup-wrapper');
            (moreEventPopup.querySelector('.e-more-event-close') as HTMLElement).click();
            (schObj.element.querySelector('.e-more-indicator') as HTMLElement).click();
            (moreEventPopup.querySelector('.e-more-event-close') as HTMLElement).click();
            (moreEventPopup.querySelector('.e-header-date') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-day');
        });
    });

    describe('Quick Popup validation', () => {
        let schObj: Schedule;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            schObj = new Schedule({
                height: '500px',
                selectedDate: new Date(2017, 10, 1),
                eventSettings: {
                    dataSource: defaultData,
                    fields: {
                        subject: { name: 'Subject', validation: { required: true } }
                    }
                },
                dataBound: dataBound
            });
            schObj.appendTo('#Schedule');
            disableScheduleAnimation(schObj);
        });
        afterAll(() => {
            if (schObj) {
                schObj.destroy();
            }
            remove(elem);
        });

        it('Cell click and insert event', () => {
            (schObj.element.querySelector('.' + cls.WORK_HOURS_CLASS) as HTMLElement).click();
            let eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            (<HTMLInputElement>eventPopup.querySelector('.' + cls.EVENT_CREATE_CLASS)).click();
            expect((<HTMLElement>document.querySelector('.e-schedule-error')).style.display).toEqual('');
        });
    });

    describe('Popup for recurrence rule appointment for vertical view', () => {
        let schObj: Schedule;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            schObj = new Schedule({
                height: '500px',
                selectedDate: new Date(2017, 10, 2),
                eventSettings: { dataSource: defaultData },
                dataBound: dataBound
            });
            schObj.appendTo('#Schedule');
            disableScheduleAnimation(schObj);
        });
        afterAll(() => {
            if (schObj) {
                schObj.destroy();
            }
            remove(elem);
        });
        it('Single appointment select using click or tap', () => {
            let target: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            (target[target.length - 1] as HTMLElement).click();
            let eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup).toBeTruthy();
        });
        it('recurrence delete dialog', () => {
            let eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup).toBeTruthy();
            (eventPopup.querySelector('.e-delete') as HTMLElement).click();
            (<HTMLElement>schObj.quickPopup.quickDialog.element.querySelector('.e-dlg-closeicon-btn')).click();
        });
    });

    describe('Popup for recurrence rule appointment for timeline view', () => {
        let schObj: Schedule;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            schObj = new Schedule({
                height: '500px',
                selectedDate: new Date(2017, 10, 2),
                currentView: 'TimelineWeek',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek'],
                eventSettings: { dataSource: defaultData },
                dataBound: dataBound
            });
            schObj.appendTo('#Schedule');
            disableScheduleAnimation(schObj);
        });
        afterAll(() => {
            if (schObj) {
                schObj.destroy();
            }
            remove(elem);
        });
        it('Single appointment select using click or tap & recurrence delete dialog', () => {
            let target: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            (target[target.length - 1] as HTMLElement).click();
            let eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup).toBeTruthy();
            (eventPopup.querySelector('.e-delete') as HTMLElement).click();
            (<HTMLElement>schObj.quickPopup.quickDialog.element.querySelector('.e-dlg-closeicon-btn')).click();
        });
    });

    describe('Quick info display for vertical view', () => {
        let schObj: Schedule;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            schObj = new Schedule({
                height: '500px',
                selectedDate: new Date(2017, 10, 2),
                eventSettings: { dataSource: defaultData },
                dataBound: dataBound
            });
            schObj.appendTo('#Schedule');
            disableScheduleAnimation(schObj);
        });
        afterAll(() => {
            if (schObj) {
                schObj.destroy();
            }
            remove(elem);
        });

        it('Normal appointment click', () => {
            let appointment: HTMLElement = schObj.element.querySelector('[data-id="Appointment_2"]') as HTMLElement;
            appointment.click();
            let eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup.querySelector('.e-date-time-details').textContent)
                .toEqual('October 30, 2017 (10:00 AM - 12:30 PM)');
            (<HTMLElement>eventPopup.querySelector('.e-close')).click();
        });

        it('All day appointment click', () => {
            let appointment: HTMLElement = schObj.element.querySelector('[data-id="Appointment_4"]') as HTMLElement;
            appointment.click();
            let eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup.querySelector('.e-date-time-details').textContent).toEqual('October 31, 2017 (All day)');
            (<HTMLElement>eventPopup.querySelector('.e-close')).click();
        });

        it('Spanned appointment click', () => {
            let appointment: HTMLElement = schObj.element.querySelector('[data-id="Appointment_12"]') as HTMLElement;
            appointment.click();
            let eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup.querySelector('.e-date-time-details').textContent).
                toEqual('November 4, 2017 (9:30 AM) - November 5, 2017 (5:45 AM)');
            (<HTMLElement>eventPopup.querySelector('.e-close')).click();
        });

        it('Spanned single day appointment click', () => {
            let appointment: HTMLElement = schObj.element.querySelector('[data-id="Appointment_5"]') as HTMLElement;
            appointment.click();
            let eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup.querySelector('.e-date-time-details').textContent).
                toEqual('October 31, 2017 (10:00 PM) - November 1, 2017 (12:00 AM)');
            (<HTMLElement>eventPopup.querySelector('.e-close')).click();
        });
    });

    describe('Quick info display for timeline view', () => {
        let schObj: Schedule;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            schObj = new Schedule({
                height: '500px',
                selectedDate: new Date(2017, 10, 2),
                currentView: 'TimelineWeek',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek'],
                eventSettings: { dataSource: defaultData },
                dataBound: dataBound
            });
            schObj.appendTo('#Schedule');
            disableScheduleAnimation(schObj);
        });
        afterAll(() => {
            if (schObj) {
                schObj.destroy();
            }
            remove(elem);
        });

        it('Normal appointment click', () => {
            let appointment: HTMLElement = schObj.element.querySelector('[data-id="Appointment_2"]') as HTMLElement;
            appointment.click();
            let eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup.querySelector('.e-date-time-details').textContent)
                .toEqual('October 30, 2017 (10:00 AM - 12:30 PM)');
            (<HTMLElement>eventPopup.querySelector('.e-close')).click();
        });

        it('Spanned appointment click', () => {
            let appointment: HTMLElement = schObj.element.querySelector('[data-id="Appointment_12"]') as HTMLElement;
            appointment.click();
            let eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup.querySelector('.e-date-time-details').textContent).
                toEqual('November 4, 2017 (9:30 AM) - November 5, 2017 (5:45 AM)');
            (<HTMLElement>eventPopup.querySelector('.e-close')).click();
        });

        it('Spanned single day appointment click', () => {
            let appointment: HTMLElement = schObj.element.querySelector('[data-id="Appointment_5"]') as HTMLElement;
            appointment.click();
            let eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup.querySelector('.e-date-time-details').textContent).
                toEqual('October 31, 2017 (10:00 PM) - November 1, 2017 (12:00 AM)');
            (<HTMLElement>eventPopup.querySelector('.e-close')).click();
        });
    });

    describe('Popup for mobile view', () => {
        let schObj: Schedule;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        let datasource: Object[] = [{
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
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            schObj = new Schedule({
                selectedDate: new Date(2017, 9, 18), width: 300,
                eventSettings: { dataSource: datasource },
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
        it('Single appointment select using click or tap and close', () => {
            let target: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
            schObj.isAdaptive = true;
            target.click();
            let eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup).toBeTruthy();
            (eventPopup.querySelector('.e-close') as HTMLElement).click();
            expect(eventPopup).toBeTruthy();
        });
        it('Recurrence appointment checking in mobile', () => {
            let target: HTMLElement = schObj.element.querySelector('.e-recurrence-icon') as HTMLElement;
            schObj.isAdaptive = true;
            target.click();
            let eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup).toBeTruthy();
            (eventPopup.querySelector('.e-close') as HTMLElement).click();
            expect(eventPopup).toBeTruthy();
        });
        it('Appointment select with details', () => {
            let target: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
            schObj.isAdaptive = true;
            target.click();
            let eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup).toBeTruthy();
            (eventPopup.querySelector('.e-close') as HTMLElement).click();
            expect(eventPopup.querySelector('.e-location-details').textContent).toEqual('India');
        });
        it('Single appointment select using click or tap and edit event', () => {
            let target: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
            target.click();
            let eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup).toBeTruthy();
            (eventPopup.querySelector('.e-edit-icon') as HTMLElement).click();
            expect(eventPopup).toBeTruthy();
        });
        it('Single appointment select using click or tap and delete event', () => {
            let target: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
            target.click();
            let eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup).toBeTruthy();
            (eventPopup.querySelector('.e-delete-icon') as HTMLElement).click();
            expect(eventPopup).toBeTruthy();
        });
    });

    describe('Multiple resource grouping', () => {
        let schObj: Schedule;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        let getResourceData: Function = () => {
            let dataCol: Object[] = [];
            resourceData.forEach((data: Object) => dataCol.push(extend({}, data)));
            return dataCol;
        };
        beforeAll((done: Function) => {
            document.body.appendChild(elem);
            let dataBound: EmitType<Object> = () => {
                disableScheduleAnimation(schObj);
                done();
            };
            schObj = new Schedule({
                width: '100%',
                height: '550px',
                selectedDate: new Date(2018, 3, 1),
                group: {
                    byGroupID: false,
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
                eventSettings: { dataSource: getResourceData() },
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

        it('resource event checking', () => {
            triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_1"]'), 'click');
            let eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup.classList).toContain('e-popup-open');
            let resourceElement: HTMLElement = eventPopup.querySelector('.e-resource') as HTMLElement;
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
            triggerMouseEvent(schObj.element.querySelector('[data-id="Appointment_1"]'), 'click');
            let eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup.classList).toContain('e-popup-open');
            let resourceElement: HTMLElement = eventPopup.querySelector('.e-resource') as HTMLElement;
            expect(resourceElement).toBeTruthy();
            expect(resourceElement.querySelector('.e-resource-details').innerHTML).toEqual('Nancy');
            (<HTMLElement>eventPopup.querySelector('.e-close')).click();
        });

        it('more events checking in multiple resource grouping', (done: Function) => {
            schObj.group.byGroupID = true;
            schObj.dataBind();
            schObj.currentView = 'Month';
            schObj.dataBind();
            schObj.popupOpen = () => { /** Null */ };
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(10);
                triggerMouseEvent(schObj.element.querySelector('.e-more-indicator'), 'click');
                let morePopup: HTMLElement = schObj.element.querySelector('.e-more-popup-wrapper') as HTMLElement;
                expect(morePopup.classList).toContain('e-popup-open');
                let appElement: Element = morePopup.querySelector('.e-appointment');
                expect(appElement.getAttribute('data-group-index')).toEqual('1');
                triggerMouseEvent(morePopup.querySelector('.e-more-event-close'), 'click');
                expect(morePopup.classList).toContain('e-popup-close');
                done();
            };
            disableScheduleAnimation(schObj);
            expect(schObj.eventsData.length).toEqual(9);
            let workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            triggerMouseEvent(workCells[9], 'click');
            let eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup.classList).toContain('e-popup-open');
            let resourceElement: HTMLElement = eventPopup.querySelector('.e-resource') as HTMLElement;
            expect(resourceElement).toBeTruthy();
            expect(resourceElement.querySelector('.e-resource-details').innerHTML).toEqual('Michael');
            (<HTMLInputElement>eventPopup.querySelector('.e-subject')).value = 'Conference Meeting';
            triggerMouseEvent(eventPopup.querySelector('.e-event-create'), 'click');
        });

        it('normal event edit checking in more events with multiple resource grouping', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(10);
                expect(morePopup.classList).toContain('e-popup-open');
                let recurrenceIcon: Element = morePopup.querySelector('.e-recurrence-icon');
                expect(recurrenceIcon).toBeTruthy();
                triggerMouseEvent(morePopup.querySelector('.e-more-event-close'), 'click');
                expect(morePopup.classList).toContain('e-popup-close');
                done();
            };
            expect(schObj.eventsData.length).toEqual(10);
            triggerMouseEvent(schObj.element.querySelector('.e-more-indicator'), 'click');
            let morePopup: HTMLElement = schObj.element.querySelector('.e-more-popup-wrapper') as HTMLElement;
            expect(morePopup.classList).toContain('e-popup-open');
            let appElement: HTMLElement = morePopup.querySelector('.e-appointment') as HTMLElement;
            expect(appElement.getAttribute('data-group-index')).toEqual('1');
            triggerMouseEvent(appElement, 'click');
            let eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup.classList).toContain('e-popup-open');
            triggerMouseEvent(eventPopup.querySelector('.e-edit'), 'click');
            expect(eventPopup.classList).toContain('e-popup-close');
            let eventWindow: HTMLElement = schObj.eventWindow.dialogObject.element;
            expect(eventWindow.classList).toContain('e-popup-open');
            let recObj: RecurrenceEditor = (eventWindow.querySelector('.e-recurrenceeditor') as EJ2Instance).
                ej2_instances[0] as RecurrenceEditor;
            recObj.value = 'FREQ=DAILY;INTERVAL=1;COUNT=5';
            recObj.dataBind();
            triggerMouseEvent(eventWindow.querySelector('.e-event-save'), 'click');
            expect(eventWindow.classList).toContain('e-popup-close');
        });

        it('recurrence event edit checking in more events with multiple resource grouping', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(11);
                expect(morePopup.classList).toContain('e-popup-open');
                let recurrenceIcon: Element = morePopup.querySelector('.e-recurrence-edit-icon');
                expect(recurrenceIcon).toBeTruthy();
                triggerMouseEvent(morePopup.querySelector('.e-more-event-close'), 'click');
                expect(morePopup.classList).toContain('e-popup-close');
                done();
            };
            expect(schObj.eventsData.length).toEqual(10);
            triggerMouseEvent(schObj.element.querySelector('.e-more-indicator'), 'click');
            let morePopup: HTMLElement = schObj.element.querySelector('.e-more-popup-wrapper') as HTMLElement;
            expect(morePopup.classList).toContain('e-popup-open');
            let appElement: HTMLElement = closest(morePopup.querySelector('.e-recurrence-icon'), '.e-appointment') as HTMLElement;
            expect(appElement.getAttribute('data-group-index')).toEqual('1');
            triggerMouseEvent(appElement, 'click');
            triggerMouseEvent(appElement, 'dblclick');
            let quickDialog: HTMLElement = schObj.quickPopup.quickDialog.element;
            remove(morePopup.querySelector('.e-more-event-content'));
            expect(quickDialog.classList).toContain('e-popup-open');
            triggerMouseEvent(quickDialog.querySelector('.e-quick-dialog-edit-event'), 'click');
            expect(quickDialog.classList).toContain('e-popup-close');
            let eventWindow: HTMLElement = schObj.eventWindow.dialogObject.element;
            expect(eventWindow.classList).toContain('e-popup-open');
            triggerMouseEvent(eventWindow.querySelector('.e-event-save'), 'click');
            expect(eventWindow.classList).toContain('e-popup-close');
        });

        it('eventRendered event checking for more event popup with multiple resource grouping', () => {
            schObj.eventRendered = (args: EventRenderedArgs) => args.cancel = true;
            triggerMouseEvent(schObj.element.querySelector('.e-more-indicator'), 'click');
            let morePopup: HTMLElement = schObj.element.querySelector('.e-more-popup-wrapper') as HTMLElement;
            expect(morePopup.classList).toContain('e-popup-open');
            let appElement: HTMLElement[] = [].slice.call(morePopup.querySelectorAll('.e-appointment'));
            expect(appElement.length).toEqual(0);
            triggerMouseEvent(morePopup.querySelector('.e-more-event-close'), 'click');
            expect(morePopup.classList).toContain('e-popup-close');
        });

        it('popupOpen event checking in more events with multiple resource grouping', () => {
            schObj.eventRendered = (args: EventRenderedArgs) => args.cancel = false;
            schObj.popupOpen = (args: PopupOpenEventArgs) => args.cancel = true;
            triggerMouseEvent(schObj.element.querySelector('.e-more-indicator'), 'click');
            expect(schObj.element.querySelector('.e-more-popup-wrapper').classList).toContain('e-popup-close');
        });

        it('more event popup checking with current date ', (done: Function) => {
            schObj.dataBound = () => {
                triggerMouseEvent(schObj.element.querySelector('.e-more-indicator'), 'click');
                let morePopup: HTMLElement = schObj.element.querySelector('.e-more-popup-wrapper') as HTMLElement;
                expect(morePopup.classList).toContain('e-popup-open');
                expect(morePopup.querySelectorAll('.e-appointment').length).toEqual(5);
                triggerMouseEvent(morePopup.querySelector('.e-more-event-close'), 'click');
                expect(morePopup.classList).toContain('e-popup-close');
                done();
            };
            schObj.popupOpen = (args: PopupOpenEventArgs) => args.cancel = false;
            schObj.selectedDate = new Date();
            schObj.dataBind();
            let generateData: Function = () => {
                let dataCol: Object[] = [];
                let currentDate: Date = new Date(new Date().setHours(0, 0, 0, 0));
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
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        let uA: string = Browser.userAgent;
        let androidUserAgent: string = 'Mozilla/5.0 (Linux; Android 9; Pixel 2 Build/PPR1.180610.009)' +
            'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.85 Mobile Safari/537.36';
        beforeAll((done: Function) => {
            Browser.userAgent = androidUserAgent;
            document.body.appendChild(elem);
            let dataBound: EmitType<Object> = () => { done(); };
            schObj = new Schedule({
                width: 300, height: '500px', selectedDate: new Date(2017, 10, 1),
                eventSettings: { dataSource: getDataSource() },
                dataBound: dataBound
            });
            schObj.appendTo('#Schedule');
            disableScheduleAnimation(schObj);
        });
        afterAll(() => {
            if (schObj) {
                schObj.destroy();
            }
            remove(elem);
            Browser.userAgent = uA;
        });

        it('checking multiple events delete in mobile', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.eventsData.length).toEqual(40);
                done();
            };
            expect(schObj.eventsData.length).toEqual(43);
            let appElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            let e: any = {};
            e.originalEvent = { target: appElements[0], type: 'touchstart' };
            (schObj.scheduleTouchModule as any).tapHoldHandler(e);
            let eventPopup: HTMLElement = document.body.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup.classList).toContain('e-popup-open');
            triggerMouseEvent(appElements[1], 'click');
            triggerMouseEvent(appElements[2], 'click');
            triggerMouseEvent(eventPopup.querySelector('.e-delete-icon'), 'click');
            let quickDialog: Element = document.querySelector('.e-quick-dialog');
            expect(quickDialog.classList).toContain('e-popup-open');
            expect(quickDialog.querySelector('.e-dlg-header').innerHTML).toEqual('Delete Multiple Events');
            expect(quickDialog.querySelector('.e-dlg-content').innerHTML).toEqual('Are you sure you want to delete the selected events?');
            let deleteButton: HTMLElement = quickDialog.querySelector('.e-quick-dialog-delete') as HTMLElement;
            triggerMouseEvent(deleteButton, 'click');
            expect(quickDialog.classList).toContain('e-popup-close');
        });
    });
});
