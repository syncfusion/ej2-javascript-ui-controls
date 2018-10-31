/**
 * Schedule header toolbar spec 
 */
import { createElement, remove, Browser, EmitType } from '@syncfusion/ej2-base';
import { ItemModel } from '@syncfusion/ej2-navigations';
import { Dialog } from '@syncfusion/ej2-popups';
import { Schedule, Day, Week, WorkWeek, Month, Agenda, MonthAgenda, ToolbarActionArgs, ActionEventArgs } from '../../../src/schedule/index';
import { triggerMouseEvent } from '../util.spec';

Schedule.Inject(Day, Week, WorkWeek, Month, Agenda, MonthAgenda);
describe('Schedule header bar', () => {
    describe('Initial load', () => {
        let schObj: Schedule;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        beforeAll(() => {
            document.body.appendChild(elem);
            schObj = new Schedule({ selectedDate: new Date(2017, 9, 4) });
            schObj.appendTo('#Schedule');
        });
        afterAll(() => {
            if (schObj) {
                schObj.destroy();
            }
            remove(elem);
        });

        it('get module name', () => {
            // tslint:disable-next-line:no-any
            expect((<any>schObj.headerModule).getModuleName()).toEqual('headerbar');
        });

        it('toolbar bar class testing', () => {
            expect(schObj.element.querySelectorAll('.e-schedule-toolbar-container')).toBeTruthy();
            expect(schObj.element.querySelectorAll('.e-schedule-toolbar').length).toEqual(1);
            expect(schObj.element.querySelectorAll('.e-toolbar-item').length).toEqual(10);
            triggerMouseEvent(document.body, 'mousedown');
        });

        it('calendar navigation', () => {
            (schObj.element.querySelectorAll('.e-schedule-toolbar .e-date-range')[0] as HTMLElement).click();
            let popupEle: Element = schObj.element.querySelector('.e-schedule-toolbar-container .e-header-popup');
            expect(popupEle).toBeTruthy();
            expect(popupEle.classList.contains('e-popup-open')).toEqual(true);
            expect(popupEle.querySelector('.e-header-calendar')).toBeTruthy();
            expect(popupEle.querySelector('.e-header-calendar').classList.contains('e-calendar')).toEqual(true);
            expect(popupEle.querySelector('.e-content').classList.contains('e-month')).toEqual(true);
            (popupEle.querySelectorAll('.e-cell')[8] as HTMLElement).click();
            expect(popupEle.classList.contains('e-popup-open')).toEqual(false);
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Sun</div><div class="e-header-date e-navigate" role="link">1</div>');
            expect(schObj.element.querySelector('.e-table-wrap').classList).toContain('e-week-view');
        });

        it('hide calendar on document click', () => {
            (schObj.element.querySelectorAll('.e-schedule-toolbar .e-date-range')[0] as HTMLElement).click();
            let popupEle: Element = schObj.element.querySelector('.e-schedule-toolbar-container .e-header-popup');
            expect(popupEle).toBeTruthy();
            expect(popupEle.classList.contains('e-popup-open')).toEqual(true);
            triggerMouseEvent(document.body, 'mousedown');
            expect(popupEle.classList.contains('e-popup-open')).toEqual(false);
        });

        it('hide halendar on date range click', () => {
            (schObj.element.querySelectorAll('.e-schedule-toolbar .e-date-range')[0] as HTMLElement).click();
            let popupEle: Element = schObj.element.querySelector('.e-schedule-toolbar-container .e-header-popup');
            expect(popupEle).toBeTruthy();
            expect(popupEle.classList.contains('e-popup-open')).toEqual(true);
            (schObj.element.querySelectorAll('.e-schedule-toolbar .e-date-range')[0] as HTMLElement).click();
            expect(popupEle.classList.contains('e-popup-open')).toEqual(false);
        });

        it('calendar date navigation', () => {
            (schObj.element.querySelectorAll('.e-schedule-toolbar .e-date-range')[0] as HTMLElement).click();
            let popupEle: Element = schObj.element.querySelector('.e-schedule-toolbar-container .e-header-popup');
            let calendarEle: Element = schObj.element.querySelector('.e-schedule-toolbar-container .e-header-calendar');
            (calendarEle.querySelector('.e-day') as HTMLElement).click();
            expect(popupEle.classList.contains('e-popup-open')).toEqual(true);
            // expect(calendarEle.querySelector('.e-header').classList.contains('e-year')).toEqual(true);
            (calendarEle.querySelector('.e-selected') as HTMLElement).click();
            expect(popupEle.classList.contains('e-popup-open')).toEqual(true);
            expect(calendarEle.querySelector('.e-header').classList.contains('e-month')).toEqual(true);
            triggerMouseEvent(calendarEle.querySelector('.e-next') as HTMLElement, 'mousedown');
            (schObj.element.querySelectorAll('.e-schedule-toolbar .e-date-range')[0] as HTMLElement).click();
            expect(popupEle.classList.contains('e-popup-open')).toEqual(false);
        });

        it('day view navigations', () => {
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-week');
            (schObj.element.querySelector('.e-schedule-toolbar .e-day') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-day');
            expect(schObj.element.querySelector('.e-table-wrap').classList).toContain('e-day-view');

            (schObj.element.querySelector('.e-toolbar-item.e-next') as HTMLElement).click();
            expect(schObj.element.querySelectorAll('.e-date-header-container .e-header-cells').length).toEqual(1);
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Tue</div><div class="e-header-date e-navigate" role="link">3</div>');

            (schObj.element.querySelector('.e-toolbar-item.e-prev') as HTMLElement).click();
            expect(schObj.element.querySelectorAll('.e-date-header-container .e-header-cells').length).toEqual(1);
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Mon</div><div class="e-header-date e-navigate" role="link">2</div>');
        });

        it('view navigations', () => {
            (schObj.element.querySelector('.e-schedule-toolbar .e-week') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-week');
            expect(schObj.element.querySelector('.e-table-wrap').classList).toContain('e-week-view');

            (schObj.element.querySelector('.e-schedule-toolbar .e-work-week') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-work-week');
            expect(schObj.element.querySelector('.e-table-wrap').classList).toContain('e-work-week-view');

            (schObj.element.querySelector('.e-schedule-toolbar .e-month') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-month');
            expect(schObj.element.querySelector('.e-table-wrap').classList).toContain('e-month-view');

            (schObj.element.querySelector('.e-schedule-toolbar .e-agenda') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-agenda');
            expect(schObj.element.querySelector('.e-table-wrap').classList).toContain('e-agenda-view');
        });

        it('today navigation', () => {
            (schObj.element.querySelector('.e-schedule-toolbar .e-week') as HTMLElement).click();
            (schObj.element.querySelector('.e-schedule-toolbar .e-today') as HTMLElement).click();
            expect(schObj.element.querySelectorAll('.e-current-day')).toBeTruthy();

            (schObj.element.querySelector('.e-schedule-toolbar .e-month') as HTMLElement).click();
            expect(schObj.element.querySelectorAll('.e-current-day')).toBeTruthy();
        });

        it('headerbar on property change', () => {
            schObj.showHeaderBar = false;
            schObj.dataBind();
            expect(schObj.headerModule).toBeNull();
            expect(schObj.element.querySelectorAll('.e-schedule-toolbar-container').length).toEqual(0);
            expect(schObj.element.querySelectorAll('.e-schedule-toolbar').length).toEqual(0);
            schObj.views = [{ option: 'Day', isSelected: true }, { option: 'Week' }];
            schObj.dataBind();

            schObj.showHeaderBar = true;
            schObj.dataBind();
            expect(schObj.headerModule).not.toBeNull();
            expect(schObj.element.querySelectorAll('.e-schedule-toolbar-container')).toBeTruthy();
            expect(schObj.element.querySelectorAll('.e-schedule-toolbar').length).toEqual(1);
            expect(schObj.element.querySelectorAll('.e-toolbar-item').length).toEqual(7);
        });
    });

    describe('View items based on property change', () => {
        let schObj: Schedule;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });

        beforeAll(() => {
            document.body.appendChild(elem);
            schObj = new Schedule({
                selectedDate: new Date(2017, 9, 4),
                views: [{ option: 'Day', isSelected: true }]
            });
            schObj.appendTo('#Schedule');
        });
        afterAll(() => {
            if (schObj) {
                schObj.destroy();
            }
            remove(elem);
        });

        it('toolbar items', () => {
            expect(schObj.element.querySelectorAll('.e-schedule-toolbar-container')).toBeTruthy();
            expect(schObj.element.querySelectorAll('.e-toolbar-item').length).toEqual(4);
            expect(schObj.element.querySelector('.e-schedule-toolbar .e-month')).toBeFalsy();
        });

        it('views on property change', () => {
            schObj.views = [{ option: 'Day', isSelected: true }, { option: 'Week' }];
            schObj.dataBind();
            expect(schObj.element.querySelectorAll('.e-toolbar-item').length).toEqual(7);
            expect(schObj.element.querySelector('.e-schedule-toolbar .e-day')).toBeTruthy();
            expect(schObj.element.querySelector('.e-schedule-toolbar .e-week')).toBeTruthy();
        });

        it('displayName on views change', () => {
            schObj.views = [{ option: 'Day', isSelected: true, interval: 5, displayName: '5 Days' },
            { option: 'Week', interval: 3, displayName: '3 Weeks' },
            { option: 'WorkWeek', interval: 2, displayName: '2 WorkWeeks' },
            { option: 'Month', interval: 2, displayName: '2 Months' }];
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-schedule-toolbar .e-day')).toBeTruthy();
            expect(schObj.element.querySelector('.e-schedule-toolbar .e-week')).toBeTruthy();
            expect(schObj.element.querySelector('.e-schedule-toolbar .e-work-week')).toBeTruthy();
            expect(schObj.element.querySelector('.e-schedule-toolbar .e-month')).toBeTruthy();

            (schObj.element.querySelector('.e-schedule-toolbar .e-week') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-week');
            expect(schObj.element.querySelector('.e-table-wrap').classList).toContain('e-week-view');
            expect(schObj.element.querySelectorAll('.e-week')[0].querySelector('.e-tbar-btn-text').innerHTML).
                toEqual('3 Weeks');

            (schObj.element.querySelector('.e-schedule-toolbar .e-day') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-day');
            expect(schObj.element.querySelector('.e-table-wrap').classList).toContain('e-day-view');
            expect(schObj.element.querySelectorAll('.e-day')[0].querySelector('.e-tbar-btn-text').innerHTML).
                toEqual('5 Days');

            (schObj.element.querySelector('.e-schedule-toolbar .e-work-week') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-work-week');
            expect(schObj.element.querySelector('.e-table-wrap').classList).toContain('e-work-week-view');
            expect(schObj.element.querySelectorAll('.e-work-week')[0].querySelector('.e-tbar-btn-text').innerHTML).
                toEqual('2 WorkWeeks');

            (schObj.element.querySelector('.e-schedule-toolbar .e-month') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-month');
            expect(schObj.element.querySelector('.e-table-wrap').classList).toContain('e-month-view');
            expect(schObj.element.querySelectorAll('.e-month')[0].querySelector('.e-tbar-btn-text').innerHTML).
                toEqual('2 Months');
        });
    });

    describe('Day of week in calendar', () => {
        let schObj: Schedule;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });

        beforeAll(() => {
            document.body.appendChild(elem);
            schObj = new Schedule({ selectedDate: new Date(2017, 9, 4), firstDayOfWeek: 3 });
            schObj.appendTo('#Schedule');
        });
        afterAll(() => {
            if (schObj) {
                schObj.destroy();
            }
            remove(elem);
        });

        it('toolbar calendar first day of week', () => {
            (schObj.element.querySelectorAll('.e-schedule-toolbar .e-date-range')[0] as HTMLElement).click();
            let popupEle: Element = schObj.element.querySelector('.e-schedule-toolbar-container .e-header-popup');
            expect(popupEle.querySelector('.e-week-header th').textContent).toBe('We');
        });

        it('toolbar calendar first day of week property change', () => {
            schObj.firstDayOfWeek = 1;
            schObj.dataBind();
            (schObj.element.querySelectorAll('.e-schedule-toolbar .e-date-range')[0] as HTMLElement).click();
            let popupEle: Element = schObj.element.querySelector('.e-schedule-toolbar-container .e-header-popup');
            expect(popupEle.querySelector('.e-week-header th').textContent).toBe('Mo');
        });
    });

    describe('RTL mode', () => {
        let schObj: Schedule;
        beforeEach(() => {
            let elem: HTMLElement = createElement('div', { id: 'Schedule' });
            document.body.appendChild(elem);
        });
        afterEach(() => {
            if (schObj) {
                schObj.destroy();
                schObj = null;
            }
            remove(document.querySelector('#Schedule'));
        });

        it('toolbar bar rtl class testing', () => {
            schObj = new Schedule({ selectedDate: new Date(2017, 9, 4), enableRtl: true }, '#Schedule');
            expect(schObj.element.querySelectorAll('.e-schedule-toolbar-container')).toBeTruthy();
            expect(schObj.element.querySelector('.e-schedule-toolbar').classList).toContain('e-rtl');
            expect(schObj.element.querySelectorAll('.e-toolbar-item').length).toEqual(10);
            (schObj.element.querySelectorAll('.e-schedule-toolbar .e-date-range')[0] as HTMLElement).click();
            let popupEle: Element = schObj.element.querySelector('.e-schedule-toolbar-container .e-header-popup');
            expect(schObj.element.querySelector('.e-schedule-toolbar').classList.contains('e-rtl')).toEqual(true);
            expect(popupEle.classList.contains('e-rtl')).toEqual(true);
            expect(popupEle.querySelector('.e-header-calendar').classList.contains('e-rtl')).toEqual(true);
        });

        it('toolbar bar rtl mode property change', (done: Function) => {
            schObj = new Schedule({ selectedDate: new Date(2017, 9, 4), enableRtl: true }, '#Schedule');
            schObj.dataBound = () => {
                (schObj.element.querySelectorAll('.e-schedule-toolbar .e-date-range')[0] as HTMLElement).click();
                let popupEle: Element = schObj.element.querySelector('.e-schedule-toolbar-container .e-header-popup');
                expect(popupEle.classList.contains('e-rtl')).toEqual(false);
                expect(popupEle.querySelector('.e-header-calendar').classList.contains('e-rtl')).toEqual(false);
                expect(schObj.element.querySelector('.e-schedule-toolbar').classList.contains('e-rtl')).toEqual(false);
                expect(schObj.element.querySelectorAll('.e-toolbar-item').length).toEqual(10);
                done();
            };
            schObj.enableRtl = false;
            schObj.dataBind();
        });
    });

    describe('HeaderBar RTL mode testing via setmodel', () => {
        let schObj: Schedule;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        beforeAll(() => {
            document.body.appendChild(elem);
            schObj = new Schedule({ selectedDate: new Date(2017, 9, 4), showHeaderBar: false, enableRtl: true });
            schObj.appendTo('#Schedule');
        });
        afterAll(() => {
            if (schObj) {
                schObj.destroy();
            }
            remove(elem);
        });

        it('toolbar bar rtl class testing', () => {
            expect(schObj.element.querySelectorAll('.e-schedule-toolbar-container').length).toEqual(0);
        });

        it('toolbar bar rtl mode property change', () => {
            schObj.showHeaderBar = true;
            schObj.dataBind();
            expect(schObj.element.querySelectorAll('.e-schedule-toolbar-container').length).toEqual(1);
            expect(schObj.element.querySelector('.e-schedule-toolbar').classList).toContain('e-rtl');
            expect(schObj.element.querySelectorAll('.e-toolbar-item').length).toEqual(10);
        });
    });

    function disableDialogAnimation(dialogObject: Dialog): void {
        dialogObject.animationSettings = { effect: 'None' };
        dialogObject.dataBind();
        dialogObject.hide();
    }

    describe('Mobile view', () => {
        let schObj: Schedule;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        let uA: string = Browser.userAgent;
        let androidUserAgent: string = 'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) ' +
            'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36';

        beforeAll(() => {
            Browser.userAgent = androidUserAgent;
            document.body.appendChild(elem);
            schObj = new Schedule({ selectedDate: new Date(2017, 9, 4), width: 300 });
            schObj.appendTo('#Schedule');
        });
        afterAll(() => {
            if (schObj) {
                schObj.destroy();
            }
            remove(elem);
            Browser.userAgent = uA;
        });

        it('toolbar bar class testing', () => {
            expect(schObj.element.querySelectorAll('.e-schedule-toolbar-container')).toBeTruthy();
            expect(schObj.element.querySelectorAll('.e-schedule-toolbar').length).toEqual(1);
        });

        it('calendar navigation', () => {
            (schObj.element.querySelectorAll('.e-schedule-toolbar .e-date-range')[0] as HTMLElement).click();
            let popupEle: Element = schObj.element.querySelector('.e-schedule-toolbar-container .e-header-popup');
            expect(popupEle).toBeTruthy();
            expect(popupEle.classList.contains('e-popup-open')).toEqual(true);
            expect(popupEle.querySelector('.e-header-calendar')).toBeTruthy();
            expect(popupEle.querySelector('.e-header-calendar').classList.contains('e-calendar')).toEqual(true);
            expect(popupEle.querySelector('.e-content').classList.contains('e-month')).toEqual(true);
            (popupEle.querySelectorAll('.e-cell')[8] as HTMLElement).click();
            expect(popupEle.classList.contains('e-popup-open')).toEqual(false);
            expect(schObj.element.querySelector('.e-date-header-container .e-header-cells').innerHTML)
                .toEqual('<div class="e-header-day">Sun</div><div class="e-header-date e-navigate" role="link">1</div>');
            expect(schObj.element.querySelector('.e-table-wrap').classList).toContain('e-week-view');
        });

        it('close toolbar popup while select items', () => {
            (schObj.element.querySelector('.e-schedule-toolbar .e-hor-nav') as HTMLElement).click();
            let toolbarPopupEle: Element = schObj.element.querySelector('.e-schedule-toolbar-container .e-toolbar-pop');
            expect(toolbarPopupEle).toBeTruthy();
            (schObj.element.querySelector('.e-schedule-toolbar .e-month') as HTMLElement).click();
            expect(toolbarPopupEle.classList.contains('e-popup-open')).toEqual(false);
        });

        it('add icon click checking', () => {
            (schObj.element.querySelector('.e-schedule-toolbar .e-week') as HTMLElement).click();
            disableDialogAnimation(schObj.eventWindow.dialogObject);
            let toolbarElement: HTMLElement = schObj.element.querySelector('.e-schedule-toolbar') as HTMLElement;
            (<HTMLElement>toolbarElement.querySelector('.e-add .e-tbar-btn')).click();
            let dialogElement: HTMLElement = document.querySelector('.e-schedule-dialog') as HTMLElement;
            expect(schObj.eventWindow.dialogObject.visible).toEqual(true);
            let backIcon: HTMLElement = dialogElement.querySelector('.e-back-icon');
            backIcon.click();
        });

        it('add icon click checking after cell click', () => {
            disableDialogAnimation(schObj.eventWindow.dialogObject);
            let toolbarElement: HTMLElement = schObj.element.querySelector('.e-schedule-toolbar') as HTMLElement;
            let firstWorkCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement;
            firstWorkCell.click();
            (<HTMLElement>toolbarElement.querySelector('.e-add .e-tbar-btn')).click();
            let dialogElement: HTMLElement = document.querySelector('.e-schedule-dialog') as HTMLElement;
            expect(schObj.eventWindow.dialogObject.visible).toEqual(true);
            let backIcon: HTMLElement = dialogElement.querySelector('.e-back-icon');
            backIcon.click();
        });
        it('Negative case for header cell click navigation', () => {
            schObj.currentView = 'Month';
            schObj.dataBind();
            expect(schObj.currentView).toEqual('Month');
            (schObj.element.querySelector('.e-date-header') as HTMLElement).click();
            expect(schObj.currentView).toEqual('Month');
        });
    });

    describe('Header date range on default culture', () => {
        let schObj: Schedule;
        beforeAll((): void => {
            schObj = undefined;
            let elem: HTMLElement = createElement('div', { id: 'Schedule' });
            document.body.appendChild(elem);
            schObj = new Schedule({ selectedDate: new Date(2017, 9, 4) });
            schObj.appendTo('#Schedule');
        });
        afterAll((): void => {
            if (schObj) {
                schObj.destroy();
            }
            remove(document.querySelector('#Schedule'));
        });
        it('dates on same month and year', () => {
            expect(schObj.element.querySelector('.e-schedule-toolbar .e-date-range .e-tbar-btn-text').innerHTML).
                toEqual('October 01 - 07, 2017');
        });
        it('dates on different month', () => {
            schObj.selectedDate = new Date(2017, 10, 1);
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-schedule-toolbar .e-date-range .e-tbar-btn-text').innerHTML).
                toEqual('Oct 29 - Nov 04, 2017');
        });
        it('dates on different year', () => {
            schObj.selectedDate = new Date(2019, 0, 1);
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-schedule-toolbar .e-date-range .e-tbar-btn-text').innerHTML).
                toEqual('Dec 30, 2018 - Jan 05, 2019');
        });
    });

    describe('Add custom items and remove default items to toolbar', () => {
        let schObj: Schedule;
        beforeAll((done: Function): void => {
            schObj = undefined;
            let elem: HTMLElement = createElement('div', { id: 'Schedule' });
            document.body.appendChild(elem);
            let dataBound: EmitType<Object> = () => { done(); };
            schObj = new Schedule({
                selectedDate: new Date(2017, 9, 4),
                width: 800,
                height: 600,
                actionBegin: (args: ActionEventArgs & ToolbarActionArgs) => {
                    if (args.requestType === 'toolbarItemRendering') {
                        let printItem: ItemModel = {
                            align: 'Center', text: 'Print', cssClass: 'e-schedule-print'
                        };
                        args.items.push(printItem);
                        args.items.splice(0, 2);
                    }
                },
                dataBound: dataBound
            });
            schObj.appendTo('#Schedule');
        });
        afterAll((): void => {
            if (schObj) {
                schObj.destroy();
            }
            remove(document.querySelector('#Schedule'));
        });
        it('check custom item', () => {
            expect(schObj.element.querySelectorAll('.e-toolbar-item').length).toEqual(9);
            expect(schObj.element.querySelectorAll('.e-schedule-print').length).toEqual(1);
        });
        it('custom item after views collection change', (done: Function) => {
            schObj.views = ['Day', 'Week', 'MonthAgenda'];
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-toolbar-item').length).toEqual(7);
                expect(schObj.element.querySelectorAll('.e-schedule-print').length).toEqual(1);
                (schObj.element.querySelector('.e-schedule-toolbar .e-month-agenda') as HTMLElement).click();
                expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-month-agenda');
                expect(schObj.element.querySelector('.e-table-wrap').classList).toContain('e-month-agenda-view');
                done();
            };
            schObj.dataBind();
        });
    });
});
