/**
 * drag spec
 */
import { Kanban, KanbanModel } from '../../src/kanban/index';
import { kanbanData } from './common/kanban-data.spec';
import { profile, inMB, getMemoryProfile } from './common/common.spec';
import * as util from './common/util.spec';

Kanban.Inject();

describe('Drag module', () => {
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


    describe('Basic Drag and drop', () => {
        let kanbanObj: Kanban;
        beforeAll((done: DoneFn) => {
            kanbanObj = util.createKanban({}, kanbanData, done);
        });

        afterAll(() => {
            util.destroy(kanbanObj);
        });

        it('Drag and drop property class testing', () => {
            let cards: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-card');
            for (let i: number = 0; i < cards.length; i++) {
                expect(cards[i].classList.contains('e-draggable')).toBe(true);
            }
        });
    });

    describe('Basic drag and drop', () => {
        let kanbanObj: Kanban;
        beforeAll((done: DoneFn) => {
            let model: KanbanModel = { allowDragAndDrop: false };
            kanbanObj = util.createKanban(model, kanbanData, done);
        });

        afterAll(() => {
            util.destroy(kanbanObj);
        });

        it('Without Drag and drop property class testing', () => {
            let cards: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-card');
            for (let i: number = 0; i < cards.length; i++) {
                expect(cards[i].classList.contains('e-draggable')).toBe(false);
            }
        });
    });

    describe('Drag and drop functionality', () => {
        let kanbanObj: Kanban;
        let key: string;
        let width: string;
        let droppedElement: HTMLElement;
        let dragElement: HTMLElement;
        beforeAll((done: DoneFn) => {
            kanbanObj = util.createKanban({}, kanbanData, done);
        });

        afterAll(() => {
            util.destroy(kanbanObj);
        });

        it('Dragged clone behavior testing', () => {
            dragElement = (kanbanObj.element.querySelectorAll('.e-card[data-id="1"]') as NodeListOf<Element>).item(0) as HTMLElement;
            expect(dragElement.classList.contains('e-draggable')).toEqual(true);
            key = dragElement.getAttribute('data-key');
            util.triggerMouseEvent(dragElement, 'mousedown');
            util.triggerMouseEvent(dragElement, 'mousemove', 100, 100);
            expect(key).toEqual('Open');
            width = dragElement.style.width;
            expect(dragElement.classList.contains('e-kanban-dragged-card')).toBeTruthy();
            expect(dragElement.nextElementSibling.classList.contains('e-target-dragged-clone')).toBeTruthy();
            expect(kanbanObj.element.querySelectorAll('.e-target-dragged-clone').length).toBe(1);
        });

        it('Created Dropped clone on above the column testing and target is card', () => {
            let element: Element = kanbanObj.element.querySelectorAll('.e-card[data-id="2"]').item(0);
            util.triggerMouseEvent(element, 'mousemove', 250, 100);
            expect(element.previousElementSibling.classList.contains('e-target-dropped-clone')).toEqual(true);
        });

        it('Created Dropped clone on above the column testing and target is card wrapper', () => {
            let ele: HTMLElement = (kanbanObj.element.querySelectorAll('.e-card-wrapper') as NodeListOf<Element>).item(1) as HTMLElement;
            util.triggerMouseEvent(ele, 'mousemove', 250, 140);
            expect(ele.firstElementChild.classList.contains('e-target-dropped-clone')).toEqual(true);
        });

        it('Created Dropped clone on column bottom testing', () => {
            let element: HTMLElement = (<NodeListOf<Element>>kanbanObj.element.querySelectorAll('.e-content-cells')).item(1) as HTMLElement;
            util.triggerMouseEvent(element, 'mousemove', 300, 1400);
            expect(element.firstElementChild.lastElementChild.classList.contains('e-target-dropped-clone')).toEqual(true);
            expect(document.body.style.cursor).toBe('');
        });

        it('Cursor changed testing between the columns', () => {
            let element: HTMLElement = (<NodeListOf<Element>>kanbanObj.element.querySelectorAll('.e-content-table')).item(0) as HTMLElement;
            util.triggerMouseEvent(element, 'mousemove', 450, 140);
            expect(document.body.style.cursor).toBe('not-allowed');
        });

        it('Cursor changed testing with header', () => {
            let element: HTMLElement = (<NodeListOf<Element>>kanbanObj.element.querySelectorAll('.e-header-cells')).item(0) as HTMLElement;
            util.triggerMouseEvent(element, 'mousemove', 100, 0);
            expect(document.body.style.cursor).toBe('not-allowed');
        });

        it('Dropped clone behavior testing', () => {
            droppedElement = kanbanObj.element.querySelectorAll('.e-card[data-id="9"] .e-card-header').item(0) as HTMLElement;
            util.triggerMouseEvent(droppedElement, 'mousemove', 500, 200);
            expect(document.body.style.cursor).toBe('');
            expect(droppedElement.closest('.e-card').nextElementSibling.classList.contains('e-target-dropped-clone')).toEqual(true);
        });

        it('Drag Possible testing when drag the card', () => {
            let cells: NodeList = kanbanObj.element.querySelectorAll('.e-content-cells');
            expect((<HTMLElement>cells[0]).classList.contains('e-dropping')).toEqual(false);
            expect((<HTMLElement>cells[1]).classList.contains('e-dropping')).toEqual(true);
            expect((<HTMLElement>cells[2]).classList.contains('e-dropping')).toEqual(true);
            expect((<HTMLElement>cells[3]).classList.contains('e-dropping')).toEqual(true);
        });

        it('Dropped clone testing', () => {
            util.triggerMouseEvent(droppedElement, 'mouseup', 500, 200);
        });

        it('Drag Possible testing after dropped the card', () => {
            let cells: NodeList = kanbanObj.element.querySelectorAll('.e-content-cells');
            expect((<HTMLElement>cells[0]).classList.contains('e-dropping')).toEqual(false);
            expect((<HTMLElement>cells[1]).classList.contains('e-dropping')).toEqual(false);
            expect((<HTMLElement>cells[2]).classList.contains('e-dropping')).toEqual(false);
            expect((<HTMLElement>cells[3]).classList.contains('e-dropping')).toEqual(false);
        });

        it('Removed draggable and droppable clone testing', () => {
            expect(kanbanObj.element.querySelectorAll('.e-target-dragged-clone').length).toBe(0);
            expect(kanbanObj.element.querySelectorAll('.e-target-dropped-clone').length).toBe(0);
            expect(kanbanObj.element.querySelectorAll('.e-card.duplicate').length).toBe(0);
            expect(kanbanObj.element.querySelectorAll('.e-kanban-dragged-card').length).toBe(0);
        });

        it('Testing the cards after dropping the card', () => {
            let data: { [key: string]: Object } = kanbanObj.getCardDetails(dragElement);
            let curKey: Object = data[kanbanObj.keyField];
            expect(curKey).not.toBe(key);
            expect(curKey).toEqual('Testing');
        });

        it('Testing drag stop on between the columns', () => {
            dragElement = kanbanObj.element.querySelectorAll('.e-card[data-id="13"]').item(0) as HTMLElement;
            util.triggerMouseEvent(dragElement, 'mousedown');
            util.triggerMouseEvent(dragElement, 'mousemove', 100, 100);
            let element: HTMLElement = (<NodeListOf<Element>>kanbanObj.element.querySelectorAll('.e-content-table')).item(0) as HTMLElement;
            util.triggerMouseEvent(element, 'mousemove', 450, 140);
            expect(document.body.style.cursor).toBe('not-allowed');
            expect(kanbanObj.element.querySelectorAll('.e-target-dragged-clone').length).toBe(1);
            expect(kanbanObj.element.querySelectorAll('.e-card.duplicate').length).toBe(1);
            util.triggerMouseEvent(element, 'mouseup', 450, 140);
            expect(kanbanObj.element.querySelectorAll('.e-target-dragged-clone').length).toBe(0);
            expect(kanbanObj.element.querySelectorAll('.e-target-dropped-clone').length).toBe(0);
            expect(kanbanObj.element.querySelectorAll('.e-card.duplicate').length).toBe(0);
            expect(kanbanObj.element.querySelectorAll('.e-kanban-dragged-card').length).toBe(0);
            expect(document.body.style.cursor).toBe('');
        });

        it('Dropped clone removed testing on dragging one column to another column', () => {
            // Mouse down action
            dragElement = kanbanObj.element.querySelectorAll('.e-card[data-id="13"]').item(0) as HTMLElement;
            util.triggerMouseEvent(dragElement, 'mousedown');
            util.triggerMouseEvent(dragElement, 'mousemove', 100, 100);
            // Mouse move action
            let element: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="14"] .e-card-content').item(0) as HTMLElement;
            util.triggerMouseEvent(element, 'mousemove', 350, 270);
            expect(kanbanObj.element.querySelectorAll('.e-target-dragged-clone').length).toBe(1);
            expect(kanbanObj.element.querySelectorAll('.e-target-dropped-clone').length).toBe(1);
            expect(kanbanObj.element.querySelectorAll('.e-card.duplicate').length).toBe(1);
        });
        it('Dropped clone removed testing on dragging clone on one column to another column', () => {
            let ele: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="8"]').item(0) as HTMLElement;
            util.triggerMouseEvent(ele, 'mousemove', 650, 150);
            expect(kanbanObj.element.querySelectorAll('.e-target-dragged-clone').length).toBe(1);
            expect(kanbanObj.element.querySelectorAll('.e-target-dropped-clone').length).toBe(1);
            expect(kanbanObj.element.querySelectorAll('.e-card.duplicate').length).toBe(1);
            util.triggerMouseEvent(ele, 'mouseup', 650, 150);
        });
        it('Dropped clone removed testing and check all clones are removed', () => {
            expect(kanbanObj.element.querySelectorAll('.e-target-dragged-clone').length).toBe(0);
            expect(kanbanObj.element.querySelectorAll('.e-target-dropped-clone').length).toBe(0);
            expect(kanbanObj.element.querySelectorAll('.e-card.duplicate').length).toBe(0);
            expect(kanbanObj.element.querySelectorAll('.e-kanban-dragged-card').length).toBe(0);
            expect(document.body.style.cursor).toBe('');
        });
    });

    describe('Drag and drop with swimlane', () => {
        let kanbanObj: Kanban;
        let key: string;
        let width: string;
        let droppedElement: HTMLElement;
        let draggedElement: HTMLElement;
        beforeAll((done: DoneFn) => {
            let model: KanbanModel = {
                swimlaneSettings: {
                    keyField: 'Assignee'
                }
            };
            kanbanObj = util.createKanban(model, kanbanData, done);
        });

        afterAll(() => {
            util.destroy(kanbanObj);
        });

        it('Swimlane drag and drop property checking', () => {
            expect(kanbanObj.swimlaneSettings.allowDragAndDrop).toEqual(false);
        });

        it('Dragged clone behavior testing', () => {
            draggedElement = kanbanObj.element.querySelectorAll('.e-card[data-id="49"]').item(0) as HTMLElement;
            expect(draggedElement.classList.contains('e-draggable')).toBe(true);
            key = draggedElement.getAttribute('data-key');
            util.triggerMouseEvent(draggedElement, 'mousedown');
            util.triggerMouseEvent(draggedElement, 'mousemove', 100, 100);
            expect(key).toEqual('Open');
            util.triggerMouseEvent(draggedElement, 'mousemove');
            width = draggedElement.style.width;
            expect(draggedElement.classList.contains('e-kanban-dragged-card')).toBeTruthy();
            expect(draggedElement.nextElementSibling.classList.contains('e-target-dropped-clone')).toBeTruthy();
            expect(kanbanObj.element.querySelectorAll('.e-target-dragged-clone').length).toBe(1);
        });

        it('Created Dropped clone on above the column testing and target is card', () => {
            let element: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="2"]').item(0) as HTMLElement;
            util.triggerMouseEvent(element, 'mousemove', 250, 100);
            expect(element.previousElementSibling.classList.contains('e-target-dropped-clone')).toEqual(true);
        });

        it('Created Dropped clone on above the column testing and target is card wrapper', () => {
            let ele: HTMLElement = kanbanObj.element.querySelectorAll('.e-card-wrapper').item(1) as HTMLElement;
            util.triggerMouseEvent(ele, 'mousemove', 250, 140);
            expect(ele.firstElementChild.classList.contains('e-target-dropped-clone')).toEqual(true);
        });

        it('Created Dropped clone on column bottom testing', () => {
            let element: Element = kanbanObj.element.querySelectorAll('.e-content-row:not(.e-swimlane-row) .e-content-cells').item(1);
            util.triggerMouseEvent(element, 'mousemove', 300, 350);
            expect(element.firstElementChild.lastElementChild.classList.contains('e-target-dropped-clone')).toEqual(true);
            expect(document.body.style.cursor).toBe('');
        });

        it('Cursor changed testing between the columns', () => {
            let element: HTMLElement = kanbanObj.element.querySelectorAll('.e-content-table').item(0) as HTMLElement;
            util.triggerMouseEvent(element, 'mousemove', 450, 140);
            expect(document.body.style.cursor).toBe('not-allowed');
        });

        it('Cursor changed testing with header', () => {
            let element: HTMLElement = kanbanObj.element.querySelectorAll('.e-header-cells').item(0) as HTMLElement;
            util.triggerMouseEvent(element, 'mousemove', 100, 0);
            expect(document.body.style.cursor).toBe('not-allowed');
        });

        it('Cursor changed testing with Kanban content', () => {
            let element: HTMLElement = kanbanObj.element.querySelectorAll('.e-kanban-content').item(0) as HTMLElement;
            util.triggerMouseEvent(element, 'mousemove', 100, 3000);
            expect(document.body.style.cursor).toBe('not-allowed');
        });

        it('Cursor changed testing on swimlane row', () => {
            let element: HTMLElement = (<NodeListOf<Element>>kanbanObj.element.querySelectorAll('.e-swimlane-row')).item(0) as HTMLElement;
            util.triggerMouseEvent(element, 'mousemove', 250, 400);
            expect(document.body.style.cursor).toBe('not-allowed');
        });

        it('Cursor changed testing on swimlane row target as content cell', () => {
            let element: HTMLElement = kanbanObj.element.querySelectorAll('.e-swimlane-row .e-content-cells').item(1) as HTMLElement;
            util.triggerMouseEvent(element, 'mousemove', 250, 470);
            expect(document.body.style.cursor).toBe('not-allowed');
        });

        it('Cursor changed testing on swimlane row content cell', () => {
            let element: Element = kanbanObj.element.querySelectorAll('.e-content-row:not(.e-swimlane-row) .e-content-cells').item(5);
            util.triggerMouseEvent(element, 'mousemove', 250, 500);
            expect(document.body.style.cursor).toBe('not-allowed');
        });

        it('Cursor changed testing on swimlane row content', () => {
            let element: Element = kanbanObj.element.querySelectorAll('.e-card[data-id="4"]').item(0);
            util.triggerMouseEvent(element, 'mousemove', 250, 550);
            expect(document.body.style.cursor).toBe('not-allowed');
        });

        it('Dropped clone behavior testing', () => {
            droppedElement = <HTMLElement>kanbanObj.element.querySelectorAll('.e-card[data-id="37"] .e-card-header').item(0);
            util.triggerMouseEvent(droppedElement, 'mousemove', 700, 200);
            expect(document.body.style.cursor).toBe('');
            expect(droppedElement.closest('.e-card').nextElementSibling.classList.contains('e-target-dropped-clone')).toEqual(true);
        });
        it('Drag Possible testing when drag the card', () => {
            let cells: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-content-row:not(.e-swimlane-row) .e-content-cells');
            expect((<HTMLElement>cells[0]).classList.contains('e-dropping')).toEqual(false);
            expect((<HTMLElement>cells[1]).classList.contains('e-dropping')).toEqual(true);
            expect((<HTMLElement>cells[2]).classList.contains('e-dropping')).toEqual(true);
            expect((<HTMLElement>cells[3]).classList.contains('e-dropping')).toEqual(true);
            for (let i: number = 4; i < cells.length; i++) {
                expect((<HTMLElement>cells[i]).classList.contains('e-dropping')).toEqual(false);
            }
        });

        it('Dropped clone testing', () => {
            util.triggerMouseEvent(droppedElement, 'mouseup', 700, 200);
        });

        it('Drag Possible testing after dropped the card', () => {
            let cells: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-content-row:not(.e-swimlane-row) .e-content-cells');
            for (let i: number = 0; i < cells.length; i++) {
                expect((<HTMLElement>cells[i]).classList.contains('e-dropping')).toEqual(false);
            }
        });

        it('Removed draggable and droppable clone testing', () => {
            expect(kanbanObj.element.querySelectorAll('.e-target-dragged-clone').length).toBe(0);
            expect(kanbanObj.element.querySelectorAll('.e-target-dropped-clone').length).toBe(0);
            expect(kanbanObj.element.querySelectorAll('.e-card.duplicate').length).toBe(0);
            expect(kanbanObj.element.querySelectorAll('.e-kanban-dragged-card').length).toBe(0);
        });

        it('Testing the cards after dropping the card', () => {
            let data: { [key: string]: Object } = kanbanObj.getCardDetails(draggedElement);
            let curKey: Object = data[kanbanObj.keyField];
            expect(curKey).not.toBe(key);
            expect(curKey).toEqual('Close');
        });
    });

    describe('Drag and drop testing on within the swimlanes', () => {
        let kanbanObj: Kanban;
        let rows: string[];
        let swimlaneKey: Object;
        let columnKey: Object;
        let key: string;
        let width: string;
        let droppedElement: HTMLElement;
        let draggedElement: HTMLElement;
        beforeAll((done: DoneFn) => {
            let model: KanbanModel = {
                swimlaneSettings: {
                    keyField: 'Assignee',
                    allowDragAndDrop: true
                }
            };
            kanbanObj = util.createKanban(model, kanbanData, done);
        });

        afterAll(() => {
            util.destroy(kanbanObj);
        });

        it('Swimlane drag and drop property checking', () => {
            expect(kanbanObj.swimlaneSettings.allowDragAndDrop).toEqual(true);
        });

        it('Dragged clone behavior testing', () => {
            draggedElement = kanbanObj.element.querySelectorAll('.e-card[data-id="49"]').item(0) as HTMLElement;
            expect(draggedElement.classList.contains('e-draggable')).toBe(true);
            key = draggedElement.getAttribute('data-key');
            util.triggerMouseEvent(draggedElement, 'mousedown');
            util.triggerMouseEvent(draggedElement, 'mousemove', 100, 100);
            expect(key).toEqual('Open');
            util.triggerMouseEvent(draggedElement, 'mousemove');
            width = draggedElement.style.width;
            expect(draggedElement.classList.contains('e-kanban-dragged-card')).toBeTruthy();
            expect(draggedElement.nextElementSibling.classList.contains('e-target-dropped-clone')).toBeTruthy();
            expect(kanbanObj.element.querySelectorAll('.e-target-dragged-clone').length).toBe(1);
        });

        it('Created Dropped clone on above the column testing and target is card', () => {
            let element: Element = kanbanObj.element.querySelectorAll('.e-card[data-id="2"]').item(0);
            util.triggerMouseEvent(element, 'mousemove', 250, 100);
            expect(element.previousElementSibling.classList.contains('e-target-dropped-clone')).toEqual(true);
        });

        it('Created Dropped clone on above the column testing and target is card wrapper', () => {
            let ele: Element = kanbanObj.element.querySelectorAll('.e-card-wrapper').item(1);
            util.triggerMouseEvent(ele, 'mousemove', 250, 140);
            expect(ele.firstElementChild.classList.contains('e-target-dropped-clone')).toEqual(true);
        });

        it('Created Dropped clone on column bottom testing', () => {
            let element: Element = kanbanObj.element.querySelectorAll('.e-content-row:not(.e-swimlane-row) .e-content-cells').item(1);
            util.triggerMouseEvent(element, 'mousemove', 300, 350);
            expect(element.firstElementChild.lastElementChild.classList.contains('e-target-dropped-clone')).toEqual(true);
            expect(document.body.style.cursor).toBe('');
        });

        it('Cursor changed testing between the columns', () => {
            let element: HTMLElement = (<NodeListOf<Element>>kanbanObj.element.querySelectorAll('.e-content-table')).item(0) as HTMLElement;
            util.triggerMouseEvent(element, 'mousemove', 450, 140);
            expect(document.body.style.cursor).toBe('not-allowed');
        });

        it('Cursor changed testing with header', () => {
            let element: HTMLElement = (<NodeListOf<Element>>kanbanObj.element.querySelectorAll('.e-header-cells')).item(0) as HTMLElement;
            util.triggerMouseEvent(element, 'mousemove', 100, 0);
            expect(document.body.style.cursor).toBe('not-allowed');
        });

        it('Cursor changed testing with Kanban content', () => {
            let element: Element = kanbanObj.element.querySelectorAll('.e-kanban-content').item(0);
            util.triggerMouseEvent(element, 'mousemove', 100, 3000);
            expect(document.body.style.cursor).toBe('not-allowed');
        });

        it('Cursor changed testing on swimlane row', () => {
            let element: HTMLElement = (<NodeListOf<Element>>kanbanObj.element.querySelectorAll('.e-swimlane-row')).item(0) as HTMLElement;
            util.triggerMouseEvent(element, 'mousemove', 250, 400);
            expect(document.body.style.cursor).toBe('not-allowed');
        });

        it('Cursor changed testing on swimlane row content cell', () => {
            let element: Element = kanbanObj.element.querySelectorAll('.e-content-row:not(.e-swimlane-row) .e-content-cells').item(5);
            util.triggerMouseEvent(element, 'mousemove', 250, 500);
            expect(document.body.style.cursor).toBe('');
        });

        it('Cursor changed testing on swimlane row content', () => {
            let element: Element = kanbanObj.element.querySelectorAll('.e-card[data-id="4"]').item(0);
            util.triggerMouseEvent(element, 'mousemove', 250, 550);
            expect(document.body.style.cursor).toBe('');
            expect(element.previousElementSibling.classList.contains('e-target-dropped-clone')).toEqual(true);
        });

        it('Dropped clone behavior testing', () => {
            droppedElement = kanbanObj.element.querySelectorAll('.e-card[data-id="37"] .e-card-header').item(0) as HTMLElement;
            util.triggerMouseEvent(droppedElement, 'mousemove', 700, 200);
            expect(document.body.style.cursor).toBe('');
            expect(droppedElement.closest('.e-card').nextElementSibling.classList.contains('e-target-dropped-clone')).toEqual(true);
        });

        it('Drag Possible testing when drag the card', () => {
            let cells: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-content-row:not(.e-swimlane-row) .e-content-cells');
            expect((<HTMLElement>cells[0]).classList.contains('e-dropping')).toEqual(false);
            for (let i: number = 1; i < cells.length; i++) {
                expect((<HTMLElement>cells[i]).classList.contains('e-dropping')).toEqual(true);
            }
        });

        it('Dropped clone testing', () => {
            util.triggerMouseEvent(droppedElement, 'mouseup', 700, 200);
        });

        it('Drag Possible testing after dropped the card', () => {
            let cells: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-content-row:not(.e-swimlane-row) .e-content-cells');
            for (let i: number = 0; i < cells.length; i++) {
                expect((<HTMLElement>cells[i]).classList.contains('e-dropping')).toEqual(false);
            }
        });

        it('Removed draggable and droppable clone testing', () => {
            expect(kanbanObj.element.querySelectorAll('.e-target-dragged-clone').length).toBe(0);
            expect(kanbanObj.element.querySelectorAll('.e-target-dropped-clone').length).toBe(0);
            expect(kanbanObj.element.querySelectorAll('.e-card.duplicate').length).toBe(0);
            expect(kanbanObj.element.querySelectorAll('.e-kanban-dragged-card').length).toBe(0);
        });

        it('Testing the cards after dropping the card', () => {
            let data: { [key: string]: Object } = kanbanObj.getCardDetails(draggedElement);
            let curKey: Object = data[kanbanObj.keyField];
            expect(curKey).not.toBe(key);
            expect(curKey).toEqual('Close');
        });

        it('Swimlane to swimlane drag and drop initial data testing', () => {
            let allKeys: string[] = kanbanData.map((obj: { [key: string]: string }) =>
                obj[kanbanObj.swimlaneSettings.keyField]);
            rows = allKeys.filter((key: string, index: number) => allKeys.indexOf(key) === index).sort();
            draggedElement = (kanbanObj.element.querySelectorAll('.e-card[data-id="2"]') as NodeListOf<Element>).item(0) as HTMLElement;
            expect(draggedElement.classList.contains('e-draggable')).toBe(true);
            let data: { [key: string]: Object } = kanbanObj.getCardDetails(draggedElement);
            swimlaneKey = data[kanbanObj.swimlaneSettings.keyField];
            let contentRow: Element = draggedElement.closest('.e-content-row');
            let curSwimlaneKey: Object = contentRow.previousElementSibling.getAttribute('data-key');
            expect(swimlaneKey).toEqual(curSwimlaneKey);
            expect(curSwimlaneKey).toEqual(rows[0]);
            columnKey = data[kanbanObj.keyField];
            let curColumnKey: Object = draggedElement.getAttribute('data-key');
            expect(columnKey).toEqual(curColumnKey);
            util.triggerMouseEvent(draggedElement, 'mousedown');
        });

        it('Swimlane to swimlane Dragged clone behavior testing', () => {
            util.triggerMouseEvent(draggedElement, 'mousemove', 100, 100);
            width = draggedElement.style.width;
            expect(draggedElement.classList.contains('e-kanban-dragged-card')).toBeTruthy();
            expect(draggedElement.nextElementSibling.classList.contains('e-target-dragged-clone')).toBeTruthy();
            expect(kanbanObj.element.querySelectorAll('.e-target-dragged-clone').length).toBe(1);
        });

        it('Swimlane to swimlane Dropped clone testing', () => {
            droppedElement = kanbanObj.element.querySelectorAll('.e-card[data-id="29"]').item(0) as HTMLElement;
            util.triggerMouseEvent(droppedElement, 'mousemove', 500, 800);
            expect(droppedElement.nextElementSibling.classList.contains('e-target-dropped-clone')).toEqual(true);
        });

        it('Swilane to swimlane Drag Possible testing when drag the card', () => {
            let cells: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-content-row:not(.e-swimlane-row) .e-content-cells');
            expect((<HTMLElement>cells[1]).classList.contains('e-dropping')).toEqual(false);
            expect((<HTMLElement>cells[0]).classList.contains('e-dropping')).toEqual(true);
            for (let i: number = 2; i < cells.length; i++) {
                expect((<HTMLElement>cells[i]).classList.contains('e-dropping')).toEqual(true);
            }
        });

        it('Swimlane to swimlane Dropped clone testing', () => {
            util.triggerMouseEvent(droppedElement, 'mouseup', 500, 800);
        });

        it('Swimlane to swimlane Drag Possible testing after dropped the card', () => {
            let cells: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-content-row:not(.e-swimlane-row) .e-content-cells');
            for (let i: number = 0; i < cells.length; i++) {
                expect((<HTMLElement>cells[i]).classList.contains('e-dropping')).toEqual(false);
            }
        });

        it('Swimlane to swimlane Removed draggable and droppable clone testing', () => {
            expect(kanbanObj.element.querySelectorAll('.e-target-dragged-clone').length).toBe(0);
            expect(kanbanObj.element.querySelectorAll('.e-target-dropped-clone').length).toBe(0);
            expect(kanbanObj.element.querySelectorAll('.e-card.duplicate').length).toBe(0);
            expect(kanbanObj.element.querySelectorAll('.e-kanban-dragged-card').length).toBe(0);
        });

        it('Swimlane to swimlane Testing the cards after dropping the card', () => {
            let data: { [key: string]: Object } = kanbanObj.getCardDetails(draggedElement);
            let curKey: Object = data[kanbanObj.keyField];
            expect(curKey).not.toBe(key);
            expect(curKey).not.toBe(columnKey);
            let curSwimlaneKey: Object = data[kanbanObj.swimlaneSettings.keyField];
            expect(curSwimlaneKey).toBe(rows[1]);
            expect(curSwimlaneKey).not.toBe(swimlaneKey);
        });

        it('Maintain swimlane collapsed state when drag and drop - collapsed the swimlanes', () => {
            let element: HTMLElement = kanbanObj.element.querySelectorAll('.e-swimlane-row .e-icons')[0] as HTMLElement;
            element.click();
            expect(element.classList.contains('e-swimlane-row-collapse')).toBe(true);
            expect(element.closest('.e-content-row').nextElementSibling.classList.contains('e-collapsed')).toBe(true);
        });

        it('Maintain swimlane collapsed state when drag and drop - collapsed the third swimlanes', () => {
            let element: HTMLElement = kanbanObj.element.querySelectorAll('.e-swimlane-row .e-icons')[2] as HTMLElement;
            element.click();
            expect(element.classList.contains('e-swimlane-row-collapse')).toBe(true);
            expect(element.closest('.e-content-row').nextElementSibling.classList.contains('e-collapsed')).toBe(true);
        });

        it('Maintain swimlane collapsed state when drag and drop - collapsed the fourth swimlanes', () => {
            let element: HTMLElement = kanbanObj.element.querySelectorAll('.e-swimlane-row .e-icons')[3] as HTMLElement;
            element.click();
            expect(element.classList.contains('e-swimlane-row-collapse')).toBe(true);
            expect(element.closest('.e-content-row').nextElementSibling.classList.contains('e-collapsed')).toBe(true);
        });

        it('Maintain swimlane collapsed state when drag and drop - drag the card', () => {
            draggedElement = (kanbanObj.element.querySelectorAll('.e-card[data-id="12"]') as NodeListOf<Element>).item(0) as HTMLElement;
            util.triggerMouseEvent(draggedElement, 'mousedown');
            droppedElement = kanbanObj.element.querySelectorAll('.e-card[data-id="72"] .e-card-content').item(0) as HTMLElement;
            util.triggerMouseEvent(droppedElement, 'mousemove', 400, 700);
        });
        it('Maintain swimlane collapsed state when drag and drop - move the card', () => {
            util.triggerMouseEvent(droppedElement, 'mousemove', 300, 700);
            expect(kanbanObj.element.querySelectorAll('.e-target-dropped-clone').length).toBe(1);
            let element: HTMLElement = kanbanObj.element.querySelectorAll('.e-swimlane-row .e-icons')[0] as HTMLElement;
            expect(element.classList.contains('e-swimlane-row-collapse')).toBe(true);
            expect(element.closest('.e-content-row').nextElementSibling.classList.contains('e-collapsed')).toBe(true);
            let element1: HTMLElement = kanbanObj.element.querySelectorAll('.e-swimlane-row .e-icons')[2] as HTMLElement;
            expect(element1.classList.contains('e-swimlane-row-collapse')).toBe(true);
            expect(element1.closest('.e-content-row').nextElementSibling.classList.contains('e-collapsed')).toBe(true);
            let element2: HTMLElement = kanbanObj.element.querySelectorAll('.e-swimlane-row .e-icons')[3] as HTMLElement;
            expect(element2.classList.contains('e-swimlane-row-collapse')).toBe(true);
            expect(element2.closest('.e-content-row').nextElementSibling.classList.contains('e-collapsed')).toBe(true);
        });

        it('Maintain swimlane collapsed state when drag and drop - drop the card', () => {
            util.triggerMouseEvent(droppedElement, 'mouseup', 300, 700);
            expect(kanbanObj.element.querySelectorAll('.e-target-dropped-clone').length).toBe(0);
            let element: HTMLElement = kanbanObj.element.querySelectorAll('.e-swimlane-row .e-icons')[0] as HTMLElement;
            expect(element.classList.contains('e-swimlane-row-collapse')).toBe(true);
            expect(element.closest('.e-content-row').nextElementSibling.classList.contains('e-collapsed')).toBe(true);
            let element1: HTMLElement = kanbanObj.element.querySelectorAll('.e-swimlane-row .e-icons')[2] as HTMLElement;
            expect(element1.classList.contains('e-swimlane-row-collapse')).toBe(true);
            expect(element1.closest('.e-content-row').nextElementSibling.classList.contains('e-collapsed')).toBe(true);
            let element2: HTMLElement = kanbanObj.element.querySelectorAll('.e-swimlane-row .e-icons')[3] as HTMLElement;
            expect(element2.classList.contains('e-swimlane-row-collapse')).toBe(true);
            expect(element2.closest('.e-content-row').nextElementSibling.classList.contains('e-collapsed')).toBe(true);
        });

        it('Maintain swimlane collapsed state when swimlane drag and drop - drag the card', () => {
            draggedElement = (kanbanObj.element.querySelectorAll('.e-card[data-id="26"]') as NodeListOf<Element>).item(0) as HTMLElement;
            util.triggerMouseEvent(draggedElement, 'mousedown');
            util.triggerMouseEvent(draggedElement, 'mousemove', 400, 700);
        });
        it('Maintain swimlane collapsed state when swimlane drag and drop - move the card', () => {
            droppedElement = kanbanObj.element.querySelectorAll('.e-card[data-id="3"] .e-card-content').item(0) as HTMLElement;
            util.triggerMouseEvent(droppedElement, 'mousemove', 150, 200);
            expect(kanbanObj.element.querySelectorAll('.e-target-dropped-clone').length).toBe(1);
            let element: HTMLElement = kanbanObj.element.querySelectorAll('.e-swimlane-row .e-icons')[0] as HTMLElement;
            expect(element.classList.contains('e-swimlane-row-collapse')).toBe(true);
            expect(element.closest('.e-content-row').nextElementSibling.classList.contains('e-collapsed')).toBe(true);
            let element1: HTMLElement = kanbanObj.element.querySelectorAll('.e-swimlane-row .e-icons')[2] as HTMLElement;
            expect(element1.classList.contains('e-swimlane-row-collapse')).toBe(true);
            expect(element1.closest('.e-content-row').nextElementSibling.classList.contains('e-collapsed')).toBe(true);
            let element2: HTMLElement = kanbanObj.element.querySelectorAll('.e-swimlane-row .e-icons')[3] as HTMLElement;
            expect(element2.classList.contains('e-swimlane-row-collapse')).toBe(true);
            expect(element2.closest('.e-content-row').nextElementSibling.classList.contains('e-collapsed')).toBe(true);
            util.triggerMouseEvent(droppedElement, 'mouseup', 150, 200);
        });

        it('Maintain swimlane collapsed state when swimlane drag and drop - drop the card', () => {
            expect(kanbanObj.element.querySelectorAll('.e-target-dropped-clone').length).toBe(0);
            let element: HTMLElement = kanbanObj.element.querySelectorAll('.e-swimlane-row .e-icons')[0] as HTMLElement;
            expect(element.classList.contains('e-swimlane-row-collapse')).toBe(true);
            expect(element.closest('.e-content-row').nextElementSibling.classList.contains('e-collapsed')).toBe(true);
            let element1: HTMLElement = kanbanObj.element.querySelectorAll('.e-swimlane-row .e-icons')[2] as HTMLElement;
            expect(element1.classList.contains('e-swimlane-row-collapse')).toBe(true);
            expect(element1.closest('.e-content-row').nextElementSibling.classList.contains('e-collapsed')).toBe(true);
            let element2: HTMLElement = kanbanObj.element.querySelectorAll('.e-swimlane-row .e-icons')[3] as HTMLElement;
            expect(element2.classList.contains('e-swimlane-row-collapse')).toBe(true);
            expect(element2.closest('.e-content-row').nextElementSibling.classList.contains('e-collapsed')).toBe(true);
        });
    });

    describe('Testing on multiple key support', () => {
        let kanbanObj: Kanban;
        let key: string;
        let droppedElement: HTMLElement;
        let draggedElement: HTMLElement;
        beforeAll((done: DoneFn) => {
            let model: KanbanModel = {
                columns: [
                    { headerText: 'Backlog', keyField: 'Open, Review' },
                    { headerText: 'In Progress', keyField: 'InProgress' },
                    { headerText: 'Testing', keyField: 'Testing' },
                    { headerText: 'Done', keyField: 'Close' }
                ]
            };
            kanbanObj = util.createKanban(model, kanbanData, done);
        });

        afterAll(() => {
            util.destroy(kanbanObj);
        });
        it('Dragged clone behavior testing with multiple column keys', () => {
            draggedElement = (kanbanObj.element.querySelectorAll('.e-card[data-id="2"]') as NodeListOf<Element>).item(0) as HTMLElement;
            expect(draggedElement.classList.contains('e-draggable')).toBe(true);
            key = draggedElement.getAttribute('data-key');
            util.triggerMouseEvent(draggedElement, 'mousedown');
            expect(key).toEqual('InProgress');
            util.triggerMouseEvent(draggedElement, 'mousemove', 100, 100);
            expect(draggedElement.classList.contains('e-kanban-dragged-card')).toBeTruthy();
            expect(draggedElement.nextElementSibling.classList.contains('e-target-dragged-clone')).toBeTruthy();
            expect(kanbanObj.element.querySelectorAll('.e-target-dragged-clone').length).toBe(1);
        });

        it('Dropped clone behavior testing with multiple key testing', () => {
            droppedElement = kanbanObj.element.querySelectorAll('.e-card[data-id="1"] .e-card-content').item(0) as HTMLElement;
            util.triggerMouseEvent(droppedElement, 'mousemove', 100, 100);
            expect(document.body.style.cursor).toBe('');
            expect(droppedElement.closest('.e-content-cells').lastElementChild.classList.contains('e-target-multi-clone')).toEqual(true);
        });

        it('Dropped multi clone testing with columns', () => {
            droppedElement = <HTMLElement>kanbanObj.element.querySelector('.e-target-multi-clone').children[0].firstElementChild;
            util.triggerMouseEvent(droppedElement, 'mousemove', 100, 300);
        });

        it('All multiple key columns cards are displayed none when drag the multiple column key testing', () => {
            let wrapper: Element = kanbanObj.element.querySelector('.e-content-cells .e-card-wrapper');
            expect(wrapper.classList.contains('e-multi-card-wrapper')).toBe(true);
        });

        it('Column key testing on multiple key testing', () => {
            let clone: Element = kanbanObj.element.querySelectorAll('.e-target-multi-clone').item(0);
            for (let i: number = 0; i < clone.childElementCount; i++) {
                expect(clone.children[i].classList.contains('e-column-key')).toBe(true);
                expect(clone.children[i].firstElementChild.classList.contains('e-text')).toBe(true);
                let headerKey: string = kanbanObj.element.querySelectorAll('.e-header-cells')[0].getAttribute('data-key');
                expect(clone.children[i].firstElementChild.innerHTML).toBe(headerKey.split(',')[i].trim());
                expect(clone.children[i].getAttribute('data-key')).toBe(headerKey.split(',')[i].trim());
            }
        });

        it('Drag Possible testing when drag the card', () => {
            let cells: NodeList = kanbanObj.element.querySelectorAll('.e-content-cells');
            expect((<HTMLElement>cells[0]).classList.contains('e-dropping')).toEqual(true);
            expect((<HTMLElement>cells[1]).classList.contains('e-dropping')).toEqual(false);
            expect((<HTMLElement>cells[2]).classList.contains('e-dropping')).toEqual(true);
            expect((<HTMLElement>cells[3]).classList.contains('e-dropping')).toEqual(true);
        });

        it('Dropped clone testing', () => {
            expect(kanbanObj.element.querySelectorAll('.e-column-key')[0].classList.contains('e-multi-active')).toBe(true);
            expect(kanbanObj.element.querySelectorAll('.e-column-key')[0].classList.contains('e-multi-bottom-border')).not.toBe(true);
            droppedElement = kanbanObj.element.querySelector('.e-target-multi-clone .e-text');
        });

        it('Drag Possible testing after dropped the card', (done: DoneFn) => {
            kanbanObj.dataBound = () => {
                let cells: NodeList = kanbanObj.element.querySelectorAll('.e-content-cells');
                expect((<HTMLElement>cells[0]).classList.contains('e-dropping')).toEqual(false);
                expect((<HTMLElement>cells[1]).classList.contains('e-dropping')).toEqual(false);
                expect((<HTMLElement>cells[2]).classList.contains('e-dropping')).toEqual(false);
                expect((<HTMLElement>cells[3]).classList.contains('e-dropping')).toEqual(false);
                let element: Element = kanbanObj.element.querySelectorAll('.e-card[data-id="2"]').item(0);
                let data: { [key: string]: Object } = kanbanObj.getCardDetails(element);
                let curKey: Object = data[kanbanObj.keyField];
                expect(curKey).not.toBe(key);
                let headerCell: HTMLElement = kanbanObj.element.querySelector('.e-header-cells');
                expect(curKey).toEqual(headerCell.getAttribute('data-key').split(',')[0].trim());
                expect(kanbanObj.element.querySelectorAll('.e-target-dragged-clone').length).toBe(0);
                expect(kanbanObj.element.querySelectorAll('.e-card.duplicate').length).toBe(0);
                expect(kanbanObj.element.querySelectorAll('.e-kanban-dragged-card').length).toBe(0);
                expect(kanbanObj.element.querySelectorAll('.e-multi-active').length).toBe(0);
                expect(kanbanObj.element.querySelectorAll('.e-column-keys').length).toBe(0);
                expect(kanbanObj.element.querySelectorAll('.e-multi-bottom-border').length).toBe(0);
                let changedKey: string = kanbanObj.element.querySelectorAll('.e-card[data-id="2"]').item(0).getAttribute('data-key');
                expect(changedKey).not.toBe(key);
                expect(changedKey).toBe(headerCell.getAttribute('data-key').split(',')[0].trim());
                done();
            };
            util.triggerMouseEvent(droppedElement, 'mouseup', 100, 100);
        });

        it('Dragged clone behavior testing with multiple column keys', () => {
            draggedElement = (kanbanObj.element.querySelectorAll('.e-card[data-id="5"]') as NodeListOf<Element>).item(0) as HTMLElement;
            expect(draggedElement.classList.contains('e-draggable')).toBe(true);
            key = draggedElement.getAttribute('data-key');
            util.triggerMouseEvent(draggedElement, 'mousedown');
            util.triggerMouseEvent(draggedElement, 'mousemove', 500, 100);
            expect(key).toEqual('Testing');
            util.triggerMouseEvent(draggedElement, 'mousemove');
            expect(draggedElement.classList.contains('e-kanban-dragged-card')).toBeTruthy();
            expect(draggedElement.nextElementSibling.classList.contains('e-target-dragged-clone')).toBeTruthy();
            expect(kanbanObj.element.querySelectorAll('.e-target-dragged-clone').length).toBe(1);
        });

        it('Dropped clone behavior testing with multiple key testing', () => {
            droppedElement = kanbanObj.element.querySelectorAll('.e-card[data-id="63"] .e-card-content').item(0) as HTMLElement;
            util.triggerMouseEvent(droppedElement, 'mousemove', 100, 1000);
            expect(document.body.style.cursor).toBe('');
            expect(droppedElement.closest('.e-content-cells').lastElementChild.classList.contains('e-target-multi-clone')).toEqual(true);
        });

        it('Dropped multi clone testing with columns', () => {
            droppedElement = <HTMLElement>kanbanObj.element.querySelector('.e-target-multi-clone').children[1].firstElementChild;
            util.triggerMouseEvent(droppedElement, 'mousemove', 100, 1100);
        });

        it('All multiple key columns cards are displayed none when drag the multiple column key testing', () => {
            let wrapper: Element = kanbanObj.element.querySelector('.e-content-cells .e-card-wrapper');
            expect(wrapper.classList.contains('e-multi-card-wrapper')).toBe(true);
        });

        it('Column key testing on multiple key testing', () => {
            let clone: HTMLElement = kanbanObj.element.querySelector('.e-target-multi-clone');
            for (let i: number = 0; i < clone.childElementCount; i++) {
                expect(clone.children[i].classList.contains('e-column-key')).toBe(true);
                expect(clone.children[i].firstElementChild.classList.contains('e-text')).toBe(true);
                let headerCell: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-header-cells');
                expect(clone.children[i].firstElementChild.innerHTML).toBe(headerCell[0].getAttribute('data-key').split(',')[i].trim());
                expect(clone.children[i].getAttribute('data-key')).toBe(headerCell[0].getAttribute('data-key').split(',')[i].trim());
            }
        });

        it('Drag Possible testing when drag the card', () => {
            let cells: NodeList = kanbanObj.element.querySelectorAll('.e-content-cells');
            expect((<HTMLElement>cells[0]).classList.contains('e-dropping')).toEqual(true);
            expect((<HTMLElement>cells[1]).classList.contains('e-dropping')).toEqual(true);
            expect((<HTMLElement>cells[2]).classList.contains('e-dropping')).toEqual(false);
            expect((<HTMLElement>cells[3]).classList.contains('e-dropping')).toEqual(true);
        });

        it('Dropped clone testing', () => {
            expect(kanbanObj.element.querySelectorAll('.e-column-key')[1].classList.contains('e-multi-active')).toBe(true);
            expect(kanbanObj.element.querySelectorAll('.e-column-key')[0].classList.contains('e-multi-bottom-border')).toBe(true);
            droppedElement = <HTMLElement>kanbanObj.element.querySelectorAll('.e-target-multi-clone .e-text').item(1);
        });

        it('Drag Possible testing after dropped the card', (done: DoneFn) => {
            kanbanObj.dataBound = () => {
                let cells: NodeList = kanbanObj.element.querySelectorAll('.e-content-cells');
                expect((<HTMLElement>cells[0]).classList.contains('e-dropping')).toEqual(false);
                expect((<HTMLElement>cells[1]).classList.contains('e-dropping')).toEqual(false);
                expect((<HTMLElement>cells[2]).classList.contains('e-dropping')).toEqual(false);
                expect((<HTMLElement>cells[3]).classList.contains('e-dropping')).toEqual(false);
                expect(kanbanObj.element.querySelectorAll('.e-target-dragged-clone').length).toBe(0);
                expect(kanbanObj.element.querySelectorAll('.e-card.duplicate').length).toBe(0);
                expect(kanbanObj.element.querySelectorAll('.e-kanban-dragged-card').length).toBe(0);
                let element: Element = kanbanObj.element.querySelectorAll('.e-card[data-id="5"]').item(0);
                let data: { [key: string]: Object } = kanbanObj.getCardDetails(element);
                let curKey: Object = data[kanbanObj.keyField];
                expect(curKey).not.toBe(key);
                let headerCell: HTMLElement = kanbanObj.element.querySelector('.e-header-cells');
                expect(curKey).toEqual(headerCell.getAttribute('data-key').split(',')[1].trim());
                expect(kanbanObj.element.querySelectorAll('.e-multi-active').length).toBe(0);
                expect(kanbanObj.element.querySelectorAll('.e-column-keys').length).toBe(0);
                expect(kanbanObj.element.querySelectorAll('.e-multi-bottom-border').length).toBe(0);
                let changedKey: string = kanbanObj.element.querySelectorAll('.e-card[data-id="5"]').item(0).getAttribute('data-key');
                expect(changedKey).not.toBe(key);
                expect(changedKey).toBe(headerCell.getAttribute('data-key').split(',')[1].trim());
                done();
            };
            util.triggerMouseEvent(droppedElement, 'mouseup', 100, 1100);
        });
    });

    describe('Testing on multiple key support with swimlane', () => {
        let kanbanObj: Kanban;
        let key: string;
        let droppedElement: HTMLElement;
        let draggedElement: HTMLElement;
        beforeAll((done: DoneFn) => {
            let model: KanbanModel = {
                columns: [
                    { headerText: 'Backlog', keyField: 'Open, Review' },
                    { headerText: 'In Progress', keyField: 'InProgress' },
                    { headerText: 'Testing', keyField: 'Testing' },
                    { headerText: 'Done', keyField: 'Close' }
                ],
                swimlaneSettings: {
                    keyField: 'Assignee'
                }
            };
            kanbanObj = util.createKanban(model, kanbanData, done);
        });

        afterAll(() => {
            util.destroy(kanbanObj);
        });
        it('Dragged clone behavior testing with multiple column keys', () => {
            draggedElement = (kanbanObj.element.querySelectorAll('.e-card[data-id="2"]') as NodeListOf<Element>).item(0) as HTMLElement;
            expect(draggedElement.classList.contains('e-draggable')).toBe(true);
            key = draggedElement.getAttribute('data-key');
            util.triggerMouseEvent(draggedElement, 'mousedown');
            expect(key).toEqual('InProgress');
            util.triggerMouseEvent(draggedElement, 'mousemove', 100, 100);
            expect(draggedElement.classList.contains('e-kanban-dragged-card')).toBeTruthy();
            expect(draggedElement.nextElementSibling.classList.contains('e-target-dragged-clone')).toBeTruthy();
            expect(kanbanObj.element.querySelectorAll('.e-target-dragged-clone').length).toBe(1);
        });

        it('Dropped clone behavior testing with multiple key testing', () => {
            droppedElement = kanbanObj.element.querySelectorAll('.e-card[data-id="25"] .e-card-content').item(0) as HTMLElement;
            util.triggerMouseEvent(droppedElement, 'mousemove', 100, 150);
            expect(document.body.style.cursor).toBe('');
            expect(droppedElement.closest('.e-content-cells').lastElementChild.classList.contains('e-target-multi-clone')).toEqual(true);
        });

        it('Dropped multi clone testing with columns', () => {
            droppedElement = <HTMLElement>kanbanObj.element.querySelector('.e-target-multi-clone').children[0].firstElementChild;
            util.triggerMouseEvent(droppedElement, 'mousemove', 100, 150);
        });

        it('All multiple key columns cards are displayed none when drag the multiple column key testing', () => {
            let wrapper: Element = kanbanObj.element.querySelector('.e-content-cells .e-card-wrapper');
            expect(wrapper.classList.contains('e-multi-card-wrapper')).toBe(true);
        });

        it('Column key testing on multiple key testing', () => {
            let clone: Element = kanbanObj.element.querySelectorAll('.e-target-multi-clone').item(0);
            for (let i: number = 0; i < clone.childElementCount; i++) {
                expect(clone.children[i].classList.contains('e-column-key')).toBe(true);
                expect(clone.children[i].firstElementChild.classList.contains('e-text')).toBe(true);
                let headerCell: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-header-cells');
                expect(clone.children[i].firstElementChild.innerHTML).toBe(headerCell[0].getAttribute('data-key').split(',')[i].trim());
                expect(clone.children[i].getAttribute('data-key')).toBe(headerCell[0].getAttribute('data-key').split(',')[i].trim());
            }
        });

        it('Drag Possible testing when drag the card', () => {
            let cells: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-content-row:not(.e-swimlane-row) .e-content-cells');
            expect((<HTMLElement>cells[0]).classList.contains('e-dropping')).toEqual(true);
            expect((<HTMLElement>cells[1]).classList.contains('e-dropping')).toEqual(false);
            expect((<HTMLElement>cells[2]).classList.contains('e-dropping')).toEqual(true);
            expect((<HTMLElement>cells[3]).classList.contains('e-dropping')).toEqual(true);
            for (let i: number = 4; i < cells.length; i++) {
                expect((<HTMLElement>cells[i]).classList.contains('e-dropping')).toEqual(false);
            }
        });

        it('Dropped clone testing', () => {
            expect(kanbanObj.element.querySelectorAll('.e-column-key')[0].classList.contains('e-multi-active')).toBe(true);
            expect(kanbanObj.element.querySelectorAll('.e-column-key')[0].classList.contains('e-multi-bottom-border')).not.toBe(true);
            droppedElement = kanbanObj.element.querySelector('.e-target-multi-clone .e-text');
        });

        it('Drag Possible testing after dropped the card', (done: DoneFn) => {
            kanbanObj.dataBound = () => {
                let className: string = '.e-content-row:not(.e-swimlane-row) .e-content-cells';
                let cells: HTMLElement[] = [].slice.call(kanbanObj.element.querySelectorAll(className));
                for (let i: number = 0; i < cells.length; i++) {
                    expect((<HTMLElement>cells[i]).classList.contains('e-dropping')).toEqual(false);
                }
                let element: Element = kanbanObj.element.querySelectorAll('.e-card[data-id="2"]').item(0);
                let data: { [key: string]: Object } = kanbanObj.getCardDetails(element);
                let curKey: Object = data[kanbanObj.keyField];
                expect(curKey).not.toBe(key);
                let headerCell: HTMLElement = kanbanObj.element.querySelector('.e-header-cells');
                expect(curKey).toEqual(headerCell.getAttribute('data-key').split(',')[0].trim());
                expect(kanbanObj.element.querySelectorAll('.e-target-dragged-clone').length).toBe(0);
                expect(kanbanObj.element.querySelectorAll('.e-card.duplicate').length).toBe(0);
                expect(kanbanObj.element.querySelectorAll('.e-kanban-dragged-card').length).toBe(0);
                expect(kanbanObj.element.querySelectorAll('.e-multi-active').length).toBe(0);
                expect(kanbanObj.element.querySelectorAll('.e-column-keys').length).toBe(0);
                expect(kanbanObj.element.querySelectorAll('.e-multi-bottom-border').length).toBe(0);
                let changedKey: string = kanbanObj.element.querySelectorAll('.e-card[data-id="2"]').item(0).getAttribute('data-key');
                expect(changedKey).not.toBe(key);
                expect(changedKey).toBe(headerCell.getAttribute('data-key').split(',')[0].trim());
                done();
            };
            util.triggerMouseEvent(droppedElement, 'mouseup', 100, 200);
        });

        it('Dragged clone behavior testing with multiple column keys', () => {
            draggedElement = kanbanObj.element.querySelectorAll('.e-card[data-id="45"]').item(0) as HTMLElement;
            expect(draggedElement.classList.contains('e-draggable')).toBe(true);
            key = draggedElement.getAttribute('data-key');
            util.triggerMouseEvent(draggedElement, 'mousedown');
            util.triggerMouseEvent(draggedElement, 'mousemove', 500, 100);
            expect(key).toEqual('Testing');
            util.triggerMouseEvent(draggedElement, 'mousemove', 500, 100);
            expect(draggedElement.classList.contains('e-kanban-dragged-card')).toBeTruthy();
            expect(draggedElement.nextElementSibling.classList.contains('e-target-dragged-clone')).toBeTruthy();
            expect(kanbanObj.element.querySelectorAll('.e-target-dragged-clone').length).toBe(1);
        });

        it('Dropped clone behavior testing with multiple key testing', () => {
            droppedElement = <HTMLElement>kanbanObj.element.querySelectorAll('.e-card[data-id="61"] .e-card-content').item(0);
            util.triggerMouseEvent(droppedElement, 'mousemove', 100, 350);
            expect(document.body.style.cursor).toBe('');
            expect(droppedElement.closest('.e-content-cells').lastElementChild.classList.contains('e-target-multi-clone')).toEqual(true);
        });

        it('Dropped multi clone testing with columns', () => {
            droppedElement = <HTMLElement>kanbanObj.element.querySelector('.e-target-multi-clone').children[1].firstElementChild;
            util.triggerMouseEvent(droppedElement, 'mousemove', 100, 350);
        });

        it('All multiple key columns cards are displayed none when drag the multiple column key testing', () => {
            let wrapper: Element = kanbanObj.element.querySelector('.e-content-cells .e-card-wrapper');
            expect(wrapper.classList.contains('e-multi-card-wrapper')).toBe(true);
        });

        it('Column key testing on multiple key testing', () => {
            let clone: HTMLElement = kanbanObj.element.querySelector('.e-target-multi-clone');
            for (let i: number = 0; i < clone.childElementCount; i++) {
                expect(clone.children[i].classList.contains('e-column-key')).toBe(true);
                expect(clone.children[i].firstElementChild.classList.contains('e-text')).toBe(true);
                let headerCell: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-header-cells');
                expect(clone.children[i].firstElementChild.innerHTML).toBe(headerCell[0].getAttribute('data-key').split(',')[i].trim());
                expect(clone.children[i].getAttribute('data-key')).toBe(headerCell[0].getAttribute('data-key').split(',')[i].trim());
            }
        });

        it('Drag Possible testing when drag the card', () => {
            let cells: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-content-row:not(.e-swimlane-row) .e-content-cells');
            expect((<HTMLElement>cells[0]).classList.contains('e-dropping')).toEqual(true);
            expect((<HTMLElement>cells[1]).classList.contains('e-dropping')).toEqual(true);
            expect((<HTMLElement>cells[2]).classList.contains('e-dropping')).toEqual(false);
            expect((<HTMLElement>cells[3]).classList.contains('e-dropping')).toEqual(true);
            for (let i: number = 4; i < cells.length; i++) {
                expect((<HTMLElement>cells[i]).classList.contains('e-dropping')).toEqual(false);
            }
        });

        it('Dropped clone testing', () => {
            droppedElement = <HTMLElement>kanbanObj.element.querySelectorAll('.e-target-multi-clone .e-text').item(1);
            expect(kanbanObj.element.querySelectorAll('.e-column-key')[1].classList.contains('e-multi-active')).toBe(true);
            expect(kanbanObj.element.querySelectorAll('.e-column-key')[0].classList.contains('e-multi-bottom-border')).toBe(true);
        });

        it('Drag Possible testing after dropped the card', (done: DoneFn) => {
            kanbanObj.dataBound = () => {
                let className: string = '.e-content-row:not(.e-swimlane-row) .e-content-cells';
                let cells: HTMLElement[] = [].slice.call(kanbanObj.element.querySelectorAll(className));
                for (let i: number = 4; i < cells.length; i++) {
                    expect((<HTMLElement>cells[i]).classList.contains('e-dropping')).toEqual(false);
                }
                expect(kanbanObj.element.querySelectorAll('.e-target-dragged-clone').length).toBe(0);
                expect(kanbanObj.element.querySelectorAll('.e-card.duplicate').length).toBe(0);
                expect(kanbanObj.element.querySelectorAll('.e-kanban-dragged-card').length).toBe(0);
                let element: Element = kanbanObj.element.querySelectorAll('.e-card[data-id="45"]').item(0);
                let data: { [key: string]: Object } = kanbanObj.getCardDetails(element);
                let curKey: Object = data[kanbanObj.keyField];
                expect(curKey).not.toBe(key);
                let headerCell: HTMLElement = kanbanObj.element.querySelector('.e-header-cells');
                expect(curKey).toEqual(headerCell.getAttribute('data-key').split(',')[1].trim());
                expect(kanbanObj.element.querySelectorAll('.e-multi-active').length).toBe(0);
                expect(kanbanObj.element.querySelectorAll('.e-column-keys').length).toBe(0);
                expect(kanbanObj.element.querySelectorAll('.e-multi-bottom-border').length).toBe(0);
                let changedKey: string = kanbanObj.element.querySelectorAll('.e-card[data-id="45"]').item(0).getAttribute('data-key');
                expect(changedKey).not.toBe(key);
                expect(changedKey).toBe(headerCell.getAttribute('data-key').split(',')[1].trim());
                done();
            };
            util.triggerMouseEvent(droppedElement, 'mouseup', 100, 350);
        });

        it('Dragged clone behavior testing with multiple column keys', () => {
            draggedElement = kanbanObj.element.querySelectorAll('.e-card[data-id="18"]').item(0) as HTMLElement;
            expect(draggedElement.classList.contains('e-draggable')).toBe(true);
            key = draggedElement.getAttribute('data-key');
            util.triggerMouseEvent(draggedElement, 'mousedown');
            expect(key).toEqual('Close');
            util.triggerMouseEvent(draggedElement, 'mousemove', 600, 100);
            expect(draggedElement.classList.contains('e-kanban-dragged-card')).toBeTruthy();
            expect(draggedElement.nextElementSibling.classList.contains('e-target-dragged-clone')).toBeTruthy();
            expect(kanbanObj.element.querySelectorAll('.e-target-dragged-clone').length).toBe(1);
        });

        it('Dropped clone behavior testing with multiple key testing', () => {
            droppedElement = kanbanObj.element.querySelectorAll('.e-card[data-id="3"] .e-card-content').item(0) as HTMLElement;
            util.triggerMouseEvent(droppedElement, 'mousemove', 100, 700);
            expect(document.body.style.cursor).toBe('not-allowed');
            let ele: Element = droppedElement.closest('.e-content-cells').lastElementChild;
            expect(ele.classList.contains('e-target-multi-clone')).not.toEqual(true);
        });

        it('Dropped multi clone testing with columns', () => {
            util.triggerMouseEvent(droppedElement, 'mousemove', 100, 750);
            let wrapper: Element = droppedElement.closest('.e-card-wrapper');
            expect(wrapper.classList.contains('e-multi-card-wrapper')).not.toBe(true);
            util.triggerMouseEvent(droppedElement, 'mouseup', 100, 750);
        });
    });

    describe('Allow Toggle Colum with swimlanes and swimlane drag and drop', () => {
        let kanbanObj: Kanban;
        beforeAll((done: DoneFn) => {
            let model: KanbanModel = {
                columns: [
                    { headerText: 'Backlog', keyField: 'Open', allowToggle: false, isExpanded: true },
                    { headerText: 'In Progress', keyField: 'InProgress', allowToggle: true, isExpanded: false },
                    { headerText: 'Testing', keyField: 'Testing', allowToggle: false, isExpanded: true },
                    { headerText: 'Done', keyField: 'Close', allowToggle: true, isExpanded: true }
                ],
                swimlaneSettings: {
                    keyField: 'Assignee',
                    allowDragAndDrop: true,
                }
            };
            kanbanObj = util.createKanban(model, kanbanData, done);
        });

        afterAll(() => {
            util.destroy(kanbanObj);
        });

        it('Single column collapse testing', () => {
            let element: Element = kanbanObj.element.querySelectorAll('.e-header-cells')[3].children[0].lastElementChild;
            (<HTMLElement>element).click();
            expect(element.classList.contains('e-column-collapse')).toBe(true);
            let ele: NodeList = util.getElement(kanbanObj, '.e-content-row:not(.e-swimlane-row) .e-content-cells[data-key="Close"]');
            for (let i: number = 0; i < ele.length; i++) {
                expect((<Element>ele[i]).classList.contains('e-collapsed')).toBe(true);
            }
        });

        it('Single column expand testing', () => {
            let element: Element = kanbanObj.element.querySelectorAll('.e-header-cells')[3].children[0].lastElementChild;
            (<HTMLElement>element).click();
            expect(element.classList.contains('e-column-expand')).toBe(true);
            let ele: NodeList = util.getElement(kanbanObj, '.e-content-row:not(.e-swimlane-row) .e-content-cells[data-key="Close"]');
            for (let i: number = 0; i < ele.length; i++) {
                expect((<Element>ele[i]).classList.contains('e-collapsed')).toBe(false);
            }
        });

        it('Maintain single collapsed state testing - drag the card', () => {
            let headerCell: Element = kanbanObj.element.querySelectorAll('.e-header-cells')[1].children[0].lastElementChild;
            expect(headerCell.classList.contains('e-column-collapse')).toBe(true);
            let contentCell: Element = kanbanObj.element.querySelectorAll('.e-content-row:not(.e-swimlane-row) .e-content-cells')[1];
            expect(contentCell.classList.contains('e-collapsed')).toBe(true);
            let draggedElement: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="45"]').item(0) as HTMLElement;
            util.triggerMouseEvent(draggedElement, 'mousedown');
            util.triggerMouseEvent(draggedElement, 'mousemove', 700, 210);
            expect(draggedElement.classList.contains('e-kanban-dragged-card')).toBeTruthy();
            expect(draggedElement.nextElementSibling.classList.contains('e-target-dragged-clone')).toBeTruthy();
            expect(kanbanObj.element.querySelectorAll('.e-target-dragged-clone').length).toBe(1);
        });

        it('Maintain single collapsed state testing - card moved to another place', () => {
            let droppedElement: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="22"]').item(0) as HTMLElement;
            util.triggerMouseEvent(droppedElement, 'mousemove', 700, 510);
            expect(droppedElement.previousElementSibling.classList.contains('e-target-dropped-clone')).toEqual(true);
            util.triggerMouseEvent(droppedElement, 'mouseup', 700, 510);
        });

        it('Maintain single collapsed state testing - after drag stop', () => {
            expect(kanbanObj.element.querySelectorAll('.e-target-dragged-clone').length).toBe(0);
            expect(kanbanObj.element.querySelectorAll('.e-target-dropped-clone').length).toBe(0);
            expect(kanbanObj.element.querySelectorAll('.e-card.duplicate').length).toBe(0);
            expect(kanbanObj.element.querySelectorAll('.e-kanban-dragged-card').length).toBe(0);
            let element: Element = kanbanObj.element.querySelectorAll('.e-header-cells')[1].children[0].lastElementChild;
            expect(element.classList.contains('e-column-collapse')).toBe(true);
            let ele: NodeList = util.getElement(kanbanObj, '.e-content-row:not(.e-swimlane-row) .e-content-cells[data-key="InProgress"]');
            for (let i: number = 0; i < ele.length; i++) {
                expect((<Element>ele[i]).classList.contains('e-collapsed')).toBe(true);
            }
        });

        it('Single Collapsed column with drag and drop behavior testing - check the column expand when cursor move', () => {
            let draggedElement: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="25"]').item(0) as HTMLElement;
            util.triggerMouseEvent(draggedElement, 'mousedown');
            util.triggerMouseEvent(draggedElement, 'mousemove', 280, 600);
            let element: Element = kanbanObj.element.querySelectorAll('.e-content-row:not(.e-swimlane-row) .e-content-cells').item(1);
            util.triggerMouseEvent(element, 'mousemove', 290, 600);
        });
        it('Single Collapsed column with drag and drop behavior testing - drop the card on collapsed column', () => {
            let droppedElement: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="29"]').item(0) as HTMLElement;
            util.triggerMouseEvent(droppedElement, 'mousemove', 450, 600);
            util.triggerMouseEvent(droppedElement, 'mouseup', 450, 600);
        });
    });

    describe('Multiple selection drag and drop', () => {
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
            let ele: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="2"]').item(0) as HTMLElement;
            util.triggerMouseEvent(ele, 'mousemove', 250, 170);
            expect(kanbanObj.element.querySelectorAll('.e-target-dragged-clone').length).toEqual(3);
        });
        it('Cloned card layout testing', () => {
            let ele: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="2"]').item(0) as HTMLElement;
            util.triggerMouseEvent(ele, 'mousemove', 250, 170);
            let element: HTMLElement = kanbanObj.element.querySelectorAll('.e-cloned-card').item(0) as HTMLElement;
            expect(element.querySelectorAll('.e-multi-card-text').item(0).innerHTML).toEqual('3 Cards');
        });
        it('Dropped card to columns', () => {
            let ele: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="2"]').item(0) as HTMLElement;
            util.triggerMouseEvent(ele, 'mouseup', 250, 150);
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