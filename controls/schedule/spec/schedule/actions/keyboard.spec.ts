/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Schedule keyboard interaction spec
 */
import { createElement } from '@syncfusion/ej2-base';
import { Schedule, ScheduleModel, Day, Week, WorkWeek, Month, Agenda, SelectEventArgs, CellClickEventArgs } from '../../../src/schedule/index';
import { defaultData, timelineData, timelineResourceData } from '../base/datasource.spec';
import * as util from '../util.spec';
import { profile, inMB, getMemoryProfile } from '../../common.spec';

Schedule.Inject(Day, Week, WorkWeek, Month, Agenda);

describe('Keyboard interaction', () => {
    beforeAll(() => {
        const isDef: (o: any) => boolean = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            // eslint-disable-next-line no-console
            console.log('Unsupported environment, window.performance.memory is unavailable');
            (this as any).skip(); //Skips test (in Chai)
            return;
        }
    });

    describe('allowKeyboardInteraction', () => {
        let schObj: Schedule;
        let keyModule: any;
        beforeEach(() => {
            document.body.appendChild(createElement('div', { id: 'Schedule' }));
        });
        afterEach(() => {
            util.destroy(schObj);
        });
        it('disable', () => {
            schObj = new Schedule({ allowKeyboardInteraction: false, selectedDate: new Date(2017, 9, 4) });
            schObj.appendTo('#Schedule');
            keyModule = schObj.keyboardInteractionModule;
            expect(keyModule).toBeUndefined();
            expect(schObj.element.classList.contains('e-keyboard')).toEqual(false);
        });
        it('property change to false', () => {
            schObj = new Schedule({ allowKeyboardInteraction: true, selectedDate: new Date(2017, 9, 4) });
            schObj.appendTo('#Schedule');
            keyModule = schObj.keyboardInteractionModule;
            expect(keyModule).not.toBeNull();
            expect(schObj.element.classList).toContain('e-keyboard');
            schObj.allowKeyboardInteraction = false;
            schObj.dataBind();
            expect(schObj.keyboardInteractionModule).toBeNull();
            expect(schObj.element.classList.contains('e-keyboard')).toEqual(false);
        });
        it('property change to true', () => {
            schObj = new Schedule({ allowKeyboardInteraction: false, selectedDate: new Date(2017, 9, 4) });
            schObj.appendTo('#Schedule');
            keyModule = schObj.keyboardInteractionModule;
            expect(keyModule).toBeUndefined();
            expect(schObj.element.classList.contains('e-keyboard')).toEqual(false);
            schObj.allowKeyboardInteraction = true;
            schObj.dataBind();
            expect(schObj.keyboardInteractionModule).not.toBeUndefined();
            expect(schObj.element.classList).toContain('e-keyboard');
        });
    });

    describe('vertical view', () => {
        let schObj: Schedule;
        let keyModule: any;
        beforeAll((done: DoneFn) => {
            const elem: HTMLElement = createElement('div', { id: 'Schedule', attrs: { tabIndex: '1' } });
            const schOptions: ScheduleModel = { selectedDate: new Date(2017, 9, 4) };
            schObj = util.createSchedule(schOptions, [], done, elem);
            keyModule = schObj.keyboardInteractionModule;
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('ensure module name', () => {
            expect(keyModule.getModuleName()).toEqual('keyboard');
        });
        it('home key', () => {
            const firstWorkCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
            expect(firstWorkCell.classList).not.toContain('e-selected-cell');
            expect(firstWorkCell.getAttribute('aria-selected')).toEqual('false');
            keyModule.keyActionHandler({ action: 'home' });
            expect(firstWorkCell.classList).toContain('e-selected-cell');
            expect(firstWorkCell.getAttribute('aria-selected')).toEqual('true');
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
        });
        it('ctrl right arrow key', () => {
            schObj.element.focus();
            (schObj.headerModule.element.querySelector('.e-next button') as HTMLElement).focus();
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('October 01 - 07, 2017');
            keyModule.keyActionHandler({ action: 'ctrlRightArrow' });
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('October 08 - 14, 2017');
            schObj.showHeaderBar = false;
            schObj.dataBind();
            schObj.element.focus();
            keyModule.keyActionHandler({ action: 'ctrlRightArrow' });
            expect(schObj.headerModule).toBeNull();
            schObj.showHeaderBar = true;
            schObj.dataBind();
        });
        it('ctrl left arrow key', () => {
            schObj.element.focus();
            (schObj.headerModule.element.querySelector('.e-prev button') as HTMLElement).focus();
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('October 15 - 21, 2017');
            keyModule.keyActionHandler({ action: 'ctrlLeftArrow' });
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('October 08 - 14, 2017');
            schObj.showHeaderBar = false;
            schObj.dataBind();
            schObj.element.focus();
            keyModule.keyActionHandler({ action: 'ctrlLeftArrow' });
            expect(schObj.headerModule).toBeNull();
            schObj.showHeaderBar = true;
            schObj.dataBind();
        });
        it('alt one day view', () => {
            schObj.element.focus();
            keyModule.keyActionHandler({ action: 'altOne', key: '1' });
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-day');
        });
        it('alt two week view', () => {
            schObj.element.focus();
            keyModule.keyActionHandler({ action: 'altTwo', key: '2' });
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-week');
        });
        it('alt three work week view', () => {
            schObj.element.focus();
            keyModule.keyActionHandler({ action: 'altThree', key: '3' });
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-work-week');
        });
        it('alt four month view', () => {
            schObj.element.focus();
            keyModule.keyActionHandler({ action: 'altFour', key: '4' });
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-month');
        });
        it('alt five agenda view', () => {
            schObj.element.focus();
            keyModule.keyActionHandler({ action: 'altFive', key: '5' });
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-agenda');
        });
        it('tab key', () => {
            schObj.element.focus();
            keyModule.keyActionHandler({
                action: 'tab', target: schObj.element,
                shiftKey: false, preventDefault: (): void => { /** Null */ }
            });
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-agenda');
            schObj.currentView = 'Day';
            schObj.dataBind();
        });
        it ('Es-832039 - keyboard arrow keys scroll action will move the selected cell beyond viewport', () => {
            const scrollTop: number = schObj.element.querySelector('.e-content-wrap').scrollTop;
            const workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            workCells[18].click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'downArrow', target: workCells[18], preventDefault: (): void => { /** Null */ } });
            expect(schObj.element.querySelector('.e-content-wrap').scrollTop).toBe(scrollTop);
            keyModule.keyActionHandler({ action: 'upArrow', target: workCells[19], preventDefault: (): void => { /** Null */ } });
            expect(schObj.element.querySelector('.e-content-wrap').scrollTop).toBe(scrollTop);
        });
    });

    describe('vertical view with appointments', () => {
        let schObj: Schedule;
        let keyModule: any;
        beforeAll((done: DoneFn) => {
            const elem: HTMLElement = createElement('div', { id: 'Schedule', attrs: { tabIndex: '1' } });
            const schOptions: ScheduleModel = { selectedDate: new Date(2017, 10, 2) };
            schObj = util.createSchedule(schOptions, defaultData, done, elem);
            keyModule = schObj.keyboardInteractionModule;
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Tab key work cell to appointment selection', () => {
            const allDayRowCells: HTMLElement[] = [].slice.call(schObj.element.querySelector('.e-all-day-row').children);
            const workCell: HTMLElement = allDayRowCells[0] as HTMLElement;
            workCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'tab', target: workCell, shiftKey: false, preventDefault: (): void => { /** Null */ } });
            let target: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-border'));
            expect(target.length).toEqual(1);
            keyModule.keyActionHandler({ action: 'tab', target: target[0], shiftKey: false, preventDefault: (): void => { /** Null */ } });
            expect(target[0].classList.contains('e-appointment-border')).toEqual(false);
            target = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            keyModule.keyActionHandler({ action: 'tab', target: target[0], shiftKey: true, preventDefault: (): void => { /** Null */ } });
            expect(target[0].getAttribute('data-guid')).not.toEqual(document.activeElement.getAttribute('data-guid'));
            target = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            keyModule.keyActionHandler({
                action: 'tab', target: target.slice(-1)[0],
                shiftKey: false, preventDefault: (): void => { /** Null */ }
            });
            expect(target.slice(-1)[0].getAttribute('data-guid')).not.toEqual(document.activeElement.getAttribute('data-guid'));
        });
        it('Escape key', () => {
            (schObj.element.querySelector('.e-appointment') as HTMLElement).click();
            const firstWorkCell: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-border'));
            expect(firstWorkCell[0].classList).toContain('e-appointment-border');
            keyModule.keyActionHandler({ action: 'enter', target: firstWorkCell[0] });
            const popup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(popup.classList.contains('e-popup-open')).toEqual(true);
            keyModule.keyActionHandler({ action: 'escape' });
            expect(schObj.element.querySelectorAll('.e-appointment-border').length).toEqual(1);
        });
        it('Enter key', () => {
            util.triggerMouseEvent(schObj.element.querySelector('.e-appointment'), 'click');
            keyModule.keyActionHandler({ action: 'escape' });
            const firstWorkCell: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-border'));
            expect(firstWorkCell[0].classList).toContain('e-appointment-border');
            keyModule.keyActionHandler({ action: 'enter', target: firstWorkCell[0] });
            const popup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(popup.classList).toContain('e-popup-open');
            keyModule.keyActionHandler({ action: 'escape' });
            expect(popup.classList).toContain('e-popup-close');
            keyModule.keyActionHandler({ action: 'enter', target: schObj.element.querySelector('.e-work-cells') });
            expect(popup.classList).toContain('e-popup-open');
            keyModule.keyActionHandler({ action: 'escape' });
            expect(popup.classList).toContain('e-popup-close');
        });
        it('Enter key for edit option', () => {
            const appointments: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            appointments[0].click();
            let popup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(popup).toBeTruthy();
            keyModule.keyActionHandler({
                action: 'enter', target: popup.querySelector('.e-event-edit'),
                shiftKey: false, preventDefault: (): void => { /** Null */ }
            });
            const cancelButton: HTMLElement = schObj.eventWindow.dialogObject.element.querySelector('.e-event-cancel') as HTMLElement;
            cancelButton.click();
            expect(schObj.element.querySelectorAll('.e-appointment-border').length).toEqual(1);
            appointments[0].click();
            popup = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(popup).toBeTruthy();
            keyModule.keyActionHandler({
                action: 'enter', target: popup.querySelector('.e-event-delete'),
                shiftKey: false, preventDefault: (): void => { /** Null */ }
            });
            expect(schObj.element.querySelectorAll('.e-appointment-border').length).toEqual(1);
            (<HTMLElement>schObj.quickPopup.quickDialog.element.querySelector('.e-dlg-closeicon-btn')).click();
            expect(schObj.element.querySelectorAll('.e-appointment-border').length).toEqual(1);
        });
        it('Enter key to work cell for create option', () => {
            const firstWorkCell: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            expect(firstWorkCell[firstWorkCell.length - 10].classList).not.toContain('e-selected-cell');
            expect(firstWorkCell[firstWorkCell.length - 10].getAttribute('aria-selected')).toEqual('false');
            firstWorkCell[firstWorkCell.length - 10].click();
            let popup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(popup.classList).toContain('e-popup-open');
            keyModule.keyActionHandler({
                action: 'enter', target: popup.querySelector('.e-event-details'),
                shiftKey: false, preventDefault: (): void => { /** Null */ }
            });
            const cancelButton: HTMLElement = schObj.eventWindow.dialogObject.element.querySelector('.e-event-cancel') as HTMLElement;
            cancelButton.click();
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            firstWorkCell[firstWorkCell.length - 10].click();
            popup = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(popup.classList).toContain('e-popup-open');
            keyModule.keyActionHandler({
                action: 'enter', target: popup.querySelector('.e-event-create'),
                shiftKey: false, preventDefault: (): void => { /** Null */ }
            });
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            firstWorkCell[firstWorkCell.length - 10].click();
            popup = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(popup.classList).toContain('e-popup-open');
            keyModule.keyActionHandler({
                action: 'enter', target: popup.querySelector('.e-subject'),
                shiftKey: false, preventDefault: (): void => { /** Null */ }
            });
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
        });
        it('ShiftTab key work cell to appointment selection', () => {
            const allDayRowCells: HTMLElement[] = [].slice.call(schObj.element.querySelector('.e-all-day-row').children);
            const workCell: HTMLElement = allDayRowCells[allDayRowCells.length - 1] as HTMLElement;
            workCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({
                action: 'shiftTab', target: workCell,
                shiftKey: true, preventDefault: (): void => { /** Null */ }
            });
            expect(schObj.element.querySelectorAll('.e-appointment-border').length).toEqual(1);
        });
        it('multiple event selection via ctrl plus click', () => {
            const firstWorkCell: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            firstWorkCell[0].click();
            util.triggerMouseEvent(firstWorkCell[1], 'click', 0, 0, false, true);
            expect(schObj.element.querySelectorAll('.e-appointment-border').length).toEqual(2);
            util.triggerMouseEvent(firstWorkCell[1], 'click', 0, 0, false, true);
            expect(schObj.element.querySelectorAll('.e-appointment-border').length).toEqual(1);
            keyModule.keyActionHandler({ action: 'escape' });
        });
        it('Delete key', () => {
            (schObj.element.querySelector('.e-appointment') as HTMLElement).click();
            expect(schObj.element.querySelectorAll('.e-appointment-border').length).toEqual(1);
            const selectedElement: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-border'));
            expect(selectedElement[0].classList).toContain('e-appointment-border');
            keyModule.keyActionHandler({ action: 'delete', target: selectedElement[0] });
            expect(schObj.element.querySelectorAll('.e-appointment-border').length).toEqual(1);
            (<HTMLElement>schObj.quickPopup.quickDialog.element.querySelector('.e-dlg-closeicon-btn')).click();
        });
        it('Right arrow key with appointment selection', () => {
            (schObj.element.querySelector('.e-appointment') as HTMLElement).click();
            expect(schObj.element.querySelectorAll('.e-appointment-border').length).toEqual(1);
            const selectedElement: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-border'));
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'rightArrow', target: selectedElement[0] });
            expect(schObj.element.querySelectorAll('.e-appointment-border').length).toEqual(0);
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
        });
        it('Left arrow key with appointment selection', () => {
            (schObj.element.querySelector('.e-appointment') as HTMLElement).click();
            expect(schObj.element.querySelectorAll('.e-appointment-border').length).toEqual(1);
            const selectedElement: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-border'));
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'leftArrow', target: selectedElement[0] });
            expect(schObj.element.querySelectorAll('.e-appointment-border').length).toEqual(0);
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
        });
        it('Tab/shift key for event edit option', () => {
            (schObj.element.querySelector('.e-appointment') as HTMLElement).click();
            const popup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(popup).toBeTruthy();
            keyModule.keyActionHandler({
                action: 'tab', target: popup.querySelector('.e-event-edit'),
                shiftKey: false, preventDefault: (): void => { /** Null */ }
            });
            expect(schObj.element.querySelectorAll('.e-appointment-border').length).toEqual(1);
            keyModule.keyActionHandler({
                action: 'tab', target: popup.querySelector('.e-event-delete'),
                shiftKey: false, preventDefault: (): void => { /** Null */ }
            });
            expect(schObj.element.querySelectorAll('.e-appointment-border').length).toEqual(1);
            keyModule.keyActionHandler({
                action: 'tab', target: popup.querySelector('.e-event-edit'),
                shiftKey: false, preventDefault: (): void => { /** Null */ }
            });
        });
        it('Tab/shift key to work cell for create option', () => {
            const firstWorkCell: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            expect(firstWorkCell[0].classList).not.toContain('e-selected-cell');
            expect(firstWorkCell[0].getAttribute('aria-selected')).toEqual('false');
            firstWorkCell[0].click();
            const popup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(popup).toBeTruthy();
            keyModule.keyActionHandler({
                action: 'tab', target: popup.querySelector('.e-event-create'),
                shiftKey: false, preventDefault: (): void => { /** Null */ }
            });
            keyModule.keyActionHandler({
                action: 'tab', target: popup.querySelector('.e-subject'),
                shiftKey: false, preventDefault: (): void => { /** Null */ }
            });
            keyModule.keyActionHandler({
                action: 'tab', target: popup.querySelector('.e-event-details'),
                shiftKey: false, preventDefault: (): void => { /** Null */ }
            });
            keyModule.keyActionHandler({
                action: 'tab', target: popup.querySelector('.e-event-create'),
                shiftKey: true, preventDefault: (): void => { /** Null */ }
            });
            keyModule.keyActionHandler({
                action: 'tab', target: popup.querySelector('.e-subject'),
                shiftKey: true, preventDefault: (): void => { /** Null */ }
            });
            keyModule.keyActionHandler({
                action: 'tab', target: popup.querySelector('.e-event-details'),
                shiftKey: true, preventDefault: (): void => { /** Null */ }
            });
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
        });
        it('Escape key without header bar', () => {
            expect(schObj.headerModule).not.toBeNull();
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('Oct 29 - Nov 04, 2017');
            expect(schObj.element.querySelectorAll('.e-schedule-toolbar').length).toEqual(1);
            expect(schObj.element.querySelectorAll('.e-toolbar-item').length).toEqual(10);
            schObj.showHeaderBar = false;
            schObj.dataBind();
            expect(schObj.headerModule).toBeNull();
            expect(schObj.element.querySelectorAll('.e-schedule-toolbar-container').length).toEqual(0);
            expect(schObj.element.querySelectorAll('.e-schedule-toolbar').length).toEqual(0);
            (schObj.element.querySelector('.e-appointment') as HTMLElement).click();
            keyModule.keyActionHandler({ action: 'escape' });
        });
        it('Negative case for Tab key work cell selection', () => {
            const allDayRowCells: HTMLElement[] = [].slice.call(schObj.element.querySelector('.e-all-day-row').children);
            expect(allDayRowCells.length).toEqual(7);
            const workCell: HTMLElement = allDayRowCells[0] as HTMLElement;
            workCell.click();
            const cellPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(cellPopup.classList).toContain('e-popup-open');
            expect(cellPopup.children[0].classList).toContain('e-cell-popup');
            keyModule.keyActionHandler({ action: 'escape' });
            expect(cellPopup.classList).toContain('e-popup-close');
            workCell.classList.remove('e-selected-cell');
            keyModule.keyActionHandler({ action: 'tab', target: workCell, shiftKey: false, preventDefault: (): void => { /** Null */ } });
        });
    });
    describe('vertical view with appointments-month view', () => {
        let schObj: Schedule;
        let keyModule: any;
        beforeAll((done: DoneFn) => {
            const elem: HTMLElement = createElement('div', { id: 'Schedule', attrs: { tabIndex: '1' } });
            const schOptions: ScheduleModel = { currentView: 'Month', selectedDate: new Date(2017, 10, 2) };
            schObj = util.createSchedule(schOptions, defaultData, done, elem);
            keyModule = schObj.keyboardInteractionModule;
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Escape key', () => {
            const moreIndicator: HTMLElement = schObj.element.querySelector('.e-more-indicator') as HTMLElement;
            moreIndicator.click();
            const popup: HTMLElement = schObj.element.querySelector('.e-more-popup-wrapper') as HTMLElement;
            expect(popup).toBeTruthy();
            expect(popup.classList.contains('e-popup-open')).toBe(true);
            expect(schObj.element.querySelectorAll('.e-appointment-border').length).toEqual(0);
            (popup.querySelector('.e-header-date') as HTMLElement).focus();
            keyModule.keyActionHandler({
                action: 'tab', target: popup.querySelector('.e-header-date'),
                shiftKey: false, preventDefault: (): void => { /** Null */ }
            });
            keyModule.keyActionHandler({ action: 'escape' });
            expect(popup).toBeTruthy();
            expect(popup.classList.contains('e-popup-close')).toBe(true);
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
        });
        it('Enter key to close more event list', () => {
            const moreIndicator: HTMLElement = schObj.element.querySelector('.e-more-indicator') as HTMLElement;
            moreIndicator.click();
            const popup: HTMLElement = schObj.element.querySelector('.e-more-popup-wrapper') as HTMLElement;
            expect(popup).toBeTruthy();
            expect(popup.classList.contains('e-popup-open')).toBe(true);
            keyModule.keyActionHandler({ action: 'enter', target: popup.querySelector('.e-more-event-close') });
            expect(popup).toBeTruthy();
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
        });
        it('Tab key for more event list', () => {
            const moreIndicator: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
            moreIndicator[1].click();
            const popup: HTMLElement = schObj.element.querySelector('.e-more-popup-wrapper') as HTMLElement;
            expect(popup.classList.contains('e-popup-open')).toBe(true);
            const apps: HTMLElement[] = [].slice.call(popup.querySelectorAll('.e-appointment'));
            apps[apps.length - 1].focus();
            keyModule.keyActionHandler({
                action: 'tab', target: apps[apps.length - 1],
                shiftKey: false, preventDefault: (): void => { /** Null */ }
            });
            expect(document.activeElement.classList).toContain('e-more-event-close');
            keyModule.keyActionHandler({ action: 'escape' });
            expect(popup.classList.contains('e-popup-open')).toBe(false);
        });
        it('Shift Tab key for more event list', () => {
            const moreIndicator: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
            moreIndicator[1].click();
            const popup: HTMLElement = schObj.element.querySelector('.e-more-popup-wrapper') as HTMLElement;
            expect(popup.classList.contains('e-popup-open')).toBe(true);
            (popup.querySelector('.e-more-event-close') as HTMLElement).focus();
            keyModule.keyActionHandler({
                action: 'shiftTab', target: popup.querySelector('.e-more-event-close'),
                shiftKey: true, preventDefault: (): void => { /** Null */ }
            });
            expect(document.activeElement.classList).toContain('e-appointment');
            keyModule.keyActionHandler({
                action: 'shiftTab', target: document.activeElement,
                shiftKey: true, preventDefault: (): void => { /** Null */ }
            });
            expect(document.activeElement.classList).toContain('e-appointment');
            keyModule.keyActionHandler({ action: 'escape' });
            expect(popup).toBeTruthy();
            expect(popup.classList.contains('e-popup-open')).toBe(false);
        });
        it('Enter key to change current view', () => {
            const moreIndicator: HTMLElement = schObj.element.querySelector('.e-more-indicator') as HTMLElement;
            moreIndicator.click();
            const popup: HTMLElement = schObj.element.querySelector('.e-more-popup-wrapper') as HTMLElement;
            expect(popup).toBeTruthy();
            expect(popup.classList.contains('e-popup-open')).toBe(true);
            keyModule.keyActionHandler({ action: 'enter', target: popup.querySelector('.e-header-date') });
            expect(popup).toBeTruthy();
            expect(popup.classList.contains('e-popup-open')).toBe(false);
        });
    });

    describe('vertical view with appointments for agenda view', () => {
        let schObj: Schedule;
        let keyModule: any;
        beforeAll((done: DoneFn) => {
            const elem: HTMLElement = createElement('div', { id: 'Schedule', attrs: { tabIndex: '1' } });
            const schOptions: ScheduleModel = { width: '100%', height: '500px', currentView: 'Agenda', selectedDate: new Date(2017, 10, 2) };
            schObj = util.createSchedule(schOptions, defaultData, done, elem);
            keyModule = schObj.keyboardInteractionModule;
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('ensure module name', () => {
            expect(keyModule.getModuleName()).toEqual('keyboard');
        });
        it('Down key press', () => {
            schObj.element.focus();
            const firstWorkCell: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(firstWorkCell[0].classList).not.toContain('e-appointment-border');
            keyModule.keyActionHandler({ action: 'downArrow', target: schObj.element });
            expect(schObj.element.querySelectorAll('.e-appointment-border').length).toEqual(1);
            keyModule.keyActionHandler({ action: 'downArrow', target: schObj.element });
            expect(schObj.element.querySelectorAll('.e-appointment-border').length).toEqual(1);
            keyModule.keyActionHandler({ action: 'downArrow', target: schObj.element });
            expect(schObj.element.querySelectorAll('.e-appointment-border').length).toEqual(1);
        });
        it('Up key press', () => {
            const firstWorkCell: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-border'));
            expect(firstWorkCell[0].classList).toContain('e-appointment-border');
            expect(schObj.element.querySelectorAll('.e-appointment-border').length).toEqual(1);
            keyModule.keyActionHandler({ action: 'upArrow', target: schObj.element });
            expect(schObj.element.querySelectorAll('.e-appointment-border').length).toEqual(1);
            keyModule.keyActionHandler({ action: 'upArrow', target: schObj.element });
            expect(schObj.element.querySelectorAll('.e-appointment-border').length).toEqual(1);
        });
        it('Right arrow key with appointment selection', () => {
            const selectedElement: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-border'));
            expect(schObj.element.querySelectorAll('.e-active-appointment-agenda').length).toEqual(1);
            expect(schObj.element.querySelectorAll('.e-appointment-border').length).toEqual(1);
            keyModule.keyActionHandler({ action: 'rightArrow', target: selectedElement[0] });
        });
    });

    describe('vertical arrow keys', () => {
        let schObj: Schedule;
        let keyModule: any;
        beforeAll((done: DoneFn) => {
            const schOptions: ScheduleModel = { selectedDate: new Date(2017, 9, 4) };
            schObj = util.createSchedule(schOptions, [], done);
            keyModule = schObj.keyboardInteractionModule;
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('multiple cell selection via shift plus click', () => {
            const workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            keyModule.initialTarget = workCells[2];
            util.triggerMouseEvent(workCells[17], 'click', 0, 0, true);
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(53);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(3);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(2);
            keyModule.keyActionHandler({ action: 'enter', target: focuesdEle });
        });
        it('multiple work cells selection via mouse', () => {
            const workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            util.triggerMouseEvent(workCells[2], 'mousedown');
            util.triggerMouseEvent(workCells[17], 'mousemove');
            util.triggerMouseEvent(workCells[17], 'mouseup');
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(53);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(3);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(2);
            keyModule.keyActionHandler({ action: 'enter', target: focuesdEle });
        });
        it('multiple allday cells selection via mouse', () => {
            const alldayCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-container .e-all-day-cells'));
            util.triggerMouseEvent(alldayCells[2], 'mousedown');
            util.triggerMouseEvent(alldayCells[4], 'mousemove');
            util.triggerMouseEvent(alldayCells[4], 'mouseup');
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(3);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-all-day-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(4);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(1);
            keyModule.keyActionHandler({ action: 'enter', target: focuesdEle });
        });
        it('mouse move out of schedule while selection via mouse', () => {
            const workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            util.triggerMouseEvent(workCells[2], 'mousedown');
            util.triggerMouseEvent(schObj.element.querySelector('.e-time-cells') as HTMLElement, 'mousemove');
            util.triggerMouseEvent(workCells[29], 'mousemove');
            util.triggerMouseEvent(workCells[29], 'mouseup');
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(45);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(1);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(4);
            keyModule.keyActionHandler({ action: 'enter', target: focuesdEle });
            keyModule.keyActionHandler({ action: 'escape' });
        });
        it('down arrow', () => {
            keyModule.keyActionHandler({ action: 'home' });
            const targetCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
            keyModule.keyActionHandler({ action: 'downArrow', target: targetCell, preventDefault: (): void => { /** Null */ } });
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(0);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(1);
        });
        it('down arrow - last row cell', () => {
            const target: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[335] as HTMLElement;
            target.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'downArrow', target: target });
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(6);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(47);
        });
        it('down arrow - all day row cell', () => {
            const target: HTMLElement = schObj.element.querySelectorAll('.e-all-day-cells')[3] as HTMLElement;
            target.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'downArrow', target: target });
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-all-day-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(2);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(1);
        });
        it('up arrow', () => {
            const targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[18] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'upArrow', target: targetCell, preventDefault: (): void => { /** Null */ } });
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(4);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(1);
        });
        it('up arrow first row cell', () => {
            const targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[1] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'upArrow', target: targetCell });
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(1);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
        it('up arrow - last row cell', () => {
            const target: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[335] as HTMLElement;
            target.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'upArrow', target: target, preventDefault: (): void => { /** Null */ } });
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(6);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(46);
        });
        it('up arrow - all day row cell', () => {
            const target: HTMLElement = schObj.element.querySelectorAll('.e-all-day-cells')[3] as HTMLElement;
            target.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'upArrow', target: target });
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-all-day-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(2);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(1);
        });
        it('right arrow', () => {
            const targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[18] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'rightArrow', target: targetCell });
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(5);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(2);
        });
        it('right arrow first row cell', () => {
            const targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[1] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'rightArrow', target: targetCell });
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(2);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
        it('right arrow - last work cell next navigation', () => {
            const target: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[335] as HTMLElement;
            target.click();
            keyModule.keyActionHandler({ action: 'escape' });
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('October 01 - 07, 2017');
            keyModule.keyActionHandler({ action: 'rightArrow', target: target });
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('October 08 - 14, 2017');
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(0);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(47);
        });
        it('right arrow - last allday cell next navigation', () => {
            const target: HTMLElement = schObj.element.querySelectorAll('.e-date-header-container .e-all-day-cells')[6] as HTMLElement;
            target.click();
            keyModule.keyActionHandler({ action: 'escape' });
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('October 08 - 14, 2017');
            keyModule.keyActionHandler({ action: 'rightArrow', target: target });
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('October 15 - 21, 2017');
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-all-day-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(0);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(1);
        });
        it('right arrow - all day row cell', () => {
            const target: HTMLElement = schObj.element.querySelectorAll('.e-all-day-cells')[3] as HTMLElement;
            target.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'rightArrow', target: target });
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-all-day-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(3);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(1);
        });
        it('left arrow', () => {
            const targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[18] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'leftArrow', target: targetCell });
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(3);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(2);
        });
        it('left arrow first work cell previous navigation', () => {
            const targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('October 15 - 21, 2017');
            keyModule.keyActionHandler({ action: 'leftArrow', target: targetCell });
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('October 08 - 14, 2017');
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(6);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
        it('left arrow first allday cell previous navigation', () => {
            const targetCell: HTMLElement = schObj.element.querySelectorAll('.e-date-header-container .e-all-day-cells')[0] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('October 08 - 14, 2017');
            keyModule.keyActionHandler({ action: 'leftArrow', target: targetCell });
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('October 01 - 07, 2017');
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-all-day-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(6);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(1);
        });
        it('left arrow - last row cell', () => {
            const target: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[335] as HTMLElement;
            target.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'leftArrow', target: target });
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(5);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(47);
        });
        it('left arrow - all day row cell', () => {
            const target: HTMLElement = schObj.element.querySelectorAll('.e-all-day-cells')[3] as HTMLElement;
            target.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'leftArrow', target: target });
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-all-day-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(1);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(1);
        });
        it('shiftDown arrow', () => {
            const targetCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = targetCell;
            keyModule.keyActionHandler({ action: 'shiftDownArrow', shiftKey: true, target: targetCell, preventDefault: (): void => { /** Null */ } });
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(2);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(0);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(1);
            keyModule.keyActionHandler({ action: 'shiftDownArrow', shiftKey: true, target: focuesdEle, preventDefault: (): void => { /** Null */ } });
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(3);
        });
        it('shiftDown arrow - last row cell', () => {
            const target: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[335] as HTMLElement;
            target.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = target;
            keyModule.keyActionHandler({ action: 'shiftDownArrow', shiftKey: true, target: target });
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(6);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(47);
        });
        it('shiftDown arrow - all day row cell', () => {
            const target: HTMLElement = schObj.element.querySelectorAll('.e-all-day-cells')[3] as HTMLElement;
            target.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = target;
            keyModule.keyActionHandler({ action: 'shiftDownArrow', shiftKey: true, target: target });
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-all-day-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(2);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(1);
        });
        it('shiftUp arrow', () => {
            const targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[18] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = targetCell;
            keyModule.keyActionHandler({ action: 'shiftUpArrow', shiftKey: true, target: targetCell, preventDefault: (): void => { /** Null */ } });
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(2);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(4);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(1);
        });
        it('shiftUp arrow first row cell', () => {
            const targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[1] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = targetCell;
            keyModule.keyActionHandler({ action: 'shiftUpArrow', shiftKey: true, target: targetCell });
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(1);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
        it('shiftUp arrow - last row cell', () => {
            const target: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[335] as HTMLElement;
            target.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = target;
            keyModule.keyActionHandler({ action: 'shiftUpArrow', shiftKey: true, target: target, preventDefault: (): void => { /** Null */ } });
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(2);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(6);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(46);
        });
        it('shiftUp arrow - all day row cell', () => {
            const target: HTMLElement = schObj.element.querySelectorAll('.e-all-day-cells')[3] as HTMLElement;
            target.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = target;
            keyModule.keyActionHandler({ action: 'shiftUpArrow', shiftKey: true, target: target });
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-all-day-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(2);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(1);
        });
        it('shiftRight arrow', () => {
            const targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[18] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = targetCell;
            keyModule.keyActionHandler({ action: 'shiftRightArrow', shiftKey: true, target: targetCell });
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(51);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(5);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(2);
            keyModule.keyActionHandler({ action: 'shiftRightArrow', shiftKey: true, target: document.activeElement });
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(100);
        });
        it('shiftRight arrow - prevent last work cell next navigation', () => {
            const target: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[335] as HTMLElement;
            target.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = target;
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('October 01 - 07, 2017');
            keyModule.keyActionHandler({ action: 'shiftRightArrow', shiftKey: true, target: target });
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('October 01 - 07, 2017');
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(6);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(47);
        });
        it('shiftRight arrow - last allday cell next navigation', () => {
            const target: HTMLElement = schObj.element.querySelectorAll('.e-date-header-container .e-all-day-cells')[6] as HTMLElement;
            target.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = target;
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('October 01 - 07, 2017');
            keyModule.keyActionHandler({ action: 'shiftRightArrow', shiftKey: true, target: target });
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('October 01 - 07, 2017');
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-all-day-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(6);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(1);
        });
        it('shiftRight arrow - all day row cell', () => {
            const target: HTMLElement = schObj.element.querySelectorAll('.e-all-day-cells')[3] as HTMLElement;
            target.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = target;
            keyModule.keyActionHandler({ action: 'shiftRightArrow', shiftKey: true, target: target });
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(2);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-all-day-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(3);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(1);
        });
        it('shiftLeft arrow', () => {
            const targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[18] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = targetCell;
            keyModule.keyActionHandler({ action: 'shiftLeftArrow', shiftKey: true, target: targetCell });
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(51);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(3);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(2);
            keyModule.keyActionHandler({ action: 'shiftLeftArrow', shiftKey: true, target: focuesdEle });
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(100);
        });
        it('shiftLeft arrow first work cell prevent previous navigation', () => {
            const targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = targetCell;
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('October 01 - 07, 2017');
            keyModule.keyActionHandler({ action: 'shiftLeftArrow', shiftKey: true, target: targetCell });
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('October 01 - 07, 2017');
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(0);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
        it('shiftLeft arrow first allday cell prevent previous navigation', () => {
            const targetCell: HTMLElement = schObj.element.querySelectorAll('.e-date-header-container .e-all-day-cells')[0] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = targetCell;
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('October 01 - 07, 2017');
            keyModule.keyActionHandler({ action: 'shiftLeftArrow', shiftKey: true, target: targetCell });
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('October 01 - 07, 2017');
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-all-day-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(0);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(1);
        });
        it('shiftLeft arrow - last row cell', () => {
            const target: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[335] as HTMLElement;
            target.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = target;
            keyModule.keyActionHandler({ action: 'shiftLeftArrow', shiftKey: true, target: target });
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(51);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(5);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(47);
        });
        it('shiftLeft arrow - all day row cell', () => {
            const target: HTMLElement = schObj.element.querySelectorAll('.e-all-day-cells')[3] as HTMLElement;
            target.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = target;
            keyModule.keyActionHandler({ action: 'shiftLeftArrow', shiftKey: true, target: target });
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(2);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-all-day-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(1);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(1);
        });
    });

    describe('vertical month view arrow keys', () => {
        let schObj: Schedule;
        let keyModule: any;
        beforeAll((done: DoneFn) => {
            const schOptions: ScheduleModel = { selectedDate: new Date(2017, 9, 4), currentView: 'Month' };
            schObj = util.createSchedule(schOptions, [], done);
            keyModule = schObj.keyboardInteractionModule;
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('multiple cell selection via shift plus click', () => {
            const workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            keyModule.initialTarget = workCells[2];
            util.triggerMouseEvent(workCells[12], 'mousedown', 0, 0, true);
            util.triggerMouseEvent(workCells[12], 'click', 0, 0, true);
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(11);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(5);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(1);
            keyModule.keyActionHandler({ action: 'enter', target: focuesdEle });
            keyModule.keyActionHandler({ action: 'escape' });
        });
        it('multiple work cells selection via mouse', () => {
            const workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            util.triggerMouseEvent(workCells[3], 'mousedown');
            util.triggerMouseEvent(workCells[18], 'mousemove');
            util.triggerMouseEvent(workCells[18], 'mouseup');
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(16);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(4);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(2);
            keyModule.keyActionHandler({ action: 'enter', target: focuesdEle });
        });
        it('down arrow', () => {
            const targetCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'downArrow', target: targetCell, preventDefault: (): void => { /** Null */ } });
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(0);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(1);
        });
        it('down arrow - last row cell', () => {
            const workCell: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            const target: HTMLElement = workCell[workCell.length - 2];
            target.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'downArrow', target: target });
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(5);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).
                toEqual((target.parentNode as HTMLTableRowElement).sectionRowIndex);
        });
        it('up arrow', () => {
            const targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[3] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'upArrow', target: targetCell });
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(3);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
        it('up arrow - last row cell', () => {
            const workCell: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            const target: HTMLElement = workCell[workCell.length - 2];
            target.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'upArrow', target: target, preventDefault: (): void => { /** Null */ } });
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(5);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).
                toEqual((target.parentNode as HTMLTableRowElement).sectionRowIndex - 1);
        });
        it('right arrow', () => {
            const targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[18] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'rightArrow', target: targetCell });
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(5);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(2);
            keyModule.keyActionHandler({ action: 'rightArrow', target: schObj.element.querySelector('.e-header-cells') });
        });
        it('right arrow first row last cell', () => {
            const targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[6] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'rightArrow', target: targetCell });
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(0);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(1);
        });
        it('right arrow - last work cell next navigation', () => {
            const workCell: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            const target: HTMLElement = workCell[workCell.length - 1];
            target.click();
            keyModule.keyActionHandler({ action: 'escape' });
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('October 2017');
            keyModule.keyActionHandler({ action: 'rightArrow', target: target });
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('November 2017');
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(0);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
        it('left arrow', () => {
            const targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[5] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'leftArrow', target: targetCell });
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(4);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
            keyModule.keyActionHandler({ action: 'leftArrow', target: schObj.element.querySelector('.e-header-cells') });
        });
        it('left arrow second row first cell', () => {
            const targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[7] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'leftArrow', target: targetCell });
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(6);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
        it('left arrow first work cell previous navigation', () => {
            const targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('November 2017');
            keyModule.keyActionHandler({ action: 'leftArrow', target: targetCell });
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('October 2017');
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(6);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(4);
        });
        it('shiftDown arrow', () => {
            const targetCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = targetCell;
            keyModule.keyActionHandler({ action: 'shiftDownArrow', shiftKey: true, target: targetCell, preventDefault: (): void => { /** Null */ } });
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(8);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(0);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(1);
        });
        it('shiftUp arrow', () => {
            const targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[18] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = targetCell;
            keyModule.keyActionHandler({ action: 'shiftUpArrow', shiftKey: true, target: targetCell, preventDefault: (): void => { /** Null */ } });
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(8);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(4);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(1);
        });
        it('shiftRight arrow', () => {
            const targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[4] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = targetCell;
            keyModule.keyActionHandler({ action: 'shiftRightArrow', shiftKey: true, target: targetCell });
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(2);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(5);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
            keyModule.keyActionHandler({ action: 'shiftRightArrow', shiftKey: true, target: document.activeElement });
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(3);
        });
        it('shiftRight arrow - prevent last work cell next navigation', () => {
            const workCell: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            const target: HTMLElement = workCell[workCell.length - 1];
            target.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = target;
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('October 2017');
            keyModule.keyActionHandler({ action: 'shiftRightArrow', shiftKey: true, target: target });
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('October 2017');
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(6);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(4);
        });
        it('shiftLeft arrow', () => {
            const targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[4] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = targetCell;
            keyModule.keyActionHandler({ action: 'shiftLeftArrow', shiftKey: true, target: targetCell });
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(2);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(3);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
            keyModule.keyActionHandler({ action: 'shiftLeftArrow', shiftKey: true, target: focuesdEle });
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(3);
        });
        it('shiftLeft arrow first work cell prevent previous navigation', () => {
            const targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = targetCell;
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('October 2017');
            keyModule.keyActionHandler({ action: 'shiftLeftArrow', shiftKey: true, target: targetCell });
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('October 2017');
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(0);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
    });

    describe('Cell selection with Resource', () => {
        let schObj: Schedule;
        let keyModule: any;
        beforeAll((done: DoneFn) => {
            const schOptions: ScheduleModel = {
                width: '100%',
                height: '550px',
                currentView: 'Month',
                selectedDate: new Date(2017, 9, 4),
                group: { resources: ['Rooms', 'Owners'] },
                resources: [{
                    field: 'RoomId', title: 'Room', name: 'Rooms', allowMultiple: false,
                    dataSource: [
                        { RoomText: 'ROOM 1', Id: 1, RoomColor: '#cb6bb2' },
                        { RoomText: 'ROOM 2', Id: 2, RoomColor: '#56ca85' }
                    ],
                    textField: 'RoomText', idField: 'Id', colorField: 'RoomColor'
                }, {
                    field: 'OwnerId', title: 'Owner', name: 'Owners', allowMultiple: true,
                    dataSource: [
                        { OwnerText: 'Nancy', Id: 1, OwnerGroupId: 1, OwnerColor: '#ffaa00' },
                        { OwnerText: 'Steven', Id: 2, OwnerGroupId: 2, OwnerColor: '#f8a398' },
                        { OwnerText: 'Michael', Id: 3, OwnerGroupId: 1, OwnerColor: '#7499e1' }
                    ],
                    textField: 'OwnerText', idField: 'Id', groupIDField: 'OwnerGroupId', colorField: 'OwnerColor'
                }],
                dataBound: () => {
                    keyModule = schObj.keyboardInteractionModule;
                    done();
                }
            };
            schObj = util.createSchedule(schOptions, []);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('shiftRight arrow', () => {
            const targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[6] as HTMLElement;
            targetCell.click();
            keyModule.initialTarget = targetCell;
            keyModule.keyActionHandler({ action: 'shiftRightArrow', shiftKey: true, target: targetCell });
            expect(targetCell.getAttribute('data-group-index')).toEqual('0');
            const lastCell: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(lastCell.getAttribute('data-group-index')).toEqual('0');
            schObj.removeSelectedClass();
        });
        it('shiftLeft arrow', () => {
            const targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[28] as HTMLElement;
            targetCell.click();
            keyModule.initialTarget = targetCell;
            keyModule.keyActionHandler({ action: 'shiftLeftArrow', shiftKey: true, target: targetCell });
            expect(targetCell.getAttribute('data-group-index')).toEqual('1');
            const lastCell: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(lastCell.getAttribute('data-group-index')).toEqual('1');
            schObj.removeSelectedClass();
        });
        it('multiple work cells right selection via mouse', () => {
            const workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            util.triggerMouseEvent(workCells[6], 'mousedown');
            util.triggerMouseEvent(workCells[28], 'mousemove');
            util.triggerMouseEvent(workCells[28], 'mouseup');
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(8);
            expect(workCells[6].getAttribute('data-group-index')).toEqual('0');
            const lastCell: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(lastCell.getAttribute('data-group-index')).toEqual('0');
            schObj.removeSelectedClass();
        });
        it('multiple work cells left selection via mouse', () => {
            const workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            util.triggerMouseEvent(workCells[28], 'mousedown');
            util.triggerMouseEvent(workCells[6], 'mousemove');
            util.triggerMouseEvent(workCells[6], 'mouseup');
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(8);
            expect(workCells[28].getAttribute('data-group-index')).toEqual('1');
            const lastCell: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(lastCell.getAttribute('data-group-index')).toEqual('1');
            schObj.removeSelectedClass();
            schObj.currentView = 'Week';
            schObj.dataBind();
        });
        it('EJ2-69432 - select event not invoked for single cell navigation', (done: DoneFn)  => {
            const workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            util.triggerMouseEvent(workCells[406], 'click');
            keyModule.keyActionHandler({ action: 'escape' });
            schObj.select = (args: SelectEventArgs) => {
                expect(args.requestType).toBe('cellSelect');
                expect(workCells[406].classList.contains('e-selected-cell')).toBeFalsy();
                done();
            };
            expect(workCells[406].classList).toContain('e-selected-cell');
            expect(workCells[406].getAttribute('data-group-index')).toEqual('1');
            keyModule.keyActionHandler({ action: 'leftArrow', target: workCells[406] });
        });
    });

    describe('month agenda with multiple delete event', () => {
        let schObj: Schedule;
        let keyModule: any;
        beforeAll((done: DoneFn) => {
            const schOptions: ScheduleModel = {
                width: '100%', height: '500px', currentView: 'MonthAgenda',
                selectedDate: new Date(2017, 10, 5), views: ['MonthAgenda']
            };
            schObj = util.createSchedule(schOptions, defaultData, done);
            keyModule = schObj.keyboardInteractionModule;
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('work cell click', () => {
            const workCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[4] as HTMLElement;
            workCell.click();
            expect(workCell.classList).toContain('e-selected-cell');
            expect(workCell.getAttribute('aria-selected')).toEqual('true');
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
        });
        it('multiple event selection via ctrl plus click', () => {
            const appointment: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            util.triggerMouseEvent(appointment[0], 'click', 0, 0, false, true);
            expect(schObj.element.querySelectorAll('.e-appointment-border').length).toEqual(1);
            util.triggerMouseEvent(appointment[1], 'click', 0, 0, false, true);
            expect(schObj.element.querySelectorAll('.e-appointment-border').length).toEqual(2);
            const selectedElement: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-border'));
            expect(selectedElement[0].classList).toContain('e-appointment-border');
            expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(2);
            expect(schObj.element.querySelectorAll('.e-appointment-border').length).toEqual(2);
            keyModule.keyActionHandler({ action: 'delete', target: selectedElement[0] });
            (<HTMLElement>schObj.quickPopup.quickDialog.element.querySelector('.e-quick-dialog-delete')).click();
            (<HTMLElement>schObj.quickPopup.quickDialog.element.querySelector('.e-dlg-closeicon-btn')).click();
            expect(schObj.element.querySelectorAll('.e-appointment-border').length).toEqual(2);
        });
    });

    describe('View navigation', () => {
        let schObj: Schedule;
        let keyModule: any;
        beforeAll((done: DoneFn) => {
            const schOptions: ScheduleModel = {
                width: '100%',
                height: '550px',
                views: ['Day', 'Week', 'Agenda'],
                currentView: 'Day',
                selectedDate: new Date(2017, 9, 4)
            };
            schObj = util.createSchedule(schOptions, [], done);
            keyModule = schObj.keyboardInteractionModule;
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Negative case for view navigation', () => {
            schObj.element.focus();
            expect(schObj.currentView).toEqual('Day');
            expect(schObj.element.querySelectorAll('.e-toolbar-item').length).toEqual(8);
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('October 4, 2017');
            keyModule.keyActionHandler({ action: 'altFive', key: '5' });
            expect(schObj.currentView).toEqual('Day');
        });
        it('Negative case for view navigation without headerbar', () => {
            expect(schObj.headerModule).not.toBeNull();
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('October 4, 2017');
            expect(schObj.element.querySelectorAll('.e-toolbar-item').length).toEqual(8);
            schObj.showHeaderBar = false;
            schObj.dataBind();
            schObj.element.focus();
            keyModule.keyActionHandler({ action: 'altOne', key: '1' });
            expect(schObj.headerModule).toBeNull();
            expect(schObj.element.querySelectorAll('.e-schedule-toolbar-container').length).toEqual(0);
            expect(schObj.element.querySelectorAll('.e-schedule-toolbar').length).toEqual(0);
            schObj.showHeaderBar = true;
            schObj.dataBind();
        });
    });
    describe('Auto Scroll on moving via mouse', () => {
        let schObj: Schedule;
        let keyModule: any;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                width: '600px',
                height: '550px',
                views: ['Day', 'Week'],
                currentView: 'Week',
                selectedDate: new Date(2017, 9, 4)
            };
            schObj = util.createSchedule(model, [], done);
            keyModule = schObj.keyboardInteractionModule;
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('mouse up', () => {
            const workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            util.triggerMouseEvent(workCells[17], 'mousedown');
            util.triggerMouseEvent(workCells[2], 'mousemove', 280, 137);
            util.triggerMouseEvent(workCells[2], 'mouseup');
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(2);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
            keyModule.keyActionHandler({ action: 'enter', target: focuesdEle });
        });
    });
    describe('Delete action', () => {
        let schObj: Schedule;
        let keyModule: any;
        const eventDatas: Record<string, any>[] = [{
            Id: 10,
            Subject: 'rec_appointment',
            StartTime: new Date(2017, 9, 2, 9, 0),
            EndTime: new Date(2017, 9, 2, 10, 0),
            AllDay: false,
            RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=2'
        }, {
            Id: 16,
            Subject: 'normal_appointment',
            StartTime: new Date(2017, 9, 3, 10, 30),
            EndTime: new Date(2017, 9, 3, 11, 0),
            IsAllDay: false
        }];
        beforeAll((done: DoneFn) => {
            const schOptions: ScheduleModel = { width: '100%', height: '550px', selectedDate: new Date(2017, 9, 2) };
            schObj = util.createSchedule(schOptions, eventDatas, done);
            keyModule = schObj.keyboardInteractionModule;
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('deleting normal and recurrence appointment simultaneously', (done: DoneFn) => {
            schObj.dataBound = () => {
                const appointment: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(appointment.length).toEqual(0);
                done();
            };
            const appointment: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            util.triggerMouseEvent(appointment[0], 'click', 0, 0, false, true);
            util.triggerMouseEvent(appointment[1], 'click', 0, 0, false, true);
            util.triggerMouseEvent(appointment[2], 'click', 0, 0, false, true);
            expect(schObj.element.querySelectorAll('.e-appointment-border').length).toEqual(3);
            const selectedElement: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-border'));
            keyModule.keyActionHandler({ action: 'delete', target: selectedElement[0] });
            expect(schObj.quickPopup.quickDialog.element.classList.contains('e-quick-dialog')).toEqual(true);
            expect(schObj.quickPopup.quickDialog.element.querySelector('#ScheduleQuickDialog_title').innerHTML)
                .toEqual('Delete Multiple Events');
            (<HTMLElement>schObj.quickPopup.quickDialog.element.querySelector('.e-quick-dialog-delete')).click();
            (<HTMLElement>schObj.quickPopup.quickDialog.element.querySelector('.e-dlg-closeicon-btn')).click();
        });
    });
    describe('Timeline view', () => {
        let schObj: Schedule;
        let keyModule: any;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                currentView: 'TimelineWeek',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek', 'TimelineMonth', 'Agenda'],
                selectedDate: new Date(2018, 4, 1)
            };
            schObj = util.createSchedule(model, [], done);
            keyModule = schObj.keyboardInteractionModule;
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('ensure module name', () => {
            expect(keyModule.getModuleName()).toEqual('keyboard');
        });
        it('home key', () => {
            const firstWorkCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
            expect(firstWorkCell.classList).not.toContain('e-selected-cell');
            expect(firstWorkCell.getAttribute('aria-selected')).toEqual('false');
            keyModule.keyActionHandler({ action: 'home' });
            expect(firstWorkCell.classList).toContain('e-selected-cell');
            expect(firstWorkCell.getAttribute('aria-selected')).toEqual('true');
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
        });
        it('ctrl right arrow key', () => {
            schObj.element.focus();
            (schObj.headerModule.element.querySelector('.e-next button') as HTMLElement).focus();
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('Apr 29 - May 05, 2018');
            keyModule.keyActionHandler({ action: 'ctrlRightArrow' });
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('May 06 - 12, 2018');
            schObj.showHeaderBar = false;
            schObj.dataBind();
            schObj.element.focus();
            keyModule.keyActionHandler({ action: 'ctrlRightArrow' });
            expect(schObj.headerModule).toBeNull();
            schObj.showHeaderBar = true;
            schObj.dataBind();
        });
        it('ctrl left arrow key', () => {
            schObj.element.focus();
            (schObj.headerModule.element.querySelector('.e-prev button') as HTMLElement).focus();
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('May 13 - 19, 2018');
            keyModule.keyActionHandler({ action: 'ctrlLeftArrow' });
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('May 06 - 12, 2018');
            schObj.showHeaderBar = false;
            schObj.dataBind();
            schObj.element.focus();
            keyModule.keyActionHandler({ action: 'ctrlLeftArrow' });
            expect(schObj.headerModule).toBeNull();
            schObj.showHeaderBar = true;
            schObj.dataBind();
        });
        it('alt one timeline day view', () => {
            schObj.element.focus();
            keyModule.keyActionHandler({ action: 'altOne', key: '1' });
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-timeline-day');
        });
        it('alt two timeline week view', () => {
            schObj.element.focus();
            keyModule.keyActionHandler({ action: 'altTwo', key: '2' });
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-timeline-week');
        });
        it('alt three timeline work week view', () => {
            schObj.element.focus();
            keyModule.keyActionHandler({ action: 'altThree', key: '3' });
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-timeline-work-week');
        });
        it('alt four timeline month view', () => {
            schObj.element.focus();
            keyModule.keyActionHandler({ action: 'altFour', key: '4' });
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-timeline-month');
        });
        it('alt five agenda view', () => {
            schObj.element.focus();
            keyModule.keyActionHandler({ action: 'altFive', key: '5' });
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-agenda');
        });
        it('tab key', () => {
            schObj.element.focus();
            keyModule.keyActionHandler({
                action: 'tab', target: schObj.element,
                shiftKey: false, preventDefault: (): void => { /** Null */ }
            });
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-agenda');
        });
    });

    describe('View changes', () => {
        let schObj: Schedule;
        let keyModule: any;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                currentView: 'TimelineWeek',
                views: ['Day', 'Week', 'WorkWeek', 'Month', 'Agenda', 'TimelineDay', 'TimelineWeek',
                    'TimelineWorkWeek', 'TimelineMonth'],
                selectedDate: new Date(2018, 4, 1)
            };
            schObj = util.createSchedule(model, [], done);
            keyModule = schObj.keyboardInteractionModule;
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('alt six timeline day view', () => {
            schObj.element.focus();
            keyModule.keyActionHandler({ action: 'altSix', key: '6' });
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-timeline-day');
        });
        it('alt seven timeline week view', () => {
            schObj.element.focus();
            keyModule.keyActionHandler({ action: 'altSeven', key: '7' });
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-timeline-week');
        });
        it('alt eight timeline work week view', () => {
            schObj.element.focus();
            keyModule.keyActionHandler({ action: 'altEight', key: '8' });
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-timeline-work-week');
        });
        it('alt nine timeline month view', () => {
            schObj.element.focus();
            keyModule.keyActionHandler({ action: 'altNine', key: '9' });
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-timeline-month');
        });
    });

    describe('Timeline view with appointments', () => {
        let schObj: Schedule;
        let keyModule: any;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                currentView: 'TimelineWeek',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek', 'TimelineMonth', 'Agenda'],
                selectedDate: new Date(2018, 4, 1)
            };
            schObj = util.createSchedule(model, timelineData, done);
            keyModule = schObj.keyboardInteractionModule;
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Tab key work cell to appointment selection', () => {
            const workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            const workCell: HTMLElement = workCells[0] as HTMLElement;
            workCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            const eventCell: HTMLElement = schObj.element.querySelector('.e-event-table');
            keyModule.keyActionHandler({ action: 'tab', target: eventCell, shiftKey: false, preventDefault: (): void => { /** Null */ } });
            let target: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-border'));
            expect(target.length).toEqual(1);
            keyModule.keyActionHandler({ action: 'tab', target: target[0], shiftKey: false, preventDefault: (): void => { /** Null */ } });
            expect(target[0].classList.contains('e-appointment-border')).toEqual(false);
            target = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            keyModule.keyActionHandler({ action: 'tab', target: target[0], shiftKey: true, preventDefault: (): void => { /** Null */ } });
            expect(target[0].getAttribute('data-guid')).not.toEqual(document.activeElement.getAttribute('data-guid'));
            target = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            keyModule.keyActionHandler({
                action: 'tab', target: target.slice(-1)[0],
                shiftKey: false, preventDefault: (): void => { /** Null */ }
            });
            expect(target.slice(-1)[0].getAttribute('data-guid')).not.toEqual(document.activeElement.getAttribute('data-guid'));
        });
        it('Escape key', () => {
            (schObj.element.querySelector('.e-appointment') as HTMLElement).click();
            const firstWorkCell: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-border'));
            expect(firstWorkCell[0].classList).toContain('e-appointment-border');
            keyModule.keyActionHandler({ action: 'enter', target: firstWorkCell[0] });
            const popup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(popup.classList.contains('e-popup-open')).toEqual(true);
            keyModule.keyActionHandler({ action: 'escape' });
            expect(schObj.element.querySelectorAll('.e-appointment-border').length).toEqual(1);
        });
        it('Enter key', () => {
            util.triggerMouseEvent(schObj.element.querySelector('.e-appointment'), 'click');
            keyModule.keyActionHandler({ action: 'escape' });
            const firstWorkCell: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-border'));
            expect(firstWorkCell[0].classList).toContain('e-appointment-border');
            keyModule.keyActionHandler({ action: 'enter', target: firstWorkCell[0] });
            const popup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(popup.classList).toContain('e-popup-open');
            keyModule.keyActionHandler({ action: 'escape' });
            expect(popup.classList).toContain('e-popup-close');
            keyModule.keyActionHandler({ action: 'enter', target: schObj.element.querySelector('.e-work-cells') });
            expect(popup.classList).toContain('e-popup-open');
            keyModule.keyActionHandler({ action: 'escape' });
            expect(popup.classList).toContain('e-popup-close');
        });
        it('Enter key for edit option', () => {
            const appointments: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            appointments[0].click();
            let popup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(popup).toBeTruthy();
            keyModule.keyActionHandler({
                action: 'enter', target: popup.querySelector('.e-event-edit'),
                shiftKey: false, preventDefault: (): void => { /** Null */ }
            });
            const cancelButton: HTMLElement = schObj.eventWindow.dialogObject.element.querySelector('.e-event-cancel') as HTMLElement;
            cancelButton.click();
            expect(schObj.element.querySelectorAll('.e-appointment-border').length).toEqual(1);
            appointments[0].click();
            popup = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(popup).toBeTruthy();
            keyModule.keyActionHandler({
                action: 'enter', target: popup.querySelector('.e-event-delete'),
                shiftKey: false, preventDefault: (): void => { /** Null */ }
            });
            expect(schObj.element.querySelectorAll('.e-appointment-border').length).toEqual(1);
            (<HTMLElement>schObj.quickPopup.quickDialog.element.querySelector('.e-dlg-closeicon-btn')).click();
            expect(schObj.element.querySelectorAll('.e-appointment-border').length).toEqual(1);
        });
        it('Enter key to work cell for create option', () => {
            const firstWorkCell: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            expect(firstWorkCell[firstWorkCell.length - 10].classList).not.toContain('e-selected-cell');
            expect(firstWorkCell[firstWorkCell.length - 10].getAttribute('aria-selected')).toEqual('false');
            firstWorkCell[firstWorkCell.length - 10].click();
            let popup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(popup.classList).toContain('e-popup-open');
            keyModule.keyActionHandler({
                action: 'enter', target: popup.querySelector('.e-event-details'),
                shiftKey: false, preventDefault: (): void => { /** Null */ }
            });
            const cancelButton: HTMLElement = schObj.eventWindow.dialogObject.element.querySelector('.e-event-cancel') as HTMLElement;
            cancelButton.click();
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            firstWorkCell[firstWorkCell.length - 10].click();
            popup = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(popup.classList).toContain('e-popup-open');
            keyModule.keyActionHandler({
                action: 'enter', target: popup.querySelector('.e-event-create'),
                shiftKey: false, preventDefault: (): void => { /** Null */ }
            });
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            firstWorkCell[firstWorkCell.length - 10].click();
            popup = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(popup.classList).toContain('e-popup-open');
            keyModule.keyActionHandler({
                action: 'enter', target: popup.querySelector('.e-subject'),
                shiftKey: false, preventDefault: (): void => { /** Null */ }
            });
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
        });
        it('ShiftTab key work cell to appoitnment selection', () => {
            const workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-event-table .e-appointment-wrapper'));
            (workCells[0].children[0] as HTMLElement).click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({
                action: 'shiftTab', target: workCells[0],
                shiftKey: true, preventDefault: (): void => { /** Null */ }
            });
            expect(schObj.element.querySelectorAll('.e-appointment-border').length).toEqual(1);
        });
        it('multiple event selection via ctrl plus click', () => {
            const firstWorkCell: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            firstWorkCell[0].click();
            util.triggerMouseEvent(firstWorkCell[1], 'click', 0, 0, false, true);
            expect(schObj.element.querySelectorAll('.e-appointment-border').length).toEqual(2);
            util.triggerMouseEvent(firstWorkCell[1], 'click', 0, 0, false, true);
            expect(schObj.element.querySelectorAll('.e-appointment-border').length).toEqual(1);
            keyModule.keyActionHandler({ action: 'escape' });
        });
        it('Delete key', () => {
            (schObj.element.querySelector('.e-appointment') as HTMLElement).click();
            expect(schObj.element.querySelectorAll('.e-appointment-border').length).toEqual(1);
            const selectedElement: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-border'));
            expect(selectedElement[0].classList).toContain('e-appointment-border');
            keyModule.keyActionHandler({ action: 'delete', target: selectedElement[0] });
            expect(schObj.element.querySelectorAll('.e-appointment-border').length).toEqual(1);
            (<HTMLElement>schObj.quickPopup.quickDialog.element.querySelector('.e-dlg-closeicon-btn')).click();
        });
        it('Right arrow key with appointment selection', () => {
            (schObj.element.querySelector('.e-appointment') as HTMLElement).click();
            expect(schObj.element.querySelectorAll('.e-appointment-border').length).toEqual(1);
            const selectedElement: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-border'));
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'rightArrow', target: selectedElement[0] });
            expect(schObj.element.querySelectorAll('.e-appointment-border').length).toEqual(0);
        });
        it('Left arrow key with appointment selection', () => {
            (schObj.element.querySelector('.e-appointment') as HTMLElement).click();
            expect(schObj.element.querySelectorAll('.e-appointment-border').length).toEqual(1);
            const selectedElement: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-border'));
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'leftArrow', target: selectedElement[0] });
            expect(schObj.element.querySelectorAll('.e-appointment-border').length).toEqual(0);
        });
        it('Tab/shift key for event edit option', () => {
            (schObj.element.querySelector('.e-appointment') as HTMLElement).click();
            const popup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(popup).toBeTruthy();
            keyModule.keyActionHandler({
                action: 'tab', target: popup.querySelector('.e-event-edit'),
                shiftKey: false, preventDefault: (): void => { /** Null */ }
            });
            expect(schObj.element.querySelectorAll('.e-appointment-border').length).toEqual(1);
            keyModule.keyActionHandler({
                action: 'tab', target: popup.querySelector('.e-event-delete'),
                shiftKey: false, preventDefault: (): void => { /** Null */ }
            });
            expect(schObj.element.querySelectorAll('.e-appointment-border').length).toEqual(1);
            keyModule.keyActionHandler({
                action: 'tab', target: popup.querySelector('.e-event-edit'),
                shiftKey: false, preventDefault: (): void => { /** Null */ }
            });
        });
        it('Tab/shift key to work cell for create option', () => {
            const firstWorkCell: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            expect(firstWorkCell[0].classList).not.toContain('e-selected-cell');
            expect(firstWorkCell[0].getAttribute('aria-selected')).toEqual('false');
            firstWorkCell[0].click();
            const popup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(popup).toBeTruthy();
            keyModule.keyActionHandler({
                action: 'tab', target: popup.querySelector('.e-event-create'),
                shiftKey: false, preventDefault: (): void => { /** Null */ }
            });
            keyModule.keyActionHandler({
                action: 'tab', target: popup.querySelector('.e-subject'),
                shiftKey: false, preventDefault: (): void => { /** Null */ }
            });
            keyModule.keyActionHandler({
                action: 'tab', target: popup.querySelector('.e-event-details'),
                shiftKey: false, preventDefault: (): void => { /** Null */ }
            });
            keyModule.keyActionHandler({
                action: 'tab', target: popup.querySelector('.e-event-create'),
                shiftKey: true, preventDefault: (): void => { /** Null */ }
            });
            keyModule.keyActionHandler({
                action: 'tab', target: popup.querySelector('.e-subject'),
                shiftKey: true, preventDefault: (): void => { /** Null */ }
            });
            keyModule.keyActionHandler({
                action: 'tab', target: popup.querySelector('.e-event-details'),
                shiftKey: true, preventDefault: (): void => { /** Null */ }
            });
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
        });
        it('Escape key without header bar', () => {
            expect(schObj.headerModule).not.toBeNull();
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('Apr 29 - May 05, 2018');
            expect(schObj.element.querySelectorAll('.e-schedule-toolbar').length).toEqual(1);
            expect(schObj.element.querySelectorAll('.e-toolbar-item').length).toEqual(10);
            schObj.showHeaderBar = false;
            schObj.dataBind();
            expect(schObj.headerModule).toBeNull();
            expect(schObj.element.querySelectorAll('.e-schedule-toolbar-container').length).toEqual(0);
            expect(schObj.element.querySelectorAll('.e-schedule-toolbar').length).toEqual(0);
            (schObj.element.querySelector('.e-appointment') as HTMLElement).click();
            keyModule.keyActionHandler({ action: 'escape' });
        });
        it('Negative case for Tab key work cell selection', () => {
            const workCells: HTMLElement[] = [].slice.call(schObj.element.querySelector('.e-content-wrap table tr').children);
            expect(workCells.length).toEqual(336);
            const workCell: HTMLElement = workCells[0] as HTMLElement;
            workCell.click();
            const cellPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(cellPopup.classList).toContain('e-popup-open');
            expect(cellPopup.children[0].classList).toContain('e-cell-popup');
            keyModule.keyActionHandler({ action: 'escape' });
            expect(cellPopup.classList).toContain('e-popup-close');
            workCell.classList.remove('e-selected-cell');
            keyModule.keyActionHandler({ action: 'tab', target: workCell, shiftKey: false, preventDefault: (): void => { /** Null */ } });
        });
    });
    describe('Timeline view with appointments-month view', () => {
        let schObj: Schedule;
        let keyModule: any;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                currentView: 'TimelineMonth',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek', 'TimelineMonth', 'Agenda'],
                selectedDate: new Date(2018, 4, 1)
            };
            schObj = util.createSchedule(model, timelineData, done);
            keyModule = schObj.keyboardInteractionModule;
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Escape key', () => {
            const moreIndicator: HTMLElement = schObj.element.querySelector('.e-more-indicator') as HTMLElement;
            moreIndicator.click();
            const popup: HTMLElement = schObj.element.querySelector('.e-more-popup-wrapper') as HTMLElement;
            expect(popup).toBeTruthy();
            expect(popup.classList.contains('e-popup-open')).toBe(true);
            expect(schObj.element.querySelectorAll('.e-appointment-border').length).toEqual(0);
            (popup.querySelector('.e-header-date') as HTMLElement).focus();
            keyModule.keyActionHandler({
                action: 'tab', target: popup.querySelector('.e-header-date'),
                shiftKey: false, preventDefault: (): void => { /** Null */ }
            });
            keyModule.keyActionHandler({ action: 'escape' });
            expect(popup).toBeTruthy();
            expect(popup.classList.contains('e-popup-close')).toBe(true);
        });
        it('Enter key to close more event list', () => {
            const moreIndicator: HTMLElement = schObj.element.querySelector('.e-more-indicator') as HTMLElement;
            moreIndicator.click();
            const popup: HTMLElement = schObj.element.querySelector('.e-more-popup-wrapper') as HTMLElement;
            expect(popup).toBeTruthy();
            expect(popup.classList.contains('e-popup-open')).toBe(true);
            keyModule.keyActionHandler({ action: 'enter', target: popup.querySelector('.e-more-event-close') });
            expect(popup).toBeTruthy();
        });
        it('Tab key for more event list', () => {
            const moreIndicator: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
            moreIndicator[0].click();
            const popup: HTMLElement = schObj.element.querySelector('.e-more-popup-wrapper') as HTMLElement;
            expect(popup.classList.contains('e-popup-open')).toBe(true);
            const apps: HTMLElement[] = [].slice.call(popup.querySelectorAll('.e-appointment'));
            apps[apps.length - 1].focus();
            keyModule.keyActionHandler({
                action: 'tab', target: apps[apps.length - 1],
                shiftKey: false, preventDefault: (): void => { /** Null */ }
            });
            expect(document.activeElement.classList).toContain('e-more-event-close');
            keyModule.keyActionHandler({ action: 'escape' });
            expect(popup.classList.contains('e-popup-open')).toBe(false);
        });
        it('Shift Tab key for more event list', () => {
            const moreIndicator: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
            moreIndicator[0].click();
            const popup: HTMLElement = schObj.element.querySelector('.e-more-popup-wrapper') as HTMLElement;
            expect(popup.classList.contains('e-popup-open')).toBe(true);
            (popup.querySelector('.e-more-event-close') as HTMLElement).focus();
            keyModule.keyActionHandler({
                action: 'shiftTab', target: popup.querySelector('.e-more-event-close'),
                shiftKey: true, preventDefault: (): void => { /** Null */ }
            });
            expect(document.activeElement.classList).toContain('e-appointment');
            keyModule.keyActionHandler({
                action: 'shiftTab', target: document.activeElement,
                shiftKey: true, preventDefault: (): void => { /** Null */ }
            });
            expect(document.activeElement.classList).toContain('e-appointment');
            keyModule.keyActionHandler({ action: 'escape' });
            expect(popup).toBeTruthy();
            expect(popup.classList.contains('e-popup-open')).toBe(false);
        });
        it('Enter key to change current view', () => {
            const moreIndicator: HTMLElement = schObj.element.querySelector('.e-more-indicator') as HTMLElement;
            moreIndicator.click();
            const popup: HTMLElement = schObj.element.querySelector('.e-more-popup-wrapper') as HTMLElement;
            expect(popup).toBeTruthy();
            expect(popup.classList.contains('e-popup-open')).toBe(true);
            keyModule.keyActionHandler({ action: 'enter', target: popup.querySelector('.e-header-date') });
            expect(popup).toBeTruthy();
            expect(popup.classList.contains('e-popup-open')).toBe(false);
        });
    });
    describe('Timeline view arrow keys', () => {
        let schObj: Schedule;
        let keyModule: any;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                currentView: 'TimelineWeek',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek', 'TimelineMonth', 'Agenda'],
                selectedDate: new Date(2018, 4, 1)
            };
            schObj = util.createSchedule(model, [], done);
            keyModule = schObj.keyboardInteractionModule;
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('multiple cell selection via shift plus click', () => {
            const workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            keyModule.initialTarget = workCells[2];
            util.triggerMouseEvent(workCells[17], 'click', 0, 0, true);
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(16);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(17);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
            keyModule.keyActionHandler({ action: 'enter', target: focuesdEle });
        });
        it('multiple work cells selection via mouse', () => {
            const workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            util.triggerMouseEvent(workCells[2], 'mousedown');
            util.triggerMouseEvent(workCells[17], 'mousemove');
            util.triggerMouseEvent(workCells[17], 'mouseup');
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(16);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(17);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
            keyModule.keyActionHandler({ action: 'enter', target: focuesdEle });
        });
        it('mouse move out of schedule while selection via mouse', () => {
            const workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            util.triggerMouseEvent(workCells[2], 'mousedown');
            util.triggerMouseEvent(schObj.element.querySelector('.e-time-cells') as HTMLElement, 'mousemove');
            util.triggerMouseEvent(workCells[29], 'mousemove');
            util.triggerMouseEvent(workCells[29], 'mouseup');
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(28);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(29);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
            keyModule.keyActionHandler({ action: 'enter', target: focuesdEle });
            keyModule.keyActionHandler({ action: 'escape' });
        });
        it('down arrow', () => {
            keyModule.keyActionHandler({ action: 'home' });
            const targetCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
            keyModule.keyActionHandler({ action: 'downArrow', target: targetCell });
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(0);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
        it('down arrow - last row cell', () => {
            const target: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[335] as HTMLElement;
            target.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'downArrow', target: target });
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(335);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
        it('up arrow', () => {
            const targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[18] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'upArrow', target: targetCell });
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(18);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
        it('up arrow first row cell', () => {
            const targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[1] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'upArrow', target: targetCell });
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(1);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
        it('up arrow - last row cell', () => {
            const target: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[335] as HTMLElement;
            target.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'upArrow', target: target });
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(335);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
        it('right arrow', () => {
            const targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[18] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'rightArrow', target: targetCell });
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(19);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
        it('right arrow first row cell', () => {
            const targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[1] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'rightArrow', target: targetCell });
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(2);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
        it('right arrow - last work cell next navigation', () => {
            const target: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[335] as HTMLElement;
            target.click();
            keyModule.keyActionHandler({ action: 'escape' });
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('Apr 29 - May 05, 2018');
            keyModule.keyActionHandler({ action: 'rightArrow', target: target });
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('May 06 - 12, 2018');
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(0);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
        it('left arrow', () => {
            const targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[18] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'leftArrow', target: targetCell });
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(17);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
        it('left arrow first work cell previous navigation', () => {
            const targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('May 06 - 12, 2018');
            keyModule.keyActionHandler({ action: 'leftArrow', target: targetCell });
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('Apr 29 - May 05, 2018');
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(335);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
        it('left arrow - last row cell', () => {
            const target: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[335] as HTMLElement;
            target.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'leftArrow', target: target });
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(334);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
        it('shiftDown arrow', () => {
            const targetCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = targetCell;
            keyModule.keyActionHandler({ action: 'shiftDownArrow', shiftKey: true, target: targetCell });
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(0);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
            keyModule.keyActionHandler({ action: 'shiftDownArrow', shiftKey: true, target: focuesdEle });
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
        });
        it('shiftDown arrow - last row cell', () => {
            const target: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[335] as HTMLElement;
            target.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = target;
            keyModule.keyActionHandler({ action: 'shiftDownArrow', shiftKey: true, target: target });
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(335);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
        it('shiftUp arrow', () => {
            const targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[18] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = targetCell;
            keyModule.keyActionHandler({ action: 'shiftUpArrow', shiftKey: true, target: targetCell });
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(18);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
        it('shiftUp arrow first row cell', () => {
            const targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[1] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = targetCell;
            keyModule.keyActionHandler({ action: 'shiftUpArrow', shiftKey: true, target: targetCell });
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(1);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
        it('shiftUp arrow - last row cell', () => {
            const target: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[335] as HTMLElement;
            target.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = target;
            keyModule.keyActionHandler({ action: 'shiftUpArrow', shiftKey: true, target: target });
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(335);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
        it('shiftRight arrow', () => {
            const targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[18] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = targetCell;
            keyModule.keyActionHandler({ action: 'shiftRightArrow', shiftKey: true, target: targetCell });
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(2);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(19);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
            keyModule.keyActionHandler({ action: 'shiftRightArrow', shiftKey: true, target: document.activeElement });
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(3);
        });
        it('shiftRight arrow - prevent last work cell next navigation', () => {
            const target: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[335] as HTMLElement;
            target.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = target;
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('Apr 29 - May 05, 2018');
            keyModule.keyActionHandler({ action: 'shiftRightArrow', shiftKey: true, target: target });
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('Apr 29 - May 05, 2018');
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(335);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
        it('shiftLeft arrow', () => {
            const targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[18] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = targetCell;
            keyModule.keyActionHandler({ action: 'shiftLeftArrow', shiftKey: true, target: targetCell });
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(2);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(17);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
            keyModule.keyActionHandler({ action: 'shiftLeftArrow', shiftKey: true, target: focuesdEle });
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(3);
        });
        it('shiftLeft arrow first work cell prevent previous navigation', () => {
            const targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = targetCell;
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('Apr 29 - May 05, 2018');
            keyModule.keyActionHandler({ action: 'shiftLeftArrow', shiftKey: true, target: targetCell });
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('Apr 29 - May 05, 2018');
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(0);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
        it('shiftLeft arrow - last row cell', () => {
            const target: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[335] as HTMLElement;
            target.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = target;
            keyModule.keyActionHandler({ action: 'shiftLeftArrow', shiftKey: true, target: target });
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(2);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(334);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
    });
    describe('Timeline month view arrow keys', () => {
        let schObj: Schedule;
        let keyModule: any;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                currentView: 'TimelineMonth',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek', 'TimelineMonth', 'Agenda'],
                selectedDate: new Date(2018, 4, 1)
            };
            schObj = util.createSchedule(model, [], done);
            keyModule = schObj.keyboardInteractionModule;
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('multiple cell selection via shift plus click', () => {
            const workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            keyModule.initialTarget = workCells[2];
            util.triggerMouseEvent(workCells[12], 'mousedown', 0, 0, true);
            util.triggerMouseEvent(workCells[12], 'click', 0, 0, true);
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(11);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(12);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
            keyModule.keyActionHandler({ action: 'enter', target: focuesdEle });
            keyModule.keyActionHandler({ action: 'escape' });
        });
        it('multiple work cells selection via mouse', () => {
            const workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            util.triggerMouseEvent(workCells[3], 'mousedown');
            util.triggerMouseEvent(workCells[18], 'mousemove');
            util.triggerMouseEvent(workCells[18], 'mouseup');
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(16);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(18);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
            keyModule.keyActionHandler({ action: 'enter', target: focuesdEle });
        });
        it('down arrow', () => {
            const targetCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'downArrow', target: targetCell });
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(0);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
        it('down arrow - last row cell', () => {
            const workCell: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            const target: HTMLElement = workCell[workCell.length - 2];
            target.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'downArrow', target: target });
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(29);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).
                toEqual((target.parentNode as HTMLTableRowElement).sectionRowIndex);
        });
        it('up arrow', () => {
            const targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[3] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'upArrow', target: targetCell });
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(3);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
        it('up arrow - last row cell', () => {
            const workCell: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            const target: HTMLElement = workCell[workCell.length - 2];
            target.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'upArrow', target: target });
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(29);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).
                toEqual((target.parentNode as HTMLTableRowElement).sectionRowIndex);
        });
        it('right arrow', () => {
            const targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[18] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'rightArrow', target: targetCell });
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(19);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
            keyModule.keyActionHandler({ action: 'rightArrow', target: schObj.element.querySelector('.e-header-cells') });
        });
        it('right arrow first row last cell', () => {
            const targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[6] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'rightArrow', target: targetCell });
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(7);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
        it('right arrow - last work cell next navigation', () => {
            const workCell: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            const target: HTMLElement = workCell[workCell.length - 1];
            target.click();
            keyModule.keyActionHandler({ action: 'escape' });
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('May 2018');
            keyModule.keyActionHandler({ action: 'rightArrow', target: target });
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('June 2018');
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(0);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
        it('left arrow', () => {
            const targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[5] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'leftArrow', target: targetCell });
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(4);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
            keyModule.keyActionHandler({ action: 'leftArrow', target: schObj.element.querySelector('.e-header-cells') });
        });
        it('left arrow second row first cell', () => {
            const targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[7] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'leftArrow', target: targetCell });
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(6);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
        it('left arrow first work cell previous navigation', () => {
            const targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('June 2018');
            keyModule.keyActionHandler({ action: 'leftArrow', target: targetCell });
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('May 2018');
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(29);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
        it('shiftDown arrow', () => {
            const targetCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = targetCell;
            keyModule.keyActionHandler({ action: 'shiftDownArrow', shiftKey: true, target: targetCell });
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(0);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
        it('shiftUp arrow', () => {
            const targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[18] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = targetCell;
            keyModule.keyActionHandler({ action: 'shiftUpArrow', shiftKey: true, target: targetCell });
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(18);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
        it('shiftRight arrow', () => {
            const targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[4] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = targetCell;
            keyModule.keyActionHandler({ action: 'shiftRightArrow', shiftKey: true, target: targetCell });
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(2);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(5);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
            keyModule.keyActionHandler({ action: 'shiftRightArrow', shiftKey: true, target: document.activeElement });
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(3);
        });
        it('shiftRight arrow - prevent last work cell next navigation', () => {
            const workCell: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            const target: HTMLElement = workCell[workCell.length - 1];
            target.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = target;
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('May 2018');
            keyModule.keyActionHandler({ action: 'shiftRightArrow', shiftKey: true, target: target });
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('May 2018');
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(30);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
        it('shiftLeft arrow', () => {
            const targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[4] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = targetCell;
            keyModule.keyActionHandler({ action: 'shiftLeftArrow', shiftKey: true, target: targetCell });
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(2);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(3);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
            keyModule.keyActionHandler({ action: 'shiftLeftArrow', shiftKey: true, target: focuesdEle });
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(3);
        });
        it('shiftLeft arrow first work cell prevent previous navigation', () => {
            const targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = targetCell;
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('May 2018');
            keyModule.keyActionHandler({ action: 'shiftLeftArrow', shiftKey: true, target: targetCell });
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('May 2018');
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(0);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
    });
    describe('Cell selection with Resource', () => {
        let schObj: Schedule;
        let keyModule: any;
        beforeAll((done: DoneFn) => {
            const schOptions: ScheduleModel = {
                height: '580px',
                currentView: 'TimelineMonth',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek', 'TimelineMonth', 'Agenda'],
                selectedDate: new Date(2018, 4, 1),
                group: { resources: ['Floors', 'Halls', 'Rooms', 'Owners'] },
                resources: [{
                    field: 'FId', title: 'Floor', name: 'Floors', allowMultiple: false,
                    dataSource: [
                        { FloorText: 'Floor 1', Id: 1, FloorColor: '#cb6bb2', Expand: false },
                        { FloorText: 'Floor 2', Id: 2, FloorColor: '#cb6bb2' }
                    ],
                    textField: 'FloorText', idField: 'Id', colorField: 'FloorColor', expandedField: 'Expand'
                }, {
                    field: 'HallId', title: 'Hall', name: 'Halls', allowMultiple: false,
                    dataSource: [
                        { HallText: 'Hall 1', Id: 1, HallGroupId: 1, HallColor: '#cb6bb2', Expand: false },
                        { HallText: 'Hall 2', Id: 2, HallGroupId: 2, HallColor: '#56ca85' }
                    ],
                    textField: 'HallText', idField: 'Id', groupIDField: 'HallGroupId', colorField: 'HallColor', expandedField: 'Expand'
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
                        { OwnerText: 'Nancy', Id: 1, OwnerGroupId: 1, OwnerColor: '#ffaa00', Expand: false },
                        { OwnerText: 'Steven', Id: 2, OwnerGroupId: 2, OwnerColor: '#f8a398', Expand: false },
                        { OwnerText: 'Michael', Id: 3, OwnerGroupId: 3, OwnerColor: '#7499e1', Expand: false },
                        { OwnerText: 'Oliver', Id: 4, OwnerGroupId: 1, OwnerColor: '#ffaa00' },
                        { OwnerText: 'John', Id: 5, OwnerGroupId: 2, OwnerColor: '#f8a398' },
                        { OwnerText: 'Barry', Id: 6, OwnerGroupId: 3, OwnerColor: '#7499e1' },
                        { OwnerText: 'Felicity', Id: 7, OwnerGroupId: 1, OwnerColor: '#ffaa00' },
                        { OwnerText: 'Cisco', Id: 8, OwnerGroupId: 3, OwnerColor: '#f8a398' },
                        { OwnerText: 'Sara', Id: 9, OwnerGroupId: 2, OwnerColor: '#7499e1' }
                    ],
                    textField: 'OwnerText', idField: 'Id', groupIDField: 'OwnerGroupId', colorField: 'OwnerColor', expandedField: 'Expand'
                }],
                dataBound: () => {
                    keyModule = schObj.keyboardInteractionModule;
                    done();
                }
            };
            schObj = util.createSchedule(schOptions, timelineResourceData);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('home key', () => {
            const firstWorkCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[403] as HTMLElement;
            expect(firstWorkCell.classList).not.toContain('e-selected-cell');
            expect(firstWorkCell.getAttribute('aria-selected')).toEqual('false');
            keyModule.keyActionHandler({ action: 'home' });
            expect(firstWorkCell.classList).toContain('e-selected-cell');
            expect(firstWorkCell.getAttribute('aria-selected')).toEqual('true');
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.classList).toContain('e-child-node');
            expect(focuesdEle.classList).not.toContain('e-resource-group-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(0);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(13);
        });
        it('multiple cell selection via shift plus click', () => {
            const workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            keyModule.initialTarget = workCells[403];
            util.triggerMouseEvent(workCells[420], 'mousedown', 0, 0, true);
            util.triggerMouseEvent(workCells[420], 'click', 0, 0, true);
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(18);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.classList).toContain('e-child-node');
            expect(focuesdEle.classList).not.toContain('e-resource-group-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(17);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(13);
            keyModule.keyActionHandler({ action: 'enter', target: focuesdEle });
            keyModule.keyActionHandler({ action: 'escape' });
        });
        it('multiple work cells selection via mouse', () => {
            const workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            util.triggerMouseEvent(workCells[403], 'mousedown');
            util.triggerMouseEvent(workCells[420], 'mousemove');
            util.triggerMouseEvent(workCells[420], 'mouseup');
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(18);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.classList).toContain('e-child-node');
            expect(focuesdEle.classList).not.toContain('e-resource-group-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(17);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(13);
            keyModule.keyActionHandler({ action: 'enter', target: focuesdEle });
        });
        it('down arrow', () => {
            const targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[403] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'downArrow', target: targetCell, preventDefault: (): void => { /** Null */ } });
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.classList).toContain('e-child-node');
            expect(focuesdEle.classList).not.toContain('e-resource-group-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(0);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(14);
        });
        it('down arrow - last row cell', () => {
            const workCell: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            const target: HTMLElement = workCell[workCell.length - 2];
            target.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'downArrow', target: target });
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.classList).toContain('e-child-node');
            expect(focuesdEle.classList).not.toContain('e-resource-group-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(29);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(15);
        });
        it('up arrow', () => {
            const targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[435] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'upArrow', target: targetCell, preventDefault: (): void => { /** Null */ } });
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.classList).toContain('e-child-node');
            expect(focuesdEle.classList).not.toContain('e-resource-group-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(1);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(13);
        });
        it('up arrow - last row cell', () => {
            const workCell: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            const target: HTMLElement = workCell[workCell.length - 2];
            target.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'upArrow', target: target, preventDefault: (): void => { /** Null */ } });
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.classList).toContain('e-child-node');
            expect(focuesdEle.classList).not.toContain('e-resource-group-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(29);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(14);
        });
        it('right arrow', () => {
            const targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[403] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'rightArrow', target: targetCell });
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.classList).toContain('e-child-node');
            expect(focuesdEle.classList).not.toContain('e-resource-group-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(1);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(13);
            keyModule.keyActionHandler({ action: 'rightArrow', target: schObj.element.querySelector('.e-header-cells') });
        });
        it('right arrow first row last cell', () => {
            const targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[450] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'rightArrow', target: targetCell });
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.classList).toContain('e-child-node');
            expect(focuesdEle.classList).not.toContain('e-resource-group-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(17);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(14);
        });
        it('right arrow - last work cell next navigation', () => {
            const workCell: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            const target: HTMLElement = workCell[workCell.length - 1];
            target.click();
            keyModule.keyActionHandler({ action: 'escape' });
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('May 2018');
            keyModule.keyActionHandler({ action: 'rightArrow', target: target });
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('June 2018');
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.classList).toContain('e-child-node');
            expect(focuesdEle.classList).not.toContain('e-resource-group-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(0);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(15);
        });
        it('left arrow', () => {
            const targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[404] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'leftArrow', target: targetCell });
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.classList).toContain('e-child-node');
            expect(focuesdEle.classList).not.toContain('e-resource-group-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(13);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(13);
            keyModule.keyActionHandler({ action: 'leftArrow', target: schObj.element.querySelector('.e-header-cells') });
        });
        it('left arrow first work cell previous navigation', () => {
            const targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[403] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('June 2018');
            keyModule.keyActionHandler({ action: 'leftArrow', target: targetCell });
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('June 2018');
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.classList).toContain('e-child-node');
            expect(focuesdEle.classList).not.toContain('e-resource-group-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(12);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(13);
        });
        it('shiftDown arrow', () => {
            const targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[410] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = targetCell;
            keyModule.keyActionHandler({ action: 'shiftDownArrow', shiftKey: true, target: targetCell });
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-child-node');
            expect(focuesdEle.classList).not.toContain('e-resource-group-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(20);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(13);
        });
        it('shiftUp arrow', () => {
            const targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[404] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = targetCell;
            keyModule.keyActionHandler({ action: 'shiftUpArrow', shiftKey: true, target: targetCell });
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.classList).toContain('e-child-node');
            expect(focuesdEle.classList).not.toContain('e-resource-group-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(14);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(13);
        });
        it('shiftRight arrow', () => {
            const targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[403] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = targetCell;
            keyModule.keyActionHandler({ action: 'shiftRightArrow', shiftKey: true, target: targetCell });
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(2);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.classList).toContain('e-child-node');
            expect(focuesdEle.classList).not.toContain('e-resource-group-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(14);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(13);
            keyModule.keyActionHandler({ action: 'shiftRightArrow', shiftKey: true, target: document.activeElement });
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(3);
        });
        it('shiftRight arrow - prevent last work cell next navigation', () => {
            const workCell: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            const target: HTMLElement = workCell[workCell.length - 1];
            target.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = target;
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('June 2018');
            keyModule.keyActionHandler({ action: 'shiftRightArrow', shiftKey: true, target: target });
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('June 2018');
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.classList).toContain('e-child-node');
            expect(focuesdEle.classList).not.toContain('e-resource-group-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(29);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(15);
        });
        it('shiftLeft arrow', () => {
            const targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[410] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = targetCell;
            keyModule.keyActionHandler({ action: 'shiftLeftArrow', shiftKey: true, target: targetCell });
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(2);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.classList).toContain('e-child-node');
            expect(focuesdEle.classList).not.toContain('e-resource-group-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(19);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(13);
            keyModule.keyActionHandler({ action: 'shiftLeftArrow', shiftKey: true, target: focuesdEle });
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(3);
        });
        it('shiftLeft arrow first work cell prevent previous navigation', () => {
            const targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[403] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = targetCell;
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('June 2018');
            keyModule.keyActionHandler({ action: 'shiftLeftArrow', shiftKey: true, target: targetCell });
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('June 2018');
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(2);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.classList).toContain('e-child-node');
            expect(focuesdEle.classList).not.toContain('e-resource-group-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(12);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(13);
        });
        it('tab key on resource cells', () => {
            const targetEle: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-resource-tree-icon'));
            targetEle[0].click();
            targetEle[1].click();
            (schObj.element.querySelector('.e-resource-cells[data-group-index="' + 10 + '"]') as HTMLElement).focus();
            expect(schObj.element.querySelector('.e-content-wrap').scrollTop).toEqual(0);
            keyModule.keyActionHandler({ action: 'tab', target: document.activeElement, shiftKey: false });
            expect(schObj.element.querySelector('.e-content-wrap').scrollTop).toBeGreaterThan(0);
            keyModule.keyActionHandler({ action: 'tab', target: schObj.element.querySelector('.e-resource-cells'), shiftKey: false });
            expect(schObj.element.querySelector('.e-content-wrap').scrollTop).toEqual(0);
        });
    });

    describe('Keyboard interaction with enabled virtual scroll', () => {
        let schObj: Schedule;
        let keyModule: any;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                height: '550px', width: '100%', currentView: 'TimelineMonth',
                views: [
                    { option: 'TimelineDay' },
                    { option: 'TimelineWeek', allowVirtualScrolling: true },
                    { option: 'TimelineMonth', allowVirtualScrolling: true }
                ],
                group: { resources: ['Floors', 'Halls', 'Rooms', 'Owners'] },
                resources: [{
                    field: 'FId', title: 'Floor', name: 'Floors', allowMultiple: false,
                    dataSource: [
                        { FloorText: 'Floor 1', Id: 1, FloorColor: '#cb6bb2' },
                        { FloorText: 'Floor 2', Id: 2, FloorColor: '#cb6bb2' }
                    ],
                    textField: 'FloorText', idField: 'Id', colorField: 'FloorColor'
                }, {
                    field: 'HallId', title: 'Hall', name: 'Halls', allowMultiple: false,
                    dataSource: [
                        { HallText: 'Hall 1', Id: 1, HallGroupId: 1, HallColor: '#cb6bb2' },
                        { HallText: 'Hall 2', Id: 2, HallGroupId: 2, HallColor: '#56ca85' },
                        { HallText: 'Hall 3', Id: 3, HallGroupId: 2, HallColor: '#56ca85' }
                    ],
                    textField: 'HallText', idField: 'Id', groupIDField: 'HallGroupId', colorField: 'HallColor'
                }, {
                    field: 'RoomId', title: 'Room', name: 'Rooms', allowMultiple: false,
                    dataSource: [
                        { RoomText: 'ROOM 1', Id: 1, RoomGroupId: 1, RoomColor: '#cb6bb2' },
                        { RoomText: 'ROOM 2', Id: 2, RoomGroupId: 2, RoomColor: '#56ca85' },
                        { RoomText: 'ROOM 3', Id: 3, RoomGroupId: 1, RoomColor: '#56ca85' },
                        { RoomText: 'ROOM 4', Id: 4, RoomGroupId: 2, RoomColor: '#56ca85' },
                        { RoomText: 'ROOM 5', Id: 5, RoomGroupId: 3, RoomColor: '#56ca85' }
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
                        { OwnerText: 'Cisco', Id: 8, OwnerGroupId: 3, OwnerColor: '#f8a398' },
                        { OwnerText: 'Sara', Id: 9, OwnerGroupId: 2, OwnerColor: '#7499e1' },
                        { OwnerText: 'John', Id: 10, OwnerGroupId: 4, OwnerColor: '#f8a398' },
                        { OwnerText: 'Barry', Id: 11, OwnerGroupId: 4, OwnerColor: '#7499e1' },
                        { OwnerText: 'Felicity', Id: 12, OwnerGroupId: 4, OwnerColor: '#ffaa00' },
                        { OwnerText: 'Cisco', Id: 13, OwnerGroupId: 4, OwnerColor: '#f8a398' },
                        { OwnerText: 'Sara', Id: 14, OwnerGroupId: 4, OwnerColor: '#7499e1' },
                        { OwnerText: 'Barry', Id: 15, OwnerGroupId: 5, OwnerColor: '#7499e1' },
                        { OwnerText: 'Felicity', Id: 16, OwnerGroupId: 5, OwnerColor: '#ffaa00' },
                        { OwnerText: 'Cisco', Id: 17, OwnerGroupId: 5, OwnerColor: '#f8a398' },
                        { OwnerText: 'Sara', Id: 18, OwnerGroupId: 5, OwnerColor: '#7499e1' }
                    ],
                    textField: 'OwnerText', idField: 'Id', groupIDField: 'OwnerGroupId',
                    colorField: 'OwnerColor'
                }],
                selectedDate: new Date(2018, 4, 1),
                dataBound: () => {
                    keyModule = schObj.keyboardInteractionModule;
                    done();
                }
            };
            schObj = util.createSchedule(model, timelineResourceData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Selecting work cell enabled virtual scroll', (done: DoneFn) => {
            const targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[220] as HTMLElement;
            const contentArea: HTMLElement = schObj.element.querySelector('.e-content-wrap') as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            expect(schObj.element.querySelector('.e-work-cells').getAttribute('data-group-index')).toBe('0');
            expect(schObj.element.querySelector('.e-selected-cell').getAttribute('data-group-index')).toBe('7');
            util.triggerScrollEvent(contentArea, 400);
            setTimeout(() => { done(); }, 500);
        });
        it('To check selected cell after scrolling', (done: DoneFn) => {
            const contentArea: HTMLElement = schObj.element.querySelector('.e-content-wrap') as HTMLElement;
            expect(contentArea.scrollTop).toEqual(400);
            expect(schObj.element.querySelector('.e-work-cells').getAttribute('data-group-index')).toBe('6');
            expect(schObj.element.querySelector('.e-selected-cell').getAttribute('data-group-index')).toBe('7');
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.classList).toContain('e-child-node');
            expect(focuesdEle.classList).not.toContain('e-resource-group-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            util.triggerScrollEvent(contentArea, 450);
            expect(contentArea.scrollTop).toEqual(450);
            setTimeout(() => { done(); }, 500);
        });
        it('Tab key with enabled virtual scroll', (done: DoneFn) => {
            keyModule.keyActionHandler({ action: 'tab', target: schObj.element.querySelector('.e-schedule-toolbar button'),
                shiftKey: false, preventDefault: (): void => { /** Null */ } });
            expect(schObj.element.querySelector('.e-resource-cells').getAttribute('tabindex')).toBe('-1');
            expect(schObj.element.querySelectorAll('.e-resource-cells')[1].getAttribute('tabindex')).toBe('0');
            expect(schObj.element.querySelector('.e-resource-cells').getAttribute('data-group-index')).toBe('6');
            expect(schObj.element.querySelectorAll('.e-resource-cells')[3].classList.contains('e-child-node')).toBe(true);
            keyModule.keyActionHandler({ action: 'tab', target: schObj.element.querySelectorAll('.e-resource-cells')[2],
                shiftKey: false, preventDefault: (): void => { /** Null */ } });
            setTimeout(() => { done(); }, 500);
        });
        it('Resource cells updated with work cells on tab key', (done: DoneFn) => {
            expect(schObj.element.querySelector('.e-resource-cells').getAttribute('tabindex')).toEqual('-1');
            expect(schObj.element.querySelector('.e-resource-cells').getAttribute('data-group-index')).toEqual('6');
            expect(schObj.element.querySelectorAll('.e-resource-cells')[2].classList.contains('e-parent-node')).toBe(false);
            (schObj.element.querySelector('.e-resource-cells[data-group-index="' + 9 + '"]') as HTMLElement).focus();
            const contentArea: HTMLElement = schObj.element.querySelector('.e-content-wrap') as HTMLElement;
            util.triggerScrollEvent(contentArea, 50);
            expect(contentArea.scrollTop).toEqual(50);
            setTimeout(() => { done(); }, 500);
        });
        it('Resource cells updated after virtual scroll', () => {
            expect(schObj.element.querySelector('.e-resource-cells').getAttribute('tabindex')).toEqual('-1');
            expect(schObj.element.querySelector('.e-resource-cells').getAttribute('data-group-index')).toEqual('0');
            expect(schObj.element.querySelectorAll('.e-resource-cells')[2].classList.contains('e-parent-node')).toBe(true);
            expect(document.activeElement.getAttribute('data-group-index')).toBe('1');
            expect(document.activeElement.classList.contains('e-resource-cells')).toBe(true);
            expect(document.activeElement.getAttribute('tabindex')).toEqual('0');
        });
    });

    describe('Year view', () => {
        let schObj: Schedule;
        let keyModule: any;
        beforeAll((done: DoneFn) => {
            const elem: HTMLElement = createElement('div', { id: 'Schedule', attrs: { tabIndex: '1' } });
            const schOptions: ScheduleModel = { selectedDate: new Date(2017, 9, 4), views: ['Year'] };
            schObj = util.createSchedule(schOptions, [], done, elem);
            keyModule = schObj.keyboardInteractionModule;
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('home key', () => {
            const firstWorkCell: HTMLElement = schObj.element.querySelector('.e-work-cells:not(.e-other-month)') as HTMLElement;
            expect(firstWorkCell.classList).not.toContain('e-selected-cell');
            keyModule.keyActionHandler({ action: 'home' });
            expect(firstWorkCell.classList).toContain('e-selected-cell');
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
        });
        it('right and left arrow key', () => {
            keyModule.keyActionHandler({ action: 'home' });
            const targetCell: HTMLElement = schObj.element.querySelector('.e-work-cells:not(.e-other-month)') as HTMLElement;
            keyModule.keyActionHandler({ action: 'rightArrow', target: targetCell });
            let focusedEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focusedEle.classList).toContain('e-selected-cell');
            expect(focusedEle.cellIndex).toEqual(1);
            expect((focusedEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
            keyModule.keyActionHandler({ action: 'leftArrow', target: focusedEle });
            focusedEle = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focusedEle.classList).toContain('e-selected-cell');
            expect(focusedEle.cellIndex).toEqual(0);
            expect((focusedEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
        it('down and up arrow key', () => {
            keyModule.keyActionHandler({ action: 'home' });
            const targetCell: HTMLElement = schObj.element.querySelector('.e-work-cells:not(.e-other-month)') as HTMLElement;
            keyModule.keyActionHandler({ action: 'downArrow', target: targetCell, preventDefault: (): void => { /** Null */ } });
            let focusedEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focusedEle.classList).toContain('e-selected-cell');
            expect(focusedEle.cellIndex).toEqual(0);
            expect((focusedEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(1);
            keyModule.keyActionHandler({ action: 'upArrow', target: focusedEle, preventDefault: (): void => { /** Null */ } });
            focusedEle = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focusedEle.classList).toContain('e-selected-cell');
            expect(focusedEle.cellIndex).toEqual(0);
            expect((focusedEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
        it('navigate to next and previous month using right and left arrow', () => {
            keyModule.keyActionHandler({ action: 'home' });
            const target: HTMLTableCellElement = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'))[30];
            keyModule.keyActionHandler({ action: 'rightArrow', target: target });
            let focusedEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focusedEle.classList).toContain('e-selected-cell');
            expect(focusedEle.cellIndex).toEqual(3);
            expect((focusedEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
            keyModule.keyActionHandler({ action: 'leftArrow', target: focusedEle });
            focusedEle = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focusedEle.classList).toContain('e-selected-cell');
            expect(focusedEle.cellIndex).toEqual(2);
            expect((focusedEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(4);
        });
        it('navigate to next and previous month by down and up keys', () => {
            keyModule.keyActionHandler({ action: 'home' });
            const target: HTMLTableCellElement = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'))[30];
            keyModule.keyActionHandler({ action: 'downArrow', target: target, preventDefault: (): void => { /** Null */ } });
            let focusedEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focusedEle.classList).toContain('e-selected-cell');
            expect(focusedEle.cellIndex).toEqual(2);
            expect((focusedEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(1);
            keyModule.keyActionHandler({ action: 'upArrow', target: focusedEle, preventDefault: (): void => { /** Null */ } });
            focusedEle = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focusedEle.classList).toContain('e-selected-cell');
            expect(focusedEle.cellIndex).toEqual(2);
            expect((focusedEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(4);
        });
        it('navigate to previous and next year', () => {
            keyModule.keyActionHandler({ action: 'home' });
            const targetCell: HTMLElement = schObj.element.querySelector('.e-work-cells:not(.e-other-month)') as HTMLElement;
            keyModule.keyActionHandler({ action: 'leftArrow', target: targetCell });
            let focusedEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focusedEle.classList).toContain('e-selected-cell');
            expect(focusedEle.cellIndex).toEqual(6);
            expect((focusedEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(4);
            keyModule.keyActionHandler({ action: 'rightArrow', target: focusedEle });
            focusedEle = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focusedEle.classList).toContain('e-selected-cell');
            expect(focusedEle.cellIndex).toEqual(0);
            expect((focusedEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
    });

    describe('Horizontal year view', () => {
        let schObj: Schedule;
        let keyModule: any;
        beforeAll((done: DoneFn) => {
            const elem: HTMLElement = createElement('div', { id: 'Schedule', attrs: { tabIndex: '1' } });
            const schOptions: ScheduleModel = { selectedDate: new Date(2017, 9, 4), views: ['TimelineYear'] };
            schObj = util.createSchedule(schOptions, [], done, elem);
            keyModule = schObj.keyboardInteractionModule;
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('home key', () => {
            const firstWorkCell: HTMLElement = schObj.element.querySelector('.e-work-cells:not(.e-other-month)') as HTMLElement;
            expect(firstWorkCell.classList).not.toContain('e-selected-cell');
            expect(firstWorkCell.getAttribute('aria-selected')).toEqual('false');
            keyModule.keyActionHandler({ action: 'home' });
            expect(firstWorkCell.classList).toContain('e-selected-cell');
            expect(firstWorkCell.getAttribute('aria-selected')).toEqual('true');
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
        });
        it('right and left arrow key', () => {
            keyModule.keyActionHandler({ action: 'home' });
            const targetCell: HTMLElement = schObj.element.querySelector('.e-work-cells:not(.e-other-month)') as HTMLElement;
            keyModule.keyActionHandler({ action: 'rightArrow', target: targetCell });
            let focusedEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focusedEle.classList).toContain('e-selected-cell');
            expect(focusedEle.getAttribute('aria-selected')).toEqual('true');
            expect(focusedEle.cellIndex).toEqual(1);
            expect((focusedEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
            keyModule.keyActionHandler({ action: 'leftArrow', target: focusedEle });
            focusedEle = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focusedEle.classList).toContain('e-selected-cell');
            expect(focusedEle.getAttribute('aria-selected')).toEqual('true');
            expect(focusedEle.cellIndex).toEqual(0);
            expect((focusedEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
        it('down and up arrow key', () => {
            keyModule.keyActionHandler({ action: 'home' });
            const targetCell: HTMLElement = schObj.element.querySelector('.e-work-cells:not(.e-other-month)') as HTMLElement;
            keyModule.keyActionHandler({ action: 'downArrow', target: targetCell, preventDefault: (): void => { /** Null */ } });
            let focusedEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focusedEle.classList).toContain('e-selected-cell');
            expect(focusedEle.getAttribute('aria-selected')).toEqual('true');
            expect(focusedEle.cellIndex).toEqual(0);
            expect((focusedEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(1);
            keyModule.keyActionHandler({ action: 'upArrow', target: focusedEle, preventDefault: (): void => { /** Null */ } });
            focusedEle = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focusedEle.classList).toContain('e-selected-cell');
            expect(focusedEle.getAttribute('aria-selected')).toEqual('true');
            expect(focusedEle.cellIndex).toEqual(0);
            expect((focusedEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
        it('navigate to next month using shift right arrow', () => {
            const cells: HTMLTableCellElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            cells[0].click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = cells[0];
            keyModule.keyActionHandler({ action: 'shiftRightArrow', shiftKey: true, target: cells[30] });
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(32);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(3);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(1);
            keyModule.keyActionHandler({ action: 'shiftRightArrow', shiftKey: true, target: focuesdEle });
            focuesdEle = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(33);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(4);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(1);
        });
        it('navigate to previous month using shift left arrow', () => {
            const target: HTMLTableCellElement = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'))[40];
            target.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = target;
            keyModule.keyActionHandler({ action: 'shiftLeftArrow', shiftKey: true, target: target });
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(2);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(30);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
            keyModule.keyActionHandler({ action: 'shiftLeftArrow', shiftKey: true, target: focuesdEle });
            focuesdEle = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(3);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(29);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
        it('navigate to next month using shift down arrow', () => {
            const target: HTMLElement = schObj.element.querySelector('.e-work-cells:not(.e-other-month)');
            target.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = target;
            keyModule.keyActionHandler({ action: 'shiftDownArrow', shiftKey: true, target: target, preventDefault: (): void => { /** Null */ } });
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(32);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(3);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(1);
            keyModule.keyActionHandler({ action: 'shiftDownArrow', shiftKey: true, target: focuesdEle, preventDefault: (): void => { /** Null */ } });
            focuesdEle = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(60);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(3);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(2);
        });
        it('navigate to previous month using shift up arrow', () => {
            const target: HTMLTableCellElement = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'))[77];
            target.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = target;
            keyModule.keyActionHandler({ action: 'shiftUpArrow', shiftKey: true, target: target, preventDefault: (): void => { /** Null */ } });
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(29);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(3);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(1);
            keyModule.keyActionHandler({ action: 'shiftUpArrow', shiftKey: true, target: focuesdEle, preventDefault: (): void => { /** Null */ } });
            focuesdEle = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(57);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(3);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
    });

    describe('Horizontal year view with resource', () => {
        let schObj: Schedule;
        let keyModule: any;
        beforeAll((done: DoneFn) => {
            const elem: HTMLElement = createElement('div', { id: 'Schedule', attrs: { tabIndex: '1' } });
            const schOptions: ScheduleModel = {
                views: ['TimelineYear'],
                group: { resources: ['Categories'] },
                resources: [{
                    field: 'TaskId', title: 'Category', name: 'Categories', allowMultiple: true,
                    dataSource: [
                        { text: 'Nancy', id: 1, color: '#df5286' },
                        { text: 'Steven', id: 2, color: '#7fa900' }
                    ],
                    textField: 'text', idField: 'id', colorField: 'color'
                }]
            };
            schObj = util.createSchedule(schOptions, [], done, elem);
            keyModule = schObj.keyboardInteractionModule;
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('home key', () => {
            const firstWorkCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
            expect(firstWorkCell.classList).not.toContain('e-selected-cell');
            expect(firstWorkCell.getAttribute('aria-selected')).toEqual('false');
            keyModule.keyActionHandler({ action: 'home' });
            expect(firstWorkCell.classList).toContain('e-selected-cell');
            expect(firstWorkCell.getAttribute('aria-selected')).toEqual('true');
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
        });
        it('down arrow', () => {
            keyModule.keyActionHandler({ action: 'home' });
            const targetCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
            keyModule.keyActionHandler({ action: 'downArrow', target: targetCell, preventDefault: (): void => { /** Null */ } });
            const focusedEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focusedEle.classList).toContain('e-selected-cell');
            expect(focusedEle.getAttribute('aria-selected')).toEqual('true');
            expect(focusedEle.cellIndex).toEqual(0);
            expect((focusedEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(1);
        });
        it('shift down arrow', () => {
            const cells: HTMLTableCellElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            cells[0].click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = cells[0];
            keyModule.keyActionHandler({ action: 'shiftDownArrow', shiftKey: true, target: cells[20], preventDefault: (): void => { /** Null */ } });
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(12);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(0);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(11);
        });
        it('up arrow', () => {
            keyModule.keyActionHandler({ action: 'home' });
            const cells: HTMLTableCellElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            keyModule.keyActionHandler({ action: 'upArrow', target: cells[1] });
            const focusedEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focusedEle.classList).toContain('e-selected-cell');
            expect(focusedEle.getAttribute('aria-selected')).toEqual('true');
            expect(focusedEle.cellIndex).toEqual(0);
            expect((focusedEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
        it('shift up arrow', () => {
            const cells: HTMLTableCellElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            cells[22].click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = cells[22];
            keyModule.keyActionHandler({ action: 'shiftUpArrow', shiftKey: true, target: cells[2] , preventDefault: (): void => { /** Null */ }});
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(12);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(0);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
    });

    describe('Vertical year view', () => {
        let schObj: Schedule;
        let keyModule: any;
        beforeAll((done: DoneFn) => {
            const elem: HTMLElement = createElement('div', { id: 'Schedule', attrs: { tabIndex: '1' } });
            const schOptions: ScheduleModel = {
                selectedDate: new Date(2017, 9, 4),
                views: [{ option: 'TimelineYear', displayName: 'Vertical Timeline Year', orientation: 'Vertical' }]
            };
            schObj = util.createSchedule(schOptions, [], done, elem);
            keyModule = schObj.keyboardInteractionModule;
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('home key', () => {
            const firstWorkCell: HTMLElement = schObj.element.querySelector('.e-work-cells:not(.e-other-month)') as HTMLElement;
            expect(firstWorkCell.classList).not.toContain('e-selected-cell');
            expect(firstWorkCell.getAttribute('aria-selected')).toEqual('false');
            keyModule.keyActionHandler({ action: 'home' });
            expect(firstWorkCell.classList).toContain('e-selected-cell');
            expect(firstWorkCell.getAttribute('aria-selected')).toEqual('true');
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
        });
        it('right and left arrow key', () => {
            keyModule.keyActionHandler({ action: 'home' });
            const targetCell: HTMLElement = schObj.element.querySelector('.e-work-cells:not(.e-other-month)') as HTMLElement;
            keyModule.keyActionHandler({ action: 'rightArrow', target: targetCell });
            let focusedEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focusedEle.classList).toContain('e-selected-cell');
            expect(focusedEle.getAttribute('aria-selected')).toEqual('true');
            expect(focusedEle.cellIndex).toEqual(1);
            expect((focusedEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
            keyModule.keyActionHandler({ action: 'leftArrow', target: focusedEle });
            focusedEle = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focusedEle.classList).toContain('e-selected-cell');
            expect(focusedEle.getAttribute('aria-selected')).toEqual('true');
            expect(focusedEle.cellIndex).toEqual(0);
            expect((focusedEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
        it('down and up arrow key', () => {
            keyModule.keyActionHandler({ action: 'home' });
            const targetCell: HTMLElement = schObj.element.querySelector('.e-work-cells:not(.e-other-month)') as HTMLElement;
            keyModule.keyActionHandler({ action: 'downArrow', target: targetCell, preventDefault: (): void => { /** Null */ } });
            let focusedEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focusedEle.classList).toContain('e-selected-cell');
            expect(focusedEle.getAttribute('aria-selected')).toEqual('true');
            expect(focusedEle.cellIndex).toEqual(0);
            expect((focusedEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(1);
            keyModule.keyActionHandler({ action: 'upArrow', target: focusedEle, preventDefault: (): void => { /** Null */ } });
            focusedEle = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focusedEle.classList).toContain('e-selected-cell');
            expect(focusedEle.getAttribute('aria-selected')).toEqual('true');
            expect(focusedEle.cellIndex).toEqual(0);
            expect((focusedEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
        it('navigate to next month using shift right arrow', () => {
            const target: HTMLElement = schObj.element.querySelector('.e-work-cells:not(.e-other-month)');
            target.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = target;
            keyModule.keyActionHandler({ action: 'shiftRightArrow', shiftKey: true, target: target });
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(32);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(1);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(3);
            keyModule.keyActionHandler({ action: 'shiftRightArrow', shiftKey: true, target: focuesdEle });
            focuesdEle = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(60);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(2);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(3);
        });
        it('navigate to previous month using shift left arrow', () => {
            const target: HTMLTableCellElement = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'))[38];
            target.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = target;
            keyModule.keyActionHandler({ action: 'shiftLeftArrow', shiftKey: true, target: target });
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(29);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(1);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(3);
            keyModule.keyActionHandler({ action: 'shiftLeftArrow', shiftKey: true, target: focuesdEle });
            focuesdEle = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(57);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(0);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(3);
        });
        it('navigate to next month using shift down arrow', () => {
            const cells: HTMLTableCellElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            cells[0].click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = cells[0];
            keyModule.keyActionHandler({ action: 'shiftDownArrow', shiftKey: true, target: cells[360], preventDefault: (): void => { /** Null */ } });
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(32);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(1);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(3);
            keyModule.keyActionHandler({ action: 'shiftDownArrow', shiftKey: true, target: focuesdEle, preventDefault: (): void => { /** Null */ } });
            focuesdEle = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(33);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(1);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(4);
        });
        it('navigate to previous month using shift up arrow', () => {
            const target: HTMLTableCellElement = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'))[37];
            target.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = target;
            keyModule.keyActionHandler({ action: 'shiftUpArrow', shiftKey: true, target: target, preventDefault: (): void => { /** Null */ } });
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(2);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(0);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(30);
            keyModule.keyActionHandler({ action: 'shiftUpArrow', shiftKey: true, target: focuesdEle, preventDefault: (): void => { /** Null */ } });
            focuesdEle = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(3);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(0);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(29);
        });
    });

    describe('Vertical year view with resource', () => {
        let schObj: Schedule;
        let keyModule: any;
        beforeAll((done: DoneFn) => {
            const elem: HTMLElement = createElement('div', { id: 'Schedule', attrs: { tabIndex: '1' } });
            const schOptions: ScheduleModel = {
                views: [{ option: 'TimelineYear', orientation: 'Vertical', displayName: 'Vertical Timeline Year' }],
                group: { resources: ['Categories'] },
                resources: [{
                    field: 'TaskId', title: 'Category', name: 'Categories', allowMultiple: true,
                    dataSource: [
                        { text: 'Nancy', id: 1, color: '#df5286' },
                        { text: 'Steven', id: 2, color: '#7fa900' }
                    ],
                    textField: 'text', idField: 'id', colorField: 'color'
                }]
            };
            schObj = util.createSchedule(schOptions, [], done, elem);
            keyModule = schObj.keyboardInteractionModule;
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('home key', () => {
            const firstWorkCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
            expect(firstWorkCell.classList).not.toContain('e-selected-cell');
            expect(firstWorkCell.getAttribute('aria-selected')).toEqual('false');
            keyModule.keyActionHandler({ action: 'home' });
            expect(firstWorkCell.classList).toContain('e-selected-cell');
            expect(firstWorkCell.getAttribute('aria-selected')).toEqual('true');
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
        });
        it('right arrow', () => {
            keyModule.keyActionHandler({ action: 'home' });
            const targetCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
            keyModule.keyActionHandler({ action: 'rightArrow', target: targetCell });
            const focusedEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focusedEle.classList).toContain('e-selected-cell');
            expect(focusedEle.getAttribute('aria-selected')).toEqual('true');
            expect(focusedEle.cellIndex).toEqual(1);
            expect((focusedEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
        it('shift right arrow', () => {
            const cells: HTMLTableCellElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            cells[0].click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = cells[0];
            keyModule.keyActionHandler({ action: 'shiftRightArrow', shiftKey: true, target: cells[10] });
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(12);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(11);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
        it('left arrow', () => {
            keyModule.keyActionHandler({ action: 'home' });
            const cells: HTMLTableCellElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            keyModule.keyActionHandler({ action: 'leftArrow', target: cells[1] });
            const focusedEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focusedEle.classList).toContain('e-selected-cell');
            expect(focusedEle.getAttribute('aria-selected')).toEqual('true');
            expect(focusedEle.cellIndex).toEqual(0);
            expect((focusedEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
        it('shift left arrow', () => {
            const cells: HTMLTableCellElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            cells[11].click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = cells[11];
            keyModule.keyActionHandler({ action: 'shiftLeftArrow', shiftKey: true, target: cells[1] });
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(12);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(0);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
    });

    describe('EJ2-49958 - Enter key with enabled readonly property', () => {
        let schObj: Schedule;
        let keyModule: any;
        beforeAll((done: DoneFn) => {
            const elem: HTMLElement = createElement('div', { id: 'Schedule', attrs: { tabIndex: '1' } });
            const schOptions: ScheduleModel = { width: '100%', height: '500px', currentView: 'Week', readonly: true, selectedDate: new Date(2017, 10, 2) };
            schObj = util.createSchedule(schOptions, defaultData, done, elem);
            keyModule = schObj.keyboardInteractionModule;
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('checking Enter key with enabled readonly property', () => {
            util.triggerMouseEvent(schObj.element.querySelector('.e-appointment'), 'click');
            keyModule.keyActionHandler({ action: 'escape' });
            const firstWorkCell: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-border'));
            expect(firstWorkCell[0].classList).toContain('e-appointment-border');
            expect(firstWorkCell[0].getAttribute('aria-disabled')).toEqual('true');
            keyModule.keyActionHandler({ action: 'enter', target: firstWorkCell[0] });
            const popup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(popup.classList).toContain('e-popup-open');
            keyModule.keyActionHandler({ action: 'escape' });
            expect(popup.classList).toContain('e-popup-close');
            keyModule.keyActionHandler({ action: 'enter', target: schObj.element.querySelector('.e-work-cells') });
            expect(popup.classList).toContain('e-popup-close');
        });
    });

    describe('F12 key for inline editing', () => {
        let schObj: Schedule;
        let keyModule: any;
        beforeAll((done: DoneFn) => {
            const elem: HTMLElement = createElement('div', { id: 'Schedule', attrs: { tabIndex: '1' } });
            const schOptions: ScheduleModel = { width: '100%', height: '500px', currentView: 'Week', allowInline: true, selectedDate: new Date(2017, 10, 2) };
            schObj = util.createSchedule(schOptions, defaultData, done, elem);
            keyModule = schObj.keyboardInteractionModule;
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('allow inline appointment creation', (done: Function) => {
            schObj.dataBound = () => {
                const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(eventElementList.length).toEqual(14);
                expect((eventElementList[1].querySelector('.e-subject') as HTMLElement).innerHTML).toBe('Testing');
                done();
            };
            keyModule.keyActionHandler({ action: 'home' });
            expect(schObj.element.querySelector('.e-inline-appointment')).toBeFalsy();
            keyModule.keyActionHandler({
                action: 'fTwelve', target: schObj.element.querySelector('.e-work-cells'),
                preventDefault: (): void => { /** Null */ }
            });
            expect(schObj.element.querySelector('.e-inline-appointment')).toBeTruthy();
            const inputElement: HTMLInputElement = schObj.element.querySelector('.e-inline-subject') as HTMLInputElement;
            expect(inputElement.classList.contains('e-inline-subject')).toBeTruthy();
            inputElement.value = 'Testing';
            keyModule.keyActionHandler({ action: 'enter', target: schObj.element.querySelector('.e-inline-subject') });
        });

        it('allow inline edit action', (done: Function) => {
            schObj.dataBound = () => {
                const eventElement: Element = schObj.element.querySelector('[data-id="Appointment_4"]');
                expect(eventElement).toBeTruthy();
                expect((eventElement.querySelector('.e-subject') as HTMLElement).innerHTML).toBe('Testing - edited');
                done();
            };
            expect(schObj.element.querySelector('.e-inline-appointment')).toBeFalsy();
            keyModule.keyActionHandler({
                action: 'fTwelve', target: schObj.element.querySelector('.e-appointment'),
                preventDefault: (): void => { /** Null */ }
            });
            const inputElement: HTMLInputElement = schObj.element.querySelector('.e-inline-subject') as HTMLInputElement;
            expect(inputElement.classList.contains('e-inline-subject')).toBeTruthy();
            inputElement.value = 'Testing - edited';
            keyModule.keyActionHandler({ action: 'enter', target: inputElement });
        });
    });

    describe('EJ2-59285 - Event deselection issue checking', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                width: '100%',
                height: '650px',
                views: ['Month'],
                allowMultiDrag: true,
                showQuickInfo: false,
                selectedDate: new Date(2017, 10, 1)
            };
            schObj = util.createSchedule(model, defaultData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Ensuring event deselection', () => {
            const apps: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            apps[0].click();
            util.triggerMouseEvent(apps[1], 'click', 0, 0, false, true);
            expect(schObj.element.querySelectorAll('.e-appointment-border').length).toEqual(2);
            expect((document.activeElement as HTMLElement).dataset.id).toEqual('Appointment_2');
            util.triggerMouseEvent(apps[2], 'click', 0, 0, false, true);
            expect(schObj.element.querySelectorAll('.e-appointment-border').length).toEqual(3);
            expect((document.activeElement as HTMLElement).dataset.id).toEqual('Appointment_3');
            util.triggerMouseEvent(apps[3], 'click', 0, 0, false, true);
            expect(schObj.element.querySelectorAll('.e-appointment-border').length).toEqual(4);
            expect((document.activeElement as HTMLElement).dataset.id).toEqual('Appointment_4');
            util.triggerMouseEvent(apps[3], 'click', 0, 0, false, true);
            expect(schObj.element.querySelectorAll('.e-appointment-border').length).toEqual(3);
            expect((document.activeElement as HTMLElement).dataset.id).toEqual('Appointment_3');
            util.triggerMouseEvent(apps[2], 'click', 0, 0, false, true);
            expect(schObj.element.querySelectorAll('.e-appointment-border').length).toEqual(2);
            expect((document.activeElement as HTMLElement).dataset.id).toEqual('Appointment_2');
            util.triggerMouseEvent(apps[1], 'click', 0, 0, false, true);
            expect(schObj.element.querySelectorAll('.e-appointment-border').length).toEqual(1);
            expect((document.activeElement as HTMLElement).dataset.id).toEqual('Appointment_1');
        });
    });

    describe('EJ2-69775 - Cell Selection order is wrong in getSelectedElements public method', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                width: '100%',
                height: '650px',
                views: ['Week'],
                selectedDate: new Date(2023, 3, 1)
            };
            schObj = util.createSchedule(model, [], done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Check the order of cell selection', () => {
            const workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            util.triggerMouseEvent(workCells[149], 'mousedown');
            util.triggerMouseEvent(workCells[136], 'mousemove');
            util.triggerMouseEvent(workCells[136], 'mouseup');
            const selectedCells: Element[] = schObj.getSelectedElements();
            expect(selectedCells.length).toBe(47);
            expect(selectedCells[0].getAttribute('data-date')).toEqual('1679999400000');
            expect(selectedCells[selectedCells.length - 1].getAttribute('data-date')).toEqual('1680082200000');
            const selectedCellDetails: CellClickEventArgs = schObj.getCellDetails(selectedCells);
            expect(selectedCellDetails.startTime.getTime()).toEqual(new Date(1679999400000).getTime());
            expect(selectedCellDetails.endTime.getTime()).toEqual(new Date(1680084000000).getTime());
            expect((selectedCellDetails.element as HTMLElement[]).length).toBe(47);
        });
    });

    describe('should prevent escape key in selected cell', () => {
        let schObj: Schedule;
        let keyModule: any;
        beforeAll((done: DoneFn) => {
            const elem: HTMLElement = createElement('div', { id: 'Schedule', attrs: { tabIndex: '1' } });
            const schOptions: ScheduleModel = { selectedDate: new Date(2017, 9, 4), views: ['Week'] };
            schObj = util.createSchedule(schOptions, [], done, elem);
            keyModule = schObj.keyboardInteractionModule;
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Escape key', () => {
            keyModule.keyActionHandler({ action: 'home' });
            const targetCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
            keyModule.keyActionHandler({ action: 'rightArrow', target: targetCell });
            let focusedEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            keyModule.keyActionHandler({ action: 'rightArrow', target: focusedEle });
            focusedEle = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            keyModule.keyActionHandler({ action: 'rightArrow', target: focusedEle });
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            focusedEle = document.activeElement as HTMLTableCellElement;
            keyModule.keyActionHandler({ action: 'escape' });
            const fourthWorkCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[3] as HTMLElement;
            expect(fourthWorkCell.isEqualNode(focusedEle)).toBe(true);
            expect(fourthWorkCell.classList.contains('e-selected-cell')).toBe(true);
            const firstWorkCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement;
            expect(firstWorkCell.isEqualNode(focusedEle)).toBe(false);
            expect(firstWorkCell.classList.contains('e-selected-cell')).toBe(false);
            schObj.allowInline = true;
            schObj.dataBind();
        });
        it('ES- 837309 - Check with AllowInline Property', () => {
            let workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            workCells[16].click();
            expect(schObj.element.querySelectorAll('.e-appointment.e-inline-appointment').length).toEqual(1);
            keyModule.keyActionHandler({ action: 'escape' });
            expect(schObj.element.querySelectorAll('.e-appointment.e-inline-appointment').length).toEqual(0);
            keyModule.keyActionHandler({ action: 'rightArrow', target: workCells[16] });
            workCells = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            expect(workCells[17].className).toContain('e-selected-cell');
        });
    });

    describe('ES-845365 - Checking showQuickinfoOnSelectionEnd property', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const schOptions: ScheduleModel = {
                width: '100%',
                height: '550px',
                currentView: 'TimelineDay',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek'],
                selectedDate: new Date(2023, 8, 1),
                quickInfoOnSelectionEnd: true,
                group: { resources: ['Rooms', 'Owners'] },
                resources: [{
                    field: 'RoomId', title: 'Room', name: 'Rooms',
                    dataSource: [
                        { RoomText: 'ROOM 1', Id: 1, RoomColor: '#cb6bb2' },
                        { RoomText: 'ROOM 2', Id: 2, RoomColor: '#56ca85' }
                    ],
                    textField: 'RoomText', idField: 'Id', colorField: 'RoomColor'
                }, {
                    field: 'OwnerId', title: 'Owner', name: 'Owners',
                    dataSource: [
                        { OwnerText: 'Nancy', Id: 1, OwnerGroupId: 1, OwnerColor: '#ffaa00' },
                        { OwnerText: 'Steven', Id: 2, OwnerGroupId: 2, OwnerColor: '#f8a398' },
                        { OwnerText: 'Michael', Id: 3, OwnerGroupId: 1, OwnerColor: '#7499e1' }
                    ],
                    textField: 'OwnerText', idField: 'Id', groupIDField: 'OwnerGroupId', colorField: 'OwnerColor'
                }]
            };
            schObj = util.createSchedule(schOptions, [], done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Checking on unselected Resource cell', () => {
            const workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            util.triggerMouseEvent(workCells[68], 'mousedown');
            util.triggerMouseEvent(workCells[72], 'mousemove');
            util.triggerMouseEvent(workCells[120], 'mousemove');
            util.triggerMouseEvent(workCells[120], 'mouseup');
            const quickPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper');
            expect(quickPopup.classList).toContain('e-popup-open');
            expect((quickPopup.querySelector('.e-resource-details') as HTMLElement).innerText).toBe('Nancy');
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
