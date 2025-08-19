/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Schedule header toolbar spec
 */
import { Browser, remove } from '@syncfusion/ej2-base';
import { ItemModel } from '@syncfusion/ej2-navigations';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import {
    Schedule, Day, Week, WorkWeek, Month, Agenda, MonthAgenda, ActionEventArgs, ScheduleModel,HeaderRenderer
} from '../../../src/schedule/index';
import * as util from '../util.spec';
import { profile, inMB, getMemoryProfile } from '../../common.spec';

Schedule.Inject(Day, Week, WorkWeek, Month, Agenda, MonthAgenda);

describe('Schedule header bar', () => {
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
        beforeAll(() => {
            const model: ScheduleModel = { selectedDate: new Date(2017, 9, 4) };
            schObj = util.createSchedule(model, []);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('get module name', () => {
            expect((<any>schObj.headerModule).getModuleName()).toEqual('headerbar');
        });

        it('toolbar bar class testing', () => {
            expect(schObj.element.querySelectorAll('.e-schedule-toolbar-container')).toBeTruthy();
            expect(schObj.element.querySelectorAll('.e-schedule-toolbar').length).toEqual(1);
            expect(schObj.element.querySelectorAll('.e-toolbar-item').length).toEqual(10);
            util.triggerMouseEvent(document.body, 'mousedown');
        });

        it('calendar navigation', () => {
            (schObj.element.querySelectorAll('.e-schedule-toolbar .e-date-range')[0] as HTMLElement).click();
            const popupEle: Element = schObj.element.querySelector('.e-schedule-toolbar-container .e-header-popup');
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
            const popupEle: Element = schObj.element.querySelector('.e-schedule-toolbar-container .e-header-popup');
            expect(popupEle).toBeTruthy();
            expect(popupEle.classList.contains('e-popup-open')).toEqual(true);
            util.triggerMouseEvent(document.body, 'mousedown');
            expect(popupEle.classList.contains('e-popup-open')).toEqual(false);
        });

        it('hide halendar on date range click', () => {
            (schObj.element.querySelectorAll('.e-schedule-toolbar .e-date-range')[0] as HTMLElement).click();
            const popupEle: Element = schObj.element.querySelector('.e-schedule-toolbar-container .e-header-popup');
            expect(popupEle).toBeTruthy();
            expect(popupEle.classList.contains('e-popup-open')).toEqual(true);
            (schObj.element.querySelectorAll('.e-schedule-toolbar .e-date-range')[0] as HTMLElement).click();
            expect(popupEle.classList.contains('e-popup-open')).toEqual(false);
        });

        it('calendar date navigation', () => {
            (schObj.element.querySelectorAll('.e-schedule-toolbar .e-date-range')[0] as HTMLElement).click();
            const popupEle: Element = schObj.element.querySelector('.e-schedule-toolbar-container .e-header-popup');
            const calendarEle: Element = schObj.element.querySelector('.e-schedule-toolbar-container .e-header-calendar');
            (calendarEle.querySelector('.e-day') as HTMLElement).click();
            expect(popupEle.classList.contains('e-popup-open')).toEqual(true);
            expect(calendarEle.querySelector('.e-header').classList.contains('e-year')).toEqual(true);
            (calendarEle.querySelector('.e-selected') as HTMLElement).click();
            expect(popupEle.classList.contains('e-popup-open')).toEqual(true);
            expect(calendarEle.querySelector('.e-header').classList.contains('e-month')).toEqual(true);
            util.triggerMouseEvent(calendarEle.querySelector('.e-next') as HTMLElement, 'mousedown');
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
        beforeAll(() => {
            const model: ScheduleModel = { selectedDate: new Date(2017, 9, 4), views: [{ option: 'Day', isSelected: true }] };
            schObj = util.createSchedule(model, []);
        });
        afterAll(() => {
            util.destroy(schObj);
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
            schObj.views = [
                { option: 'Day', isSelected: true, interval: 5, displayName: '5 Days' },
                { option: 'Week', interval: 3, displayName: '3 Weeks' },
                { option: 'WorkWeek', interval: 2, displayName: '2 WorkWeeks' },
                { option: 'Month', interval: 2, displayName: '2 Months' }
            ];
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
        beforeAll(() => {
            const model: ScheduleModel = { selectedDate: new Date(2017, 9, 4), firstDayOfWeek: 3 };
            schObj = util.createSchedule(model, []);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('toolbar calendar first day of week', () => {
            (schObj.element.querySelectorAll('.e-schedule-toolbar .e-date-range')[0] as HTMLElement).click();
            const popupEle: Element = schObj.element.querySelector('.e-schedule-toolbar-container .e-header-popup');
            expect(popupEle.querySelector('.e-week-header th').textContent).toBe('We');
        });

        it('toolbar calendar first day of week property change', () => {
            schObj.firstDayOfWeek = 1;
            schObj.dataBind();
            (schObj.element.querySelectorAll('.e-schedule-toolbar .e-date-range')[0] as HTMLElement).click();
            const popupEle: Element = schObj.element.querySelector('.e-schedule-toolbar-container .e-header-popup');
            expect(popupEle.querySelector('.e-week-header th').textContent).toBe('Mo');
        });
    });

    describe('RTL mode', () => {
        let schObj: Schedule;
        beforeEach(() => {
            schObj = undefined;
        });
        afterEach(() => {
            util.destroy(schObj);
        });

        it('toolbar bar rtl class testing', () => {
            const model: ScheduleModel = { selectedDate: new Date(2017, 9, 4), enableRtl: true };
            schObj = util.createSchedule(model, []);
            expect(schObj.element.querySelectorAll('.e-schedule-toolbar-container')).toBeTruthy();
            expect(schObj.element.querySelector('.e-schedule-toolbar').classList).toContain('e-rtl');
            expect(schObj.element.querySelectorAll('.e-toolbar-item').length).toEqual(10);
            (schObj.element.querySelectorAll('.e-schedule-toolbar .e-date-range')[0] as HTMLElement).click();
            const popupEle: Element = schObj.element.querySelector('.e-schedule-toolbar-container .e-header-popup');
            expect(schObj.element.querySelector('.e-schedule-toolbar').classList.contains('e-rtl')).toEqual(true);
            expect(popupEle.classList.contains('e-rtl')).toEqual(true);
            expect(popupEle.querySelector('.e-header-calendar').classList.contains('e-rtl')).toEqual(true);
        });

        it('toolbar bar rtl mode property change', (done: DoneFn) => {
            const model: ScheduleModel = { selectedDate: new Date(2017, 9, 4), enableRtl: true };
            schObj = util.createSchedule(model, []);
            schObj.dataBound = () => {
                (schObj.element.querySelectorAll('.e-schedule-toolbar .e-date-range')[0] as HTMLElement).click();
                const popupEle: Element = schObj.element.querySelector('.e-schedule-toolbar-container .e-header-popup');
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
        beforeAll(() => {
            const model: ScheduleModel = { selectedDate: new Date(2017, 9, 4), showHeaderBar: false, enableRtl: true };
            schObj = util.createSchedule(model, []);
        });
        afterAll(() => {
            util.destroy(schObj);
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

    describe('Mobile view', () => {
        let schObj: Schedule;
        const uA: string = Browser.userAgent;
        const androidUserAgent: string = 'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) ' +
            'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36';
        beforeAll((done: DoneFn) => {
            Browser.userAgent = androidUserAgent;
            const model: ScheduleModel = { selectedDate: new Date(2017, 9, 4), width: 300 };
            schObj = util.createSchedule(model, [], done);
        });
        afterAll(() => {
            util.destroy(schObj);
            Browser.userAgent = uA;
        });

        it('toolbar bar class testing', () => {
            expect(schObj.element.querySelectorAll('.e-schedule-toolbar-container')).toBeTruthy();
            expect(schObj.element.querySelectorAll('.e-schedule-toolbar').length).toEqual(1);
        });

        it('calendar navigation', () => {
            (schObj.element.querySelectorAll('.e-schedule-toolbar .e-date-range')[0] as HTMLElement).click();
            const popupEle: Element = schObj.element.querySelector('.e-schedule-toolbar-container .e-header-popup');
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
            const toolbarPopupEle: Element = schObj.element.querySelector('.e-schedule-toolbar-container .e-toolbar-pop');
            expect(toolbarPopupEle).toBeTruthy();
            (schObj.element.querySelector('.e-schedule-toolbar .e-month') as HTMLElement).click();
            expect(toolbarPopupEle.classList.contains('e-popup-open')).toEqual(false);
        });

        it('add icon click checking', () => {
            (schObj.element.querySelector('.e-schedule-toolbar .e-week') as HTMLElement).click();
            const toolbarElement: HTMLElement = schObj.element.querySelector('.e-schedule-toolbar') as HTMLElement;
            (<HTMLElement>toolbarElement.querySelector('.e-add .e-tbar-btn')).click();
            const dialogElement: HTMLElement = document.querySelector('.e-schedule-dialog') as HTMLElement;
            expect(schObj.eventWindow.dialogObject.visible).toEqual(true);
            const backIcon: HTMLElement = dialogElement.querySelector('.e-back-icon');
            backIcon.click();
        });

        it('add icon click checking after cell click', () => {
            const toolbarElement: HTMLElement = schObj.element.querySelector('.e-schedule-toolbar') as HTMLElement;
            const firstWorkCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement;
            firstWorkCell.click();
            (<HTMLElement>toolbarElement.querySelector('.e-add .e-tbar-btn')).click();
            const dialogElement: HTMLElement = document.querySelector('.e-schedule-dialog') as HTMLElement;
            expect(schObj.eventWindow.dialogObject.visible).toEqual(true);
            const backIcon: HTMLElement = dialogElement.querySelector('.e-back-icon');
            backIcon.click();
        });
        it('Negative case for header cell click navigation', () => {
            schObj.currentView = 'Month';
            schObj.dataBind();
            expect(schObj.currentView).toEqual('Month');
            (schObj.element.querySelector('.e-date-header') as HTMLElement).click();
            expect(schObj.currentView).toEqual('Day');
            schObj.currentView = 'Week';
            schObj.dataBind();
            expect(schObj.currentView).toEqual('Week');
            (schObj.element.querySelector('.e-header-date') as HTMLElement).click();
            expect(schObj.currentView).toEqual('Day');
        });
    });

    describe('Header date range on default culture', () => {
        let schObj: Schedule;
        beforeAll((): void => {
            const model: ScheduleModel = { selectedDate: new Date(2017, 9, 4) };
            schObj = util.createSchedule(model, []);
        });
        afterAll((): void => {
            util.destroy(schObj);
        });
        it('dates on same month and year', () => {
            expect(schObj.element.querySelector('.e-schedule-toolbar .e-date-range .e-tbar-btn-text').innerHTML).
                toEqual('October 01 - 07, 2017');
            expect(schObj.element.querySelector('.e-schedule-toolbar .e-date-range').firstElementChild.getAttribute('aria-label')).
                toEqual('October 01 - 07, 2017');
        });
        it('dates on different month', () => {
            schObj.selectedDate = new Date(2017, 10, 1);
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-schedule-toolbar .e-date-range .e-tbar-btn-text').innerHTML).
                toEqual('Oct 29 - Nov 04, 2017');
            expect(schObj.element.querySelector('.e-schedule-toolbar .e-date-range').firstElementChild.getAttribute('aria-label')).
                toEqual('Oct 29 - Nov 04, 2017');
        });
        it('dates on different year', () => {
            schObj.selectedDate = new Date(2019, 0, 1);
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-schedule-toolbar .e-date-range .e-tbar-btn-text').innerHTML).
                toEqual('Dec 30, 2018 - Jan 05, 2019');
            expect(schObj.element.querySelector('.e-schedule-toolbar .e-date-range').firstElementChild.getAttribute('aria-label')).
                toEqual('Dec 30, 2018 - Jan 05, 2019');
        });
    });

    describe('Add custom items and remove default items to toolbar', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn): void => {
            const model: ScheduleModel = {
                width: 800, height: 600, selectedDate: new Date(2017, 9, 4),
                actionBegin: (args: ActionEventArgs) => {
                    if (args.requestType === 'toolbarItemRendering') {
                        const printItem: ItemModel = { align: 'Center', text: 'Print', cssClass: 'e-schedule-print' };
                        args.items.push(printItem);
                        args.items.splice(0, 2);
                    }
                }
            };
            schObj = util.createSchedule(model, [], done);
        });
        afterAll((): void => {
            util.destroy(schObj);
        });
        it('check custom item', () => {
            expect(schObj.element.querySelectorAll('.e-toolbar-item').length).toEqual(9);
            expect(schObj.element.querySelectorAll('.e-schedule-print').length).toEqual(1);
        });
        it('custom item after views collection change', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-toolbar-item').length).toEqual(7);
                expect(schObj.element.querySelectorAll('.e-schedule-print').length).toEqual(1);
                done();
            };
            schObj.views = ['Day', 'Week', 'MonthAgenda'];
            schObj.dataBind();
        });
        it('month-agenda view testing', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-month-agenda');
                expect(schObj.element.querySelector('.e-table-wrap').classList).toContain('e-month-agenda-view');
                done();
            };
            (schObj.element.querySelector('.e-schedule-toolbar .e-month-agenda') as HTMLElement).click();
        });
        it('toolbar destroy manually', () => {
            schObj.dataBound = null;
            expect(schObj.element.querySelectorAll('.e-toolbar-item').length).toEqual(7);
            remove(schObj.element.querySelector('.e-date-range'));
            schObj.headerModule.updateHeaderItems('remove');
            schObj.headerModule.destroy();
            schObj.headerModule.updateItems();
            expect(schObj.element.querySelectorAll('.e-toolbar-item').length).toEqual(0);
        });
    });

    describe('Custom toolbar with default align', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn): void => {
            const model: ScheduleModel = {
                width: 800, height: 600, selectedDate: new Date(2017, 9, 4),
                toolbarItems: [{ name: 'Today', text: 'Today', disabled: false, visible: true, showTextOn: 'Toolbar', tabIndex: 1, type:'Button', width: '50px', cssClass:'e-today',
                suffixIcon: 'e-icon-day', overflow:'Show', showAlwaysInPopup: true, prefixIcon: 'e-icon-day', tooltipText: 'Today', htmlAttributes: null}, 
                { name: 'Previous', text: 'previous' }, { name: 'Next', text: 'Next' }, { name: 'DateRangeText',  htmlAttributes: { 'aria-atomic': 'true', 'aria-live': 'assertive', 'role': 'navigation' } },
                { prefixIcon: 'e-icons e-cut', tooltipText: 'Cut', click: function() { alert("cut button clicked")}  }, { name: 'NewEvent', disabled: true,visible: false, },
                { id: 'dropdown', type:'Input', template: '<div class="e-input-group"><input id="dropdown"></input></div>' },
                { id: 'button', template: '<div class="e-input-group"><button id="btn">Custom button</button></div>',click: function() { alert("custom button clicked")} }, { name: 'Views' },],
                views: ['Day', 'Week', 'WorkWeek', 'Month'],
            };
            schObj = util.createSchedule(model, [], done);
            let sportsData: string[] = ['Badminton', 'Cricket', 'Football', 'Golf', 'Tennis'];
            let dropDownListObject: DropDownList = new DropDownList({
                dataSource: sportsData
            });
            dropDownListObject.appendTo('#dropdown');
        });
        afterAll((): void => {
            util.destroy(schObj);
        });
        it('checking toolbar items', () => {
            expect(schObj.element.querySelectorAll('.e-toolbar-item').length).toEqual(12);
            expect(schObj.element.querySelectorAll('.e-cut').length).toEqual(1);
            expect(schObj.toolbarItems[0].name).toEqual('Today');
            expect(schObj.toolbarItems[0].align).toEqual('Left');
            expect(schObj.toolbarItems[0].text).toEqual('Today');
            expect(schObj.toolbarItems[0].visible).toEqual(true);
            expect(schObj.toolbarItems[0].disabled).toEqual(false);
            expect(schObj.toolbarItems[0].width).toEqual('50px');
            expect(schObj.toolbarItems[0].showAlwaysInPopup).toEqual(true);
            expect(schObj.toolbarItems[0].showTextOn).toEqual('Toolbar');
            expect(schObj.toolbarItems[0].tabIndex).toEqual(1);
            expect(schObj.toolbarItems[0].type).toEqual('Button');
            expect(schObj.toolbarItems[0].suffixIcon).toEqual('e-icon-day');
            expect(schObj.toolbarItems[0].cssClass).toEqual('e-today');
            expect(schObj.toolbarItems[0].overflow).toEqual('Show');
            expect(schObj.toolbarItems[0].htmlAttributes).toEqual(null);
        });

        it('checking view navigations', () => {
            expect(schObj.element.querySelector('.e-schedule-toolbar .e-day')).toBeTruthy();
            expect(schObj.element.querySelector('.e-schedule-toolbar .e-week')).toBeTruthy();
            expect(schObj.element.querySelector('.e-schedule-toolbar .e-work-week')).toBeTruthy();
            expect(schObj.element.querySelector('.e-schedule-toolbar .e-month')).toBeTruthy();

            (schObj.element.querySelector('.e-schedule-toolbar .e-week') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-week');
            expect(schObj.element.querySelector('.e-table-wrap').classList).toContain('e-week-view');

            (schObj.element.querySelector('.e-schedule-toolbar .e-day') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-day');
            expect(schObj.element.querySelector('.e-table-wrap').classList).toContain('e-day-view');

            (schObj.element.querySelector('.e-schedule-toolbar .e-work-week') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-work-week');
            expect(schObj.element.querySelector('.e-table-wrap').classList).toContain('e-work-week-view');

            (schObj.element.querySelector('.e-schedule-toolbar .e-month') as HTMLElement).click();
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-month');
            expect(schObj.element.querySelector('.e-table-wrap').classList).toContain('e-month-view');
        });

        it('date navigation', () => {
            schObj.currentView = 'Week';
            schObj.selectedDate = new Date(2017, 9, 29);
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-schedule-toolbar .e-date-range .e-tbar-btn-text').innerHTML).
                toEqual('Oct 29 - Nov 04, 2017');
            schObj.selectedDate = new Date(2017, 10, 6);
            schObj.dataBind();
            expect(schObj.element.querySelector('.e-schedule-toolbar .e-date-range .e-tbar-btn-text').innerHTML).
                toEqual('November 05 - 11, 2017');
        });

        it('checking click actions', () => {
            expect((schObj.element.querySelectorAll('.e-toolbar-item')[6].querySelector('input').classList.contains('e-dropdownlist'))).toEqual(true);
            (schObj.element.querySelectorAll('.e-toolbar-item')[4] as HTMLElement).click();
            (schObj.element.querySelectorAll('.e-toolbar-item')[7] as HTMLElement).click();
            (schObj.element.querySelectorAll('.e-toolbar-item')[0] as HTMLElement).click()
            expect(schObj.selectedDate.getDate()).toEqual(new Date().getDate());
        });
    });

    describe('Custom toolbar with user given align properties', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn): void => {
            const model: ScheduleModel = {
                width: 800, height: 600, selectedDate: new Date(2017, 9, 4),
                toolbarItems: [{ name: 'Today', text: 'Today', align: 'Right'}, 
                { name: 'Previous', text: 'previous', align: 'Right' }, { name: 'Next', text: 'Next', align:'Right' }, { name: 'DateRangeText', align: 'Right' },
                { prefixIcon: 'e-icons e-cut', tooltipText: 'Cut', click: function() { alert("cut button clicked")}, align:'Right'  }, { name: 'NewEvent', align:'Right' },
                { id: 'dropdown', type:'Input', template: '<div class="e-input-group"><input id="dropdown"></input></div>', align: 'Right' },
                { id: 'button', template: '<div class="e-input-group"><button id="btn">Custom button</button></div>',click: function() { alert("custom button clicked")}, align:'Right'},
                { name: 'Views', align: 'Right' }],
                views: ['Day', 'Week', 'WorkWeek', 'Month'],
            };
            schObj = util.createSchedule(model, [], done);
            let sportsData: string[] = ['Badminton', 'Cricket', 'Football', 'Golf', 'Tennis'];
            let dropDownListObject: DropDownList = new DropDownList({
                dataSource: sportsData
            });
            dropDownListObject.appendTo('#dropdown');
        });
        afterAll((): void => {
            util.destroy(schObj);
        });
        it('checking toolbar items', () => {
            expect(schObj.element.querySelectorAll('.e-toolbar-item').length).toEqual(12);
            expect(schObj.element.querySelectorAll('.e-cut').length).toEqual(1);
            expect(schObj.toolbarItems[0].name).toEqual('Today');
            expect(schObj.toolbarItems[0].align).toEqual('Right');
            expect(schObj.toolbarItems[1].name).toEqual('Previous');
            expect(schObj.toolbarItems[1].align).toEqual('Right');
            expect(schObj.toolbarItems[2].name).toEqual('Next');
            expect(schObj.toolbarItems[2].align).toEqual('Right');
            expect(schObj.toolbarItems[3].name).toEqual('DateRangeText');
            expect(schObj.toolbarItems[3].align).toEqual('Right');
            expect(schObj.toolbarItems[8].name).toEqual('Views');
            expect(schObj.toolbarItems[8].align).toEqual('Right');
        }); 
    });

    describe('Custom toolbar with click function', () => {
        let schObj: Schedule;
        let wasClicked: boolean;
        beforeAll((done: DoneFn): void => {
            const model: ScheduleModel = {
                width: 800, height: 600, selectedDate: new Date(2017, 9, 4),
                toolbarItems: [{ name: 'Today', text: 'Today', align: 'Right'}, 
                { name: 'Previous', text: 'previous', align: 'Right' }, { name: 'Next', text: 'Next', align:'Right' }, { name: 'DateRangeText', align: 'Right' },
                { prefixIcon: 'e-icons e-cut', tooltipText: 'Cut', click: function() { wasClicked = true; }, align:'Right'  }

                ],
                views: ['Day', 'Week', 'WorkWeek', 'Month'],
            };
            schObj = util.createSchedule(model, [], done);
            let sportsData: string[] = ['Badminton', 'Cricket', 'Football', 'Golf', 'Tennis'];
            let dropDownListObject: DropDownList = new DropDownList({
                dataSource: sportsData
            });
            dropDownListObject.appendTo('#dropdown');
        });
        afterAll((): void => {
            util.destroy(schObj);
        });
        it('checking toolbar item click action', () => {
            expect(schObj.element.querySelectorAll('.e-toolbar-item').length).toEqual(5);
            expect(schObj.element.querySelectorAll('.e-cut').length).toEqual(1);
            expect(schObj.toolbarItems[4].tooltipText).toEqual('Cut');
            (schObj.toolbarItems[4]).click();
            expect(wasClicked).toBe(true);

        }); 
    });

    describe('HeaderRenderer - hasSelectedDate Method', () => {
        let scheduleObj: Schedule;
        let headerRenderer: HeaderRenderer;

        beforeEach((done: DoneFn) => {
            const model: ScheduleModel = {
                selectedDate: new Date(2022, 9, 5),
                currentView: 'Month',
                views: ['Month']
            };

            scheduleObj = util.createSchedule(model, [], done);
            headerRenderer = new HeaderRenderer(scheduleObj);
        });

        afterEach(() => {
            util.destroy(scheduleObj);
        });

        it('should return true if selectedDate is within the current view date range', () => {
            const selectedDate = new Date(2022, 9, 5);
            scheduleObj.selectedDate = selectedDate;
            spyOn(scheduleObj, 'getCurrentViewDates').and.returnValue([new Date(2022, 9, 1), new Date(2022, 9, 31)]);
            const result = (headerRenderer as any).hasSelectedDate();
            expect(result).toBe(true);
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
