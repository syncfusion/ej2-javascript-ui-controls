/**
 * drag spec
 */
import { Kanban, KanbanModel } from '../../src/kanban/index';
import { kanbanData } from './common/kanban-data.spec';
import { profile, inMB, getMemoryProfile } from './common/common.spec';
import * as util from './common/util.spec';

Kanban.Inject();

describe('Customer bug module', () => {
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

    describe('EJ2CORE-503 - Cards are hidden on the Kanban after the multiple card drag and drop - default layout', () => {
        let kanbanObj: Kanban;
        beforeAll((done: DoneFn) => {
            let model: KanbanModel = {
                columns: [
                    { headerText: 'Backlog', keyField: 'Open', allowToggle: true },
                    { headerText: 'In Progress', keyField: 'InProgress', allowToggle: true },
                    { headerText: 'Testing', keyField: 'Testing', allowToggle: true },
                    { headerText: 'Done', keyField: 'Close', allowToggle: true }
                ],
                cardSettings: {
                    selectionType: 'Multiple'
                }
            };
            kanbanObj = util.createKanban(model, kanbanData, done);
        });

        afterAll(() => {
            util.destroy(kanbanObj);
        });

        it('Select multiple cards', () => {
            let card1: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="1"]').item(0) as HTMLElement;
            util.triggerMouseEvent(card1, 'click');
            expect(card1.classList.contains('e-selection')).toEqual(true);
            let card2: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="3"]').item(0) as HTMLElement;
            util.triggerMouseEvent(card2, 'click', null, null, false, true);
            let card3: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="4"]').item(0) as HTMLElement;
            util.triggerMouseEvent(card3, 'click', null, null, false, true);
            expect(card1.classList.contains('e-selection')).toEqual(true);
            expect(card2.classList.contains('e-selection')).toEqual(true);
            expect(card3.classList.contains('e-selection')).toEqual(true);
        });
        it('Drag multiple cards', () => {
            let draggedElement: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="1"]').item(0) as HTMLElement;
            util.triggerMouseEvent(draggedElement, 'mousedown');
            util.triggerMouseEvent(draggedElement, 'mousemove', 250, 300);
            expect(kanbanObj.element.querySelectorAll('.e-target-dragged-clone').length).toEqual(3);
            let card1: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="1"]').item(0) as HTMLElement;
            expect(card1.classList.contains('e-kanban-dragged-card')).toEqual(true);
            let card2: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="3"]').item(0) as HTMLElement;
            expect(card2.classList.contains('e-kanban-dragged-card')).toEqual(true);
            let card3: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="4"]').item(0) as HTMLElement;
            expect(card3.classList.contains('e-kanban-dragged-card')).toEqual(true);
        });
        it('Dropped card to columns', () => {
            let ele: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="2"]').item(0) as HTMLElement;
            util.triggerMouseEvent(ele, 'mouseup', 250, 300);
        });
        it('After select multiple cards', () => {
            let card1: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="1"]').item(0) as HTMLElement;
            expect(card1.classList.contains('e-selection')).toEqual(true);
            let card2: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="3"]').item(0) as HTMLElement;
            let card3: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="4"]').item(0) as HTMLElement;
            expect(card1.classList.contains('e-selection')).toEqual(true);
            expect(card2.classList.contains('e-selection')).toEqual(true);
            expect(card3.classList.contains('e-selection')).toEqual(true);
            expect(card1.classList.contains('e-kanban-dragged-card')).toEqual(false);
            expect(card2.classList.contains('e-kanban-dragged-card')).toEqual(false);
            expect(card3.classList.contains('e-kanban-dragged-card')).toEqual(false);
        });
    });

    describe('EJ2CORE-503 - Cards are hidden on the Kanban after the multiple card drag and drop - swimlane layout', () => {
        let kanbanObj: Kanban;
        beforeAll((done: DoneFn) => {
            let model: KanbanModel = {
                columns: [
                    { headerText: 'Backlog', keyField: 'Open', allowToggle: true },
                    { headerText: 'In Progress', keyField: 'InProgress', allowToggle: true },
                    { headerText: 'Testing', keyField: 'Testing', allowToggle: true },
                    { headerText: 'Done', keyField: 'Close', allowToggle: true }
                ],
                swimlaneSettings: {
                    keyField: 'Assignee',
                    allowDragAndDrop: true,
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

        it('Select multiple cards', () => {
            let card1: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="45"]').item(0) as HTMLElement;
            util.triggerMouseEvent(card1, 'click');
            expect(card1.classList.contains('e-selection')).toEqual(true);
            let card2: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="18"]').item(0) as HTMLElement;
            util.triggerMouseEvent(card2, 'click', null, null, false, true);
            let card3: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="66"]').item(0) as HTMLElement;
            util.triggerMouseEvent(card3, 'click', null, null, false, true);
            expect(card1.classList.contains('e-selection')).toEqual(true);
            expect(card2.classList.contains('e-selection')).toEqual(true);
            expect(card3.classList.contains('e-selection')).toEqual(true);
        });
        it('Drag multiple cards', () => {
            let draggedElement: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="66"]').item(0) as HTMLElement;
            util.triggerMouseEvent(draggedElement, 'mousedown');
            util.triggerMouseEvent(draggedElement, 'mousemove', 250, 170);
            expect(kanbanObj.element.querySelectorAll('.e-target-dragged-clone').length).toEqual(3);
            let card1: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="45"]').item(0) as HTMLElement;
            expect(card1.classList.contains('e-kanban-dragged-card')).toEqual(true);
            let card2: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="18"]').item(0) as HTMLElement;
            expect(card2.classList.contains('e-kanban-dragged-card')).toEqual(true);
            let card3: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="66"]').item(0) as HTMLElement;
            expect(card3.classList.contains('e-kanban-dragged-card')).toEqual(true);
        });
        it('Dropped card to columns', () => {
            let ele: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="2"]').item(0) as HTMLElement;
            util.triggerMouseEvent(ele, 'mouseup', 250, 150);
        });
        it('After select multiple cards', () => {
            let card1: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="45"]').item(0) as HTMLElement;
            expect(card1.classList.contains('e-selection')).toEqual(true);
            let card2: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="18"]').item(0) as HTMLElement;
            let card3: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="66"]').item(0) as HTMLElement;
            expect(card1.classList.contains('e-selection')).toEqual(true);
            expect(card2.classList.contains('e-selection')).toEqual(true);
            expect(card3.classList.contains('e-selection')).toEqual(true);
            expect(card1.classList.contains('e-kanban-dragged-card')).toEqual(false);
            expect(card2.classList.contains('e-kanban-dragged-card')).toEqual(false);
            expect(card3.classList.contains('e-kanban-dragged-card')).toEqual(false);
        });
    });

    describe('EJ2CORE-503 - Cards are hidden on the Kanban after the single card drag and drop - default layout', () => {
        let kanbanObj: Kanban;
        beforeAll((done: DoneFn) => {
            let model: KanbanModel = {
                columns: [
                    { headerText: 'Backlog', keyField: 'Open', allowToggle: true },
                    { headerText: 'In Progress', keyField: 'InProgress', allowToggle: true },
                    { headerText: 'Testing', keyField: 'Testing', allowToggle: true },
                    { headerText: 'Done', keyField: 'Close', allowToggle: true }
                ]
            };
            kanbanObj = util.createKanban(model, kanbanData, done);
        });

        afterAll(() => {
            util.destroy(kanbanObj);
        });

        it('Select single card', () => {
            let card1: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="1"]').item(0) as HTMLElement;
            util.triggerMouseEvent(card1, 'click');
            expect(card1.classList.contains('e-selection')).toEqual(true);
        });
        it('Drag selected card', () => {
            let draggedElement: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="1"]').item(0) as HTMLElement;
            util.triggerMouseEvent(draggedElement, 'mousedown');
            util.triggerMouseEvent(draggedElement, 'mousemove', 250, 300);
            expect(kanbanObj.element.querySelectorAll('.e-target-dragged-clone').length).toEqual(1);
            let card1: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="1"]').item(0) as HTMLElement;
            expect(card1.classList.contains('e-kanban-dragged-card')).toEqual(true);
        });
        it('Dropped card to columns', () => {
            let ele: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="2"]').item(0) as HTMLElement;
            util.triggerMouseEvent(ele, 'mouseup', 250, 300);
        });
        it('After select cards', () => {
            let card1: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="1"]').item(0) as HTMLElement;
            expect(card1.classList.contains('e-selection')).toEqual(true);
            expect(card1.classList.contains('e-kanban-dragged-card')).toEqual(false);
        });
    });

    describe('EJ2CORE-503 - Cards are hidden on the Kanban after the multiple card drag and drop - default layout', () => {
        let kanbanObj: Kanban;
        beforeAll((done: DoneFn) => {
            let model: KanbanModel = {
                columns: [
                    { headerText: 'Backlog', keyField: 'Open', allowToggle: true },
                    { headerText: 'In Progress', keyField: 'InProgress', allowToggle: true },
                    { headerText: 'Testing', keyField: 'Testing', allowToggle: true },
                    { headerText: 'Done', keyField: 'Close', allowToggle: true }
                ]
            };
            kanbanObj = util.createKanban(model, kanbanData, done);
        });

        afterAll(() => {
            util.destroy(kanbanObj);
        });

        it('Without Select single cards', () => {
            let card1: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="1"]').item(0) as HTMLElement;
            expect(card1.classList.contains('e-selection')).toEqual(false);
        });
        it('Drag single cards', () => {
            let draggedElement: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="1"]').item(0) as HTMLElement;
            util.triggerMouseEvent(draggedElement, 'mousedown');
            util.triggerMouseEvent(draggedElement, 'mousemove', 250, 300);
            expect(kanbanObj.element.querySelectorAll('.e-target-dragged-clone').length).toEqual(1);
            let card1: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="1"]').item(0) as HTMLElement;
            expect(card1.classList.contains('e-kanban-dragged-card')).toEqual(true);
        });
        it('Dropped card to columns', () => {
            let ele: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="2"]').item(0) as HTMLElement;
            util.triggerMouseEvent(ele, 'mouseup', 250, 300);
        });
        it('After drag and drop without select cards', () => {
            let card1: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="1"]').item(0) as HTMLElement;
            expect(card1.classList.contains('e-selection')).toEqual(false);
            expect(card1.classList.contains('e-kanban-dragged-card')).toEqual(false);
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