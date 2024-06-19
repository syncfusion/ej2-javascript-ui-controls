/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * keyboard spec
 */
import { Kanban, KanbanModel } from '../../src/kanban/index';
import { kanbanData } from './common/kanban-data.spec';
import { profile, inMB, getMemoryProfile } from './common/common.spec';
import * as util from './common/util.spec';

Kanban.Inject();

describe('Keyboard module', () => {
    beforeAll(() => {
        const isDef: (o: any) => boolean = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            // eslint-disable-next-line no-console
            console.log('Unsupported environment, window.performance.memory is unavailable');
            (this as any).skip(); //Skips test (in Chai)
            return;
        }
    });

    describe('Keyboard Interactions for single card selection type', () => {
        let kanbanObj: Kanban;
        let keyModule: any;
        beforeAll((done: DoneFn) => {
            const model: KanbanModel = {
                columns: [
                    { headerText: 'Backlog', keyField: 'Open', allowToggle: true },
                    { headerText: 'In Progress', keyField: 'InProgress', allowToggle: true },
                    { headerText: 'Testing', keyField: 'Testing', allowToggle: true },
                    { headerText: 'Done', keyField: 'Close', allowToggle: true }
                ],
                allowKeyboard: true,
                swimlaneSettings: {
                    keyField: 'Assignee'
                },
                cardSettings: {
                    selectionType: 'Single'
                }
            };
            kanbanObj = util.createKanban(model, kanbanData, done);
        });

        afterAll(() => {
            util.destroy(kanbanObj);
        });

        it('ensure module name', () => {
            keyModule = kanbanObj.keyboardModule;
            kanbanObj.element.focus();
        });

        it('first card selection testing', () => {
            const card: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="25"]').item(0) as HTMLElement;
            expect(card.classList.contains('e-selection')).not.toBe(true);
            keyModule.keyActionHandler({ action: 'firstCardSelection', preventDefault: function () { } });
            expect(card.classList.contains('e-selection')).toBe(true);
        });

        it('last card selection testing', () => {
            const card: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="54"]').item(0) as HTMLElement;
            expect(card.classList.contains('e-selection')).toEqual(false);
            keyModule.keyActionHandler({ action: 'lastCardSelection', preventDefault: function () { } });
            expect(card.classList.contains('e-selection')).toEqual(true);
            const card1: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="25"]').item(0) as HTMLElement;
            expect(card1.classList.contains('e-selection')).toEqual(false);
        });
    });

    describe('Keyboard Interactions', () => {
        let kanbanObj: Kanban;
        let keyModule: any;
        beforeAll((done: DoneFn) => {
            const model: KanbanModel = {
                columns: [
                    { headerText: 'Backlog', keyField: 'Open', allowToggle: true },
                    { headerText: 'In Progress', keyField: 'InProgress', allowToggle: true },
                    { headerText: 'Testing', keyField: 'Testing', allowToggle: true },
                    { headerText: 'Done', keyField: 'Close', allowToggle: true }
                ],
                allowKeyboard: true,
                swimlaneSettings: {
                    keyField: 'Assignee'
                },
                cardSettings: {
                    selectionType: 'Multiple'
                }
            };
            kanbanObj = util.createKanban(model, kanbanData, done);
        });

        afterAll(() => {
            util.destroy(kanbanObj);
        });

        it('last card selection testing', () => {
            keyModule = kanbanObj.keyboardModule;
            kanbanObj.element.focus();
            const card: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="54"]').item(0) as HTMLElement;
            expect(card.classList.contains('e-selection')).toEqual(false);
            keyModule.keyActionHandler({ action: 'lastCardSelection', preventDefault: function () { } });
            expect(card.classList.contains('e-selection')).toEqual(true);
        });
    });

    describe('Keyboard Interactions', () => {
        let kanbanObj: Kanban;
        let keyModule: any;
        beforeAll((done: DoneFn) => {
            let model: KanbanModel = {
                columns: [
                    { headerText: 'Backlog', keyField: 'Open', allowToggle: true },
                    { headerText: 'In Progress', keyField: 'InProgress', allowToggle: true },
                    { headerText: 'Testing', keyField: 'Testing', allowToggle: true },
                    { headerText: 'Done', keyField: 'Close', allowToggle: true }
                ],
                allowKeyboard: true,
                swimlaneSettings: {
                    keyField: 'Assignee',
                },
                cardSettings: {
                    selectionType: 'Multiple'
                }
            };
            kanbanObj = util.createKanban(model, kanbanData, done);
        });

        afterAll(() => {
            util.destroy(kanbanObj);
        });

        it('ensure module name', () => {
            keyModule = kanbanObj.keyboardModule;
            expect(keyModule).not.toBeNull;
        });

        it('Down key', () => {
            let card: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="25"]').item(0) as HTMLElement;
            expect(card.classList.contains('e-selection')).not.toBe(true);
            util.triggerMouseEvent(card, 'click'); card.focus();
            expect(card.classList.contains('e-selection')).toBe(true);
            expect(card == document.activeElement).toBe(true);
            keyModule.keyActionHandler({ action: 'downArrow', preventDefault: function () { } });
            expect(card.nextElementSibling.classList.contains('e-selection')).not.toBe(true);
            expect(card == document.activeElement).toBe(false);
            expect(card.nextElementSibling == document.activeElement).toBe(true);
        });

        it('Up key', () => {
            let card: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="49"]').item(0) as HTMLElement;
            util.triggerMouseEvent(card, 'click'); card.focus();
            expect(card.classList.contains('e-selection')).toBe(true);
            expect(card == document.activeElement).toBe(true);
            keyModule.keyActionHandler({ action: 'upArrow', preventDefault: function () { } });
            expect(card.previousElementSibling.classList.contains('e-selection')).not.toBe(true);
            expect(card == document.activeElement).toBe(false);
            expect(card.previousElementSibling == document.activeElement).toBe(true);
        });

        it('Right key', () => {
            let contentEle: HTMLElement = kanbanObj.element.querySelectorAll('.e-content-cells.e-drag').item(0) as HTMLElement;
            contentEle.focus();
            expect(contentEle == document.activeElement).toBe(true);
            keyModule.keyActionHandler({ action: 'rightArrow', preventDefault: function () { } });
            expect(contentEle == document.activeElement).toBe(false);
            expect(contentEle.nextElementSibling == document.activeElement).toBe(true);
        });

        it('Left key', () => {
            let contentEle: HTMLElement = kanbanObj.element.querySelectorAll('.e-content-cells.e-drag').item(1) as HTMLElement;
            contentEle.focus();
            expect(contentEle == document.activeElement).toBe(true);
            keyModule.keyActionHandler({ action: 'leftArrow', preventDefault: function () { } });
            expect(contentEle == document.activeElement).toBe(false);
            expect(contentEle.previousElementSibling == document.activeElement).toBe(true);
        });

        it('escape key ', () => {
            let card: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="25"]').item(0) as HTMLElement;
            util.triggerMouseEvent(card, 'click'); card.focus();
            expect(card.classList.contains('e-selection')).toBe(true);
            keyModule.keyActionHandler({ action: 'escape', preventDefault: function () { } });
            expect(card.classList.contains('e-selection')).not.toBe(true);
        });

        it('Enter Key ', () => {
            let swimlaneIcon: HTMLElement = kanbanObj.element.querySelector('.e-swimlane-row-expand');
            swimlaneIcon.focus();
            keyModule.keyActionHandler({ action: 'enter', target: swimlaneIcon, preventDefault: function () { } });
            expect(swimlaneIcon.classList.contains('e-swimlane-row-expand')).toBe(false);
            expect(swimlaneIcon.classList.contains('e-swimlane-row-collapse')).toBe(true);
            keyModule.keyActionHandler({ action: 'enter', target: swimlaneIcon, preventDefault: function () { } });
            expect(swimlaneIcon.classList.contains('e-swimlane-row-expand')).toBe(true);
            expect(swimlaneIcon.classList.contains('e-swimlane-row-collapse')).toBe(false);
        });

        it('Space Key ', () => {
            let swimlaneIcon: HTMLElement = kanbanObj.element.querySelector('.e-swimlane-row-expand');
            swimlaneIcon.focus();
            keyModule.keyActionHandler({ action: 'space', target: swimlaneIcon, preventDefault: function () { } });
            expect(swimlaneIcon.classList.contains('e-swimlane-row-expand')).toBe(false);
            expect(swimlaneIcon.classList.contains('e-swimlane-row-collapse')).toBe(true);
            keyModule.keyActionHandler({ action: 'space', target: swimlaneIcon, preventDefault: function () { } });
            expect(swimlaneIcon.classList.contains('e-swimlane-row-expand')).toBe(true);
            expect(swimlaneIcon.classList.contains('e-swimlane-row-collapse')).toBe(false);
        });
    });

    describe('Keyboard Interactions', () => {
        let kanbanObj: Kanban;
        let keyModule: any;
        beforeAll((done: DoneFn) => {
            let model: KanbanModel = {
                columns: [
                    { headerText: 'Backlog', keyField: 'Open', allowToggle: true, showAddButton: true },
                    { headerText: 'In Progress', keyField: 'InProgress', allowToggle: true, showAddButton: true },
                    { headerText: 'Testing', keyField: 'Testing', allowToggle: true, showAddButton: true },
                    { headerText: 'Done', keyField: 'Close', allowToggle: true, showAddButton: true }
                ],
                allowKeyboard: true,
                swimlaneSettings: {
                    keyField: 'Assignee',
                },
                cardSettings: {
                    selectionType: 'Multiple'
                }
            };
            kanbanObj = util.createKanban(model, kanbanData, done);
        });

        afterAll(() => {
            util.destroy(kanbanObj);
        });

        it('ensure module name', () => {
            keyModule = kanbanObj.keyboardModule;
            expect(keyModule).not.toBeNull;
        });

        it('Up key with add card button', () => {
            let contentEle: HTMLElement = kanbanObj.element.querySelectorAll('.e-content-cells.e-drag').item(0) as HTMLElement;
            contentEle.focus();
            keyModule.keyActionHandler({ action: 'enter', target: contentEle, preventDefault: function () { } });
        });

        it('Up key with add card button next step', () => {
            expect(document.activeElement.classList.contains('e-show-add-button')).toBe(true);
            keyModule.keyActionHandler({ action: 'upArrow', preventDefault: function () { } });
            expect(document.activeElement.getAttribute('tabindex')).toEqual('0');
            expect(document.activeElement.classList.contains('e-show-add-button')).not.toBe(true);
            let card: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="25"]').item(0) as HTMLElement;
            expect(card.getAttribute('tabindex')).toEqual('0');
        });

        it('Show add button with escape key', () => {
            let contentEle: HTMLElement = kanbanObj.element.querySelectorAll('.e-content-cells.e-drag').item(0) as HTMLElement;
            contentEle.focus();
            keyModule.keyActionHandler({ action: 'enter', target: contentEle, preventDefault: function () { } });
            expect(document.activeElement.classList.contains('e-show-add-button')).toBe(true);
            keyModule.keyActionHandler({ action: 'escape', preventDefault: function () { } });
            expect(document.activeElement == contentEle).toBe(true);
        });

        it('tab key', () => {
            let card: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="25"]').item(0) as HTMLElement;
            let addButton: HTMLElement = kanbanObj.element.querySelector('.e-show-add-button');
            expect(addButton.classList.contains('e-show-add-focus')).toBe(false);
            util.triggerMouseEvent(card, 'click');
            keyModule.keyActionHandler({ action: 'tab', target: card, shiftKey: false, preventDefault: (): void => { /** Null */ } });
        });

        it('tab key first step', () => {
            let card: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="25"]').item(0) as HTMLElement;
            let addButton: HTMLElement = kanbanObj.element.querySelector('.e-show-add-button');
            expect(addButton.classList.contains('e-show-add-button')).toBe(true);
            expect(addButton.classList.contains('e-show-add-focus')).toBe(false);
            util.triggerMouseEvent(card, 'click'); card.focus();
            keyModule.keyActionHandler({ action: 'tab', target: card, shiftKey: false, preventDefault: (): void => { /** Null */ } });
            expect(addButton.classList.contains('e-show-add-focus')).toBe(true);
        });

        it('multiSelection enter', () => {
            let card: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="25"]').item(0) as HTMLElement;
            util.triggerMouseEvent(card, 'click'); card.focus();
            keyModule.keyActionHandler({ action: 'multiSelectionEnter', preventDefault: function () { } });
            expect(card.getAttribute('tabindex')).toEqual('0');
            expect(card.getAttribute('aria-selected')).toEqual('true');
        });
        it('multiSelection space', () => {
            let card: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="45"]').item(0) as HTMLElement;
            util.triggerMouseEvent(card, 'click'); card.focus();
            keyModule.keyActionHandler({ action: 'multiSelectionSpace', preventDefault: function () { } });
            expect(card.getAttribute('tabindex')).toEqual('0');
            expect(card.getAttribute('aria-selected')).toEqual('true');
        });

        it('tab no next card availability', () => {
            let card: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="25"]').item(0) as HTMLElement;
            util.triggerMouseEvent(card, 'click'); card.focus();
            expect(card.nextElementSibling != null).toBe(true);
            expect(card.classList.contains('e-selection')).toBe(true);
            expect(card.nextElementSibling.classList.contains('e-selection')).toBe(false);
            keyModule.keyActionHandler({ action: 'multiSelectionByDownArrow', preventDefault: function () { } });
            expect(card.nextElementSibling != null).toBe(true);
            expect(card.classList.contains('e-selection')).toBe(true);
            expect(card.nextElementSibling.classList.contains('e-selection')).toBe(true);
            let card_1: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="61"]').item(0) as HTMLElement;
            expect(card_1.classList.contains('e-selection')).toBe(false);
            keyModule.keyActionHandler({ action: 'multiSelectionByDownArrow', preventDefault: function () { } });
            expect(card_1.classList.contains('e-selection')).toBe(true);
        });

        it('tab no next card availability', () => {
            let card: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="69"]').item(0) as HTMLElement;
            util.triggerMouseEvent(card, 'click'); card.focus();
            expect(card.previousElementSibling != null).toBe(true);
            expect(card.classList.contains('e-selection')).toBe(true);
            expect(card.previousElementSibling.classList.contains('e-selection')).toBe(false);
            keyModule.keyActionHandler({ action: 'multiSelectionByUpArrow', preventDefault: function () { } });
            expect(card.previousElementSibling != null).toBe(true);
            expect(card.classList.contains('e-selection')).toBe(true);
            expect(card.previousElementSibling.classList.contains('e-selection')).toBe(true);
            let card_1: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="49"]').item(0) as HTMLElement;
            expect(card_1.classList.contains('e-selection')).toBe(false);
            keyModule.keyActionHandler({ action: 'multiSelectionByUpArrow', preventDefault: function () { } });
            expect(card_1.classList.contains('e-selection')).toBe(true);
        });

        it('remove selection multiselection', () => {
            expect(kanbanObj.getSelectedCards().length).toEqual(3);
            keyModule.keyActionHandler({ action: 'downArrow', preventDefault: function () { } });
            expect(kanbanObj.getSelectedCards().length).toEqual(0);
        });

        it('down key along with tab/shiftTab', () => {
            let lastCard: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="2"]').item(0) as HTMLElement;
            util.triggerMouseEvent(lastCard, 'click'); lastCard.focus();
            expect(document.activeElement == lastCard).toBe(true);
            expect(lastCard.classList.contains('e-selection')).toBe(true);
            keyModule.keyActionHandler({ action: 'tab', target: lastCard, shiftKey: false, preventDefault: (): void => { /** Null */ } });
            expect(document.activeElement == lastCard).toBe(true);
            expect(lastCard.classList.contains('e-selection')).toBe(true);
        });

        it('show add button along with tab', () => {
            let contentEle: HTMLElement = kanbanObj.element.querySelectorAll('.e-content-cells.e-drag').item(0) as HTMLElement;
            util.triggerMouseEvent(contentEle, 'click'); contentEle.focus();
            expect(document.activeElement.classList.contains('e-show-add-button')).toBe(false);
            keyModule.keyActionHandler({ action: 'enter', target: document.activeElement, preventDefault: function () { } });
            expect(document.activeElement.classList.contains('e-show-add-button')).toBe(true);
            keyModule.keyActionHandler({ action: 'tab', target: document.activeElement, shiftKey: false, preventDefault: (): void => { /** Null */ } });
            expect(document.activeElement.classList.contains('e-show-add-button')).toBe(true);
        });

        it('show add button along with shiftTab', () => {
            let contentEle: HTMLElement = kanbanObj.element.querySelectorAll('.e-content-cells.e-drag').item(0) as HTMLElement;
            util.triggerMouseEvent(contentEle, 'click'); contentEle.focus();
            expect(document.activeElement.classList.contains('e-show-add-button')).toBe(false);
            keyModule.keyActionHandler({ action: 'enter', target: document.activeElement, preventDefault: function () { } });
            expect(document.activeElement.classList.contains('e-show-add-button')).toBe(true);
            keyModule.keyActionHandler({ action: 'tab', target: document.activeElement, shiftKey: true, preventDefault: (): void => { /** Null */ } });
            expect(document.activeElement.classList.contains('e-show-add-button')).toBe(true);
        });

        it('show add button along with shiftTab', () => {
            let headerEle: HTMLElement = kanbanObj.element.querySelectorAll('.e-header-icon').item(0) as HTMLElement;
            util.triggerMouseEvent(headerEle, 'click'); headerEle.focus();
            expect(headerEle.classList.contains('e-column-collapse')).toBe(true);
            expect(headerEle.classList.contains('e-column-expand')).toBe(false);
            expect(document.activeElement == headerEle).toBe(true);
            keyModule.keyActionHandler({ action: 'enter', target: headerEle, preventDefault: function () { } });
            expect(headerEle.classList.contains('e-column-collapse')).toBe(false);
            expect(headerEle.classList.contains('e-column-expand')).toBe(true);
        });

        it('Card Select enter key to open popup', (done: Function) => {
            let card: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="25"]').item(0) as HTMLElement;
            util.triggerMouseEvent(card, 'click'); card.focus();
            expect(document.activeElement == card).toBe(true);
            keyModule.keyActionHandler({ action: 'enter', target: card, preventDefault: function () { } });
            setTimeout(() => { done(); }, 500);
        });

        it('Card Select enter key to open popup', () => {
            let popup: HTMLElement = document.querySelector('.e-dialog.e-kanban-dialog.e-popup');
            expect(popup.classList.contains('e-popup-close')).toBe(false);
            expect(popup.classList.contains('e-popup-open')).toBe(true);
            kanbanObj.closeDialog();
            expect(popup.classList.contains('e-popup-open')).toBe(false);
        });

        it('enter key in add card button', () => {
            let contentEle: HTMLElement = kanbanObj.element.querySelectorAll('.e-content-cells.e-drag').item(0) as HTMLElement;
            util.triggerMouseEvent(contentEle, 'click'); contentEle.focus();
            keyModule.keyActionHandler({ action: 'enter', target: contentEle, preventDefault: function () { } });
            expect(document.activeElement.classList.contains('e-show-add-button')).toBe(true);
            keyModule.keyActionHandler({ action: 'enter', target: document.activeElement, preventDefault: function () { } });
        });

        it('enter key in add card button', () => {
            let popup: HTMLElement = document.querySelector('.e-dialog.e-kanban-dialog.e-popup');
            kanbanObj.closeDialog();
            expect(popup.classList.contains('e-popup-open')).toBe(false);
        });

        it('delete key ', () => {
            let card: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="45"]').item(0) as HTMLElement;
            util.triggerMouseEvent(card, 'click');
            expect(card.classList.contains('e-selection')).toBe(true);
            keyModule.keyActionHandler({ action: 'delete', preventDefault: function () { } });
            let card_1: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="45"]').item(0) as HTMLElement;
            expect(card_1 == null).toBe(true);
        });

        it('tab key focus on show add button', () => {
            let contentEle: HTMLElement = kanbanObj.element.querySelectorAll('.e-content-cells.e-drag').item(2) as HTMLElement;
            util.triggerMouseEvent(contentEle, 'click'); contentEle.focus();
            keyModule.keyActionHandler({ action: 'enter', target: contentEle, preventDefault: function () { } });
            keyModule.keyActionHandler({ action: 'tab', target: contentEle, shiftKey: false, preventDefault: (): void => { /** Null */ } });
            expect(contentEle.querySelector('e-card') == null).toBe(true);
        });

        it('focus on document down tab key', () => {
            let ele: HTMLElement = document.querySelector('.e-kanban');
            ele.focus();
            keyModule.keyActionHandler({ action: 'tab', target: ele, shiftKey: false, preventDefault: (): void => { /** Null */ } });
        });

        it('Focus on add button and enter key', (done: Function) => {
            let addButton: HTMLElement = kanbanObj.element.querySelector('.e-show-add-button');
            let popupEle: HTMLElement = document.querySelector('.e-dialog.e-kanban-dialog.e-popup');
            addButton.focus();
            expect(popupEle == null).toBe(true);
            keyModule.keyActionHandler({ action: 'enter', target: addButton, preventDefault: function () { } });
            setTimeout(() => { done(); }, 500);
        });

        it('opening the popup', () => {
            let popupEle: HTMLElement = document.querySelector('.e-dialog.e-kanban-dialog.e-popup');
            expect(popupEle.classList.contains('e-popup-close')).toBe(false);
            expect(popupEle.classList.contains('e-popup-open')).toBe(true);
            kanbanObj.closeDialog();
            expect(popupEle.classList.contains('e-popup-open')).toBe(false);
        });
    });

    it('memory leak', () => {
        profile.sample();
        const average: number = inMB(profile.averageChange);
        expect(average).toBeLessThan(10); //Check average change in memory samples to not be over 10MB
        const memory: number = inMB(getMemoryProfile());
        //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    });
});
