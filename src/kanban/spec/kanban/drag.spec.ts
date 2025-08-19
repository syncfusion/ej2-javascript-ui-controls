/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * drag spec
 */
import { DragEventArgs, Kanban, KanbanModel } from '../../src/kanban/index';
import { kanbanData } from './common/kanban-data.spec';
import { profile, inMB, getMemoryProfile } from './common/common.spec';
import * as util from './common/util.spec';
import { closest, createElement } from '@syncfusion/ej2-base';
import { Query, Predicate } from '@syncfusion/ej2-data';

Kanban.Inject();

describe('906990 - Error Thrown During Drag and Drop in Kanban Component - normal mode', () => {
    let kanbanObj: Kanban;
    const kanbanData = [
        {
            "Id": "Task 1",
            "Title": "Task - 29001",
            "Status": "Open",
            "Summary": "Analyze the new requirements gathered from the customer.",
            "Type": "Story",
            "Priority": "Low",
            "Tags": "Analyze,Customer",
            "Estimate": 3.5,
            "Assignee": "Nancy Davloio",
            "RankId": 1,
            "Color": "#02897B",
            "ClassName": "e-story, e-low, e-nancy-davloio"
        },
        {
            "Id": "Task 2",
            "Title": "Task - 29002",
            "Status": "InProgress",
            "Summary": "Improve application performance",
            "Type": "Improvement",
            "Priority": "Normal",
            "Tags": "Improvement",
            "Estimate": 6,
            "Assignee": "Andrew Fuller",
            "RankId": 2,
            "Color": "#673AB8",
            "ClassName": "e-improvement, e-normal, e-andrew-fuller"
        },
        {
            "Id": "Task 3",
            "Title": "Task - 29003",
            "Status": "Testing",
            "Summary": "Improve application performance",
            "Type": "Improvement",
            "Priority": "Normal",
            "Tags": "Improvement",
            "Estimate": 3,
            "Assignee": "Andrew Fuller",
            "RankId": 3,
            "Color": "#67s3AB8",
            "ClassName": "e-improvement, e-normal, e-andrew-fuller"
        },
    ];
    beforeAll((done: DoneFn) => {
        const model: KanbanModel = {
            keyField: 'Status',
            dataSource: kanbanData,
            columns: [
                { headerText: 'To Do', keyField: 'Open' },
                { headerText: 'In Progress', keyField: 'InProgress' },
                { headerText: 'Testing', keyField: 'Testing' },
                { headerText: 'Done', keyField: 'Close' }
            ],
            cardSettings: {
                contentField: 'Summary',
                headerField: 'Id',
            },
            sortSettings: {
                sortBy: 'Index',
                field: 'RankId'
            }, 
            actionComplete : function (e){
                console.log(e);
            },
            query : new Query()
            .where(
                Predicate.or(
                    new Predicate('Status', 'equal', "Open"),
                    new Predicate('Status', 'equal', "InProgress")
                )
            )
        };
        kanbanObj = util.createKanban(model, kanbanData, done);
    });

    afterAll(() => {
        util.destroy(kanbanObj);
    });
    it('- Error Thrown During Drag and Drop in Kanban Component) - ', (done: Function) => {
        setTimeout(() => {
            const dragElement = (kanbanObj.element.querySelectorAll('.e-card[data-id="Task 1"]') as NodeListOf<Element>).item(0) as HTMLElement;
            util.triggerMouseEvent(dragElement, 'mousedown');
            util.triggerMouseEvent(dragElement, 'mousemove', 20, 80);
            expect(dragElement.closest('.e-content-cells').classList.contains('e-dragged-column')).toBe(true);
            done();
        }, 1000);
    });
    it('- Error Thrown During Drag and Drop in Kanban Component - Dropping the dragged card in the another column  at the place of column down- ', (done: Function) => {
        setTimeout(() => {
            const element: Element = kanbanObj.element.querySelectorAll('.e-kanban-border').item(2);
            util.triggerMouseEvent(element, 'mousemove', 50, 400);
            util.triggerMouseEvent(element, 'mouseup', 50, 400);
            const droppedElem: HTMLElement = (kanbanObj.element.querySelectorAll('.e-card[data-id="Task 1"]') as NodeListOf<Element>).item(0) as HTMLElement;
            expect(droppedElem.parentElement.parentElement.getAttribute('data-key')).toEqual('Testing');
            done();
        }, 1000);
    });
});

