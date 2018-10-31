/**
 * Schedule keyboard interaction spec 
 */
import { createElement, remove, EmitType } from '@syncfusion/ej2-base';
import { Schedule, ScheduleModel, Day, Week, WorkWeek, Month, Agenda } from '../../../src/schedule/index';
import { defaultData, timelineData, timelineResourceData, cloneDataSource } from '../base/datasource.spec';
import { triggerMouseEvent, disableScheduleAnimation } from '../util.spec';
import { createSchedule, destroy } from '../util.spec';

Schedule.Inject(Day, Week, WorkWeek, Month, Agenda);

describe('Keyboard interaction', () => {
    describe('allowKeyboardInteraction', () => {
        let schObj: Schedule;
        // tslint:disable-next-line:no-any
        let keyModule: any;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        beforeEach(() => {
            document.body.appendChild(elem);
        });
        afterEach(() => {
            if (schObj) {
                schObj.destroy();
            }
            remove(elem);
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
        // tslint:disable-next-line:no-any
        let keyModule: any;
        let elem: HTMLElement = createElement('div', { id: 'Schedule', attrs: { tabIndex: '1' } });
        beforeAll(() => {
            document.body.appendChild(elem);
            schObj = new Schedule({ selectedDate: new Date(2017, 9, 4) });
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
        it('ensure module name', () => {
            expect(keyModule.getModuleName()).toEqual('keyboard');
        });
        it('home key', () => {
            let firstWorkCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
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
        });
    });

    describe('vertical view with appointments', () => {
        let schObj: Schedule;
        // tslint:disable-next-line:no-any
        let keyModule: any;
        let elem: HTMLElement = createElement('div', { id: 'Schedule', attrs: { tabIndex: '1' } });
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            schObj = new Schedule({
                selectedDate: new Date(2017, 10, 2),
                eventSettings: { dataSource: defaultData },
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
        it('Tab key work cell to appointment selection', () => {
            let allDayRowCells: HTMLElement[] = [].slice.call(schObj.element.querySelector('.e-all-day-row').children);
            let workCell: HTMLElement = allDayRowCells[0] as HTMLElement;
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
            let firstWorkCell: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-border'));
            expect(firstWorkCell[0].classList).toContain('e-appointment-border');
            expect(firstWorkCell[0].getAttribute('aria-selected')).toEqual('true');
            keyModule.keyActionHandler({ action: 'enter', target: firstWorkCell[0] });
            let popup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(popup.classList.contains('e-popup-open')).toEqual(true);
            keyModule.keyActionHandler({ action: 'escape' });
            expect(schObj.element.querySelectorAll('.e-appointment-border').length).toEqual(1);
        });
        it('Enter key', () => {
            triggerMouseEvent(schObj.element.querySelector('.e-appointment'), 'click');
            keyModule.keyActionHandler({ action: 'escape' });
            let firstWorkCell: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-border'));
            expect(firstWorkCell[0].classList).toContain('e-appointment-border');
            expect(firstWorkCell[0].getAttribute('aria-selected')).toEqual('true');
            keyModule.keyActionHandler({ action: 'enter', target: firstWorkCell[0] });
            let popup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(popup.classList).toContain('e-popup-open');
            keyModule.keyActionHandler({ action: 'escape' });
            expect(popup.classList).toContain('e-popup-close');
            keyModule.keyActionHandler({ action: 'enter', target: schObj.element.querySelector('.e-work-cells') });
            expect(popup.classList).toContain('e-popup-open');
            keyModule.keyActionHandler({ action: 'escape' });
            expect(popup.classList).toContain('e-popup-close');
        });
        it('Enter key for edit option', () => {
            let appointments: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            appointments[0].click();
            let popup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(popup).toBeTruthy();
            keyModule.keyActionHandler({
                action: 'enter', target: popup.querySelector('.e-event-edit'),
                shiftKey: false, preventDefault: (): void => { /** Null */ }
            });
            let cancelButton: HTMLElement = schObj.eventWindow.dialogObject.element.querySelector('.e-event-cancel') as HTMLElement;
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
            let firstWorkCell: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            expect(firstWorkCell[firstWorkCell.length - 10].classList).not.toContain('e-selected-cell');
            expect(firstWorkCell[firstWorkCell.length - 10].getAttribute('aria-selected')).toEqual('false');
            firstWorkCell[firstWorkCell.length - 10].click();
            let popup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(popup.classList).toContain('e-popup-open');
            keyModule.keyActionHandler({
                action: 'enter', target: popup.querySelector('.e-event-details'),
                shiftKey: false, preventDefault: (): void => { /** Null */ }
            });
            let cancelButton: HTMLElement = schObj.eventWindow.dialogObject.element.querySelector('.e-event-cancel') as HTMLElement;
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
            let allDayRowCells: HTMLElement[] = [].slice.call(schObj.element.
                querySelector('.e-all-day-row').children);
            let workCell: HTMLElement = allDayRowCells[allDayRowCells.length - 1] as HTMLElement;
            workCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({
                action: 'shiftTab', target: workCell,
                shiftKey: true, preventDefault: (): void => { /** Null */ }
            });
            expect(schObj.element.querySelectorAll('.e-appointment-border').length).toEqual(1);
        });
        it('multiple event selection via ctrl plus click', () => {
            let firstWorkCell: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            firstWorkCell[0].click();
            triggerMouseEvent(firstWorkCell[1], 'click', 0, 0, false, true);
            expect(schObj.element.querySelectorAll('.e-appointment-border').length).toEqual(2);
            triggerMouseEvent(firstWorkCell[1], 'click', 0, 0, false, true);
            expect(schObj.element.querySelectorAll('.e-appointment-border').length).toEqual(1);
            keyModule.keyActionHandler({ action: 'escape' });
        });
        it('Delete key', () => {
            (schObj.element.querySelector('.e-appointment') as HTMLElement).click();
            expect(schObj.element.querySelectorAll('.e-appointment-border').length).toEqual(1);
            let selectedElement: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-border'));
            expect(selectedElement[0].classList).toContain('e-appointment-border');
            expect(selectedElement[0].getAttribute('aria-selected')).toEqual('true');
            keyModule.keyActionHandler({ action: 'delete', target: selectedElement[0] });
            expect(schObj.element.querySelectorAll('.e-appointment-border').length).toEqual(1);
            (<HTMLElement>schObj.quickPopup.quickDialog.element.querySelector('.e-dlg-closeicon-btn')).click();
        });
        it('Right arrow key with appointment selection', () => {
            (schObj.element.querySelector('.e-appointment') as HTMLElement).click();
            expect(schObj.element.querySelectorAll('.e-appointment-border').length).toEqual(1);
            let selectedElement: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-border'));
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'rightArrow', target: selectedElement[0] });
            expect(schObj.element.querySelectorAll('.e-appointment-border').length).toEqual(0);
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
        });
        it('Left arrow key with appointment selection', () => {
            (schObj.element.querySelector('.e-appointment') as HTMLElement).click();
            expect(schObj.element.querySelectorAll('.e-appointment-border').length).toEqual(1);
            let selectedElement: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-border'));
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'leftArrow', target: selectedElement[0] });
            expect(schObj.element.querySelectorAll('.e-appointment-border').length).toEqual(0);
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
        });
        it('Tab/shift key for event edit option', () => {
            (schObj.element.querySelector('.e-appointment') as HTMLElement).click();
            let popup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
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
            let firstWorkCell: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            expect(firstWorkCell[0].classList).not.toContain('e-selected-cell');
            expect(firstWorkCell[0].getAttribute('aria-selected')).toEqual('false');
            firstWorkCell[0].click();
            let popup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
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
            let allDayRowCells: HTMLElement[] = [].slice.call(schObj.element.querySelector('.e-all-day-row').children);
            expect(allDayRowCells.length).toEqual(7);
            let workCell: HTMLElement = allDayRowCells[0] as HTMLElement;
            workCell.click();
            let cellPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
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
        // tslint:disable-next-line:no-any
        let keyModule: any;
        let elem: HTMLElement = createElement('div', { id: 'Schedule', attrs: { tabIndex: '1' } });
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            schObj = new Schedule({
                currentView: 'Month',
                selectedDate: new Date(2017, 10, 2),
                eventSettings: { dataSource: defaultData },
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
        it('Escape key', () => {
            let moreIndicator: HTMLElement = schObj.element.querySelector('.e-more-indicator') as HTMLElement;
            moreIndicator.click();
            let popup: HTMLElement = schObj.element.querySelector('.e-more-popup-wrapper') as HTMLElement;
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
            let moreIndicator: HTMLElement = schObj.element.querySelector('.e-more-indicator') as HTMLElement;
            moreIndicator.click();
            let popup: HTMLElement = schObj.element.querySelector('.e-more-popup-wrapper') as HTMLElement;
            expect(popup).toBeTruthy();
            expect(popup.classList.contains('e-popup-open')).toBe(true);
            keyModule.keyActionHandler({ action: 'enter', target: popup.querySelector('.e-more-event-close') });
            expect(popup).toBeTruthy();
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
        });
        it('Tab key for more event list', () => {
            let moreIndicator: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
            moreIndicator[1].click();
            let popup: HTMLElement = schObj.element.querySelector('.e-more-popup-wrapper') as HTMLElement;
            expect(popup.classList.contains('e-popup-open')).toBe(true);
            let apps: HTMLElement[] = [].slice.call(popup.querySelectorAll('.e-appointment'));
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
            let moreIndicator: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
            moreIndicator[1].click();
            let popup: HTMLElement = schObj.element.querySelector('.e-more-popup-wrapper') as HTMLElement;
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
            let moreIndicator: HTMLElement = schObj.element.querySelector('.e-more-indicator') as HTMLElement;
            moreIndicator.click();
            let popup: HTMLElement = schObj.element.querySelector('.e-more-popup-wrapper') as HTMLElement;
            expect(popup).toBeTruthy();
            expect(popup.classList.contains('e-popup-open')).toBe(true);
            keyModule.keyActionHandler({ action: 'enter', target: popup.querySelector('.e-header-date') });
            expect(popup).toBeTruthy();
            expect(popup.classList.contains('e-popup-open')).toBe(false);
        });
    });

    describe('vertical view with appointments for agenda view', () => {
        let schObj: Schedule;
        // tslint:disable-next-line:no-any
        let keyModule: any;
        let elem: HTMLElement = createElement('div', { id: 'Schedule', attrs: { tabIndex: '1' } });
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            schObj = new Schedule({
                width: '100%',
                height: '500px',
                currentView: 'Agenda',
                selectedDate: new Date(2017, 10, 2),
                eventSettings: { dataSource: defaultData },
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
        it('ensure module name', () => {
            expect(keyModule.getModuleName()).toEqual('keyboard');
        });
        it('Down key press', () => {
            schObj.element.focus();
            let firstWorkCell: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(firstWorkCell[0].classList).not.toContain('e-appointment-border');
            keyModule.keyActionHandler({ action: 'downArrow', target: schObj.element });
            expect(schObj.element.querySelectorAll('.e-appointment-border').length).toEqual(1);
            keyModule.keyActionHandler({ action: 'downArrow', target: schObj.element });
            expect(schObj.element.querySelectorAll('.e-appointment-border').length).toEqual(1);
            keyModule.keyActionHandler({ action: 'downArrow', target: schObj.element });
            expect(schObj.element.querySelectorAll('.e-appointment-border').length).toEqual(1);
        });
        it('Up key press', () => {
            let firstWorkCell: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-border'));
            expect(firstWorkCell[0].classList).toContain('e-appointment-border');
            expect(schObj.element.querySelectorAll('.e-appointment-border').length).toEqual(1);
            keyModule.keyActionHandler({ action: 'upArrow', target: schObj.element });
            expect(schObj.element.querySelectorAll('.e-appointment-border').length).toEqual(1);
            keyModule.keyActionHandler({ action: 'upArrow', target: schObj.element });
            expect(schObj.element.querySelectorAll('.e-appointment-border').length).toEqual(1);
        });
        it('Right arrow key with appointment selection', () => {
            let selectedElement: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-border'));
            expect(schObj.element.querySelectorAll('.e-active-appointment-agenda').length).toEqual(1);
            expect(schObj.element.querySelectorAll('.e-appointment-border').length).toEqual(1);
            keyModule.keyActionHandler({ action: 'rightArrow', target: selectedElement[0] });
        });
    });

    describe('vertical arrow keys', () => {
        let schObj: Schedule;
        // tslint:disable-next-line:no-any
        let keyModule: any;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        beforeAll(() => {
            document.body.appendChild(elem);
            schObj = new Schedule({ selectedDate: new Date(2017, 9, 4) });
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
        it('multiple cell selection via shift plus click', () => {
            let workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            keyModule.initialTarget = workCells[2];
            triggerMouseEvent(workCells[17], 'click', 0, 0, true);
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(53);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(3);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(2);
            keyModule.keyActionHandler({ action: 'enter', target: focuesdEle });
        });
        it('multiple work cells selection via mouse', () => {
            let workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            triggerMouseEvent(workCells[2], 'mousedown');
            triggerMouseEvent(workCells[17], 'mousemove');
            triggerMouseEvent(workCells[17], 'mouseup');
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(53);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(3);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(2);
            keyModule.keyActionHandler({ action: 'enter', target: focuesdEle });
        });
        it('multiple allday cells selection via mouse', () => {
            let alldayCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-date-header-container .e-all-day-cells'));
            triggerMouseEvent(alldayCells[2], 'mousedown');
            triggerMouseEvent(alldayCells[4], 'mousemove');
            triggerMouseEvent(alldayCells[4], 'mouseup');
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(3);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-all-day-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(4);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(1);
            keyModule.keyActionHandler({ action: 'enter', target: focuesdEle });
        });
        it('mouse move out of schedule while selection via mouse', () => {
            let workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            triggerMouseEvent(workCells[2], 'mousedown');
            triggerMouseEvent(schObj.element.querySelector('.e-time-cells') as HTMLElement, 'mousemove');
            triggerMouseEvent(workCells[29], 'mousemove');
            triggerMouseEvent(workCells[29], 'mouseup');
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
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
            let targetCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
            keyModule.keyActionHandler({ action: 'downArrow', target: targetCell });
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(0);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(1);
        });
        it('down arrow - last row cell', () => {
            let target: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[335] as HTMLElement;
            target.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'downArrow', target: target });
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(6);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(47);
        });
        it('down arrow - all day row cell', () => {
            let target: HTMLElement = schObj.element.querySelectorAll('.e-all-day-cells')[3] as HTMLElement;
            target.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'downArrow', target: target });
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-all-day-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(2);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(1);
        });
        it('up arrow', () => {
            let targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[18] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'upArrow', target: targetCell });
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(4);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(1);
        });
        it('up arrow first row cell', () => {
            let targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[1] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'upArrow', target: targetCell });
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(1);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
        it('up arrow - last row cell', () => {
            let target: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[335] as HTMLElement;
            target.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'upArrow', target: target });
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(6);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(46);
        });
        it('up arrow - all day row cell', () => {
            let target: HTMLElement = schObj.element.querySelectorAll('.e-all-day-cells')[3] as HTMLElement;
            target.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'upArrow', target: target });
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-all-day-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(2);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(1);
        });
        it('right arrow', () => {
            let targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[18] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'rightArrow', target: targetCell });
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(5);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(2);
        });
        it('right arrow first row cell', () => {
            let targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[1] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'rightArrow', target: targetCell });
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(2);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
        it('right arrow - last work cell next navigation', () => {
            let target: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[335] as HTMLElement;
            target.click();
            keyModule.keyActionHandler({ action: 'escape' });
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).
                toEqual('October 01 - 07, 2017');
            keyModule.keyActionHandler({ action: 'rightArrow', target: target });
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).
                toEqual('October 08 - 14, 2017');
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(0);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(47);
        });
        it('right arrow - last allday cell next navigation', () => {
            let target: HTMLElement = schObj.element.querySelectorAll('.e-date-header-container .e-all-day-cells')[6] as HTMLElement;
            target.click();
            keyModule.keyActionHandler({ action: 'escape' });
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).
                toEqual('October 08 - 14, 2017');
            keyModule.keyActionHandler({ action: 'rightArrow', target: target });
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).
                toEqual('October 15 - 21, 2017');
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-all-day-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(0);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(1);
        });
        it('right arrow - all day row cell', () => {
            let target: HTMLElement = schObj.element.querySelectorAll('.e-all-day-cells')[3] as HTMLElement;
            target.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'rightArrow', target: target });
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-all-day-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(3);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(1);
        });
        it('left arrow', () => {
            let targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[18] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'leftArrow', target: targetCell });
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(3);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(2);
        });
        it('left arrow first work cell previous navigation', () => {
            let targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).
                toEqual('October 15 - 21, 2017');
            keyModule.keyActionHandler({ action: 'leftArrow', target: targetCell });
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).
                toEqual('October 08 - 14, 2017');
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(6);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
        it('left arrow first allday cell previous navigation', () => {
            let targetCell: HTMLElement = schObj.element.querySelectorAll('.e-date-header-container .e-all-day-cells')[0] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).
                toEqual('October 08 - 14, 2017');
            keyModule.keyActionHandler({ action: 'leftArrow', target: targetCell });
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).
                toEqual('October 01 - 07, 2017');
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-all-day-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(6);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(1);
        });
        it('left arrow - last row cell', () => {
            let target: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[335] as HTMLElement;
            target.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'leftArrow', target: target });
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(5);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(47);
        });
        it('left arrow - all day row cell', () => {
            let target: HTMLElement = schObj.element.querySelectorAll('.e-all-day-cells')[3] as HTMLElement;
            target.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'leftArrow', target: target });
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-all-day-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(1);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(1);
        });
        it('shiftDown arrow', () => {
            let targetCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = targetCell;
            keyModule.keyActionHandler({ action: 'shiftDownArrow', shiftKey: true, target: targetCell });
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(2);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(0);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(1);
            keyModule.keyActionHandler({ action: 'shiftDownArrow', shiftKey: true, target: focuesdEle });
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(3);
        });
        it('shiftDown arrow - last row cell', () => {
            let target: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[335] as HTMLElement;
            target.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = target;
            keyModule.keyActionHandler({ action: 'shiftDownArrow', shiftKey: true, target: target });
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(6);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(47);
        });
        it('shiftDown arrow - all day row cell', () => {
            let target: HTMLElement = schObj.element.querySelectorAll('.e-all-day-cells')[3] as HTMLElement;
            target.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = target;
            keyModule.keyActionHandler({ action: 'shiftDownArrow', shiftKey: true, target: target });
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-all-day-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(2);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(1);
        });
        it('shiftUp arrow', () => {
            let targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[18] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = targetCell;
            keyModule.keyActionHandler({ action: 'shiftUpArrow', shiftKey: true, target: targetCell });
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(2);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(4);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(1);
        });
        it('shiftUp arrow first row cell', () => {
            let targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[1] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = targetCell;
            keyModule.keyActionHandler({ action: 'shiftUpArrow', shiftKey: true, target: targetCell });
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(1);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
        it('shiftUp arrow - last row cell', () => {
            let target: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[335] as HTMLElement;
            target.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = target;
            keyModule.keyActionHandler({ action: 'shiftUpArrow', shiftKey: true, target: target });
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(2);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(6);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(46);
        });
        it('shiftUp arrow - all day row cell', () => {
            let target: HTMLElement = schObj.element.querySelectorAll('.e-all-day-cells')[3] as HTMLElement;
            target.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = target;
            keyModule.keyActionHandler({ action: 'shiftUpArrow', shiftKey: true, target: target });
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-all-day-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(2);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(1);
        });
        it('shiftRight arrow', () => {
            let targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[18] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = targetCell;
            keyModule.keyActionHandler({ action: 'shiftRightArrow', shiftKey: true, target: targetCell });
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
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
            let target: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[335] as HTMLElement;
            target.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = target;
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).
                toEqual('October 01 - 07, 2017');
            keyModule.keyActionHandler({ action: 'shiftRightArrow', shiftKey: true, target: target });
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).
                toEqual('October 01 - 07, 2017');
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(6);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(47);
        });
        it('shiftRight arrow - last allday cell next navigation', () => {
            let target: HTMLElement = schObj.element.querySelectorAll('.e-date-header-container .e-all-day-cells')[6] as HTMLElement;
            target.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = target;
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).
                toEqual('October 01 - 07, 2017');
            keyModule.keyActionHandler({ action: 'shiftRightArrow', shiftKey: true, target: target });
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).
                toEqual('October 01 - 07, 2017');
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-all-day-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(6);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(1);
        });
        it('shiftRight arrow - all day row cell', () => {
            let target: HTMLElement = schObj.element.querySelectorAll('.e-all-day-cells')[3] as HTMLElement;
            target.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = target;
            keyModule.keyActionHandler({ action: 'shiftRightArrow', shiftKey: true, target: target });
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(2);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-all-day-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(3);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(1);
        });
        it('shiftLeft arrow', () => {
            let targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[18] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = targetCell;
            keyModule.keyActionHandler({ action: 'shiftLeftArrow', shiftKey: true, target: targetCell });
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
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
            let targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = targetCell;
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).
                toEqual('October 01 - 07, 2017');
            keyModule.keyActionHandler({ action: 'shiftLeftArrow', shiftKey: true, target: targetCell });
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).
                toEqual('October 01 - 07, 2017');
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(0);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
        it('shiftLeft arrow first allday cell prevent previous navigation', () => {
            let targetCell: HTMLElement = schObj.element.querySelectorAll('.e-date-header-container .e-all-day-cells')[0] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = targetCell;
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).
                toEqual('October 01 - 07, 2017');
            keyModule.keyActionHandler({ action: 'shiftLeftArrow', shiftKey: true, target: targetCell });
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).
                toEqual('October 01 - 07, 2017');
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-all-day-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(0);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(1);
        });
        it('shiftLeft arrow - last row cell', () => {
            let target: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[335] as HTMLElement;
            target.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = target;
            keyModule.keyActionHandler({ action: 'shiftLeftArrow', shiftKey: true, target: target });
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(51);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(5);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(47);
        });
        it('shiftLeft arrow - all day row cell', () => {
            let target: HTMLElement = schObj.element.querySelectorAll('.e-all-day-cells')[3] as HTMLElement;
            target.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = target;
            keyModule.keyActionHandler({ action: 'shiftLeftArrow', shiftKey: true, target: target });
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
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
        // tslint:disable-next-line:no-any
        let keyModule: any;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        beforeAll(() => {
            document.body.appendChild(elem);
            schObj = new Schedule({ selectedDate: new Date(2017, 9, 4), currentView: 'Month' });
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
        it('multiple cell selection via shift plus click', () => {
            let workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            keyModule.initialTarget = workCells[2];
            triggerMouseEvent(workCells[12], 'mousedown', 0, 0, true);
            triggerMouseEvent(workCells[12], 'click', 0, 0, true);
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
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
            let workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            triggerMouseEvent(workCells[3], 'mousedown');
            triggerMouseEvent(workCells[18], 'mousemove');
            triggerMouseEvent(workCells[18], 'mouseup');
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(16);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(4);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(2);
            keyModule.keyActionHandler({ action: 'enter', target: focuesdEle });
        });
        it('down arrow', () => {
            let targetCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'downArrow', target: targetCell });
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(0);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(1);
        });
        it('down arrow - last row cell', () => {
            let workCell: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            let target: HTMLElement = workCell[workCell.length - 2];
            target.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'downArrow', target: target });
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(5);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).
                toEqual((target.parentNode as HTMLTableRowElement).sectionRowIndex);
        });
        it('up arrow', () => {
            let targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[3] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'upArrow', target: targetCell });
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(3);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
        it('up arrow - last row cell', () => {
            let workCell: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            let target: HTMLElement = workCell[workCell.length - 2];
            target.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'upArrow', target: target });
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(5);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).
                toEqual((target.parentNode as HTMLTableRowElement).sectionRowIndex - 1);
        });
        it('right arrow', () => {
            let targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[18] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'rightArrow', target: targetCell });
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(5);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(2);
            keyModule.keyActionHandler({ action: 'rightArrow', target: schObj.element.querySelector('.e-header-cells') });
        });
        it('right arrow first row last cell', () => {
            let targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[6] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'rightArrow', target: targetCell });
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(0);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(1);
        });
        it('right arrow - last work cell next navigation', () => {
            let workCell: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            let target: HTMLElement = workCell[workCell.length - 1];
            target.click();
            keyModule.keyActionHandler({ action: 'escape' });
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).
                toEqual('October 2017');
            keyModule.keyActionHandler({ action: 'rightArrow', target: target });
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).
                toEqual('November 2017');
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(0);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
        it('left arrow', () => {
            let targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[5] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'leftArrow', target: targetCell });
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(4);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
            keyModule.keyActionHandler({ action: 'leftArrow', target: schObj.element.querySelector('.e-header-cells') });
        });
        it('left arrow second row first cell', () => {
            let targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[7] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'leftArrow', target: targetCell });
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(6);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
        it('left arrow first work cell previous navigation', () => {
            let targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).
                toEqual('November 2017');
            keyModule.keyActionHandler({ action: 'leftArrow', target: targetCell });
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).
                toEqual('October 2017');
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(6);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(4);
        });
        it('shiftDown arrow', () => {
            let targetCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = targetCell;
            keyModule.keyActionHandler({ action: 'shiftDownArrow', shiftKey: true, target: targetCell });
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(8);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(0);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(1);
        });
        it('shiftUp arrow', () => {
            let targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[18] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = targetCell;
            keyModule.keyActionHandler({ action: 'shiftUpArrow', shiftKey: true, target: targetCell });
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(8);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(4);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(1);
        });
        it('shiftRight arrow', () => {
            let targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[4] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = targetCell;
            keyModule.keyActionHandler({ action: 'shiftRightArrow', shiftKey: true, target: targetCell });
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
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
            let workCell: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            let target: HTMLElement = workCell[workCell.length - 1];
            target.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = target;
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).
                toEqual('October 2017');
            keyModule.keyActionHandler({ action: 'shiftRightArrow', shiftKey: true, target: target });
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).
                toEqual('October 2017');
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(6);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(4);
        });
        it('shiftLeft arrow', () => {
            let targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[4] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = targetCell;
            keyModule.keyActionHandler({ action: 'shiftLeftArrow', shiftKey: true, target: targetCell });
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
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
            let targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = targetCell;
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).
                toEqual('October 2017');
            keyModule.keyActionHandler({ action: 'shiftLeftArrow', shiftKey: true, target: targetCell });
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).
                toEqual('October 2017');
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
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
        // tslint:disable-next-line:no-any
        let keyModule: any;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => {
                keyModule = schObj.keyboardInteractionModule;
                done();
            };
            document.body.appendChild(elem);
            schObj = new Schedule({
                width: '100%',
                height: '550px',
                currentView: 'Month',
                selectedDate: new Date(2017, 9, 4),
                group: {
                    resources: ['Rooms', 'Owners']
                },
                resources: [
                    {
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
                    }
                ],
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
        it('shiftRight arrow', () => {
            let targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[6] as HTMLElement;
            targetCell.click();
            keyModule.initialTarget = targetCell;
            keyModule.keyActionHandler({ action: 'shiftRightArrow', shiftKey: true, target: targetCell });
            expect(targetCell.getAttribute('data-group-index')).toEqual('0');
            let lastCell: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(lastCell.getAttribute('data-group-index')).toEqual('0');
            schObj.removeSelectedClass();
        });
        it('shiftLeft arrow', () => {
            let targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[28] as HTMLElement;
            targetCell.click();
            keyModule.initialTarget = targetCell;
            keyModule.keyActionHandler({ action: 'shiftLeftArrow', shiftKey: true, target: targetCell });
            expect(targetCell.getAttribute('data-group-index')).toEqual('1');
            let lastCell: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(lastCell.getAttribute('data-group-index')).toEqual('1');
            schObj.removeSelectedClass();
        });
        it('multiple work cells right selection via mouse', () => {
            let workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            triggerMouseEvent(workCells[6], 'mousedown');
            triggerMouseEvent(workCells[28], 'mousemove');
            triggerMouseEvent(workCells[28], 'mouseup');
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(8);
            expect(workCells[6].getAttribute('data-group-index')).toEqual('0');
            let lastCell: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(lastCell.getAttribute('data-group-index')).toEqual('0');
            schObj.removeSelectedClass();
        });
        it('multiple work cells left selection via mouse', () => {
            let workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            triggerMouseEvent(workCells[28], 'mousedown');
            triggerMouseEvent(workCells[6], 'mousemove');
            triggerMouseEvent(workCells[6], 'mouseup');
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(8);
            expect(workCells[28].getAttribute('data-group-index')).toEqual('1');
            let lastCell: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(lastCell.getAttribute('data-group-index')).toEqual('1');
            schObj.removeSelectedClass();
        });
    });

    describe('month agenda with multiple delete event', () => {
        let schObj: Schedule;
        // tslint:disable-next-line:no-any
        let keyModule: any;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            schObj = new Schedule({
                width: '100%',
                height: '500px',
                currentView: 'MonthAgenda', selectedDate: new Date(2017, 10, 5), views: ['MonthAgenda'],
                eventSettings: { dataSource: defaultData },
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
        it('work cell click', () => {
            let workCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[4] as HTMLElement;
            workCell.click();
            expect(workCell.classList).toContain('e-selected-cell');
            expect(workCell.getAttribute('aria-selected')).toEqual('true');
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
        });
        it('multiple event selection via ctrl plus click', () => {
            let appointment: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            triggerMouseEvent(appointment[0], 'click', 0, 0, false, true);
            expect(schObj.element.querySelectorAll('.e-appointment-border').length).toEqual(1);
            triggerMouseEvent(appointment[1], 'click', 0, 0, false, true);
            expect(schObj.element.querySelectorAll('.e-appointment-border').length).toEqual(2);
            let selectedElement: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-border'));
            expect(selectedElement[0].classList).toContain('e-appointment-border');
            expect(selectedElement[0].getAttribute('aria-selected')).toEqual('true');
            expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(4);
            expect(schObj.element.querySelectorAll('.e-appointment-border').length).toEqual(2);
            keyModule.keyActionHandler({ action: 'delete', target: selectedElement[0] });
            (<HTMLElement>schObj.quickPopup.quickDialog.element.querySelector('.e-quick-dialog-delete')).click();
            (<HTMLElement>schObj.quickPopup.quickDialog.element.querySelector('.e-dlg-closeicon-btn')).click();
            expect(schObj.element.querySelectorAll('.e-appointment-border').length).toEqual(2);
        });
    });

    // describe('vertical mobile week', () => {
    //     let schObj: Schedule;
    //     // tslint:disable-next-line:no-any
    //     let keyModule: any;
    //     let elem: HTMLElement = createElement('div', { id: 'Schedule' });
    //     beforeEach(() => {
    //         document.body.appendChild(elem);
    //         schObj = new Schedule({
    //             selectedDate: new Date(2017, 9, 4), width: 300,
    //             views: ['day', 'weekAgenda', 'workWeek', 'month'], currentView: 'weekAgenda'
    //         });
    //         schObj.appendTo('#Schedule');
    //         keyModule = schObj.keyboardInteractionModule;
    //     });
    //     afterEach(() => {
    //         if (schObj) {
    //             schObj.destroy();
    //         }
    //         remove(elem);
    //     });
    //     it('multiple cell selection via shift plus click', () => {
    //         let workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
    //         keyModule.initialTarget = workCells[0];
    //         triggerMouseEvent(workCells[0], 'mousedown');
    //         triggerMouseEvent(workCells[0], 'mouseup');
    //         triggerMouseEvent(workCells[3], 'click', 0, 0, true);
    //         let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
    //         expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(4);
    //         expect(focuesdEle.classList).toContain('e-selected-cell');
    //         expect(focuesdEle.classList).toContain('e-work-cells');
    //         expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
    //         expect(focuesdEle.cellIndex).toEqual(1);
    //         expect((focuesdEle.parentNode as HTMLTableRowElement).rowIndex).toEqual(1);
    //         keyModule.keyActionHandler({ action: 'enter', target: focuesdEle });
    //     });
    //     it('multiple work cells selection via mouse', () => {
    //         let workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
    //         triggerMouseEvent(workCells[0], 'mousedown');
    //         triggerMouseEvent(workCells[2], 'mousemove');
    //         triggerMouseEvent(workCells[2], 'mouseup');
    //         let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
    //         expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(3);
    //         expect(focuesdEle.classList).toContain('e-selected-cell');
    //         expect(focuesdEle.classList).toContain('e-work-cells');
    //         expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
    //         expect(focuesdEle.cellIndex).toEqual(0);
    //         expect((focuesdEle.parentNode as HTMLTableRowElement).rowIndex).toEqual(1);
    //         keyModule.keyActionHandler({ action: 'enter', target: focuesdEle });
    //     });
    //     it('home and arrow keys', () => {
    //         keyModule.keyActionHandler({ action: 'home' });
    //         let firstEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
    //         expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
    //         expect(firstEle.classList).toContain('e-selected-cell');
    //         expect(firstEle.getAttribute('aria-selected')).toEqual('true');
    //         expect(firstEle.cellIndex).toEqual(0);
    //         expect((firstEle.parentNode as HTMLTableRowElement).rowIndex).toEqual(0);
    //         let targetCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
    //         keyModule.keyActionHandler({ action: 'downArrow', target: targetCell });
    //         let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
    //         expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
    //         expect(focuesdEle.classList).toContain('e-selected-cell');
    //         expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
    //         expect(focuesdEle.cellIndex).toEqual(0);
    //         expect((focuesdEle.parentNode as HTMLTableRowElement).rowIndex).toEqual(1);
    //     });
    // });
    describe('View navigation', () => {
        let schObj: Schedule;
        // tslint:disable-next-line:no-any
        let keyModule: any;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => {
                keyModule = schObj.keyboardInteractionModule;
                done();
            };
            document.body.appendChild(elem);
            schObj = new Schedule({
                width: '100%',
                height: '550px',
                views: ['Day', 'Week', 'Agenda'],
                currentView: 'Day',
                selectedDate: new Date(2017, 9, 4),
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
    describe('Delete action', () => {
        let schObj: Schedule;
        // tslint:disable-next-line:no-any
        let keyModule: any;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            schObj = new Schedule({
                width: '100%',
                height: '550px',
                selectedDate: new Date(2017, 9, 2),
                eventSettings: {
                    dataSource: [{
                        Id: 10,
                        Subject: 'rec_appointment',
                        StartTime: new Date(2017, 9, 2, 9, 0),
                        EndTime: new Date(2017, 9, 2, 10, 0),
                        AllDay: false,
                        RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=2',
                    }, {
                        Id: 16,
                        Subject: 'normal_appointment',
                        StartTime: new Date(2017, 9, 3, 10, 30),
                        EndTime: new Date(2017, 9, 3, 11, 0),
                        IsAllDay: false,
                    }]
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
        it('deleting normal and recurrence appointment simultaneously', (done: Function) => {
            let dataBound: (args: Object) => void = (args: Object) => {
                let appointment: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(appointment.length).toEqual(0);
                done();
            };
            let appointment: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            triggerMouseEvent(appointment[0], 'click', 0, 0, false, true);
            triggerMouseEvent(appointment[1], 'click', 0, 0, false, true);
            triggerMouseEvent(appointment[2], 'click', 0, 0, false, true);
            expect(schObj.element.querySelectorAll('.e-appointment-border').length).toEqual(3);
            let selectedElement: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-border'));
            keyModule.keyActionHandler({ action: 'delete', target: selectedElement[0] });
            expect(schObj.quickPopup.quickDialog.element.classList.contains('e-quick-dialog')).toEqual(true);
            expect(schObj.quickPopup.quickDialog.element.querySelector('#ScheduleQuickDialog_title').innerHTML)
                .toEqual('Delete Multiple Events');
            (<HTMLElement>schObj.quickPopup.quickDialog.element.querySelector('.e-quick-dialog-delete')).click();
            (<HTMLElement>schObj.quickPopup.quickDialog.element.querySelector('.e-dlg-closeicon-btn')).click();
            schObj.dataBound = dataBound;
        });
    });
    describe('Timeline view', () => {
        let schObj: Schedule;
        // tslint:disable-next-line:no-any
        let keyModule: any;
        beforeAll((done: Function) => {
            let model: ScheduleModel = {
                currentView: 'TimelineWeek',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek', 'TimelineMonth', 'Agenda'],
                selectedDate: new Date(2018, 4, 1)
            };
            schObj = createSchedule(model, [], done);
            keyModule = schObj.keyboardInteractionModule;
        });
        afterAll(() => {
            destroy(schObj);
        });
        it('ensure module name', () => {
            expect(keyModule.getModuleName()).toEqual('keyboard');
        });
        it('home key', () => {
            let firstWorkCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
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
        it('alt one day view', () => {
            schObj.element.focus();
            keyModule.keyActionHandler({ action: 'altOne', key: '1' });
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-timeline-day');
        });
        it('alt two week view', () => {
            schObj.element.focus();
            keyModule.keyActionHandler({ action: 'altTwo', key: '2' });
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-timeline-week');
        });
        it('alt three work week view', () => {
            schObj.element.focus();
            keyModule.keyActionHandler({ action: 'altThree', key: '3' });
            expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-timeline-work-week');
        });
        it('alt four month view', () => {
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
    describe('Timeline view with appointments', () => {
        let schObj: Schedule;
        // tslint:disable-next-line:no-any
        let keyModule: any;
        beforeAll((done: Function) => {
            let model: ScheduleModel = {
                currentView: 'TimelineWeek',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek', 'TimelineMonth', 'Agenda'],
                selectedDate: new Date(2018, 4, 1)
            };
            schObj = createSchedule(model, timelineData, done);
            keyModule = schObj.keyboardInteractionModule;
        });
        afterAll(() => {
            destroy(schObj);
        });
        it('Tab key work cell to appointment selection', () => {
            let workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            let workCell: HTMLElement = workCells[0] as HTMLElement;
            workCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            let eventCell: HTMLElement = schObj.element.querySelector('.e-event-table');
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
            let firstWorkCell: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-border'));
            expect(firstWorkCell[0].classList).toContain('e-appointment-border');
            expect(firstWorkCell[0].getAttribute('aria-selected')).toEqual('true');
            keyModule.keyActionHandler({ action: 'enter', target: firstWorkCell[0] });
            let popup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(popup.classList.contains('e-popup-open')).toEqual(true);
            keyModule.keyActionHandler({ action: 'escape' });
            expect(schObj.element.querySelectorAll('.e-appointment-border').length).toEqual(1);
        });
        it('Enter key', () => {
            triggerMouseEvent(schObj.element.querySelector('.e-appointment'), 'click');
            keyModule.keyActionHandler({ action: 'escape' });
            let firstWorkCell: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-border'));
            expect(firstWorkCell[0].classList).toContain('e-appointment-border');
            expect(firstWorkCell[0].getAttribute('aria-selected')).toEqual('true');
            keyModule.keyActionHandler({ action: 'enter', target: firstWorkCell[0] });
            let popup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(popup.classList).toContain('e-popup-open');
            keyModule.keyActionHandler({ action: 'escape' });
            expect(popup.classList).toContain('e-popup-close');
            keyModule.keyActionHandler({ action: 'enter', target: schObj.element.querySelector('.e-work-cells') });
            expect(popup.classList).toContain('e-popup-open');
            keyModule.keyActionHandler({ action: 'escape' });
            expect(popup.classList).toContain('e-popup-close');
        });
        it('Enter key for edit option', () => {
            let appointments: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            appointments[0].click();
            let popup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(popup).toBeTruthy();
            keyModule.keyActionHandler({
                action: 'enter', target: popup.querySelector('.e-event-edit'),
                shiftKey: false, preventDefault: (): void => { /** Null */ }
            });
            let cancelButton: HTMLElement = schObj.eventWindow.dialogObject.element.querySelector('.e-event-cancel') as HTMLElement;
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
            let firstWorkCell: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            expect(firstWorkCell[firstWorkCell.length - 10].classList).not.toContain('e-selected-cell');
            expect(firstWorkCell[firstWorkCell.length - 10].getAttribute('aria-selected')).toEqual('false');
            firstWorkCell[firstWorkCell.length - 10].click();
            let popup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(popup.classList).toContain('e-popup-open');
            keyModule.keyActionHandler({
                action: 'enter', target: popup.querySelector('.e-event-details'),
                shiftKey: false, preventDefault: (): void => { /** Null */ }
            });
            let cancelButton: HTMLElement = schObj.eventWindow.dialogObject.element.querySelector('.e-event-cancel') as HTMLElement;
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
            let workCells: HTMLElement[] =
                [].slice.call(schObj.element.querySelectorAll('.e-event-table .e-appointment-wrapper'));
            (workCells[0].children[0] as HTMLElement).click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({
                action: 'shiftTab', target: workCells[0],
                shiftKey: true, preventDefault: (): void => { /** Null */ }
            });
            expect(schObj.element.querySelectorAll('.e-appointment-border').length).toEqual(1);
        });
        it('multiple event selection via ctrl plus click', () => {
            let firstWorkCell: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            firstWorkCell[0].click();
            triggerMouseEvent(firstWorkCell[1], 'click', 0, 0, false, true);
            expect(schObj.element.querySelectorAll('.e-appointment-border').length).toEqual(2);
            triggerMouseEvent(firstWorkCell[1], 'click', 0, 0, false, true);
            expect(schObj.element.querySelectorAll('.e-appointment-border').length).toEqual(1);
            keyModule.keyActionHandler({ action: 'escape' });
        });
        it('Delete key', () => {
            (schObj.element.querySelector('.e-appointment') as HTMLElement).click();
            expect(schObj.element.querySelectorAll('.e-appointment-border').length).toEqual(1);
            let selectedElement: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-border'));
            expect(selectedElement[0].classList).toContain('e-appointment-border');
            expect(selectedElement[0].getAttribute('aria-selected')).toEqual('true');
            keyModule.keyActionHandler({ action: 'delete', target: selectedElement[0] });
            expect(schObj.element.querySelectorAll('.e-appointment-border').length).toEqual(1);
            (<HTMLElement>schObj.quickPopup.quickDialog.element.querySelector('.e-dlg-closeicon-btn')).click();
        });
        it('Right arrow key with appointment selection', () => {
            (schObj.element.querySelector('.e-appointment') as HTMLElement).click();
            expect(schObj.element.querySelectorAll('.e-appointment-border').length).toEqual(1);
            let selectedElement: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-border'));
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'rightArrow', target: selectedElement[0] });
            expect(schObj.element.querySelectorAll('.e-appointment-border').length).toEqual(0);
        });
        it('Left arrow key with appointment selection', () => {
            (schObj.element.querySelector('.e-appointment') as HTMLElement).click();
            expect(schObj.element.querySelectorAll('.e-appointment-border').length).toEqual(1);
            let selectedElement: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-border'));
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'leftArrow', target: selectedElement[0] });
            expect(schObj.element.querySelectorAll('.e-appointment-border').length).toEqual(0);
        });
        it('Tab/shift key for event edit option', () => {
            (schObj.element.querySelector('.e-appointment') as HTMLElement).click();
            let popup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
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
            let firstWorkCell: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            expect(firstWorkCell[0].classList).not.toContain('e-selected-cell');
            expect(firstWorkCell[0].getAttribute('aria-selected')).toEqual('false');
            firstWorkCell[0].click();
            let popup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
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
            let workCells: HTMLElement[] = [].slice.call(schObj.element.querySelector('.e-content-wrap table tr').children);
            expect(workCells.length).toEqual(336);
            let workCell: HTMLElement = workCells[0] as HTMLElement;
            workCell.click();
            let cellPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
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
        // tslint:disable-next-line:no-any
        let keyModule: any;
        let elem: HTMLElement = createElement('div', { id: 'Schedule', attrs: { tabIndex: '1' } });
        beforeAll((done: Function) => {
            let model: ScheduleModel = {
                currentView: 'TimelineMonth',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek', 'TimelineMonth', 'Agenda'],
                selectedDate: new Date(2018, 4, 1)
            };
            schObj = createSchedule(model, timelineData, done);
            keyModule = schObj.keyboardInteractionModule;
        });
        afterAll(() => {
            destroy(schObj);
        });
        it('Escape key', () => {
            let moreIndicator: HTMLElement = schObj.element.querySelector('.e-more-indicator') as HTMLElement;
            moreIndicator.click();
            let popup: HTMLElement = schObj.element.querySelector('.e-more-popup-wrapper') as HTMLElement;
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
            let moreIndicator: HTMLElement = schObj.element.querySelector('.e-more-indicator') as HTMLElement;
            moreIndicator.click();
            let popup: HTMLElement = schObj.element.querySelector('.e-more-popup-wrapper') as HTMLElement;
            expect(popup).toBeTruthy();
            expect(popup.classList.contains('e-popup-open')).toBe(true);
            keyModule.keyActionHandler({ action: 'enter', target: popup.querySelector('.e-more-event-close') });
            expect(popup).toBeTruthy();
        });
        it('Tab key for more event list', () => {
            let moreIndicator: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
            moreIndicator[0].click();
            let popup: HTMLElement = schObj.element.querySelector('.e-more-popup-wrapper') as HTMLElement;
            expect(popup.classList.contains('e-popup-open')).toBe(true);
            let apps: HTMLElement[] = [].slice.call(popup.querySelectorAll('.e-appointment'));
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
            let moreIndicator: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
            moreIndicator[0].click();
            let popup: HTMLElement = schObj.element.querySelector('.e-more-popup-wrapper') as HTMLElement;
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
            let moreIndicator: HTMLElement = schObj.element.querySelector('.e-more-indicator') as HTMLElement;
            moreIndicator.click();
            let popup: HTMLElement = schObj.element.querySelector('.e-more-popup-wrapper') as HTMLElement;
            expect(popup).toBeTruthy();
            expect(popup.classList.contains('e-popup-open')).toBe(true);
            keyModule.keyActionHandler({ action: 'enter', target: popup.querySelector('.e-header-date') });
            expect(popup).toBeTruthy();
            expect(popup.classList.contains('e-popup-open')).toBe(false);
        });
    });
    describe('Timeline view arrow keys', () => {
        let schObj: Schedule;
        // tslint:disable-next-line:no-any
        let keyModule: any;
        beforeAll((done: Function) => {
            let model: ScheduleModel = {
                currentView: 'TimelineWeek',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek', 'TimelineMonth', 'Agenda'],
                selectedDate: new Date(2018, 4, 1)
            };
            schObj = createSchedule(model, [], done);
            keyModule = schObj.keyboardInteractionModule;
        });
        afterAll(() => {
            destroy(schObj);
        });
        it('multiple cell selection via shift plus click', () => {
            let workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            keyModule.initialTarget = workCells[2];
            triggerMouseEvent(workCells[17], 'click', 0, 0, true);
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(16);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(17);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
            keyModule.keyActionHandler({ action: 'enter', target: focuesdEle });
        });
        it('multiple work cells selection via mouse', () => {
            let workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            triggerMouseEvent(workCells[2], 'mousedown');
            triggerMouseEvent(workCells[17], 'mousemove');
            triggerMouseEvent(workCells[17], 'mouseup');
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(16);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(17);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
            keyModule.keyActionHandler({ action: 'enter', target: focuesdEle });
        });
        it('mouse move out of schedule while selection via mouse', () => {
            let workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            triggerMouseEvent(workCells[2], 'mousedown');
            triggerMouseEvent(schObj.element.querySelector('.e-time-cells') as HTMLElement, 'mousemove');
            triggerMouseEvent(workCells[29], 'mousemove');
            triggerMouseEvent(workCells[29], 'mouseup');
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
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
            let targetCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
            keyModule.keyActionHandler({ action: 'downArrow', target: targetCell });
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(0);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
        it('down arrow - last row cell', () => {
            let target: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[335] as HTMLElement;
            target.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'downArrow', target: target });
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(335);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
        it('up arrow', () => {
            let targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[18] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'upArrow', target: targetCell });
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(18);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
        it('up arrow first row cell', () => {
            let targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[1] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'upArrow', target: targetCell });
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(1);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
        it('up arrow - last row cell', () => {
            let target: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[335] as HTMLElement;
            target.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'upArrow', target: target });
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(335);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
        it('right arrow', () => {
            let targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[18] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'rightArrow', target: targetCell });
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(19);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
        it('right arrow first row cell', () => {
            let targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[1] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'rightArrow', target: targetCell });
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(2);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
        it('right arrow - last work cell next navigation', () => {
            let target: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[335] as HTMLElement;
            target.click();
            keyModule.keyActionHandler({ action: 'escape' });
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).
                toEqual('Apr 29 - May 05, 2018');
            keyModule.keyActionHandler({ action: 'rightArrow', target: target });
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).
                toEqual('May 06 - 12, 2018');
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(0);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
        it('left arrow', () => {
            let targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[18] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'leftArrow', target: targetCell });
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(17);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
        it('left arrow first work cell previous navigation', () => {
            let targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).
                toEqual('May 06 - 12, 2018');
            keyModule.keyActionHandler({ action: 'leftArrow', target: targetCell });
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).
                toEqual('Apr 29 - May 05, 2018');
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(335);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
        it('left arrow - last row cell', () => {
            let target: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[335] as HTMLElement;
            target.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'leftArrow', target: target });
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(334);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
        it('shiftDown arrow', () => {
            let targetCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = targetCell;
            keyModule.keyActionHandler({ action: 'shiftDownArrow', shiftKey: true, target: targetCell });
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(0);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
            keyModule.keyActionHandler({ action: 'shiftDownArrow', shiftKey: true, target: focuesdEle });
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
        });
        it('shiftDown arrow - last row cell', () => {
            let target: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[335] as HTMLElement;
            target.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = target;
            keyModule.keyActionHandler({ action: 'shiftDownArrow', shiftKey: true, target: target });
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(335);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
        it('shiftUp arrow', () => {
            let targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[18] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = targetCell;
            keyModule.keyActionHandler({ action: 'shiftUpArrow', shiftKey: true, target: targetCell });
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(18);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
        it('shiftUp arrow first row cell', () => {
            let targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[1] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = targetCell;
            keyModule.keyActionHandler({ action: 'shiftUpArrow', shiftKey: true, target: targetCell });
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(1);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
        it('shiftUp arrow - last row cell', () => {
            let target: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[335] as HTMLElement;
            target.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = target;
            keyModule.keyActionHandler({ action: 'shiftUpArrow', shiftKey: true, target: target });
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(335);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
        it('shiftRight arrow', () => {
            let targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[18] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = targetCell;
            keyModule.keyActionHandler({ action: 'shiftRightArrow', shiftKey: true, target: targetCell });
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
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
            let target: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[335] as HTMLElement;
            target.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = target;
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).
                toEqual('Apr 29 - May 05, 2018');
            keyModule.keyActionHandler({ action: 'shiftRightArrow', shiftKey: true, target: target });
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).
                toEqual('Apr 29 - May 05, 2018');
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(335);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
        it('shiftLeft arrow', () => {
            let targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[18] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = targetCell;
            keyModule.keyActionHandler({ action: 'shiftLeftArrow', shiftKey: true, target: targetCell });
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
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
            let targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = targetCell;
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).
                toEqual('Apr 29 - May 05, 2018');
            keyModule.keyActionHandler({ action: 'shiftLeftArrow', shiftKey: true, target: targetCell });
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).
                toEqual('Apr 29 - May 05, 2018');
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(0);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
        it('shiftLeft arrow - last row cell', () => {
            let target: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[335] as HTMLElement;
            target.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = target;
            keyModule.keyActionHandler({ action: 'shiftLeftArrow', shiftKey: true, target: target });
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
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
        // tslint:disable-next-line:no-any
        let keyModule: any;
        beforeAll((done: Function) => {
            let model: ScheduleModel = {
                currentView: 'TimelineMonth',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek', 'TimelineMonth', 'Agenda'],
                selectedDate: new Date(2018, 4, 1)
            };
            schObj = createSchedule(model, [], done);
            keyModule = schObj.keyboardInteractionModule;
        });
        afterAll(() => {
            destroy(schObj);
        });
        it('multiple cell selection via shift plus click', () => {
            let workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            keyModule.initialTarget = workCells[2];
            triggerMouseEvent(workCells[12], 'mousedown', 0, 0, true);
            triggerMouseEvent(workCells[12], 'click', 0, 0, true);
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
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
            let workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            triggerMouseEvent(workCells[3], 'mousedown');
            triggerMouseEvent(workCells[18], 'mousemove');
            triggerMouseEvent(workCells[18], 'mouseup');
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(16);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(18);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
            keyModule.keyActionHandler({ action: 'enter', target: focuesdEle });
        });
        it('down arrow', () => {
            let targetCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'downArrow', target: targetCell });
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(0);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
        it('down arrow - last row cell', () => {
            let workCell: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            let target: HTMLElement = workCell[workCell.length - 2];
            target.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'downArrow', target: target });
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(29);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).
                toEqual((target.parentNode as HTMLTableRowElement).sectionRowIndex);
        });
        it('up arrow', () => {
            let targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[3] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'upArrow', target: targetCell });
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(3);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
        it('up arrow - last row cell', () => {
            let workCell: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            let target: HTMLElement = workCell[workCell.length - 2];
            target.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'upArrow', target: target });
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(29);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).
                toEqual((target.parentNode as HTMLTableRowElement).sectionRowIndex);
        });
        it('right arrow', () => {
            let targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[18] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'rightArrow', target: targetCell });
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(19);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
            keyModule.keyActionHandler({ action: 'rightArrow', target: schObj.element.querySelector('.e-header-cells') });
        });
        it('right arrow first row last cell', () => {
            let targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[6] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'rightArrow', target: targetCell });
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(7);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
        it('right arrow - last work cell next navigation', () => {
            let workCell: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            let target: HTMLElement = workCell[workCell.length - 1];
            target.click();
            keyModule.keyActionHandler({ action: 'escape' });
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).
                toEqual('May 2018');
            keyModule.keyActionHandler({ action: 'rightArrow', target: target });
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).
                toEqual('June 2018');
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(0);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
        it('left arrow', () => {
            let targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[5] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'leftArrow', target: targetCell });
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(4);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
            keyModule.keyActionHandler({ action: 'leftArrow', target: schObj.element.querySelector('.e-header-cells') });
        });
        it('left arrow second row first cell', () => {
            let targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[7] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'leftArrow', target: targetCell });
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(6);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
        it('left arrow first work cell previous navigation', () => {
            let targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).
                toEqual('June 2018');
            keyModule.keyActionHandler({ action: 'leftArrow', target: targetCell });
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).
                toEqual('May 2018');
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(29);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
        it('shiftDown arrow', () => {
            let targetCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = targetCell;
            keyModule.keyActionHandler({ action: 'shiftDownArrow', shiftKey: true, target: targetCell });
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(0);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
        it('shiftUp arrow', () => {
            let targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[18] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = targetCell;
            keyModule.keyActionHandler({ action: 'shiftUpArrow', shiftKey: true, target: targetCell });
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(18);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
        it('shiftRight arrow', () => {
            let targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[4] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = targetCell;
            keyModule.keyActionHandler({ action: 'shiftRightArrow', shiftKey: true, target: targetCell });
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
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
            let workCell: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            let target: HTMLElement = workCell[workCell.length - 1];
            target.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = target;
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).
                toEqual('May 2018');
            keyModule.keyActionHandler({ action: 'shiftRightArrow', shiftKey: true, target: target });
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).
                toEqual('May 2018');
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(30);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(0);
        });
        it('shiftLeft arrow', () => {
            let targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[4] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = targetCell;
            keyModule.keyActionHandler({ action: 'shiftLeftArrow', shiftKey: true, target: targetCell });
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
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
            let targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = targetCell;
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).
                toEqual('May 2018');
            keyModule.keyActionHandler({ action: 'shiftLeftArrow', shiftKey: true, target: targetCell });
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).
                toEqual('May 2018');
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
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
        // tslint:disable-next-line:no-any
        let keyModule: any;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => {
                keyModule = schObj.keyboardInteractionModule;
                done();
            };
            document.body.appendChild(elem);
            schObj = new Schedule({
                height: '580px',
                currentView: 'TimelineMonth',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek', 'TimelineMonth', 'Agenda'],
                selectedDate: new Date(2018, 4, 1),
                group: {
                    resources: ['Floors', 'Halls', 'Rooms', 'Owners']
                },
                resources: [
                    {
                        field: 'FId', title: 'Floor',
                        name: 'Floors', allowMultiple: false,
                        dataSource: [
                            { FloorText: 'Floor 1', Id: 1, FloorColor: '#cb6bb2', Expand: false },
                            { FloorText: 'Floor 2', Id: 2, FloorColor: '#cb6bb2' },
                        ],
                        textField: 'FloorText', idField: 'Id', colorField: 'FloorColor', expandedField: 'Expand'
                    },
                    {
                        field: 'HallId', title: 'Hall',
                        name: 'Halls', allowMultiple: false,
                        dataSource: [
                            { HallText: 'Hall 1', Id: 1, HallGroupId: 1, HallColor: '#cb6bb2', Expand: false },
                            { HallText: 'Hall 2', Id: 2, HallGroupId: 2, HallColor: '#56ca85' }
                        ],
                        textField: 'HallText', idField: 'Id', groupIDField: 'HallGroupId', colorField: 'HallColor', expandedField: 'Expand'
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
                        textField: 'OwnerText', idField: 'Id',
                        groupIDField: 'OwnerGroupId', colorField: 'OwnerColor', expandedField: 'Expand'
                    }
                ],
                eventSettings: {
                    dataSource: cloneDataSource(timelineResourceData)
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
        it('home key', () => {
            let firstWorkCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[403] as HTMLElement;
            expect(firstWorkCell.classList).not.toContain('e-selected-cell');
            expect(firstWorkCell.getAttribute('aria-selected')).toEqual('false');
            keyModule.keyActionHandler({ action: 'home' });
            expect(firstWorkCell.classList).toContain('e-selected-cell');
            expect(firstWorkCell.getAttribute('aria-selected')).toEqual('true');
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
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
            let workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            keyModule.initialTarget = workCells[403];
            triggerMouseEvent(workCells[420], 'mousedown', 0, 0, true);
            triggerMouseEvent(workCells[420], 'click', 0, 0, true);
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
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
            let workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            triggerMouseEvent(workCells[403], 'mousedown');
            triggerMouseEvent(workCells[420], 'mousemove');
            triggerMouseEvent(workCells[420], 'mouseup');
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
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
            let targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[403] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'downArrow', target: targetCell });
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
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
            let workCell: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            let target: HTMLElement = workCell[workCell.length - 2];
            target.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'downArrow', target: target });
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
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
            let targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[435] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'upArrow', target: targetCell });
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
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
            let workCell: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            let target: HTMLElement = workCell[workCell.length - 2];
            target.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'upArrow', target: target });
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
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
            let targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[403] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'rightArrow', target: targetCell });
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
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
            let targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[450] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'rightArrow', target: targetCell });
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
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
            let workCell: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            let target: HTMLElement = workCell[workCell.length - 1];
            target.click();
            keyModule.keyActionHandler({ action: 'escape' });
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).
                toEqual('May 2018');
            keyModule.keyActionHandler({ action: 'rightArrow', target: target });
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).
                toEqual('June 2018');
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
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
            let targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[404] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.keyActionHandler({ action: 'leftArrow', target: targetCell });
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
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
            let targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[403] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).
                toEqual('June 2018');
            keyModule.keyActionHandler({ action: 'leftArrow', target: targetCell });
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).
                toEqual('June 2018');
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
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
            let targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[410] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = targetCell;
            keyModule.keyActionHandler({ action: 'shiftDownArrow', shiftKey: true, target: targetCell });
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(1);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-child-node');
            expect(focuesdEle.classList).not.toContain('e-resource-group-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(20);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(13);
        });
        it('shiftUp arrow', () => {
            let targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[404] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = targetCell;
            keyModule.keyActionHandler({ action: 'shiftUpArrow', shiftKey: true, target: targetCell });
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
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
            let targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[403] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = targetCell;
            keyModule.keyActionHandler({ action: 'shiftRightArrow', shiftKey: true, target: targetCell });
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
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
            let workCell: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            let target: HTMLElement = workCell[workCell.length - 1];
            target.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = target;
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).
                toEqual('June 2018');
            keyModule.keyActionHandler({ action: 'shiftRightArrow', shiftKey: true, target: target });
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).
                toEqual('June 2018');
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
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
            let targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[410] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = targetCell;
            keyModule.keyActionHandler({ action: 'shiftLeftArrow', shiftKey: true, target: targetCell });
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
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
            let targetCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[403] as HTMLElement;
            targetCell.click();
            keyModule.keyActionHandler({ action: 'escape' });
            keyModule.initialTarget = targetCell;
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).
                toEqual('June 2018');
            keyModule.keyActionHandler({ action: 'shiftLeftArrow', shiftKey: true, target: targetCell });
            expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).
                toEqual('June 2018');
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(2);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.classList).toContain('e-child-node');
            expect(focuesdEle.classList).not.toContain('e-resource-group-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(12);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(13);
        });
    });
});