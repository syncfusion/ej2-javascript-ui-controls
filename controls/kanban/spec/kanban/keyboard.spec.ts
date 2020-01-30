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
        // tslint:disable:no-any
        const isDef: (o: any) => boolean = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            // tslint:disable-next-line:no-console
            console.log('Unsupported environment, window.performance.memory is unavailable');
            (this as any).skip(); //Skips test (in Chai)
            return;
        }
    });

    describe('Default layout interactions', () => {
        let kanbanObj: Kanban;
        beforeAll((done: DoneFn) => {
            let model: KanbanModel = {
                columns: [
                    { headerText: 'Backlog', keyField: 'Open', allowToggle: true },
                    { headerText: 'In Progress', keyField: 'InProgress', allowToggle: true },
                    { headerText: 'Testing', keyField: 'Testing', allowToggle: true },
                    { headerText: 'Done', keyField: 'Close', allowToggle: true }
                ],
                allowKeyboard: true,
                cardSettings: {
                    selectionType: 'Single'
                }
            };
            kanbanObj = util.createKanban(model, kanbanData, done);
        });

        beforeEach((done: DoneFn) => done());

        afterAll(() => {
            util.destroy(kanbanObj);
        });

        it('trying to expand swimlanes', () => {
            let card: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="25"]').item(0) as HTMLElement;
            expect(card.classList.contains('e-selection')).not.toBe(true);
            util.triggerMouseEvent(card, 'click');
            (kanbanObj.keyboardModule as any).keyActionHandler({ action: 'swimlaneExpandAll' });
            expect(card.classList.contains('e-selection')).toBe(true);
        });
    });

    describe('Keyboard Interactions for single card selection type', () => {
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
            expect(keyModule.getModuleName()).toEqual('keyboard');
        });

        it('first card selection testing', () => {
            let card: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="25"]').item(0) as HTMLElement;
            expect(card.classList.contains('e-selection')).not.toBe(true);
            keyModule.keyActionHandler({ action: 'firstCardSelection' });
            expect(card.classList.contains('e-selection')).toBe(true);
        });

        it('last card selection testing', () => {
            let card: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="54"]').item(0) as HTMLElement;
            expect(card.classList.contains('e-selection')).toEqual(false);
            keyModule.keyActionHandler({ action: 'lastCardSelection' });
            expect(card.classList.contains('e-selection')).toEqual(true);
            let card1: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="25"]').item(0) as HTMLElement;
            expect(card1.classList.contains('e-selection')).toEqual(false);
        });

        it('Swimlane collapse all testing', () => {
            let element: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-swimlane-row');
            for (let i: number = 0; i < element.length; i++) {
                expect(element[i].classList.contains('e-collapsed')).toEqual(false);
                expect(element[i].querySelector('.e-icons').classList.contains('e-swimlane-row-expand')).toBe(true);
                expect(element[i].nextElementSibling.classList.contains('e-collapsed')).toEqual(false);
            }
            keyModule.keyActionHandler({ action: 'swimlaneCollapseAll' });
            for (let i: number = 0; i < element.length; i++) {
                expect(element[i].classList.contains('e-collapsed')).toBe(true);
                expect(element[i].querySelector('.e-icons').classList.contains('e-swimlane-row-collapse')).toBe(true);
                expect(element[i].nextElementSibling.classList.contains('e-collapsed')).toBe(true);
            }
        });
        it('Swimlane expand all testing', () => {
            let element: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-swimlane-row');
            for (let i: number = 0; i < element.length; i++) {
                expect(element[i].classList.contains('e-collapsed')).toBe(true);
                expect(element[i].querySelector('.e-icons').classList.contains('e-swimlane-row-collapse')).toBe(true);
                expect(element[i].nextElementSibling.classList.contains('e-collapsed')).toBe(true);
            }
            keyModule.keyActionHandler({ action: 'swimlaneExpandAll' });
            for (let i: number = 0; i < element.length; i++) {
                expect(element[i].classList.contains('e-collapsed')).not.toBe(true);
                expect(element[i].querySelector('.e-icons').classList.contains('e-swimlane-row-expand')).toBe(true);
                expect(element[i].nextElementSibling.classList.contains('e-collapsed')).not.toBe(true);
            }
        });

        it('Selected card Swimlane collapse testing', () => {
            let element: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-swimlane-row');
            for (let i: number = 0; i < element.length; i++) {
                expect(element[i].classList.contains('e-collapsed')).not.toBe(true);
                expect(element[i].querySelector('.e-icons').classList.contains('e-swimlane-row-expand')).toBe(true);
                expect(element[i].nextElementSibling.classList.contains('e-collapsed')).not.toBe(true);
            }
            let card: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="17"]').item(0) as HTMLElement;
            expect(card.classList.contains('e-selection')).not.toBe(true);
            card.click();
            expect(card.classList.contains('e-selection')).toBe(true);
            keyModule.keyActionHandler({ action: 'selectedSwimlaneCollapse' });
            expect(element[0].classList.contains('e-collapsed')).not.toBe(true);
            expect(element[0].querySelector('.e-icons').classList.contains('e-swimlane-row-expand')).toBe(true);
            expect(element[0].nextElementSibling.classList.contains('e-collapsed')).not.toBe(true);
            expect(element[1].classList.contains('e-collapsed')).toBe(true);
            expect(element[1].querySelector('.e-icons').classList.contains('e-swimlane-row-collapse')).toBe(true);
            expect(element[1].nextElementSibling.classList.contains('e-collapsed')).toBe(true);
            for (let i: number = 2; i < element.length; i++) {
                expect(element[i].classList.contains('e-collapsed')).not.toBe(true);
                expect(element[i].querySelector('.e-icons').classList.contains('e-swimlane-row-expand')).toBe(true);
                expect(element[i].nextElementSibling.classList.contains('e-collapsed')).not.toBe(true);
            }
        });
        it('Selected card Swimlane expand testing', () => {
            let element: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-swimlane-row');
            expect(element[0].classList.contains('e-collapsed')).not.toBe(true);
            expect(element[0].querySelector('.e-icons').classList.contains('e-swimlane-row-expand')).toBe(true);
            expect(element[0].nextElementSibling.classList.contains('e-collapsed')).not.toBe(true);
            expect(element[1].classList.contains('e-collapsed')).toBe(true);
            expect(element[1].querySelector('.e-icons').classList.contains('e-swimlane-row-collapse')).toBe(true);
            expect(element[1].nextElementSibling.classList.contains('e-collapsed')).toBe(true);
            for (let i: number = 2; i < element.length; i++) {
                expect(element[i].classList.contains('e-collapsed')).not.toBe(true);
                expect(element[i].querySelector('.e-icons').classList.contains('e-swimlane-row-expand')).toBe(true);
                expect(element[i].nextElementSibling.classList.contains('e-collapsed')).not.toBe(true);
            }
            keyModule.keyActionHandler({ action: 'selectedSwimlaneExpand' });
            for (let i: number = 0; i < element.length; i++) {
                expect(element[i].classList.contains('e-collapsed')).not.toBe(true);
                expect(element[i].querySelector('.e-icons').classList.contains('e-swimlane-row-expand')).toBe(true);
                expect(element[i].nextElementSibling.classList.contains('e-collapsed')).not.toBe(true);
            }
        });
        it('Selected card Column collapse testing', () => {
            let card: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="17"]').item(0) as HTMLElement;
            let key: string = card.getAttribute('data-key');
            let headerCell: Element = kanbanObj.element.querySelectorAll('.e-header-cells[data-key=' + key + ']').item(0);
            expect(headerCell.classList.contains('e-collapsed')).not.toBe(true);
            expect(headerCell.querySelector('.e-icons').classList.contains('e-column-expand')).toBe(true);
            let element: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-content-cells[data-key=' + key + ']');
            for (let i: number = 0; i < element.length; i++) {
                expect(element[i].classList.contains('e-collapsed')).not.toBe(true);
            }
            keyModule.keyActionHandler({ action: 'selectedColumnCollapse' });
            expect(headerCell.classList.contains('e-collapsed')).toBe(true);
            expect(headerCell.querySelector('.e-icons').classList.contains('e-column-collapse')).toBe(true);
            for (let i: number = 0; i < element.length; i++) {
                expect(element[i].classList.contains('e-collapsed')).toBe(true);
            }
        });

        it('Again clicked on collapsed keys on collapsed columns', () => {
            let card: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="17"]').item(0) as HTMLElement;
            let key: string = card.getAttribute('data-key');
            let headerCell: Element = kanbanObj.element.querySelectorAll('.e-header-cells[data-key=' + key + ']').item(0);
            keyModule.keyActionHandler({ action: 'selectedColumnCollapse' });
            expect(headerCell.classList.contains('e-collapsed')).toBe(true);
            let element: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-content-cells[data-key=' + key + ']');
            expect(headerCell.querySelector('.e-icons').classList.contains('e-column-collapse')).toBe(true);
            for (let i: number = 0; i < element.length; i++) {
                expect(element[i].classList.contains('e-collapsed')).toBe(true);
            }
        });
        it('Selected card - Column expand testing', () => {
            let card: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="17"]').item(0) as HTMLElement;
            let key: string = card.getAttribute('data-key');
            let headerCell: Element = kanbanObj.element.querySelectorAll('.e-header-cells[data-key=' + key + ']').item(0);
            keyModule.keyActionHandler({ action: 'selectedColumnExpand' });
            expect(headerCell.classList.contains('e-collapsed')).not.toBe(true);
            expect(headerCell.querySelector('.e-icons').classList.contains('e-column-expand')).toBe(true);
            let element: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-content-cells[data-key=' + key + ']');
            for (let i: number = 0; i < element.length; i++) {
                expect(element[i].classList.contains('e-collapsed')).not.toBe(true);
            }
        });
        it('Up arrow testing', () => {
            let card: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="49"]').item(0) as HTMLElement;
            util.triggerMouseEvent(card, 'click');
            expect(card.classList.contains('e-selection')).toEqual(true);
            keyModule.keyActionHandler({ action: 'upArrow' });
            expect(card.classList.contains('e-selection')).toEqual(false);
            let upCard: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="25"]').item(0) as HTMLElement;
            expect(upCard.classList.contains('e-selection')).toEqual(true);
        });
        it('Down arrow testing', () => {
            keyModule.keyActionHandler({ action: 'downArrow' });
            let downCard: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="49"]').item(0) as HTMLElement;
            expect(downCard.classList.contains('e-selection')).toEqual(true);
        });
        it('Right arrow testing', () => {
            keyModule.keyActionHandler({ action: 'rightArrow' });
            let rightCard: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="2"]').item(0) as HTMLElement;
            expect(rightCard.classList.contains('e-selection')).toEqual(true);
        });
        it('Left arrow testing', () => {
            keyModule.keyActionHandler({ action: 'leftArrow' });
            let leftCard: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="25"]').item(0) as HTMLElement;
            expect(leftCard.classList.contains('e-selection')).toEqual(true);
        });
        it('Multi selection testing', () => {
            keyModule.keyActionHandler({ action: 'multiSelectionByRightArrow' });
            let multiCard: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="2"]').item(0) as HTMLElement;
            expect(multiCard.classList.contains('e-selection')).toEqual(true);
            let leftCard: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="25"]').item(0) as HTMLElement;
            expect(leftCard.classList.contains('e-selection')).toEqual(false);
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

        it('last card selection testing', () => {
            keyModule = kanbanObj.keyboardModule;
            let card: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="54"]').item(0) as HTMLElement;
            expect(card.classList.contains('e-selection')).toEqual(false);
            keyModule.keyActionHandler({ action: 'lastCardSelection' });
            expect(card.classList.contains('e-selection')).toEqual(true);
        });
        it('Multi selection right arrow testing', () => {
            let card1: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="25"]').item(0) as HTMLElement;
            util.triggerMouseEvent(card1, 'click');
            expect(card1.classList.contains('e-selection')).toEqual(true);
            keyModule.keyActionHandler({ action: 'multiSelectionByRightArrow' });
            let card2: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="49"]').item(0) as HTMLElement;
            expect(card2.classList.contains('e-selection')).toEqual(true);
            let card3: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="61"]').item(0) as HTMLElement;
            expect(card3.classList.contains('e-selection')).toEqual(true);
            let card4: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="69"]').item(0) as HTMLElement;
            expect(card4.classList.contains('e-selection')).toEqual(true);
            let card5: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="2"]').item(0) as HTMLElement;
            expect(card5.classList.contains('e-selection')).toEqual(true);
        });
        it('Multi selection left arrow testing', () => {
            let card1: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="66"]').item(0) as HTMLElement;
            util.triggerMouseEvent(card1, 'click');
            expect(card1.classList.contains('e-selection')).toEqual(true);
            keyModule.keyActionHandler({ action: 'multiSelectionByLeftArrow' });
            let card2: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="42"]').item(0) as HTMLElement;
            expect(card2.classList.contains('e-selection')).toEqual(true);
            let card3: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="37"]').item(0) as HTMLElement;
            expect(card3.classList.contains('e-selection')).toEqual(true);
            let card4: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="18"]').item(0) as HTMLElement;
            expect(card4.classList.contains('e-selection')).toEqual(true);
            let card5: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="45"]').item(0) as HTMLElement;
            expect(card5.classList.contains('e-selection')).toEqual(true);
        });
    });

    describe('Keyboard Interactions for multiple card selection type', () => {
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

        it('Click up arrow when no card is selected', () => {
            keyModule = kanbanObj.keyboardModule;
            keyModule.keyActionHandler({ action: 'upArrow' });
            expect(kanbanObj.element.querySelectorAll('.e-card.e-selection').length).toEqual(0);
        });

        it('Multi selection with swimlane row to row using left arrow', () => {
            let card: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="14"]').item(0) as HTMLElement;
            expect(card.classList.contains('e-selection')).toEqual(false);
            let swimlaneRow: Element = kanbanObj.element.querySelectorAll('.e-swimlane-row').item(2);
            expect(swimlaneRow.classList.contains('e-collapsed')).toEqual(false);
            util.triggerMouseEvent(card, 'click');
            expect(card.classList.contains('e-selection')).toEqual(true);
            keyModule.keyActionHandler({ action: 'multiSelectionByLeftArrow' });
            let card1: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="58"]').item(0) as HTMLElement;
            expect(card1.classList.contains('e-selection')).toEqual(true);
            expect(swimlaneRow.classList.contains('e-collapsed')).toEqual(true);
            expect(card.classList.contains('e-selection')).toEqual(false);
        });
        it('Multi selection with swimlane row to row using right arrow', () => {
            let card: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="58"]').item(0) as HTMLElement;
            expect(card.classList.contains('e-selection')).toEqual(true);
            let swimlaneRow: Element = kanbanObj.element.querySelectorAll('.e-swimlane-row').item(2);
            expect(swimlaneRow.classList.contains('e-collapsed')).toEqual(true);
            keyModule.keyActionHandler({ action: 'rightArrow' });
            let card1: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="14"]').item(0) as HTMLElement;
            expect(card1.classList.contains('e-selection')).toEqual(true);
            expect(swimlaneRow.classList.contains('e-collapsed')).toEqual(false);
            expect(card.classList.contains('e-selection')).toEqual(false);
        });
        it('Multi selection with up arrow', () => {
            keyModule.keyActionHandler({ action: 'multiSelectionByUpArrow' });
            let card1: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="70"]').item(0) as HTMLElement;
            expect(card1.classList.contains('e-selection')).toEqual(false);
            let card2: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="14"]').item(0) as HTMLElement;
            expect(card2.classList.contains('e-selection')).toEqual(true);
        });
        it('Multi selection with down arrow', () => {
            keyModule.keyActionHandler({ action: 'multiSelectionByDownArrow' });
            let card1: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="14"]').item(0) as HTMLElement;
            expect(card1.classList.contains('e-selection')).toEqual(true);
            let card2: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="62"]').item(0) as HTMLElement;
            expect(card2.classList.contains('e-selection')).toEqual(true);
            keyModule.keyActionHandler({ action: 'multiSelectionByDownArrow' });
            let card3: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="14"]').item(0) as HTMLElement;
            expect(card3.classList.contains('e-selection')).toEqual(true);
            let card4: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="62"]').item(0) as HTMLElement;
            expect(card4.classList.contains('e-selection')).toEqual(true);
            let card5: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="40"]').item(0) as HTMLElement;
            expect(card5.classList.contains('e-selection')).toEqual(false);
        });
        it('Last cloumn card selection with right key functionalities', () => {
            let card: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="34"]').item(0) as HTMLElement;
            util.triggerMouseEvent(card, 'click');
            expect(card.classList.contains('e-selection')).toEqual(true);
            keyModule.keyActionHandler({ action: 'rightArrow' });
            let card1: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="46"]').item(0) as HTMLElement;
            expect(card1.classList.contains('e-selection')).toEqual(true);
            expect(card.classList.contains('e-selection')).toEqual(false);
        });
        it('Last cloumn card selection with right key functionalities moved to next swimlane row', () => {
            let card: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="58"]').item(0) as HTMLElement;
            keyModule.keyActionHandler({ action: 'rightArrow' });
            expect(card.classList.contains('e-selection')).toEqual(true);
            keyModule.keyActionHandler({ action: 'rightArrow' });
            let card1: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="14"]').item(0) as HTMLElement;
            expect(card1.classList.contains('e-selection')).toEqual(true);
            expect(card.classList.contains('e-selection')).toEqual(false);
        });
        it('First cloumn card selection with left key functionalities moved to previous swimlane row', () => {
            let card: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="14"]').item(0) as HTMLElement;
            util.triggerMouseEvent(card, 'click');
            expect(card.classList.contains('e-selection')).toEqual(true);
            keyModule.keyActionHandler({ action: 'leftArrow' });
            let card1: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="58"]').item(0) as HTMLElement;
            expect(card1.classList.contains('e-selection')).toEqual(true);
            let row1: HTMLElement = kanbanObj.element.querySelectorAll('.e-content-row').item(4) as HTMLElement;
            expect(row1.classList.contains('e-collapsed')).toEqual(true);
            let row2: HTMLElement = kanbanObj.element.querySelectorAll('.e-content-row').item(5) as HTMLElement;
            expect(row2.classList.contains('e-collapsed')).toEqual(true);
        });
        it('First cloumn card selection with left key functionalities moved to first card', () => {
            let card: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="51"]').item(0) as HTMLElement;
            util.triggerMouseEvent(card, 'click');
            expect(card.classList.contains('e-selection')).toEqual(true);
            keyModule.keyActionHandler({ action: 'leftArrow' });
            let card1: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="15"]').item(0) as HTMLElement;
            expect(card1.classList.contains('e-selection')).toEqual(true);
        });
        it('First cloumn card selection with left key functionalities moved to previous swimlane row', () => {
            let card: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="3"]').item(0) as HTMLElement;
            util.triggerMouseEvent(card, 'click');
            expect(card.classList.contains('e-selection')).toEqual(true);
            keyModule.keyActionHandler({ action: 'leftArrow' });
            let card1: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="66"]').item(0) as HTMLElement;
            expect(card1.classList.contains('e-selection')).toEqual(true);
        });
    });

    it('memory leak', () => {
        profile.sample();
        let average: any = inMB(profile.averageChange);
        expect(average).toBeLessThan(10); //Check average change in memory samples to not be over 10MB
        let memory: any = inMB(getMemoryProfile());
        //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    });
});