describe('Drag module', () => {
    beforeAll(() => {
        const isDef: (o: any) => boolean = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            // eslint-disable-next-line no-console
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
            expect(kanbanObj.element.querySelector('.e-card').classList.contains('e-draggable')).toBe(true);
            expect(kanbanObj.element.querySelector('.e-card').classList.contains('e-lib')).toBe(true);
        });
    });

    describe('Basic drag and drop', () => {
        let kanbanObj: Kanban;
        beforeAll((done: DoneFn) => {
            const model: KanbanModel = { allowDragAndDrop: false };
            kanbanObj = util.createKanban(model, kanbanData, done);
        });

        afterAll(() => {
            util.destroy(kanbanObj);
        });

        it('Without Drag and drop property class testing', () => {
            expect(kanbanObj.element.querySelector('.e-card').classList.contains('e-draggable')).toBe(false);
            expect(kanbanObj.element.querySelector('.e-card').classList.contains('e-lib')).toBe(false);
        });
    });

    describe('Drag and drop functionality', () => {
        let kanbanObj: Kanban;
        let key: string;
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
            key = dragElement.getAttribute('data-key');
            util.triggerMouseEvent(dragElement, 'mousedown');
            util.triggerMouseEvent(dragElement, 'mousemove', 100, 100);
            expect(key).toEqual('Open');
            expect(dragElement.classList.contains('e-kanban-dragged-card')).toBeTruthy();
            expect(dragElement.nextElementSibling.classList.contains('e-target-dragged-clone')).toBeTruthy();
            expect(kanbanObj.element.querySelectorAll('.e-target-dragged-clone').length).toBe(1);
        });

        it('Created Dropped clone on above the column testing and target is card', () => {
            const element: Element = kanbanObj.element.querySelectorAll('.e-card[data-id="2"]').item(0);
            util.triggerMouseEvent(element, 'mousemove', 250, 100);
            expect(element.previousElementSibling.classList.contains('e-target-dropped-clone')).toEqual(true);
        });

        it('Created Dropped clone on above the column testing and target is card wrapper', () => {
            const ele: HTMLElement = (kanbanObj.element.querySelectorAll('.e-card-wrapper') as NodeListOf<Element>).item(1) as HTMLElement;
            util.triggerMouseEvent(ele, 'mousemove', 250, 140);
            expect(ele.firstElementChild.classList.contains('e-target-dropped-clone')).toEqual(true);
            util.triggerMouseEvent(ele.lastElementChild, 'mousemove', 250, 240);
        });

        it('Created Dropped clone on column bottom testing', () => {
            const element: HTMLElement = (<NodeListOf<Element>>kanbanObj.element.querySelectorAll('.e-content-cells')).item(1) as HTMLElement;
            util.triggerMouseEvent(element, 'mousemove', 300, 1400);
            expect(element.lastElementChild.lastElementChild.classList.contains('e-target-dropped-clone')).toEqual(true);
            expect(document.body.style.cursor).toBe('');
        });

        it('Cursor changed testing between the columns', () => {
            const element: HTMLElement = (<NodeListOf<Element>>kanbanObj.element.querySelectorAll('.e-content-table')).item(0) as HTMLElement;
            util.triggerMouseEvent(element, 'mousemove', 450, 140);
            expect(document.body.style.cursor).toBe('not-allowed');
        });

        it('Cursor changed testing with header', () => {
            const element: HTMLElement = (<NodeListOf<Element>>kanbanObj.element.querySelectorAll('.e-header-cells')).item(0) as HTMLElement;
            util.triggerMouseEvent(element, 'mousemove', 100, 0);
            expect(document.body.style.cursor).toBe('not-allowed');
        });

        it('Dropped clone behavior testing', () => {
            droppedElement = kanbanObj.element.querySelectorAll('.e-card[data-id="9"] .e-card-header').item(0) as HTMLElement;
            util.triggerMouseEvent(droppedElement, 'mousemove', 500, 200);
            util.triggerMouseEvent(droppedElement, 'mousemove', 500, 200);
            expect(document.body.style.cursor).toBe('');
            expect(droppedElement.closest('.e-card').nextElementSibling.classList.contains('e-target-dropped-clone')).toEqual(true);
        });

        it('Drag Possible testing when drag the card', () => {
            const cells: NodeList = kanbanObj.element.querySelectorAll('.e-content-cells');
            expect((<HTMLElement>cells[0].firstChild).classList.contains('e-dropping')).toEqual(true);
            expect((<HTMLElement>cells[1].firstChild).classList.contains('e-dropping')).toEqual(true);
            expect((<HTMLElement>cells[2].firstChild).classList.contains('e-dropping')).toEqual(true);
            expect((<HTMLElement>cells[3].firstChild).classList.contains('e-dropping')).toEqual(true);
        });

        it('Dropped clone testing', () => {
            util.triggerMouseEvent(droppedElement, 'mouseup', 500, 200);
        });

        it('Drag Possible testing after dropped the card', () => {
            const cells: NodeList = kanbanObj.element.querySelectorAll('.e-content-cells');
            expect((<HTMLElement>cells[0].firstChild).classList.contains('e-dropping')).toEqual(false);
            expect((<HTMLElement>cells[1].firstChild).classList.contains('e-dropping')).toEqual(false);
            expect((<HTMLElement>cells[2].firstChild).classList.contains('e-dropping')).toEqual(false);
            expect((<HTMLElement>cells[3].firstChild).classList.contains('e-dropping')).toEqual(false);
        });

        it('Removed draggable and droppable clone testing', () => {
            expect(kanbanObj.element.querySelectorAll('.e-target-dragged-clone').length).toBe(0);
            expect(kanbanObj.element.querySelectorAll('.e-target-dropped-clone').length).toBe(0);
            expect(kanbanObj.element.querySelectorAll('.e-card.e-cloned-card').length).toBe(0);
            expect(kanbanObj.element.querySelectorAll('.e-kanban-dragged-card').length).toBe(0);
        });

        it('Testing the cards after dropping the card', () => {
            const data: Record<string, any> = kanbanObj.getCardDetails(dragElement);
            const curKey: string = data[kanbanObj.keyField] as string;
            expect(curKey).not.toBe(key);
            expect(curKey).toEqual('Testing');
        });

        it('Testing drag stop on between the columns', () => {
            dragElement = kanbanObj.element.querySelectorAll('.e-card[data-id="13"]').item(0) as HTMLElement;
            util.triggerMouseEvent(dragElement, 'mousedown');
            util.triggerMouseEvent(dragElement, 'mousemove', 100, 100);
            const element: HTMLElement = (<NodeListOf<Element>>kanbanObj.element.querySelectorAll('.e-content-table')).item(0) as HTMLElement;
            util.triggerMouseEvent(element, 'mousemove', 450, 140);
            expect(document.body.style.cursor).toBe('not-allowed');
            expect(kanbanObj.element.querySelectorAll('.e-target-dragged-clone').length).toBe(1);
            expect(kanbanObj.element.querySelectorAll('.e-card.e-cloned-card').length).toBe(1);
            util.triggerMouseEvent(element, 'mouseup', 450, 140);
            expect(kanbanObj.element.querySelectorAll('.e-target-dragged-clone').length).toBe(0);
            expect(kanbanObj.element.querySelectorAll('.e-target-dropped-clone').length).toBe(0);
            expect(kanbanObj.element.querySelectorAll('.e-card.e-cloned-card').length).toBe(0);
            expect(kanbanObj.element.querySelectorAll('.e-kanban-dragged-card').length).toBe(0);
            expect(document.body.style.cursor).toBe('');
        });

        it('Dropped clone removed testing on dragging one column to another column', () => {
            // Mouse down action
            dragElement = kanbanObj.element.querySelectorAll('.e-card[data-id="13"]').item(0) as HTMLElement;
            util.triggerMouseEvent(dragElement, 'mousedown');
            util.triggerMouseEvent(dragElement, 'mousemove', 100, 100);
            // Mouse move action
            const element: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="14"] .e-card-content').item(0) as HTMLElement;
            util.triggerMouseEvent(element, 'mousemove', 350, 270);
            expect(kanbanObj.element.querySelectorAll('.e-target-dragged-clone').length).toBe(1);
            expect(kanbanObj.element.querySelectorAll('.e-target-dropped-clone').length).toBe(1);
            expect(kanbanObj.element.querySelectorAll('.e-card.e-cloned-card').length).toBe(1);
        });
        it('Dropped clone removed testing on dragging clone on one column to another column', () => {
            const ele: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="8"]').item(0) as HTMLElement;
            util.triggerMouseEvent(ele, 'mousemove', 650, 150);
            expect(kanbanObj.element.querySelectorAll('.e-target-dragged-clone').length).toBe(1);
            expect(kanbanObj.element.querySelectorAll('.e-target-dropped-clone').length).toBe(1);
            expect(kanbanObj.element.querySelectorAll('.e-card.e-cloned-card').length).toBe(1);
            util.triggerMouseEvent(ele, 'mouseup', 650, 150);
        });
        it('Dropped clone removed testing and check all clones are removed', () => {
            expect(kanbanObj.element.querySelectorAll('.e-target-dragged-clone').length).toBe(0);
            expect(kanbanObj.element.querySelectorAll('.e-target-dropped-clone').length).toBe(0);
            expect(kanbanObj.element.querySelectorAll('.e-card.e-cloned-card').length).toBe(0);
            expect(kanbanObj.element.querySelectorAll('.e-kanban-dragged-card').length).toBe(0);
            expect(document.body.style.cursor).toBe('');
        });
    });

    describe('Drag and drop with swimlane', () => {
        let kanbanObj: Kanban;
        let key: string;
        let droppedElement: HTMLElement;
        let draggedElement: HTMLElement;
        beforeAll((done: DoneFn) => {
            const model: KanbanModel = {
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
            key = draggedElement.getAttribute('data-key');
            util.triggerMouseEvent(draggedElement, 'mousedown');
            util.triggerMouseEvent(draggedElement, 'mousemove', 100, 100);
            expect(key).toEqual('Open');
            util.triggerMouseEvent(draggedElement, 'mousemove');
            expect(draggedElement.classList.contains('e-kanban-dragged-card')).toBeTruthy();
            expect(draggedElement.nextElementSibling.classList.contains('e-target-dropped-clone')).toBeTruthy();
            expect(kanbanObj.element.querySelectorAll('.e-target-dragged-clone').length).toBe(1);
        });

        it('Created Dropped clone on above the column testing and target is card', () => {
            const element: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="2"]').item(0) as HTMLElement;
            util.triggerMouseEvent(element, 'mousemove', 250, 100);
            expect(element.previousElementSibling.classList.contains('e-target-dropped-clone')).toEqual(true);
        });

        it('Created Dropped clone on above the column testing and target is card wrapper', () => {
            const ele: HTMLElement = kanbanObj.element.querySelectorAll('.e-card-wrapper').item(1) as HTMLElement;
            util.triggerMouseEvent(ele, 'mousemove', 250, 140);
            expect(ele.firstElementChild.classList.contains('e-target-dropped-clone')).toEqual(true);
            util.triggerMouseEvent(ele.lastElementChild, 'mousemove', 250, 240);
        });

        it('Created Dropped clone on column bottom testing', () => {
            const element: Element = kanbanObj.element.querySelectorAll('.e-content-row:not(.e-swimlane-row) .e-content-cells').item(1);
            util.triggerMouseEvent(element, 'mousemove', 300, 350);
            expect(element.lastElementChild.lastElementChild.classList.contains('e-target-dropped-clone')).toEqual(true);
            expect(document.body.style.cursor).toBe('');
        });

        it('Cursor changed testing between the columns', () => {
            const element: HTMLElement = kanbanObj.element.querySelectorAll('.e-content-table').item(0) as HTMLElement;
            util.triggerMouseEvent(element, 'mousemove', 450, 140);
            expect(document.body.style.cursor).toBe('not-allowed');
        });

        it('Cursor changed testing with header', () => {
            const element: HTMLElement = kanbanObj.element.querySelectorAll('.e-header-cells').item(0) as HTMLElement;
            util.triggerMouseEvent(element, 'mousemove', 100, 0);
            expect(document.body.style.cursor).toBe('not-allowed');
        });

        it('Cursor changed testing with Kanban content', () => {
            const element: HTMLElement = kanbanObj.element.querySelectorAll('.e-kanban-content').item(0) as HTMLElement;
            util.triggerMouseEvent(element, 'mousemove', 100, 3000);
            expect(document.body.style.cursor).toBe('not-allowed');
        });

        it('Cursor changed testing on swimlane row', () => {
            const element: HTMLElement = (<NodeListOf<Element>>kanbanObj.element.querySelectorAll('.e-swimlane-row')).item(0) as HTMLElement;
            util.triggerMouseEvent(element, 'mousemove', 250, 400);
            expect(document.body.style.cursor).toBe('not-allowed');
        });

        it('Cursor changed testing on swimlane row target as content cell', () => {
            const element: HTMLElement = kanbanObj.element.querySelectorAll('.e-swimlane-row .e-content-cells').item(1) as HTMLElement;
            util.triggerMouseEvent(element, 'mousemove', 250, 470);
            expect(document.body.style.cursor).toBe('not-allowed');
        });

        it('Cursor changed testing on swimlane row content cell', () => {
            const element: Element = kanbanObj.element.querySelectorAll('.e-content-row:not(.e-swimlane-row) .e-content-cells').item(5);
            util.triggerMouseEvent(element, 'mousemove', 250, 500);
            expect(document.body.style.cursor).toBe('not-allowed');
        });

        it('Cursor changed testing on swimlane row content', () => {
            const element: Element = kanbanObj.element.querySelectorAll('.e-card[data-id="4"]').item(0);
            util.triggerMouseEvent(element, 'mousemove', 250, 550);
            expect(document.body.style.cursor).toBe('not-allowed');
        });

        it('Dropped clone behavior testing', () => {
            droppedElement = <HTMLElement>kanbanObj.element.querySelectorAll('.e-card[data-id="37"] .e-card-header').item(0);
            util.triggerMouseEvent(droppedElement, 'mousemove', 700, 200);
            util.triggerMouseEvent(droppedElement, 'mousemove', 700, 200);
            expect(document.body.style.cursor).toBe('');
            expect(droppedElement.closest('.e-card').nextElementSibling.classList.contains('e-target-dropped-clone')).toEqual(true);
        });
        it('Drag Possible testing when drag the card', () => {
            const cells: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-content-row:not(.e-swimlane-row) .e-content-cells');
            expect((<HTMLElement>cells[0]).classList.contains('e-dropping')).toEqual(true);
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
            const cells: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-content-row:not(.e-swimlane-row) .e-content-cells');
            for (let i: number = 0; i < cells.length; i++) {
                expect((<HTMLElement>cells[i].firstChild).classList.contains('e-dropping')).toEqual(false);
            }
        });

        it('Removed draggable and droppable clone testing', () => {
            expect(kanbanObj.element.querySelectorAll('.e-target-dragged-clone').length).toBe(0);
            expect(kanbanObj.element.querySelectorAll('.e-target-dropped-clone').length).toBe(0);
            expect(kanbanObj.element.querySelectorAll('.e-card.e-cloned-card').length).toBe(0);
            expect(kanbanObj.element.querySelectorAll('.e-kanban-dragged-card').length).toBe(0);
        });

        it('Testing the cards after dropping the card', () => {
            const data: Record<string, any> = kanbanObj.getCardDetails(draggedElement);
            const curKey: string = data[kanbanObj.keyField] as string;
            expect(curKey).not.toBe(key);
            expect(curKey).toEqual('Close');
        });
    });

    describe('Drag and drop testing on within the swimlanes', () => {
        let kanbanObj: Kanban;
        let rows: string[];
        let swimlaneKey: string;
        let columnKey: string;
        let key: string;
        let droppedElement: HTMLElement;
        let draggedElement: HTMLElement;
        beforeAll((done: DoneFn) => {
            const model: KanbanModel = {
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
            key = draggedElement.getAttribute('data-key');
            util.triggerMouseEvent(draggedElement, 'mousedown');
            util.triggerMouseEvent(draggedElement, 'mousemove', 100, 100);
            expect(key).toEqual('Open');
            util.triggerMouseEvent(draggedElement, 'mousemove');
            expect(draggedElement.classList.contains('e-kanban-dragged-card')).toBeTruthy();
            expect(draggedElement.nextElementSibling.classList.contains('e-target-dropped-clone')).toBeTruthy();
            expect(kanbanObj.element.querySelectorAll('.e-target-dragged-clone').length).toBe(1);
        });

        it('Created Dropped clone on above the column testing and target is card', () => {
            const element: Element = kanbanObj.element.querySelectorAll('.e-card[data-id="2"]').item(0);
            util.triggerMouseEvent(element, 'mousemove', 250, 100);
            expect(element.previousElementSibling.classList.contains('e-target-dropped-clone')).toEqual(true);
        });

        it('Created Dropped clone on above the column testing and target is card wrapper', () => {
            const ele: Element = kanbanObj.element.querySelectorAll('.e-card-wrapper').item(1);
            util.triggerMouseEvent(ele, 'mousemove', 250, 140);
            expect(ele.firstElementChild.classList.contains('e-target-dropped-clone')).toEqual(true);
            util.triggerMouseEvent(ele.lastElementChild, 'mousemove', 250, 240);
        });

        it('Created Dropped clone on column bottom testing', () => {
            const element: Element = kanbanObj.element.querySelectorAll('.e-content-row:not(.e-swimlane-row) .e-content-cells').item(1);
            util.triggerMouseEvent(element, 'mousemove', 300, 350);
            expect(element.firstElementChild.lastElementChild.classList.contains('e-target-dropped-clone')).toEqual(true);
            expect(document.body.style.cursor).toBe('');
        });

        it('Cursor changed testing between the columns', () => {
            const element: HTMLElement = (<NodeListOf<Element>>kanbanObj.element.querySelectorAll('.e-content-table')).item(0) as HTMLElement;
            util.triggerMouseEvent(element, 'mousemove', 450, 140);
            expect(document.body.style.cursor).toBe('not-allowed');
        });

        it('Cursor changed testing with header', () => {
            const element: HTMLElement = (<NodeListOf<Element>>kanbanObj.element.querySelectorAll('.e-header-cells')).item(0) as HTMLElement;
            util.triggerMouseEvent(element, 'mousemove', 100, 0);
            expect(document.body.style.cursor).toBe('not-allowed');
        });

        it('Cursor changed testing with Kanban content', () => {
            const element: Element = kanbanObj.element.querySelectorAll('.e-kanban-content').item(0);
            util.triggerMouseEvent(element, 'mousemove', 100, 3000);
            expect(document.body.style.cursor).toBe('not-allowed');
        });

        it('Cursor changed testing on swimlane row', () => {
            const element: HTMLElement = (<NodeListOf<Element>>kanbanObj.element.querySelectorAll('.e-swimlane-row')).item(0) as HTMLElement;
            util.triggerMouseEvent(element, 'mousemove', 250, 400);
            expect(document.body.style.cursor).toBe('not-allowed');
        });

        it('Cursor changed testing on swimlane row content cell', () => {
            const element: Element = kanbanObj.element.querySelectorAll('.e-content-row:not(.e-swimlane-row) .e-content-cells').item(5);
            util.triggerMouseEvent(element, 'mousemove', 250, 500);
            expect(document.body.style.cursor).toBe('');
        });

        it('Cursor changed testing on swimlane row content', () => {
            const element: Element = kanbanObj.element.querySelectorAll('.e-card[data-id="4"]').item(0);
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
            const cells: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-content-row:not(.e-swimlane-row) .e-content-cells');
            for (let i: number = 0; i < cells.length; i++) {
                expect((<HTMLElement>cells[i]).classList.contains('e-dropping')).toEqual(true);
            }
        });

        it('Dropped clone testing', () => {
            util.triggerMouseEvent(droppedElement, 'mouseup', 700, 200);
        });

        it('Drag Possible testing after dropped the card', () => {
            const cells: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-content-row:not(.e-swimlane-row) .e-content-cells');
            for (let i: number = 0; i < cells.length; i++) {
                expect((<HTMLElement>cells[i].firstChild).classList.contains('e-dropping')).toEqual(false);
            }
        });

        it('Removed draggable and droppable clone testing', () => {
            expect(kanbanObj.element.querySelectorAll('.e-target-dragged-clone').length).toBe(0);
            expect(kanbanObj.element.querySelectorAll('.e-target-dropped-clone').length).toBe(0);
            expect(kanbanObj.element.querySelectorAll('.e-card.e-cloned-card').length).toBe(0);
            expect(kanbanObj.element.querySelectorAll('.e-kanban-dragged-card').length).toBe(0);
        });

        it('Testing the cards after dropping the card', () => {
            const data: Record<string, any> = kanbanObj.getCardDetails(draggedElement);
            const curKey: string = data[kanbanObj.keyField] as string;
            expect(curKey).not.toBe(key);
            expect(curKey).toEqual('Close');
        });

        it('Swimlane to swimlane drag and drop initial data testing', () => {
            const allKeys: string[] = kanbanData.map((obj: { [key: string]: string }) =>
                obj[kanbanObj.swimlaneSettings.keyField]);
            rows = allKeys.filter((key: string, index: number) => allKeys.indexOf(key) === index).sort();
            draggedElement = (kanbanObj.element.querySelectorAll('.e-card[data-id="2"]') as NodeListOf<Element>).item(0) as HTMLElement;
            const data: Record<string, any> = kanbanObj.getCardDetails(draggedElement);
            swimlaneKey = data[kanbanObj.swimlaneSettings.keyField] as string;
            const contentRow: Element = draggedElement.closest('.e-content-row');
            const curSwimlaneKey: string = contentRow.previousElementSibling.getAttribute('data-key');
            expect(swimlaneKey).toEqual(curSwimlaneKey);
            expect(curSwimlaneKey).toEqual(rows[0]);
            columnKey = data[kanbanObj.keyField] as string;
            const curColumnKey: string = draggedElement.getAttribute('data-key');
            expect(columnKey).toEqual(curColumnKey);
            util.triggerMouseEvent(draggedElement, 'mousedown');
        });

        it('Swimlane to swimlane Dragged clone behavior testing', () => {
            util.triggerMouseEvent(draggedElement, 'mousemove', 100, 100);
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
            const cells: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-content-row:not(.e-swimlane-row) .e-content-cells');
            for (let i: number = 0; i < cells.length; i++) {
                expect((<HTMLElement>cells[i]).classList.contains('e-dropping')).toEqual(true);
            }
        });

        it('Swimlane to swimlane Dropped clone testing', () => {
            util.triggerMouseEvent(droppedElement, 'mouseup', 500, 800);
        });

        it('Swimlane to swimlane Drag Possible testing after dropped the card', () => {
            const cells: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-content-row:not(.e-swimlane-row) .e-content-cells');
            for (let i: number = 0; i < cells.length; i++) {
                expect((<HTMLElement>cells[i].firstChild).classList.contains('e-dropping')).toEqual(false);
            }
        });

        it('Swimlane to swimlane Removed draggable and droppable clone testing', () => {
            expect(kanbanObj.element.querySelectorAll('.e-target-dragged-clone').length).toBe(0);
            expect(kanbanObj.element.querySelectorAll('.e-target-dropped-clone').length).toBe(0);
            expect(kanbanObj.element.querySelectorAll('.e-card.e-cloned-card').length).toBe(0);
            expect(kanbanObj.element.querySelectorAll('.e-kanban-dragged-card').length).toBe(0);
        });

        it('Swimlane to swimlane Testing the cards after dropping the card', () => {
            const data: Record<string, any> = kanbanObj.getCardDetails(draggedElement);
            const curKey: string = data[kanbanObj.keyField] as string;
            expect(curKey).not.toBe(key);
            expect(curKey).not.toBe(columnKey);
            const curSwimlaneKey: string = data[kanbanObj.swimlaneSettings.keyField] as string;
            expect(curSwimlaneKey).toBe(rows[1]);
            expect(curSwimlaneKey).not.toBe(swimlaneKey);
        });

        it('Maintain swimlane collapsed state when drag and drop - collapsed the swimlanes', () => {
            const element: HTMLElement = kanbanObj.element.querySelectorAll('.e-swimlane-row .e-icons')[0] as HTMLElement;
            element.click();
            expect(element.classList.contains('e-swimlane-row-collapse')).toBe(true);
            expect(element.closest('.e-content-row').nextElementSibling.classList.contains('e-collapsed')).toBe(true);
        });

        it('Maintain swimlane collapsed state when drag and drop - collapsed the third swimlanes', () => {
            const element: HTMLElement = kanbanObj.element.querySelectorAll('.e-swimlane-row .e-icons')[2] as HTMLElement;
            element.click();
            expect(element.classList.contains('e-swimlane-row-collapse')).toBe(true);
            expect(element.closest('.e-content-row').nextElementSibling.classList.contains('e-collapsed')).toBe(true);
        });

        it('Maintain swimlane collapsed state when drag and drop - collapsed the fourth swimlanes', () => {
            const element: HTMLElement = kanbanObj.element.querySelectorAll('.e-swimlane-row .e-icons')[3] as HTMLElement;
            element.click();
            expect(element.classList.contains('e-swimlane-row-collapse')).toBe(true);
            expect(element.closest('.e-content-row').nextElementSibling.classList.contains('e-collapsed')).toBe(true);
        });

        it('Maintain swimlane collapsed state when drag and drop - drag the card', () => {
            draggedElement = (kanbanObj.element.querySelectorAll('.e-card[data-id="12"]') as NodeListOf<Element>).item(0) as HTMLElement;
            util.triggerMouseEvent(draggedElement, 'mousedown');
            droppedElement = kanbanObj.element.querySelectorAll('.e-card[data-id="72"] .e-card-content').item(0) as HTMLElement;
            util.triggerMouseEvent(droppedElement, 'mousemove', 250, 750);
        });
        it('Maintain swimlane collapsed state when drag and drop - move the card', () => {
            util.triggerMouseEvent(droppedElement, 'mousemove', 250, 250);
            expect(kanbanObj.element.querySelectorAll('.e-target-dropped-clone').length).toBe(1);
            const element: HTMLElement = kanbanObj.element.querySelectorAll('.e-swimlane-row .e-icons')[0] as HTMLElement;
            expect(element.classList.contains('e-swimlane-row-collapse')).toBe(true);
            expect(element.closest('.e-content-row').nextElementSibling.classList.contains('e-collapsed')).toBe(true);
            const element1: HTMLElement = kanbanObj.element.querySelectorAll('.e-swimlane-row .e-icons')[2] as HTMLElement;
            expect(element1.classList.contains('e-swimlane-row-collapse')).toBe(true);
            expect(element1.closest('.e-content-row').nextElementSibling.classList.contains('e-collapsed')).toBe(true);
            const element2: HTMLElement = kanbanObj.element.querySelectorAll('.e-swimlane-row .e-icons')[3] as HTMLElement;
            expect(element2.classList.contains('e-swimlane-row-collapse')).toBe(true);
            expect(element2.closest('.e-content-row').nextElementSibling.classList.contains('e-collapsed')).toBe(true);
        });

        it('Maintain swimlane collapsed state when drag and drop - drop the card', (done: DoneFn) => {
            kanbanObj.dataBound = () => {
                expect(kanbanObj.element.querySelectorAll('.e-target-dropped-clone').length).toBe(0);
                const element: HTMLElement = kanbanObj.element.querySelectorAll('.e-swimlane-row .e-icons')[0] as HTMLElement;
                expect(element.classList.contains('e-swimlane-row-collapse')).toBe(true);
                expect(element.closest('.e-content-row').nextElementSibling.classList.contains('e-collapsed')).toBe(true);
                const element1: HTMLElement = kanbanObj.element.querySelectorAll('.e-swimlane-row .e-icons')[2] as HTMLElement;
                expect(element1.classList.contains('e-swimlane-row-collapse')).toBe(true);
                expect(element1.closest('.e-content-row').nextElementSibling.classList.contains('e-collapsed')).toBe(true);
                const element2: HTMLElement = kanbanObj.element.querySelectorAll('.e-swimlane-row .e-icons')[3] as HTMLElement;
                expect(element2.classList.contains('e-swimlane-row-collapse')).toBe(true);
                expect(element2.closest('.e-content-row').nextElementSibling.classList.contains('e-collapsed')).toBe(true);
                done();
            };
            util.triggerMouseEvent(droppedElement, 'mouseup', 250, 250);
        });

        it('Maintain swimlane collapsed state when swimlane drag and drop - drag the card', () => {
            draggedElement = (kanbanObj.element.querySelectorAll('.e-card[data-id="26"]') as NodeListOf<Element>).item(0) as HTMLElement;
            util.triggerMouseEvent(draggedElement, 'mousedown');
            util.triggerMouseEvent(draggedElement, 'mousemove', 400, 700);
        });
        it('Maintain swimlane collapsed state when swimlane drag and drop - move the card', () => {
            draggedElement = (kanbanObj.element.querySelectorAll('.e-card[data-id="26"]') as NodeListOf<Element>).item(0) as HTMLElement;
            util.triggerMouseEvent(draggedElement, 'mousemove', 400, 700);
            droppedElement = kanbanObj.element.querySelectorAll('.e-card[data-id="3"] .e-card-content').item(0) as HTMLElement;
            util.triggerMouseEvent(droppedElement, 'mousemove', 130, 190);
            expect(kanbanObj.element.querySelectorAll('.e-target-dropped-clone').length).toBe(1);
            const element: HTMLElement = kanbanObj.element.querySelectorAll('.e-swimlane-row .e-icons')[0] as HTMLElement;
            expect(element.classList.contains('e-swimlane-row-collapse')).toBe(true);
            expect(element.closest('.e-content-row').nextElementSibling.classList.contains('e-collapsed')).toBe(true);
            const element1: HTMLElement = kanbanObj.element.querySelectorAll('.e-swimlane-row .e-icons')[2] as HTMLElement;
            expect(element1.classList.contains('e-swimlane-row-collapse')).toBe(true);
            expect(element1.closest('.e-content-row').nextElementSibling.classList.contains('e-collapsed')).toBe(true);
            const element2: HTMLElement = kanbanObj.element.querySelectorAll('.e-swimlane-row .e-icons')[3] as HTMLElement;
            expect(element2.classList.contains('e-swimlane-row-collapse')).toBe(true);
            expect(element2.closest('.e-content-row').nextElementSibling.classList.contains('e-collapsed')).toBe(true);

        });

        it('Maintain swimlane collapsed state when swimlane drag and drop - drop the card', (done: DoneFn) => {
            kanbanObj.dataBound = () => {
                expect(kanbanObj.element.querySelectorAll('.e-target-dropped-clone').length).toBe(0);
                const element: HTMLElement = kanbanObj.element.querySelectorAll('.e-swimlane-row .e-icons')[0] as HTMLElement;
                expect(element.classList.contains('e-swimlane-row-collapse')).toBe(true);
                expect(element.closest('.e-content-row').nextElementSibling.classList.contains('e-collapsed')).toBe(true);
                const element1: HTMLElement = kanbanObj.element.querySelectorAll('.e-swimlane-row .e-icons')[2] as HTMLElement;
                expect(element1.classList.contains('e-swimlane-row-collapse')).toBe(true);
                expect(element1.closest('.e-content-row').nextElementSibling.classList.contains('e-collapsed')).toBe(true);
                const element2: HTMLElement = kanbanObj.element.querySelectorAll('.e-swimlane-row .e-icons')[3] as HTMLElement;
                expect(element2.classList.contains('e-swimlane-row-collapse')).toBe(true);
                expect(element2.closest('.e-content-row').nextElementSibling.classList.contains('e-collapsed')).toBe(true);
                done();
            };
            util.triggerMouseEvent(droppedElement, 'mouseup', 144, 160);
        });
    });

    describe('Testing on multiple key support', () => {
        let kanbanObj: Kanban;
        let key: string;
        let droppedElement: HTMLElement;
        let draggedElement: HTMLElement;
        beforeAll((done: DoneFn) => {
            const model: KanbanModel = {
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
            key = draggedElement.getAttribute('data-key');
            util.triggerMouseEvent(draggedElement, 'mousedown');
            expect(key).toEqual('InProgress');
            util.triggerMouseEvent(draggedElement, 'mousemove', 100, 100);
            expect(draggedElement.classList.contains('e-kanban-dragged-card')).toBeTruthy();
            expect(draggedElement.nextElementSibling.classList.contains('e-target-dragged-clone')).toBeTruthy();
            expect(kanbanObj.element.querySelectorAll('.e-target-dragged-clone').length).toBe(1);
            util.triggerMouseEvent(draggedElement, 'mousemove');
        });

        it('Dropped clone behavior testing with multiple key testing', () => {
            droppedElement = kanbanObj.element.querySelectorAll('.e-card[data-id="1"] .e-card-content').item(0) as HTMLElement;
            util.triggerMouseEvent(droppedElement, 'mousemove', 100, 200);
            expect(document.body.style.cursor).toBe('');
            expect(droppedElement.closest('.e-content-cells').lastElementChild.classList.contains('e-target-multi-clone')).toEqual(true);
        });

        it('Dropped multi clone testing with columns', () => {
            droppedElement = <HTMLElement>kanbanObj.element.querySelector('.e-target-multi-clone').children[0].firstElementChild;
            util.triggerMouseEvent(droppedElement, 'mousemove', 100, 300);
        });

        it('All multiple key columns cards are displayed none when drag the multiple column key testing', () => {
            const wrapper: Element = kanbanObj.element.querySelector('.e-content-cells .e-card-wrapper');
            expect(wrapper.classList.contains('e-multi-card-wrapper')).toBe(true);
        });

        it('Column key testing on multiple key testing', () => {
            const clone: Element = kanbanObj.element.querySelectorAll('.e-target-multi-clone').item(0);
            for (let i: number = 0; i < clone.childElementCount; i++) {
                expect(clone.children[i].classList.contains('e-column-key')).toBe(true);
                expect(clone.children[i].firstElementChild.classList.contains('e-text')).toBe(true);
                const headerKey: string = kanbanObj.element.querySelectorAll('.e-header-cells')[0].getAttribute('data-key');
                expect(clone.children[i].firstElementChild.innerHTML).toBe(headerKey.split(',')[i].trim());
                expect(clone.children[i].getAttribute('data-key')).toBe(headerKey.split(',')[i].trim());
            }
        });

        it('Drag Possible testing when drag the card', () => {
            const cells: NodeList = kanbanObj.element.querySelectorAll('.e-content-cells');
            expect((<HTMLElement>cells[0].firstChild).classList.contains('e-dropping')).toEqual(true);
            expect((<HTMLElement>cells[1].firstChild).classList.contains('e-dropping')).toEqual(true);
            expect((<HTMLElement>cells[2].firstChild).classList.contains('e-dropping')).toEqual(true);
            expect((<HTMLElement>cells[3].firstChild).classList.contains('e-dropping')).toEqual(true);
        });

        it('Dropped clone testing', () => {
            expect(kanbanObj.element.querySelectorAll('.e-column-key')[0].classList.contains('e-multi-active')).toBe(true);
            expect(kanbanObj.element.querySelectorAll('.e-column-key')[0].classList.contains('e-multi-bottom-border')).not.toBe(true);
            droppedElement = kanbanObj.element.querySelector('.e-target-multi-clone .e-text');
        });

        it('Drag Possible testing after dropped the card', (done: DoneFn) => {
            kanbanObj.dataBound = () => {
                const cells: NodeList = kanbanObj.element.querySelectorAll('.e-content-cells');
                expect((<HTMLElement>cells[0].firstChild).classList.contains('e-dropping')).toEqual(false);
                expect((<HTMLElement>cells[1].firstChild).classList.contains('e-dropping')).toEqual(false);
                expect((<HTMLElement>cells[2].firstChild).classList.contains('e-dropping')).toEqual(false);
                expect((<HTMLElement>cells[3].firstChild).classList.contains('e-dropping')).toEqual(false);
                const element: Element = kanbanObj.element.querySelectorAll('.e-card[data-id="2"]').item(0);
                const data: Record<string, any> = kanbanObj.getCardDetails(element);
                const curKey: string = data[kanbanObj.keyField] as string;
                expect(curKey).not.toBe(key);
                const headerCell: HTMLElement = kanbanObj.element.querySelector('.e-header-cells');
                expect(curKey).toEqual(headerCell.getAttribute('data-key').split(',')[0].trim());
                expect(kanbanObj.element.querySelectorAll('.e-target-dragged-clone').length).toBe(0);
                expect(kanbanObj.element.querySelectorAll('.e-card.e-cloned-card').length).toBe(0);
                expect(kanbanObj.element.querySelectorAll('.e-kanban-dragged-card').length).toBe(0);
                expect(kanbanObj.element.querySelectorAll('.e-multi-active').length).toBe(0);
                expect(kanbanObj.element.querySelectorAll('.e-column-keys').length).toBe(0);
                expect(kanbanObj.element.querySelectorAll('.e-multi-bottom-border').length).toBe(0);
                const changedKey: string = kanbanObj.element.querySelectorAll('.e-card[data-id="2"]').item(0).getAttribute('data-key');
                expect(changedKey).not.toBe(key);
                expect(changedKey).toBe(headerCell.getAttribute('data-key').split(',')[0].trim());
                done();
            };
            util.triggerMouseEvent(droppedElement, 'mouseup', 100, 100);
        });

        it('Dragged clone behavior testing with multiple column keys', () => {
            draggedElement = (kanbanObj.element.querySelectorAll('.e-card[data-id="5"]') as NodeListOf<Element>).item(0) as HTMLElement;
            key = draggedElement.getAttribute('data-key');
            util.triggerMouseEvent(draggedElement, 'mousedown');
            util.triggerMouseEvent(draggedElement, 'mousemove', 500, 100);
            expect(key).toEqual('Testing');
            expect(draggedElement.classList.contains('e-kanban-dragged-card')).toBeTruthy();
            expect(draggedElement.nextElementSibling.classList.contains('e-target-dragged-clone')).toBeTruthy();
            expect(kanbanObj.element.querySelectorAll('.e-target-dragged-clone').length).toBe(1);
            util.triggerMouseEvent(draggedElement, 'mousemove');
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
            const wrapper: Element = kanbanObj.element.querySelector('.e-content-cells .e-card-wrapper');
            expect(wrapper.classList.contains('e-multi-card-wrapper')).toBe(true);
        });

        it('Column key testing on multiple key testing', () => {
            const clone: HTMLElement = kanbanObj.element.querySelector('.e-target-multi-clone');
            for (let i: number = 0; i < clone.childElementCount; i++) {
                expect(clone.children[i].classList.contains('e-column-key')).toBe(true);
                expect(clone.children[i].firstElementChild.classList.contains('e-text')).toBe(true);
                const headerCell: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-header-cells');
                expect(clone.children[i].firstElementChild.innerHTML).toBe(headerCell[0].getAttribute('data-key').split(',')[i].trim());
                expect(clone.children[i].getAttribute('data-key')).toBe(headerCell[0].getAttribute('data-key').split(',')[i].trim());
            }
        });

        it('Drag Possible testing when drag the card', () => {
            const cells: NodeList = kanbanObj.element.querySelectorAll('.e-content-cells');
            expect((<HTMLElement>cells[0].firstChild).classList.contains('e-dropping')).toEqual(true);
            expect((<HTMLElement>cells[1].firstChild).classList.contains('e-dropping')).toEqual(true);
            expect((<HTMLElement>cells[2].firstChild).classList.contains('e-dropping')).toEqual(true);
            expect((<HTMLElement>cells[3].firstChild).classList.contains('e-dropping')).toEqual(true);
        });

        it('Dropped clone testing', () => {
            expect(kanbanObj.element.querySelectorAll('.e-column-key')[1].classList.contains('e-multi-active')).toBe(true);
            expect(kanbanObj.element.querySelectorAll('.e-column-key')[0].classList.contains('e-multi-bottom-border')).toBe(true);
            droppedElement = <HTMLElement>kanbanObj.element.querySelectorAll('.e-target-multi-clone .e-text').item(1);
        });

        it('Drag Possible testing after dropped the card', (done: DoneFn) => {
            kanbanObj.dataBound = () => {
                const cells: NodeList = kanbanObj.element.querySelectorAll('.e-content-cells');
                expect((<HTMLElement>cells[0].firstChild).classList.contains('e-dropping')).toEqual(false);
                expect((<HTMLElement>cells[1].firstChild).classList.contains('e-dropping')).toEqual(false);
                expect((<HTMLElement>cells[2].firstChild).classList.contains('e-dropping')).toEqual(false);
                expect((<HTMLElement>cells[3].firstChild).classList.contains('e-dropping')).toEqual(false);
                expect(kanbanObj.element.querySelectorAll('.e-target-dragged-clone').length).toBe(0);
                expect(kanbanObj.element.querySelectorAll('.e-card.e-cloned-card').length).toBe(0);
                expect(kanbanObj.element.querySelectorAll('.e-kanban-dragged-card').length).toBe(0);
                const element: Element = kanbanObj.element.querySelectorAll('.e-card[data-id="5"]').item(0);
                const data: Record<string, any> = kanbanObj.getCardDetails(element);
                const curKey: string = data[kanbanObj.keyField] as string;
                expect(curKey).not.toBe(key);
                const headerCell: HTMLElement = kanbanObj.element.querySelector('.e-header-cells');
                expect(curKey).toEqual(headerCell.getAttribute('data-key').split(',')[1].trim());
                expect(kanbanObj.element.querySelectorAll('.e-multi-active').length).toBe(0);
                expect(kanbanObj.element.querySelectorAll('.e-column-keys').length).toBe(0);
                expect(kanbanObj.element.querySelectorAll('.e-multi-bottom-border').length).toBe(0);
                const changedKey: string = kanbanObj.element.querySelectorAll('.e-card[data-id="5"]').item(0).getAttribute('data-key');
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
            const model: KanbanModel = {
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
            key = draggedElement.getAttribute('data-key');
            util.triggerMouseEvent(draggedElement, 'mousedown');
            expect(key).toEqual('InProgress');
            util.triggerMouseEvent(draggedElement, 'mousemove', 100, 100);
            expect(draggedElement.classList.contains('e-kanban-dragged-card')).toBeTruthy();
            expect(draggedElement.nextElementSibling.classList.contains('e-target-dragged-clone')).toBeTruthy();
            expect(kanbanObj.element.querySelectorAll('.e-target-dragged-clone').length).toBe(1);
            util.triggerMouseEvent(draggedElement, 'mousemove');
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
            const wrapper: Element = kanbanObj.element.querySelector('.e-content-cells .e-card-wrapper');
            expect(wrapper.classList.contains('e-multi-card-wrapper')).toBe(true);
        });

        it('Column key testing on multiple key testing', () => {
            const clone: Element = kanbanObj.element.querySelectorAll('.e-target-multi-clone').item(0);
            for (let i: number = 0; i < clone.childElementCount; i++) {
                expect(clone.children[i].classList.contains('e-column-key')).toBe(true);
                expect(clone.children[i].firstElementChild.classList.contains('e-text')).toBe(true);
                const headerCell: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-header-cells');
                expect(clone.children[i].firstElementChild.innerHTML).toBe(headerCell[0].getAttribute('data-key').split(',')[i].trim());
                expect(clone.children[i].getAttribute('data-key')).toBe(headerCell[0].getAttribute('data-key').split(',')[i].trim());
            }
        });

        it('Drag Possible testing when drag the card', () => {
            const cells: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-content-row:not(.e-swimlane-row) .e-content-cells');
            expect((<HTMLElement>cells[0]).classList.contains('e-dropping')).toEqual(true);
            expect((<HTMLElement>cells[1]).classList.contains('e-dropping')).toEqual(true);
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
                const className: string = '.e-content-row:not(.e-swimlane-row) .e-content-cells';
                const cells: HTMLElement[] = [].slice.call(kanbanObj.element.querySelectorAll(className));
                for (let i: number = 0; i < cells.length; i++) {
                    expect((<HTMLElement>cells[i].firstChild).classList.contains('e-dropping')).toEqual(false);
                }
                const element: Element = kanbanObj.element.querySelectorAll('.e-card[data-id="2"]').item(0);
                const data: Record<string, any> = kanbanObj.getCardDetails(element);
                const curKey: string = data[kanbanObj.keyField] as string;
                expect(curKey).not.toBe(key);
                const headerCell: HTMLElement = kanbanObj.element.querySelector('.e-header-cells');
                expect(curKey).toEqual(headerCell.getAttribute('data-key').split(',')[0].trim());
                expect(kanbanObj.element.querySelectorAll('.e-target-dragged-clone').length).toBe(0);
                expect(kanbanObj.element.querySelectorAll('.e-card.e-cloned-card').length).toBe(0);
                expect(kanbanObj.element.querySelectorAll('.e-kanban-dragged-card').length).toBe(0);
                expect(kanbanObj.element.querySelectorAll('.e-multi-active').length).toBe(0);
                expect(kanbanObj.element.querySelectorAll('.e-column-keys').length).toBe(0);
                expect(kanbanObj.element.querySelectorAll('.e-multi-bottom-border').length).toBe(0);
                const changedKey: string = kanbanObj.element.querySelectorAll('.e-card[data-id="2"]').item(0).getAttribute('data-key');
                expect(changedKey).not.toBe(key);
                expect(changedKey).toBe(headerCell.getAttribute('data-key').split(',')[0].trim());
                done();
            };
            util.triggerMouseEvent(droppedElement, 'mouseup', 100, 200);
        });

        it('Dragged clone behavior testing with multiple column keys', () => {
            draggedElement = kanbanObj.element.querySelectorAll('.e-card[data-id="45"]').item(0) as HTMLElement;
            key = draggedElement.getAttribute('data-key');
            util.triggerMouseEvent(draggedElement, 'mousedown');
            util.triggerMouseEvent(draggedElement, 'mousemove', 500, 100);
            expect(key).toEqual('Testing');
            util.triggerMouseEvent(draggedElement, 'mousemove', 500, 100);
            expect(draggedElement.classList.contains('e-kanban-dragged-card')).toBeTruthy();
            expect(draggedElement.nextElementSibling.classList.contains('e-target-dropped-clone')).toBeTruthy();
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
            const wrapper: Element = kanbanObj.element.querySelector('.e-content-cells .e-card-wrapper');
            expect(wrapper.classList.contains('e-multi-card-wrapper')).toBe(true);
        });

        it('Column key testing on multiple key testing', () => {
            const clone: HTMLElement = kanbanObj.element.querySelector('.e-target-multi-clone');
            for (let i: number = 0; i < clone.childElementCount; i++) {
                expect(clone.children[i].classList.contains('e-column-key')).toBe(true);
                expect(clone.children[i].firstElementChild.classList.contains('e-text')).toBe(true);
                const headerCell: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-header-cells');
                expect(clone.children[i].firstElementChild.innerHTML).toBe(headerCell[0].getAttribute('data-key').split(',')[i].trim());
                expect(clone.children[i].getAttribute('data-key')).toBe(headerCell[0].getAttribute('data-key').split(',')[i].trim());
            }
        });

        it('Drag Possible testing when drag the card', () => {
            const cells: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-content-row:not(.e-swimlane-row) .e-content-cells');
            expect((<HTMLElement>cells[0]).classList.contains('e-dropping')).toEqual(true);
            expect((<HTMLElement>cells[1]).classList.contains('e-dropping')).toEqual(true);
            expect((<HTMLElement>cells[2]).classList.contains('e-dropping')).toEqual(true);
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
                const className: string = '.e-content-row:not(.e-swimlane-row) .e-content-cells';
                const cells: HTMLElement[] = [].slice.call(kanbanObj.element.querySelectorAll(className));
                for (let i: number = 4; i < cells.length; i++) {
                    expect((<HTMLElement>cells[i].firstChild).classList.contains('e-dropping')).toEqual(false);
                }
                expect(kanbanObj.element.querySelectorAll('.e-target-dragged-clone').length).toBe(0);
                expect(kanbanObj.element.querySelectorAll('.e-card.e-cloned-card').length).toBe(0);
                expect(kanbanObj.element.querySelectorAll('.e-kanban-dragged-card').length).toBe(0);
                const element: Element = kanbanObj.element.querySelectorAll('.e-card[data-id="45"]').item(0);
                const data: Record<string, any> = kanbanObj.getCardDetails(element);
                const curKey: string = data[kanbanObj.keyField] as string;
                expect(curKey).not.toBe(key);
                const headerCell: HTMLElement = kanbanObj.element.querySelector('.e-header-cells');
                expect(curKey).toEqual(headerCell.getAttribute('data-key').split(',')[1].trim());
                expect(kanbanObj.element.querySelectorAll('.e-multi-active').length).toBe(0);
                expect(kanbanObj.element.querySelectorAll('.e-column-keys').length).toBe(0);
                expect(kanbanObj.element.querySelectorAll('.e-multi-bottom-border').length).toBe(0);
                const changedKey: string = kanbanObj.element.querySelectorAll('.e-card[data-id="45"]').item(0).getAttribute('data-key');
                expect(changedKey).not.toBe(key);
                expect(changedKey).toBe(headerCell.getAttribute('data-key').split(',')[1].trim());
                done();
            };
            util.triggerMouseEvent(droppedElement, 'mouseup', 100, 350);
        });

        it('Dragged clone behavior testing with multiple column keys', () => {
            draggedElement = kanbanObj.element.querySelectorAll('.e-card[data-id="18"]').item(0) as HTMLElement;
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
            const ele: Element = droppedElement.closest('.e-content-cells').lastElementChild;
            expect(ele.classList.contains('e-target-multi-clone')).not.toEqual(true);
        });

        it('Dropped multi clone testing with columns', () => {
            util.triggerMouseEvent(droppedElement, 'mousemove', 100, 750);
            const wrapper: Element = droppedElement.closest('.e-card-wrapper');
            expect(wrapper.classList.contains('e-multi-card-wrapper')).not.toBe(true);
            util.triggerMouseEvent(droppedElement, 'mouseup', 100, 750);
        });
    });

    describe('Allow Toggle Colum with swimlanes and swimlane drag and drop', () => {
        let kanbanObj: Kanban;
        beforeAll((done: DoneFn) => {
            const model: KanbanModel = {
                columns: [
                    { headerText: 'Backlog', keyField: 'Open', allowToggle: false, isExpanded: true },
                    { headerText: 'In Progress', keyField: 'InProgress', allowToggle: true, isExpanded: false },
                    { headerText: 'Testing', keyField: 'Testing', allowToggle: false, isExpanded: true },
                    { headerText: 'Done', keyField: 'Close', allowToggle: true, isExpanded: true }
                ],
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

        it('Single column collapse testing', () => {
            const element: Element = kanbanObj.element.querySelectorAll('.e-header-cells')[3].children[0].lastElementChild;
            (<HTMLElement>element).click();
            expect(element.classList.contains('e-column-collapse')).toBe(true);
            const ele: NodeList = util.getElement(kanbanObj, '.e-content-row:not(.e-swimlane-row) .e-content-cells[data-key="Close"]');
            for (let i: number = 0; i < ele.length; i++) {
                expect((<Element>ele[i]).classList.contains('e-collapsed')).toBe(true);
            }
        });

        it('Single column expand testing', () => {
            const element: Element = kanbanObj.element.querySelectorAll('.e-header-cells')[3].children[0].lastElementChild;
            (<HTMLElement>element).click();
            expect(element.classList.contains('e-column-expand')).toBe(true);
            const ele: NodeList = util.getElement(kanbanObj, '.e-content-row:not(.e-swimlane-row) .e-content-cells[data-key="Close"]');
            for (let i: number = 0; i < ele.length; i++) {
                expect((<Element>ele[i]).classList.contains('e-collapsed')).toBe(false);
            }
        });

        it('Maintain single collapsed state testing - drag the card', () => {
            const headerCell: Element = kanbanObj.element.querySelectorAll('.e-header-cells')[1].children[0].lastElementChild;
            expect(headerCell.classList.contains('e-column-collapse')).toBe(true);
            const contentCell: Element = kanbanObj.element.querySelectorAll('.e-content-row:not(.e-swimlane-row) .e-content-cells')[1];
            expect(contentCell.classList.contains('e-collapsed')).toBe(true);
            const draggedElement: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="45"]').item(0) as HTMLElement;
            util.triggerMouseEvent(draggedElement, 'mousedown');
            util.triggerMouseEvent(draggedElement, 'mousemove', 700, 210);
            expect(draggedElement.classList.contains('e-kanban-dragged-card')).toBeTruthy();
            expect(draggedElement.nextElementSibling.classList.contains('e-target-dragged-clone')).toBeTruthy();
            expect(kanbanObj.element.querySelectorAll('.e-target-dragged-clone').length).toBe(1);
        });

        it('Maintain single collapsed state testing - card moved to another place', () => {
            const droppedElement: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="22"]').item(0) as HTMLElement;
            util.triggerMouseEvent(droppedElement, 'mousemove', 700, 510);
            expect(droppedElement.previousElementSibling.classList.contains('e-target-dropped-clone')).toEqual(true);

        });

        it('Maintain single collapsed state testing - after drag stop', (done: DoneFn) => {
            const droppedElement: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="22"]').item(0) as HTMLElement;
            kanbanObj.dataBound = () => {
                expect(kanbanObj.element.querySelectorAll('.e-target-dragged-clone').length).toBe(0);
                expect(kanbanObj.element.querySelectorAll('.e-target-dropped-clone').length).toBe(0);
                expect(kanbanObj.element.querySelectorAll('.e-card.e-cloned-card').length).toBe(0);
                expect(kanbanObj.element.querySelectorAll('.e-kanban-dragged-card').length).toBe(0);
                const element: Element = kanbanObj.element.querySelectorAll('.e-header-cells')[1].children[0].lastElementChild;
                expect(element.classList.contains('e-column-collapse')).toBe(true);
                const ele: NodeList = util.getElement(kanbanObj, '.e-content-row:not(.e-swimlane-row) .e-content-cells[data-key="InProgress"]');
                for (let i: number = 0; i < ele.length; i++) {
                    expect((<Element>ele[i]).classList.contains('e-collapsed')).toBe(true);
                }
                done();
            };
            util.triggerMouseEvent(droppedElement, 'mouseup', 700, 510);
        });

        it('Single Collapsed column with drag and drop behavior testing - check the column expand when cursor move', () => {
            const draggedElement: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="25"]').item(0) as HTMLElement;
            util.triggerMouseEvent(draggedElement, 'mousedown');
            util.triggerMouseEvent(draggedElement, 'mousemove', 280, 600);
            const element: Element = kanbanObj.element.querySelectorAll('.e-content-row:not(.e-swimlane-row) .e-content-cells').item(1);
            util.triggerMouseEvent(element, 'mousemove', 290, 600);
        });
        it('Single Collapsed column with drag and drop behavior testing - drop the card on collapsed column', () => {
            const droppedElement: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="29"]').item(0) as HTMLElement;
            util.triggerMouseEvent(droppedElement, 'mousemove', 450, 600);
            util.triggerMouseEvent(droppedElement, 'mouseup', 450, 600);
        });
    });

    describe('Multiple selection drag and drop', () => {
        let kanbanObj: Kanban;
        beforeAll((done: DoneFn) => {
            const model: KanbanModel = {
                columns: [
                    { headerText: 'Backlog', keyField: 'Open', allowToggle: true },
                    { headerText: 'In Progress', keyField: 'InProgress', allowToggle: true },
                    { headerText: 'Testing', keyField: 'Testing', allowToggle: true },
                    { headerText: 'Done', keyField: 'Close', allowToggle: true }
                ],
                swimlaneSettings: {
                    keyField: 'Assignee',
                    allowDragAndDrop: true
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
            const card1: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="45"]').item(0) as HTMLElement;
            util.triggerMouseEvent(card1, 'click');
            expect(card1.classList.contains('e-selection')).toEqual(true);
            const card2: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="18"]').item(0) as HTMLElement;
            util.triggerMouseEvent(card2, 'click', null, null, false, true);
            const card3: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="66"]').item(0) as HTMLElement;
            util.triggerMouseEvent(card3, 'click', null, null, false, true);
            expect(card1.classList.contains('e-selection')).toEqual(true);
            expect(card2.classList.contains('e-selection')).toEqual(true);
            expect(card3.classList.contains('e-selection')).toEqual(true);
        });
        it('Drag multiple cards', () => {
            const draggedElement: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="66"]').item(0) as HTMLElement;
            util.triggerMouseEvent(draggedElement, 'mousedown');
            util.triggerMouseEvent(draggedElement, 'mousemove', 250, 170);
            expect(kanbanObj.element.querySelectorAll('.e-target-dragged-clone').length).toEqual(3);
        });
        it('Cloned card layout testing', () => {
            const ele: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="2"]').item(0) as HTMLElement;
            util.triggerMouseEvent(ele, 'mousemove', 250, 170);
            const element: HTMLElement = kanbanObj.element.querySelectorAll('.e-cloned-card').item(0) as HTMLElement;
            expect(element.querySelectorAll('.e-multi-card-text').item(0).innerHTML).toEqual('3 Cards');
        });
        it('Dropped card to columns', () => {
            const ele: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="2"]').item(0) as HTMLElement;
            util.triggerMouseEvent(ele, 'mouseup', 250, 150);
        });
    });

    describe('Prevent Drag and drop by args value as true', () => {
        let kanbanObj: Kanban;
        let dragElement: HTMLElement;
        beforeAll((done: DoneFn) => {
            kanbanObj = util.createKanban({}, kanbanData, done);
        });

        afterAll(() => {
            util.destroy(kanbanObj);
        });

        it('Check the card dragging or not', () => {
            kanbanObj.dragStart = (args: DragEventArgs) => args.cancel = true;
            dragElement = (kanbanObj.element.querySelectorAll('.e-card[data-id="2"]') as NodeListOf<Element>).item(0) as HTMLElement;
            util.triggerMouseEvent(dragElement, 'mousedown');
            util.triggerMouseEvent(dragElement, 'mousemove', 100, 100);
            expect(dragElement.classList.contains('e-kanban-dragged-card')).toBeFalsy();
            expect(dragElement.nextElementSibling.classList.contains('e-target-dragged-clone')).toBeFalsy();
            expect(kanbanObj.element.querySelectorAll('.e-target-dragged-clone').length).toBe(0);
        });
    });

    describe('External drop functionality', () => {
        let kanbanObj: Kanban;
        let kanbanObj1: Kanban;
        let draggedElement: HTMLElement;
        beforeAll((done: DoneFn) => {
            let kanbanData1: Record<string, any>[] = [
                {
                    'Id': 1,
                    'Status': 'Open',
                    'Summary': 'Analyze the new requirements gathered from the customer.',
                    'Type': 'Story',
                    'Priority': 'Low',
                    'Tags': 'Analyze,Customer',
                    'Estimate': 3.5,
                    'Assignee': 'Andrew Fuller',
                    'AssigneeName': 'Andrew',
                    'RankId': 1
                },
                {
                    'Id': 2,
                    'Status': 'InProgress',
                    'Summary': 'Improve application performance',
                    'Type': 'Improvement',
                    'Priority': 'Normal',
                    'Tags': 'Improvement',
                    'Estimate': 6,
                    'Assignee': 'Andrew Fuller',
                    'AssigneeName': 'Andrew',
                    'RankId': 1
                },
                {
                    'Id': 3,
                    'Status': 'Open',
                    'Summary': 'Arrange a web meeting with the customer to get new requirements.',
                    'Type': 'Others',
                    'Priority': 'Critical',
                    'Tags': 'Meeting',
                    'Estimate': 5.5,
                    'Assignee': 'Janet Leverling',
                    'AssigneeName': 'Janet',
                    'RankId': 2
                },
                {
                    'Id': 4,
                    'Status': 'InProgress',
                    'Summary': 'Fix the issues reported in the IE browser.',
                    'Type': 'Bug',
                    'Priority': 'Release Breaker',
                    'Tags': 'IE',
                    'Estimate': 2.5,
                    'Assignee': 'Janet Leverling',
                    'AssigneeName': 'Janet',
                    'RankId': 2
                },
                {
                    'Id': 5,
                    'Status': 'Close',
                    'Summary': 'Fix the issues reported by the customer.',
                    'Type': 'Bug',
                    'Priority': 'Low',
                    'Tags': 'Customer',
                    'Estimate': '3.5',
                    'Assignee': 'Steven walker',
                    'AssigneeName': 'Steven',
                    'RankId': 1
                }];
            let kanbanData2: Record<string, any>[] = [{
                'Id': 1,
                'Status': 'Close',
                'Summary': 'Arrange a web meeting with the customer to get the login page requirements.',
                'Type': 'Others',
                'Priority': 'Low',
                'Tags': 'Meeting',
                'Estimate': 2,
                'Assignee': 'Andrew Fuller',
                'AssigneeName': 'Andrew',
                'RankId': 1
            },
            {
                'Id': 2,
                'Status': 'Open',
                'Summary': 'Validate new requirements',
                'Type': 'Improvement',
                'Priority': 'Low',
                'Tags': 'Validation',
                'Estimate': 1.5,
                'Assignee': 'Robert King',
                'AssigneeName': 'Robert',
                'RankId': 1
            },
            {
                'Id': 3,
                'Status': 'Close',
                'Summary': 'Login page validation',
                'Type': 'Story',
                'Priority': 'Release Breaker',
                'Tags': 'Validation,Fix',
                'Estimate': 2.5,
                'Assignee': 'Janet Leverling',
                'AssigneeName': 'Janet',
                'RankId': 2
            },
            {
                'Id': 4,
                'Status': 'InProgress',
                'Summary': 'Fix the issues reported in Safari browser.',
                'Type': 'Bug',
                'Priority': 'Release Breaker',
                'Tags': 'Fix,Safari',
                'Estimate': 1.5,
                'Assignee': 'Nancy Davloio',
                'AssigneeName': 'Nancy',
                'RankId': 2
            },
            {
                'Id': 5,
                'Status': 'Close',
                'Summary': 'Test the application in the IE browser.',
                'Type': 'Story',
                'Priority': 'Low',
                'Tags': 'Testing,IE',
                'Estimate': 5.5,
                'Assignee': 'Janet Leverling',
                'AssigneeName': 'Janet',
                'RankId': 3
            }];
            let kanbanDragStop: any = (args: DragEventArgs) => {
                if (closest(args.event.target as Element, '#kanban1')) {
                    kanbanObj.deleteCard(args.data);
                    args.data.forEach((card: { [key: string]: Object }, index: number) => changeId(card, index + 1));
                    kanbanObj1.addCard(args.data, args.dropIndex);
                    args.cancel = true;
                }
            };
            let changeId: any = (card: { [key: string]: Object }, increase: number) => {
                let index: number = ((kanbanObj1.kanbanData) as { [key: string]: Object }[]).findIndex(
                    (colData: { [key: string]: Object }) =>
                        colData[kanbanObj1.cardSettings.headerField] === card[kanbanObj1.cardSettings.headerField]);
                if (index !== -1) {
                    card[kanbanObj1.cardSettings.headerField] = Math.max.apply(Math, kanbanObj1.kanbanData.map(
                        (obj: { [key: string]: string }) => parseInt(obj[kanbanObj1.cardSettings.headerField], 10))) + increase;
                }
            }
            const model: KanbanModel = {

                keyField: 'Status',
                columns: [
                    { headerText: 'Backlog', keyField: 'Open, Review' },
                    { headerText: 'In Progress', keyField: 'InProgress' },
                    { headerText: 'Done', keyField: 'Close' }
                ],
                externalDropId: ['#Kanban2'],
                cardSettings: {
                    showHeader: true,
                    contentField: 'RankId',
                    headerField: 'Id',
                    selectionType: 'Multiple'
                },
                showEmptyColumn: true,
                dragStop: kanbanDragStop
            };
            kanbanObj = util.createKanban(model, kanbanData1, done, createElement('div', { id: 'Kanban1' }));

            const model2: KanbanModel = {
                keyField: 'Status',
                columns: [
                    { headerText: 'Backlog', keyField: 'Open' },
                    { headerText: 'In Progress', keyField: 'InProgress' },
                    { headerText: 'Testing', keyField: 'Testing' },
                    { headerText: 'Done', keyField: 'Review, Close' }
                ],
                cardSettings: {
                    showHeader: true,
                    contentField: 'RankId',
                    headerField: 'Id'
                },
                showEmptyColumn: true,
                sortSettings: {
                    field: 'RankId',
                    direction: 'Descending'
                }
            };
            kanbanObj1 = util.createKanban(model2, kanbanData2, done, createElement('div', { id: 'Kanban2' }));
        });

        afterAll(() => {
            util.destroy(kanbanObj);
            util.destroy(kanbanObj1);
        });

        it('Check the first kanbanObject data', (done: Function) => {
            setTimeout(() => {
                expect(kanbanObj.kanbanData.length).toEqual(5);
                done();
            }, 500);
        });

        it('check the next kanban data length', () => {
            expect(kanbanObj1.kanbanData.length).toEqual(5);
            expect(kanbanObj.element.querySelectorAll('.e-card-wrapper')[0].childElementCount).toEqual(2);
            expect(kanbanObj.element.querySelectorAll('.e-card-wrapper')[1].childElementCount).toEqual(2);
            draggedElement = kanbanObj.element.querySelectorAll('.e-card[data-id="1"]').item(0) as HTMLElement;
            util.triggerMouseEvent(draggedElement, 'mousedown');
            util.triggerMouseEvent(draggedElement, 'mousemove', 100, 230);
        });

        it('On dragging the card to another kanban', () => {
            let ele: HTMLElement = kanbanObj1.element.querySelectorAll('.e-card[data-id="4"]').item(0).querySelector('.e-card-header') as HTMLElement;
            util.triggerMouseEvent(ele, 'mousemove', 100, 300);
            util.triggerMouseEvent(ele, 'mouseup');
            expect(kanbanObj.element.querySelectorAll('.e-card-wrapper')[0].childElementCount).toEqual(1);
            expect(kanbanObj.element.querySelectorAll('.e-card-wrapper')[1].childElementCount).toEqual(3);
        });
    });

    describe('EJ2-50533 - Card is not in selected state after drag and drop the card', () => {
        let kanbanObj: Kanban;
        let key: string;
        let droppedElement: HTMLElement;
        let dragElement: HTMLElement;
        beforeAll((done: DoneFn) => {
            const model: KanbanModel = {
                cardSettings: {
                    headerField: 'Id',
                    selectionType: 'Single'
                }
            };
            kanbanObj = util.createKanban(model, kanbanData, done);
        });

        afterAll(() => {
            util.destroy(kanbanObj);
        });

        it('Card click action event args as false', () => {
            let ele: HTMLElement = kanbanObj.element.querySelector('.e-card[data-id="1"]') as HTMLElement;
            expect(ele.classList.contains('e-selection')).toEqual(false);
            util.triggerMouseEvent(ele, 'click');
            expect(ele.classList.contains('e-selection')).toEqual(true);
        });

        it('Dragged clone behavior testing', () => {
            dragElement = (kanbanObj.element.querySelectorAll('.e-card[data-id="1"]') as NodeListOf<Element>).item(0) as HTMLElement;
            key = dragElement.getAttribute('data-key');
            util.triggerMouseEvent(dragElement, 'mousedown');
            util.triggerMouseEvent(dragElement, 'mousemove', 100, 100);
            expect(key).toEqual('Open');
            expect(dragElement.classList.contains('e-kanban-dragged-card')).toBeTruthy();
            expect(dragElement.nextElementSibling.classList.contains('e-target-dragged-clone')).toBeTruthy();
            expect(kanbanObj.element.querySelectorAll('.e-target-dragged-clone').length).toBe(1);
        });

        it('Created Dropped clone on above the column testing and target is card', () => {
            const element: Element = kanbanObj.element.querySelectorAll('.e-card[data-id="2"]').item(0);
            util.triggerMouseEvent(element, 'mousemove', 250, 100);
            expect(element.previousElementSibling.classList.contains('e-target-dropped-clone')).toEqual(true);
        });

        it('Dropped clone behavior testing', () => {
            droppedElement = kanbanObj.element.querySelectorAll('.e-card[data-id="9"] .e-card-header').item(0) as HTMLElement;
            util.triggerMouseEvent(droppedElement, 'mousemove', 500, 200);
            util.triggerMouseEvent(droppedElement, 'mousemove', 500, 200);
            expect(document.body.style.cursor).toBe('');
            expect(droppedElement.closest('.e-card').nextElementSibling.classList.contains('e-target-dropped-clone')).toEqual(true);
        });

        it('Dropped clone testing', () => {
            util.triggerMouseEvent(droppedElement, 'mouseup', 500, 200);
        });

        it('Testing the cards after dropping the card', () => {
            const data: Record<string, any> = kanbanObj.getCardDetails(dragElement);
            const curKey: string = data[kanbanObj.keyField] as string;
            expect(curKey).not.toBe(key);
            expect(curKey).toEqual('Testing');
        });

        it('check the selection after drag and drop', () => {
            let ele: HTMLElement = kanbanObj.element.querySelector('.e-card[data-id="1"]') as HTMLElement;
            expect(ele.classList.contains('e-selection')).toEqual(true);
        });
    });

    describe('EJ2-62190 - Drag and Drop is not working in Kanban when enabling ShowAddButton ', () => {
        let kanbanObj: Kanban;
        let key: string;
        let droppedElement: HTMLElement;
        let dragElement: HTMLElement;
        beforeAll((done: DoneFn) => {
            const model: KanbanModel = {
                cardSettings: {
                    headerField: 'Id',
                    selectionType: 'Single'
                },
                columns: [
                    { headerText: 'Backlog', keyField: 'Open', showAddButton: true },
                    { headerText: 'In Progress', keyField: 'InProgress', showAddButton: true },
                    { headerText: 'Review', keyField: 'Review', showAddButton: true },
                    { headerText: 'Testing', keyField: 'Testing', showAddButton: true },
                    { headerText: 'Done', keyField: 'Close', showAddButton: true }
                ],
            };
            kanbanObj = util.createKanban(model, kanbanData, done);
        });

        afterAll(() => {
            util.destroy(kanbanObj);
        });

        it('Card click action event args as false', () => {
            let ele: HTMLElement = kanbanObj.element.querySelector('.e-card[data-id="1"]') as HTMLElement;
            expect(ele.classList.contains('e-selection')).toEqual(false);
            util.triggerMouseEvent(ele, 'click');
            expect(ele.classList.contains('e-selection')).toEqual(true);
        });

        it('Dragged clone behavior testing', () => {
            dragElement = (kanbanObj.element.querySelectorAll('.e-card[data-id="1"]') as NodeListOf<Element>).item(0) as HTMLElement;
            key = dragElement.getAttribute('data-key');
            util.triggerMouseEvent(dragElement, 'mousedown');
            util.triggerMouseEvent(dragElement, 'mousemove', 100, 100);
            expect(key).toEqual('Open');
            expect(dragElement.classList.contains('e-kanban-dragged-card')).toBeTruthy();
            expect(dragElement.nextElementSibling.classList.contains('e-target-dragged-clone')).toBeTruthy();
            expect(kanbanObj.element.querySelectorAll('.e-target-dragged-clone').length).toBe(1);
        });

        it('Created Dropped clone on above the column testing and target is card', () => {
            const element: Element = kanbanObj.element.querySelectorAll('.e-card[data-id="2"]').item(0);
            util.triggerMouseEvent(element, 'mousemove', 250, 100);
            expect(element.previousElementSibling.classList.contains('e-target-dropped-clone')).toEqual(true);
        });

        it('Dropped clone behavior testing', () => {
            droppedElement = kanbanObj.element.querySelectorAll('.e-card[data-id="9"] .e-card-header').item(0) as HTMLElement;
            util.triggerMouseEvent(droppedElement, 'mousemove', 500, 200);
            util.triggerMouseEvent(droppedElement, 'mousemove', 500, 200);
            expect(document.body.style.cursor).toBe('');
            expect(droppedElement.closest('.e-card').nextElementSibling.classList.contains('e-target-dropped-clone')).toEqual(true);
        });

        it('Dropped clone testing', () => {
            util.triggerMouseEvent(droppedElement, 'mouseup', 500, 200);
        });

        it('Testing the cards after dropping the card', () => {
            const data: Record<string, any> = kanbanObj.getCardDetails(dragElement);
            const curKey: string = data[kanbanObj.keyField] as string;
            expect(curKey).not.toBe(key);
            expect(curKey).toEqual('Testing');
        });

        it('check the selection after drag and drop', () => {
            let ele: HTMLElement = kanbanObj.element.querySelector('.e-card[data-id="1"]') as HTMLElement;
            expect(ele.classList.contains('e-selection')).toEqual(true);
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
describe('835740 - The drop is not working on the empty column in the Kanban component.', () => {
    let kanbanObj: Kanban;
    beforeAll((done: DoneFn) => {
        let kanbanData: Record<string, any>[] = [{
            'Id': 1,
            'Status': 'InProgress',
            'Summary': 'Arrange a web meeting with the customer to get the login page requirements.',
            'Type': 'Others',
            'Priority': 'Low',
            'Tags': 'Meeting',
            'Estimate': 2,
            'Assignee': 'Andrew Fuller',
            'AssigneeName': 'Andrew',
            'RankId': 1
        },
        {
            'Id': 2,
            'Status': 'close',
            'Summary': 'Validate new requirements',
            'Type': 'Improvement',
            'Priority': 'Low',
            'Tags': 'Validation',
            'Estimate': 1.5,
            'Assignee': 'Robert King',
            'AssigneeName': 'Robert',
            'RankId': 1
        },
        {
            'Id': 3,
            'Status': 'Close',
            'Summary': 'Login page validation',
            'Type': 'Story',
            'Priority': 'Release Breaker',
            'Tags': 'Validation,Fix',
            'Estimate': 2.5,
            'Assignee': 'Janet Leverling',
            'AssigneeName': 'Janet',
            'RankId': 2
        },
        {
            'Id': 4,
            'Status': 'InProgress',
            'Summary': 'Fix the issues reported in Safari browser.',
            'Type': 'Bug',
            'Priority': 'Release Breaker',
            'Tags': 'Fix,Safari',
            'Estimate': 1.5,
            'Assignee': 'Nancy Davloio',
            'AssigneeName': 'Nancy',
            'RankId': 2
        },
        {
            'Id': 5,
            'Status': 'Close',
            'Summary': 'Test the application in the IE browser.',
            'Type': 'Story',
            'Priority': 'Low',
            'Tags': 'Testing,IE',
            'Estimate': 5.5,
            'Assignee': 'Janet Leverling',
            'AssigneeName': 'Janet',
            'RankId': 3
        }];
        const model: KanbanModel = {
            dataSource: kanbanData,
            keyField: 'Status',
            columns: [
                { headerText: 'Backlog', keyField: 'Open' },
                { headerText: 'In Progress', keyField: 'InProgress' },
                { headerText: 'Done', keyField: 'Close' }
            ],
            externalDropId: ['#Kanban2'],
            cardSettings: {
                showHeader: true,
                contentField: 'RankId',
                headerField: 'Id',
                selectionType: 'Multiple'
            },

        };
        kanbanObj = util.createKanban(model, kanbanData, done, createElement('div', { id: 'Kanban1' }));
    });

    afterAll(() => {
        util.destroy(kanbanObj);
    });
    it('- Dragging the card from the second column (to drop on empty column) - ', (done: Function) => {
        setTimeout(() => {
            const dragElement = (kanbanObj.element.querySelectorAll('.e-card[data-id="4"]') as NodeListOf<Element>).item(0) as HTMLElement;
            util.triggerMouseEvent(dragElement, 'mousedown');
            util.triggerMouseEvent(dragElement, 'mousemove', 20, 80);
            expect(dragElement.closest('.e-content-cells').classList.contains('e-dragged-column')).toBe(true);
            done();
        }, 1000);
    });

    it(' - Dropping the dragged card in the empty column - ', (done: Function) => {
        setTimeout(() => {
            const element: Element = kanbanObj.element.querySelectorAll('.e-empty-card').item(0);
            util.triggerMouseEvent(element, 'mousemove', 20, 70);
            util.triggerMouseEvent(element, 'mouseup', 20, 70);
            const droppedElem: HTMLElement = (kanbanObj.element.querySelectorAll('.e-card[data-id="4"]') as NodeListOf<Element>).item(0) as HTMLElement;
            expect(droppedElem.parentElement.parentElement.getAttribute('data-key')).toEqual('Open');
            done();
        }, 1000);
    });
});
describe('925005 - Unable to Drop a Card at the Top of Another Column When Swimlane Enabled.', () => {
    let kanbanObj: Kanban;
    beforeAll((done: DoneFn) => {
        let kanbanData: Record<string, any>[] = [
            {
                'Id': 1,
                'Status': 'Open',
                'Summary': 'Analyze the new requirements gathered from the customer.',
                'Type': 'Story',
                'Priority': 'Low',
                'Tags': 'Analyze,Customer',
                'Estimate': 3.5,
                'Assignee': 'Nancy Davloio',
                'RankId': 1
            },
            {
                'Id': 2,
                'Status': 'InProgress',
                'Summary': 'Improve application performance',
                'Type': 'Improvement',
                'Priority': 'Normal',
                'Tags': 'Improvement',
                'Estimate': 6,
                'Assignee': 'Andrew Fuller',
                'RankId': 1
            },
            {
                'Id': 3,
                'Status': 'Open',
                'Summary': 'Arrange a web meeting with the customer to get new requirements.',
                'Type': 'Others',
                'Priority': 'Critical',
                'Tags': 'Meeting',
                'Estimate': 5.5,
                'Assignee': 'Janet Leverling',
                'RankId': 2
            },
            {
                'Id': 4,
                'Status': 'InProgress',
                'Summary': 'Fix the issues reported in the IE browser.',
                'Type': 'Bug',
                'Priority': 'Release Breaker',
                'Tags': 'IE',
                'Estimate': 2.5,
                'Assignee': 'Janet Leverling',
                'RankId': 2
            },
            {
                'Id': 5,
                'Status': 'Testing',
                'Summary': 'Fix the issues reported by the customer.',
                'Type': 'Bug',
                'Priority': 'Low',
                'Tags': 'Customer',
                'Estimate': '3.5',
                'Assignee': 'Steven walker',
                'RankId': 1
            },
            {
                'Id': 6,
                'Status': 'Close',
                'Summary': 'Arrange a web meeting with the customer to get the login page requirements.',
                'Type': 'Others',
                'Priority': 'Low',
                'Tags': 'Meeting',
                'Estimate': 2,
                'Assignee': 'Michael Suyama',
                'RankId': 1
            },
            {
                'Id': 7,
                'Status': 'Validate',
                'Summary': 'Validate new requirements',
                'Type': 'Improvement',
                'Priority': 'Low',
                'Tags': 'Validation',
                'Estimate': 1.5,
                'Assignee': 'Robert King',
                'RankId': 1
            },
            {
                'Id': 8,
                'Status': 'Close',
                'Summary': 'Login page validation',
                'Type': 'Story',
                'Priority': 'Release Breaker',
                'Tags': 'Validation,Fix',
                'Estimate': 2.5,
                'Assignee': 'Laura Callahan',
                'RankId': 2
            },
            {
                'Id': 9,
                'Status': 'Testing',
                'Summary': 'Fix the issues reported in Safari browser.',
                'Type': 'Bug',
                'Priority': 'Release Breaker',
                'Tags': 'Fix,Safari',
                'Estimate': 1.5,
                'Assignee': 'Nancy Davloio',
                'RankId': 2
            },
            {
                'Id': 10,
                'Status': 'Close',
                'Summary': 'Test the application in the IE browser.',
                'Type': 'Story',
                'Priority': 'Low',
                'Tags': 'Testing,IE',
                'Estimate': 5.5,
                'Assignee': 'Margaret hamilt',
                'RankId': 3
            },
            {
                'Id': 11,
                'Status': 'Validate',
                'Summary': 'Validate the issues reported by the customer.',
                'Type': 'Story',
                'Priority': 'High',
                'Tags': 'Validation,Fix',
                'Estimate': 1,
                'Assignee': 'Steven walker',
                'RankId': 1
            },
            {
                'Id': 12,
                'Status': 'Testing',
                'Summary': 'Check Login page validation.',
                'Type': 'Story',
                'Priority': 'Release Breaker',
                'Tags': 'Testing',
                'Estimate': 0.5,
                'Assignee': 'Michael Suyama',
                'RankId': 3
            },
            {
                'Id': 13,
                'Status': 'Open',
                'Summary': 'API improvements.',
                'Type': 'Improvement',
                'Priority': 'High',
                'Tags': 'Grid,API',
                'Estimate': 3.5,
                'Assignee': 'Robert King',
                'RankId': 3
            },
            {
                'Id': 14,
                'Status': 'InProgress',
                'Summary': 'Add responsive support to application',
                'Type': 'Epic',
                'Priority': 'Critical',
                'Tags': 'Responsive',
                'Estimate': 6,
                'Assignee': 'Laura Callahan',
                'RankId': 3
            },
            {
                'Id': 15,
                'Status': 'Open',
                'Summary': 'Show the retrieved data from the server in grid control.',
                'Type': 'Story',
                'Priority': 'High',
                'Tags': 'Database,SQL',
                'Estimate': 5.5,
                'Assignee': 'Margaret hamilt',
                'RankId': 4
            },
            {
                'Id': 16,
                'Status': 'InProgress',
                'Summary': 'Fix cannot open user’s default database SQL error.',
                'Priority': 'Critical',
                'Type': 'Bug',
                'Tags': 'Database,Sql2008',
                'Estimate': 2.5,
                'Assignee': 'Janet Leverling',
                'RankId': 4
            },
            {
                'Id': 17,
                'Status': 'Testing',
                'Summary': 'Fix the issues reported in data binding.',
                'Type': 'Story',
                'Priority': 'Normal',
                'Tags': 'Databinding',
                'Estimate': '3.5',
                'Assignee': 'Janet Leverling',
                'RankId': 4
            },
            {
                'Id': 18,
                'Status': 'Close',
                'Summary': 'Analyze SQL server 2008 connection.',
                'Type': 'Story',
                'Priority': 'Release Breaker',
                'Tags': 'Grid,Sql',
                'Estimate': 2,
                'Assignee': 'Andrew Fuller',
                'RankId': 4
            },
            {
                'Id': 19,
                'Status': 'Validate',
                'Summary': 'Validate databinding issues.',
                'Type': 'Story',
                'Priority': 'Low',
                'Tags': 'Validation',
                'Estimate': 1.5,
                'Assignee': 'Margaret hamilt',
                'RankId': 1
            },
            {
                'Id': 20,
                'Status': 'Close',
                'Summary': 'Analyze grid control.',
                'Type': 'Story',
                'Priority': 'High',
                'Tags': 'Analyze',
                'Estimate': 2.5,
                'Assignee': 'Margaret hamilt',
                'RankId': 5
            },
            {
                'Id': 21,
                'Status': 'Close',
                'Summary': 'Stored procedure for initial data binding of the grid.',
                'Type': 'Others',
                'Priority': 'Release Breaker',
                'Tags': 'Databinding',
                'Estimate': 1.5,
                'Assignee': 'Steven walker',
                'RankId': 6
            },
            {
                'Id': 22,
                'Status': 'Close',
                'Summary': 'Analyze stored procedures.',
                'Type': 'Story',
                'Priority': 'Release Breaker',
                'Tags': 'Procedures',
                'Estimate': 5.5,
                'Assignee': 'Janet Leverling',
                'RankId': 7
            },
            {
                'Id': 23,
                'Status': 'Validate',
                'Summary': 'Validate editing issues.',
                'Type': 'Story',
                'Priority': 'Critical',
                'Tags': 'Editing',
                'Estimate': 1,
                'Assignee': 'Nancy Davloio',
                'RankId': 1
            },
            {
                'Id': 24,
                'Status': 'Testing',
                'Summary': 'Test editing functionality.',
                'Type': 'Story',
                'Priority': 'Normal',
                'Tags': 'Editing,Test',
                'Estimate': 0.5,
                'Assignee': 'Nancy Davloio',
                'RankId': 5
            },
            {
                'Id': 25,
                'Status': 'Open',
                'Summary': 'Enhance editing functionality.',
                'Type': 'Improvement',
                'Priority': 'Low',
                'Tags': 'Editing',
                'Estimate': 3.5,
                'Assignee': 'Andrew Fuller',
                'RankId': 5
            }
        ];
        const model: KanbanModel = {
            dataSource: kanbanData,
            keyField: 'Status',
            columns: [
                { headerText: 'Backlog', keyField: 'Open' },
                { headerText: 'In Progress', keyField: 'InProgress' },
                { headerText: 'Testing', keyField: 'Testing' },
                { headerText: 'Done', keyField: 'Close' }
            ],
            cardSettings: {
                contentField: 'Summary',
                headerField: 'Id'
            },
            swimlaneSettings: {
                keyField: 'Assignee'
            }
        };
        kanbanObj = util.createKanban(model, kanbanData, done, createElement('div', { id: 'Kanban1' }));
    });

    afterAll(() => {
        util.destroy(kanbanObj);
    });
    it('- Unable to Drop a Card at the Top of Another Column When Swimlane Enabled. ', (done: Function) => {
        setTimeout(() => {
            window.scrollTo(0, document.body.scrollHeight);
            const dragElement = (kanbanObj.element.querySelectorAll('.e-card[data-id="24"]') as NodeListOf<Element>).item(0) as HTMLElement;
            util.triggerMouseEvent(dragElement, 'mousedown');
            util.triggerMouseEvent(dragElement, 'mousemove', 313, 58);
            expect(dragElement.closest('.e-content-cells').classList.contains('e-dragged-column')).toBe(true);
            done();
        }, 1000);
    });
    it(' - Unable to Drop a Card at the Top of Another Column When Swimlane Enabled. ', function (done) {
        setTimeout(function () {
            const element: Element = kanbanObj.element.querySelectorAll('.e-card[data-id="9"]').item(0);
            util.triggerMouseEvent(element, 'mousemove', 312, 57);
            util.triggerMouseEvent(element, 'mouseup', 312, 57);
            const droppedElem: HTMLElement = (kanbanObj.element.querySelectorAll('.e-card[data-id="24"]') as NodeListOf<Element>).item(0) as HTMLElement;
            expect(droppedElem.parentElement.childNodes[0]).toEqual(droppedElem);
            done();
        }, 1000);
    });
});
describe('840166 - Kanban should allow the whole station as dropdown', () => {
    let kanbanObj: Kanban;
    beforeAll((done: DoneFn) => {
        const model: KanbanModel = {
            keyField: 'Status',
            columns: [
                { headerText: 'Backlog', keyField: 'Open' },
                { headerText: 'In Progress', keyField: 'InProgress' },
                { headerText: 'Review', keyField: 'Review' },
                { headerText: 'Testing', keyField: 'Testing' },
                { headerText: 'Done', keyField: 'Close' }
            ],
            cardSettings: {
                contentField: 'Summary',
                headerField: 'Id'
            }
        };
        kanbanObj = util.createKanban(model, kanbanData, done);
    });

    afterAll(() => {
        util.destroy(kanbanObj);
    });
    it('- Dragging the card from the second column (to drop on first column) - ', (done: Function) => {
        setTimeout(() => {
            const dragElement = (kanbanObj.element.querySelectorAll('.e-card[data-id="74"]') as NodeListOf<Element>).item(0) as HTMLElement;
            util.triggerMouseEvent(dragElement, 'mousedown');
            util.triggerMouseEvent(dragElement, 'mousemove', 20, 80);
            expect(dragElement.closest('.e-content-cells').classList.contains('e-dragged-column')).toBe(true);
            done();
        }, 1000);
    });

    it(' - Dropping the dragged card in the another column  at the place of column down- ', (done: Function) => {
        setTimeout(() => {
            const element: Element = kanbanObj.element.querySelectorAll('.e-kanban-border').item(2);
            util.triggerMouseEvent(element, 'mousemove', 50, 400);
            util.triggerMouseEvent(element, 'mouseup', 50, 400);
            const droppedElem: HTMLElement = (kanbanObj.element.querySelectorAll('.e-card[data-id="74"]') as NodeListOf<Element>).item(0) as HTMLElement;
            expect(droppedElem.parentElement.parentElement.getAttribute('data-key')).toEqual('Review');
            done();
        }, 1000);
    });
});