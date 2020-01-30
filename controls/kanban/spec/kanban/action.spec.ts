/**
 * action spec
 */
import { Kanban, KanbanModel, CardClickEventArgs, ActionEventArgs, ColumnsModel } from '../../src/kanban/index';
import { L10n } from '@syncfusion/ej2-base';
import { kanbanData } from './common/kanban-data.spec';
import { profile, inMB, getMemoryProfile } from './common/common.spec';
import * as util from './common/util.spec';

Kanban.Inject();

describe('Action module', () => {
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

    describe('Card click and double click actions testing', () => {
        let kanbanObj: Kanban;
        let isCardClick: boolean = false;
        let cardDoubleClickFunction: () => void = jasmine.createSpy('cardDoubleClick');
        beforeAll((done: DoneFn) => {
            let model: KanbanModel = {
                cardClick: (args: CardClickEventArgs) => args.cancel = !isCardClick,
                cardDoubleClick: cardDoubleClickFunction
            };
            kanbanObj = util.createKanban(model, kanbanData, done);
        });

        beforeEach((done: DoneFn) => done());

        afterAll(() => {
            util.destroy(kanbanObj);
        });

        it('card click action event args as false', () => {
            let card: Element = kanbanObj.element.querySelector('.e-card');
            expect(card.classList.contains('e-selection')).toEqual(false);
            util.triggerMouseEvent(card, 'click');
            expect(card.classList.contains('e-selection')).toEqual(false);
        });

        it('card click action event args as true', () => {
            isCardClick = true;
            let card: Element = kanbanObj.element.querySelector('.e-card');
            expect(card.classList.contains('e-selection')).toEqual(false);
            util.triggerMouseEvent(card, 'click');
            expect(card.classList.contains('e-selection')).toEqual(true);
        });

        it('card double click action', () => {
            let card: Element = kanbanObj.element.querySelector('.e-card[data-id="2"]');
            expect(card.classList.contains('e-selection')).toEqual(false);
            util.triggerMouseEvent(card, 'dblclick');
            expect(card.classList.contains('e-selection')).toEqual(false);
            expect(cardDoubleClickFunction).toHaveBeenCalled();
        });
    });

    describe('row expand and collapse testing', () => {
        let kanbanObj: Kanban;
        let actionCompleteFunction: () => void = jasmine.createSpy('actionComplete');
        beforeAll((done: DoneFn) => {
            let model: KanbanModel = {
                swimlaneSettings: {
                    keyField: 'Assignee'
                },
                actionComplete: actionCompleteFunction
            };
            kanbanObj = util.createKanban(model, kanbanData, done);
        });

        beforeEach((done: DoneFn) => done());

        afterAll(() => {
            util.destroy(kanbanObj);
        });

        it('action begin testing with cancel as true', () => {
            kanbanObj.actionBegin = (args: ActionEventArgs) => args.cancel = true;
            let swimlaneRow: Element = kanbanObj.element.querySelector('.e-content-row.e-swimlane-row');
            expect(swimlaneRow.classList.contains('e-collapsed')).toEqual(false);
            expect(swimlaneRow.nextElementSibling.classList.contains('e-collapsed')).toEqual(false);
            util.triggerMouseEvent(swimlaneRow.querySelector('.e-swimlane-row-expand'), 'click');
            expect(swimlaneRow.classList.contains('e-collapsed')).toEqual(false);
            expect(swimlaneRow.nextElementSibling.classList.contains('e-collapsed')).toEqual(false);
        });

        it('action begin testing with cancel as false and row collapsed', () => {
            kanbanObj.actionBegin = (args: ActionEventArgs) => args.cancel = false;
            let swimlaneRow: Element = kanbanObj.element.querySelector('.e-content-row.e-swimlane-row');
            expect(swimlaneRow.classList.contains('e-collapsed')).toEqual(false);
            expect(swimlaneRow.nextElementSibling.classList.contains('e-collapsed')).toEqual(false);
            let rowIcon: Element = swimlaneRow.querySelector('.e-swimlane-row-expand');
            expect(rowIcon).toBeTruthy();
            expect(swimlaneRow.querySelector('.e-swimlane-row-collapse')).not.toBeTruthy();
            util.triggerMouseEvent(rowIcon, 'click');
            expect(swimlaneRow.classList.contains('e-collapsed')).toEqual(true);
            expect(swimlaneRow.nextElementSibling.classList.contains('e-collapsed')).toEqual(true);
        });

        it('action begin testing with cancel as false and row expanded', () => {
            let swimlaneRow: Element = kanbanObj.element.querySelector('.e-content-row.e-swimlane-row');
            expect(swimlaneRow.classList.contains('e-collapsed')).toEqual(true);
            expect(swimlaneRow.nextElementSibling.classList.contains('e-collapsed')).toEqual(true);
            let rowIcon: Element = swimlaneRow.querySelector('.e-swimlane-row-collapse');
            expect(rowIcon).toBeTruthy();
            expect(swimlaneRow.querySelector('.e-swimlane-row-expand')).not.toBeTruthy();
            util.triggerMouseEvent(rowIcon, 'click');
            expect(swimlaneRow.classList.contains('e-collapsed')).toEqual(false);
            expect(swimlaneRow.nextElementSibling.classList.contains('e-collapsed')).toEqual(false);
            expect(actionCompleteFunction).toHaveBeenCalled();
        });
    });

    describe('column expand and collapse testing without swimlane', () => {
        let kanbanObj: Kanban;
        let dataSource: Object[] = kanbanData.slice(0, 10);
        let actionCompleteFunction: () => void = jasmine.createSpy('actionComplete');
        beforeAll((done: DoneFn) => {
            let model: KanbanModel = {
                columns: [
                    { headerText: 'Backlog', keyField: 'Open', allowToggle: true },
                    { headerText: 'In Progress', keyField: 'InProgress', allowToggle: true },
                    { headerText: 'Testing', keyField: 'Testing', allowToggle: true },
                    { headerText: 'Done', keyField: 'Close', allowToggle: true }
                ],
                actionComplete: actionCompleteFunction
            };
            kanbanObj = util.createKanban(model, dataSource, done);
        });

        beforeEach((done: DoneFn) => done());

        afterAll(() => {
            util.destroy(kanbanObj);
        });

        it('action begin testing with cancel as true', () => {
            kanbanObj.actionBegin = (args: ActionEventArgs) => args.cancel = true;
            let columnHeader: HTMLElement = kanbanObj.element.querySelector('.e-header-cells') as HTMLElement;
            expect(columnHeader.classList.contains('e-toggle-header')).toEqual(true);
            expect(columnHeader.classList.contains('e-collapsed')).toEqual(false);
            expect(columnHeader.children[1].classList.contains('e-column-expand')).toEqual(true);
            expect(columnHeader.children[1].classList.contains('e-column-collapse')).toEqual(false);
            util.triggerMouseEvent(columnHeader.children[1], 'click');
            expect(columnHeader.classList.contains('e-toggle-header')).toEqual(true);
            expect(columnHeader.classList.contains('e-collapsed')).toEqual(false);
            expect(columnHeader.children[1].classList.contains('e-column-expand')).toEqual(true);
            expect(columnHeader.children[1].classList.contains('e-column-collapse')).toEqual(false);
        });

        it('action begin testing with cancel as false and column collapsed', () => {
            kanbanObj.actionBegin = (args: ActionEventArgs) => args.cancel = false;
            let columnHeader: HTMLElement = kanbanObj.element.querySelector('.e-header-cells') as HTMLElement;
            expect(columnHeader.classList.contains('e-toggle-header')).toEqual(true);
            expect(columnHeader.classList.contains('e-collapsed')).toEqual(false);
            expect(columnHeader.children[1].classList.contains('e-column-expand')).toEqual(true);
            expect(columnHeader.children[1].classList.contains('e-column-collapse')).toEqual(false);
            util.triggerMouseEvent(columnHeader.children[1], 'click');
            expect(columnHeader.classList.contains('e-toggle-header')).toEqual(true);
            expect(columnHeader.classList.contains('e-collapsed')).toEqual(true);
            expect(columnHeader.children[1].classList.contains('e-column-expand')).toEqual(false);
            expect(columnHeader.children[1].classList.contains('e-column-collapse')).toEqual(true);
        });

        it('action begin testing with cancel as false and column expanded', () => {
            let columnHeader: HTMLElement = kanbanObj.element.querySelector('.e-header-cells') as HTMLElement;
            expect(columnHeader.classList.contains('e-toggle-header')).toEqual(true);
            expect(columnHeader.classList.contains('e-collapsed')).toEqual(true);
            expect(columnHeader.children[1].classList.contains('e-column-expand')).toEqual(false);
            expect(columnHeader.children[1].classList.contains('e-column-collapse')).toEqual(true);
            util.triggerMouseEvent(columnHeader.children[1], 'click');
            expect(columnHeader.classList.contains('e-toggle-header')).toEqual(true);
            expect(columnHeader.classList.contains('e-collapsed')).toEqual(false);
            expect(columnHeader.children[1].classList.contains('e-column-expand')).toEqual(true);
            expect(columnHeader.children[1].classList.contains('e-column-collapse')).toEqual(false);
            expect(actionCompleteFunction).toHaveBeenCalled();
        });

        it('all columns collapsed together', () => {
            let columnKeys: string[] = ['Open', 'InProgress', 'Testing', 'Close'];
            let columnHeaders: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-header-cells');
            columnHeaders.forEach((columnHeader: HTMLElement, index: number) => {
                expect(columnHeader.classList.contains('e-toggle-header')).toEqual(true);
                expect(columnHeader.classList.contains('e-collapsed')).toEqual(false);
                expect(columnHeader.children[1].classList.contains('e-column-expand')).toEqual(true);
                expect(columnHeader.children[1].classList.contains('e-column-collapse')).toEqual(false);
                expect(columnHeader.getAttribute('data-key')).toEqual(columnKeys[index]);
                util.triggerMouseEvent(columnHeader.children[1], 'click');
                expect(columnHeader.classList.contains('e-toggle-header')).toEqual(true);
                expect(columnHeader.classList.contains('e-collapsed')).toEqual(true);
                expect(columnHeader.children[1].classList.contains('e-column-expand')).toEqual(false);
                expect(columnHeader.children[1].classList.contains('e-column-collapse')).toEqual(true);
                expect(actionCompleteFunction).toHaveBeenCalled();
            });
        });
    });

    describe('Allow Toggle Column', () => {
        let kanbanObj: Kanban;
        beforeAll((done: DoneFn) => {
            let model: KanbanModel = {
                columns: [
                    { headerText: 'Backlog', keyField: 'Open', allowToggle: false, isExpanded: true },
                    { headerText: 'In Progress', keyField: 'InProgress', allowToggle: true, isExpanded: false },
                    { headerText: 'Testing', keyField: 'Testing', allowToggle: false, isExpanded: true },
                    { headerText: 'Done', keyField: 'Close', allowToggle: true, isExpanded: true }
                ]
            };
            kanbanObj = util.createKanban(model, kanbanData, done);
        });

        afterAll(() => {
            util.destroy(kanbanObj);
        });

        it('Particular column collapsed testing', () => {
            expect(kanbanObj.columns[0].allowToggle).toBeFalsy();
            expect(kanbanObj.columns[1].allowToggle).toBeTruthy();
            expect(kanbanObj.columns[2].allowToggle).toBeFalsy();
            expect(kanbanObj.columns[3].allowToggle).toBeTruthy();
        });

        it('Particular column expanded state testing', () => {
            expect(kanbanObj.columns[0].isExpanded).toBeTruthy();
            expect(kanbanObj.columns[1].isExpanded).toBeFalsy();
            expect(kanbanObj.columns[2].isExpanded).toBeTruthy();
            expect(kanbanObj.columns[3].isExpanded).toBeTruthy();
        });

        it('Particular column icon rendering testing', () => {
            let headerCells: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-header-cells');
            expect(headerCells[0].lastElementChild.classList.contains('e-column-expand')).toBe(false);
            expect(headerCells[1].lastElementChild.classList.contains('e-column-collapse')).toBe(true);
            expect(headerCells[2].lastElementChild.classList.contains('e-column-expand')).toBe(false);
            expect(headerCells[3].lastElementChild.classList.contains('e-column-expand')).toBe(true);
        });
        it('Checked collapesd class added properly on header cell testing', () => {
            let headerCells: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-header-cells');
            expect(headerCells[0].classList.contains('e-collapsed')).toBe(false);
            expect(headerCells[1].classList.contains('e-collapsed')).toBe(true);
            expect(headerCells[2].classList.contains('e-collapsed')).toBe(false);
            expect(headerCells[3].classList.contains('e-collapsed')).toBe(false);
        });

        it('Checked toggle header class added properly on header cell testing', () => {
            let headerCells: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-header-cells');
            expect(headerCells[0].classList.contains('e-toggle-header')).toBe(false);
            expect(headerCells[1].classList.contains('e-toggle-header')).toBe(true);
            expect(headerCells[2].classList.contains('e-toggle-header')).toBe(false);
            expect(headerCells[3].classList.contains('e-toggle-header')).toBe(true);
        });

        it('Checked collapsed class added on content cell testing', () => {
            let headerCells: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-header-cells');
            expect(headerCells[0].classList.contains('e-collapsed')).toBe(false);
            expect(headerCells[1].classList.contains('e-collapsed')).toBe(true);
            expect(headerCells[2].classList.contains('e-collapsed')).toBe(false);
            expect(headerCells[3].classList.contains('e-collapsed')).toBe(false);
        });

        it('Single column collapse testing', () => {
            let element: Element = kanbanObj.element.querySelectorAll('.e-header-cells')[3].lastElementChild;
            (<HTMLElement>element).click();
            expect(element.classList.contains('e-column-collapse')).toBe(true);
            expect(kanbanObj.element.querySelectorAll('.e-content-cells')[3].classList.contains('e-collapsed')).toBe(true);
        });

        it('Single column expand testing', () => {
            let element: Element = kanbanObj.element.querySelectorAll('.e-header-cells')[3].lastElementChild;
            (<HTMLElement>element).click();
            expect(element.classList.contains('e-column-expand')).toBe(true);
            expect(kanbanObj.element.querySelectorAll('.e-content-cells')[3].classList.contains('e-collapsed')).toBe(false);
        });

        it('Maintain single collapsed state testing - drag the card', () => {
            let headerCell: Element = kanbanObj.element.querySelectorAll('.e-header-cells')[1].lastElementChild;
            expect(headerCell.classList.contains('e-column-collapse')).toBe(true);
            expect(kanbanObj.element.querySelectorAll('.e-content-cells')[1].classList.contains('e-collapsed')).toBe(true);
            let draggedElement: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="5"]').item(0) as HTMLElement;
            util.triggerMouseEvent(draggedElement, 'mousedown');
            util.triggerMouseEvent(draggedElement, 'mousemove', 508, 110);
            expect(draggedElement.classList.contains('e-kanban-dragged-card')).toBeTruthy();
            expect(draggedElement.nextElementSibling.classList.contains('e-target-dragged-clone')).toBeTruthy();
            expect(kanbanObj.element.querySelectorAll('.e-target-dragged-clone').length).toBe(1);
        });

        it('Maintain single collapsed state testing - card moved to another place', () => {
            let droppedElement: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="8"]').item(0) as HTMLElement;
            util.triggerMouseEvent(droppedElement, 'mousemove', 650, 200);
            expect(droppedElement.nextElementSibling.classList.contains('e-target-dropped-clone')).toEqual(true);
            util.triggerMouseEvent(droppedElement, 'mouseup', 650, 200);
        });

        it('Maintain single collapsed state testing - after drag stop', () => {
            expect(kanbanObj.element.querySelectorAll('.e-target-dragged-clone').length).toBe(0);
            expect(kanbanObj.element.querySelectorAll('.e-target-dropped-clone').length).toBe(0);
            expect(kanbanObj.element.querySelectorAll('.e-card.duplicate').length).toBe(0);
            expect(kanbanObj.element.querySelectorAll('.e-kanban-dragged-card').length).toBe(0);
            let headerCell: Element = kanbanObj.element.querySelectorAll('.e-header-cells')[1].lastElementChild;
            expect(headerCell.classList.contains('e-column-collapse')).toBe(true);
            expect(kanbanObj.element.querySelectorAll('.e-content-cells')[1].classList.contains('e-collapsed')).toBe(true);
        });

        it('Single Collapsed column with drag and drop behavior testing - check the column expand when cursor move', () => {
            let draggedElement: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="1"]').item(0) as HTMLElement;
            util.triggerMouseEvent(draggedElement, 'mousedown');
            util.triggerMouseEvent(draggedElement, 'mousemove', 280, 200);
            let element: Element = kanbanObj.element.querySelectorAll('.e-content-row:not(.e-swimlane-row) .e-content-cells').item(1);
            util.triggerMouseEvent(element, 'mousemove', 290, 200);
        });
        it('Single Collapsed column with drag and drop behavior testing - drop the card on collapsed column', () => {
            let droppedElement: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="14"]').item(0) as HTMLElement;
            util.triggerMouseEvent(droppedElement, 'mousemove', 290, 250);
            util.triggerMouseEvent(droppedElement, 'mouseup', 290, 250);
        });
    });

    describe('All Columns allowed to expand/collapse behavior', () => {
        let kanbanObj: Kanban;
        beforeAll((done: DoneFn) => {
            let model: KanbanModel = {
                columns: [
                    { headerText: 'Backlog', keyField: 'Open', allowToggle: true, isExpanded: true },
                    { headerText: 'In Progress', keyField: 'InProgress', allowToggle: true, isExpanded: true },
                    { headerText: 'Testing', keyField: 'Testing', allowToggle: true, isExpanded: true },
                    { headerText: 'Done', keyField: 'Close', allowToggle: true, isExpanded: true }
                ]
            };
            kanbanObj = util.createKanban(model, kanbanData, done);
        });

        afterAll(() => {
            util.destroy(kanbanObj);
        });
        it('Allow Toggle Column testing', () => {
            for (let i: number = 0; i < kanbanObj.columns.length; i++) {
                let element: Element = kanbanObj.element.querySelectorAll('.e-header-cells')[i].lastElementChild;
                expect(kanbanObj.columns[i].allowToggle).toBe(element.classList.contains('e-column-expand'));
            }
        });
        it('Columns collapsed testing', () => {
            for (let i: number = 0; i < kanbanObj.columns.length; i++) {
                expect(kanbanObj.columns[i].allowToggle).toBeTruthy();
            }
        });
        it('Columns expanded state testing', () => {
            kanbanObj.columns.forEach((column: ColumnsModel) => expect(column.isExpanded).toBeTruthy());
        });

        it('Columns icons rendering testing', () => {
            for (let i: number = 0; i < kanbanObj.columns.length; i++) {
                let headerCell: Element = kanbanObj.element.querySelectorAll('.e-header-cells')[i].lastElementChild;
                expect(headerCell.classList.contains('e-column-expand')).toBe(true);
            }
        });
        it('Checked collapesd class added properly on header cell testing', () => {
            for (let i: number = 0; i < kanbanObj.columns.length; i++) {
                expect(kanbanObj.element.querySelectorAll('.e-header-cells')[i].classList.contains('e-collapsed')).toBe(false);
            }
        });
        it('Checked toggle header class added properly on header cell testing', () => {
            for (let i: number = 0; i < kanbanObj.columns.length; i++) {
                expect(kanbanObj.element.querySelectorAll('.e-header-cells')[i].classList.contains('e-toggle-header')).toBe(true);
            }
        });
        it('Checked collapsed class added on content cell testing', () => {
            for (let i: number = 0; i < kanbanObj.columns.length; i++) {
                expect(kanbanObj.element.querySelectorAll('.e-content-cells')[i].classList.contains('e-collapsed')).toBe(false);
            }
        });
        it('First column collapse testing', () => {
            let element: Element = kanbanObj.element.querySelectorAll('.e-header-cells')[0].lastElementChild;
            (<HTMLElement>element).click();
            expect(element.classList.contains('e-column-collapse')).toBe(true);
            expect(kanbanObj.element.querySelectorAll('.e-content-cells')[0].classList.contains('e-collapsed')).toBe(true);
        });
        it('Second column collapse testing', () => {
            let element: Element = kanbanObj.element.querySelectorAll('.e-header-cells')[1].lastElementChild;
            (<HTMLElement>element).click();
            expect(element.classList.contains('e-column-collapse')).toBe(true);
            expect(kanbanObj.element.querySelectorAll('.e-content-cells')[1].classList.contains('e-collapsed')).toBe(true);
        });
        it('Third column collapse testing', () => {
            let element: Element = kanbanObj.element.querySelectorAll('.e-header-cells')[2].lastElementChild;
            (<HTMLElement>element).click();
            expect(element.classList.contains('e-column-collapse')).toBe(true);
            expect(kanbanObj.element.querySelectorAll('.e-content-cells')[2].classList.contains('e-collapsed')).toBe(true);
        });
        it('Forth column collapse testing', () => {
            let element: Element = kanbanObj.element.querySelectorAll('.e-header-cells')[3].lastElementChild;
            (<HTMLElement>element).click();
            expect(element.classList.contains('e-column-collapse')).toBe(true);
            expect(kanbanObj.element.querySelectorAll('.e-content-cells')[3].classList.contains('e-collapsed')).toBe(true);
        });
        it('Next column expanded when all columns collapsed state testing', () => {
            let headerCell: Element = kanbanObj.element.querySelectorAll('.e-header-cells')[0].lastElementChild;
            expect(headerCell.classList.contains('e-column-expand')).toBe(true);
            expect(kanbanObj.element.querySelectorAll('.e-content-cells')[0].classList.contains('e-collapsed')).toBe(false);
        });
        it('Next column testing - first column collapsed', () => {
            let element: Element = kanbanObj.element.querySelectorAll('.e-header-cells')[0].lastElementChild;
            (<HTMLElement>element).click();
            expect(element.classList.contains('e-column-collapse')).toBe(true);
            expect(kanbanObj.element.querySelectorAll('.e-content-cells')[0].classList.contains('e-collapsed')).toBe(true);
        });
        it('Next column testing - second column automatically expanded', () => {
            let headerCells: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-header-cells');
            expect(headerCells[1].lastElementChild.classList.contains('e-column-expand')).toBe(true);
            expect(kanbanObj.element.querySelectorAll('.e-content-cells')[1].classList.contains('e-collapsed')).toBe(false);
            expect(headerCells[0].lastElementChild.classList.contains('e-column-collapse')).toBe(true);
            expect(kanbanObj.element.querySelectorAll('.e-content-cells')[0].classList.contains('e-collapsed')).toBe(true);
            expect(headerCells[2].lastElementChild.classList.contains('e-column-collapse')).toBe(true);
            expect(kanbanObj.element.querySelectorAll('.e-content-cells')[2].classList.contains('e-collapsed')).toBe(true);
            expect(headerCells[3].lastElementChild.classList.contains('e-column-collapse')).toBe(true);
            expect(kanbanObj.element.querySelectorAll('.e-content-cells')[3].classList.contains('e-collapsed')).toBe(true);
        });

        it('Next column testing - second column collapsed', () => {
            let element: Element = kanbanObj.element.querySelectorAll('.e-header-cells')[1].lastElementChild;
            (<HTMLElement>element).click();
            expect(element.classList.contains('e-column-collapse')).toBe(true);
            expect(kanbanObj.element.querySelectorAll('.e-content-cells')[1].classList.contains('e-collapsed')).toBe(true);
        });
        it('Next column testing - third column automatically expanded', () => {
            let headerCell: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-header-cells');
            expect(headerCell[2].lastElementChild.classList.contains('e-column-expand')).toBe(true);
            expect(kanbanObj.element.querySelectorAll('.e-content-cells')[2].classList.contains('e-collapsed')).toBe(false);
            expect(headerCell[0].lastElementChild.classList.contains('e-column-collapse')).toBe(true);
            expect(kanbanObj.element.querySelectorAll('.e-content-cells')[0].classList.contains('e-collapsed')).toBe(true);
            expect(headerCell[1].lastElementChild.classList.contains('e-column-collapse')).toBe(true);
            expect(kanbanObj.element.querySelectorAll('.e-content-cells')[1].classList.contains('e-collapsed')).toBe(true);
            expect(headerCell[3].lastElementChild.classList.contains('e-column-collapse')).toBe(true);
            expect(kanbanObj.element.querySelectorAll('.e-content-cells')[3].classList.contains('e-collapsed')).toBe(true);
        });
        it('Next column testing - third column collapsed', () => {
            let element: Element = kanbanObj.element.querySelectorAll('.e-header-cells')[2].lastElementChild;
            (<HTMLElement>element).click();
            expect(element.classList.contains('e-column-collapse')).toBe(true);
            expect(kanbanObj.element.querySelectorAll('.e-content-cells')[2].classList.contains('e-collapsed')).toBe(true);
        });
        it('Next column testing - forth column automatically expanded', () => {
            let headerCell: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-header-cells');
            expect(headerCell[3].lastElementChild.classList.contains('e-column-expand')).toBe(true);
            expect(kanbanObj.element.querySelectorAll('.e-content-cells')[3].classList.contains('e-collapsed')).toBe(false);
            expect(headerCell[0].lastElementChild.classList.contains('e-column-collapse')).toBe(true);
            expect(kanbanObj.element.querySelectorAll('.e-content-cells')[0].classList.contains('e-collapsed')).toBe(true);
            expect(headerCell[1].lastElementChild.classList.contains('e-column-collapse')).toBe(true);
            expect(kanbanObj.element.querySelectorAll('.e-content-cells')[1].classList.contains('e-collapsed')).toBe(true);
            expect(headerCell[2].lastElementChild.classList.contains('e-column-collapse')).toBe(true);
            expect(kanbanObj.element.querySelectorAll('.e-content-cells')[2].classList.contains('e-collapsed')).toBe(true);
        });
    });
    describe('Allow Toggle Colum with swimlanes', () => {
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
                    keyField: 'Assignee'
                }
            };
            kanbanObj = util.createKanban(model, kanbanData, done);
        });

        afterAll(() => {
            util.destroy(kanbanObj);
        });
        it('Particular column collapsed testing', () => {
            expect(kanbanObj.columns[0].allowToggle).toBeFalsy();
            expect(kanbanObj.columns[1].allowToggle).toBeTruthy();
            expect(kanbanObj.columns[2].allowToggle).toBeFalsy();
            expect(kanbanObj.columns[3].allowToggle).toBeTruthy();
        });

        it('Particular column expanded state testing', () => {
            expect(kanbanObj.columns[0].isExpanded).toBeTruthy();
            expect(kanbanObj.columns[1].isExpanded).toBeFalsy();
            expect(kanbanObj.columns[2].isExpanded).toBeTruthy();
            expect(kanbanObj.columns[3].isExpanded).toBeTruthy();
        });
        it('Particular column icon rendering testing', () => {
            let headerCell: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-header-cells');
            expect(headerCell[0].lastElementChild.classList.contains('e-column-expand')).toBe(false);
            expect(headerCell[1].lastElementChild.classList.contains('e-column-collapse')).toBe(true);
            expect(headerCell[2].lastElementChild.classList.contains('e-column-expand')).toBe(false);
            expect(headerCell[3].lastElementChild.classList.contains('e-column-expand')).toBe(true);
        });

        it('Checked collapesd class added properly on header cell testing', () => {
            expect(kanbanObj.element.querySelectorAll('.e-header-cells')[0].classList.contains('e-collapsed')).toBe(false);
            expect(kanbanObj.element.querySelectorAll('.e-header-cells')[1].classList.contains('e-collapsed')).toBe(true);
            expect(kanbanObj.element.querySelectorAll('.e-header-cells')[2].classList.contains('e-collapsed')).toBe(false);
            expect(kanbanObj.element.querySelectorAll('.e-header-cells')[3].classList.contains('e-collapsed')).toBe(false);
        });
        it('Checked toggle header class added properly on header cell testing', () => {
            expect(kanbanObj.element.querySelectorAll('.e-header-cells')[0].classList.contains('e-toggle-header')).toBe(false);
            expect(kanbanObj.element.querySelectorAll('.e-header-cells')[1].classList.contains('e-toggle-header')).toBe(true);
            expect(kanbanObj.element.querySelectorAll('.e-header-cells')[2].classList.contains('e-toggle-header')).toBe(false);
            expect(kanbanObj.element.querySelectorAll('.e-header-cells')[3].classList.contains('e-toggle-header')).toBe(true);
        });
        it('Checked collapsed class added on content cell testing', () => {
            let element: NodeList = kanbanObj.element.querySelectorAll('.e-content-row:not(.e-swimlane-row) .e-content-cells');
            expect((<Element>element[0]).classList.contains('e-collapsed')).toBe(false);
            expect((<Element>element[1]).classList.contains('e-collapsed')).toBe(true);
            expect((<Element>element[2]).classList.contains('e-collapsed')).toBe(false);
            expect((<Element>element[3]).classList.contains('e-collapsed')).toBe(false);
            let ele: NodeList = util.getElement(kanbanObj, '.e-content-row:not(.e-swimlane-row) .e-content-cells[data-key="InProgress"]');
            for (let i: number = 0; i < ele.length; i++) {
                expect((<Element>ele[i]).classList.contains('e-collapsed')).toBe(true);
            }
        });
        it('Single column collapse testing', () => {
            let element: Element = kanbanObj.element.querySelectorAll('.e-header-cells')[3].lastElementChild;
            (<HTMLElement>element).click();
            expect(element.classList.contains('e-column-collapse')).toBe(true);
            let ele: NodeList = util.getElement(kanbanObj, '.e-content-row:not(.e-swimlane-row) .e-content-cells[data-key="Close"]');
            for (let i: number = 0; i < ele.length; i++) {
                expect((<Element>ele[i]).classList.contains('e-collapsed')).toBe(true);
            }
        });
        it('Single column expand testing', () => {
            let element: Element = kanbanObj.element.querySelectorAll('.e-header-cells')[3].lastElementChild;
            (<HTMLElement>element).click();
            expect(element.classList.contains('e-column-expand')).toBe(true);
            let ele: NodeList = util.getElement(kanbanObj, '.e-content-row:not(.e-swimlane-row) .e-content-cells[data-key="Close"]');
            for (let i: number = 0; i < ele.length; i++) {
                expect((<Element>ele[i]).classList.contains('e-collapsed')).toBe(false);
            }
        });
        it('Maintain single collapsed state testing - drag the card', () => {
            let headerCell: Element = kanbanObj.element.querySelectorAll('.e-header-cells')[1].lastElementChild;
            expect(headerCell.classList.contains('e-column-collapse')).toBe(true);
            let content: NodeList = util.getElement(kanbanObj, '.e-content-row:not(.e-swimlane-row) .e-content-cells');
            expect((content.item(1) as HTMLElement).classList.contains('e-collapsed')).toBe(true);
            let draggedElement: Element = kanbanObj.element.querySelectorAll('.e-card[data-id="45"]').item(0);
            util.triggerMouseEvent(draggedElement, 'mousedown');
            util.triggerMouseEvent(draggedElement, 'mousemove', 700, 210);
            expect(draggedElement.classList.contains('e-kanban-dragged-card')).toBeTruthy();
            expect(draggedElement.nextElementSibling.classList.contains('e-target-dragged-clone')).toBeTruthy();
            expect(kanbanObj.element.querySelectorAll('.e-target-dragged-clone').length).toBe(1);
        });

        it('Maintain single collapsed state testing - card moved to another place', () => {
            let droppedElement: Element = kanbanObj.element.querySelectorAll('.e-card[data-id="37"]').item(0);
            util.triggerMouseEvent(droppedElement, 'mousemove', 700, 210);
            expect(droppedElement.nextElementSibling.classList.contains('e-target-dropped-clone')).toEqual(true);
            util.triggerMouseEvent(droppedElement, 'mouseup', 700, 210);
        });
        it('Maintain single collapsed state testing - after drag stop', () => {
            expect(kanbanObj.element.querySelectorAll('.e-target-dragged-clone').length).toBe(0);
            expect(kanbanObj.element.querySelectorAll('.e-target-dropped-clone').length).toBe(0);
            expect(kanbanObj.element.querySelectorAll('.e-card.duplicate').length).toBe(0);
            expect(kanbanObj.element.querySelectorAll('.e-kanban-dragged-card').length).toBe(0);
            let element: Element = kanbanObj.element.querySelectorAll('.e-header-cells')[1].lastElementChild;
            expect(element.classList.contains('e-column-collapse')).toBe(true);
            let ele: NodeList = util.getElement(kanbanObj, '.e-content-row:not(.e-swimlane-row) .e-content-cells[data-key="InProgress"]');
            for (let i: number = 0; i < ele.length; i++) {
                expect((<Element>ele[i]).classList.contains('e-collapsed')).toBe(true);
            }
        });
        it('Single Collapsed column with drag and drop behavior testing - check the column expand when cursor move', () => {
            let draggedElement: Element = kanbanObj.element.querySelectorAll('.e-card[data-id="25"]').item(0);
            util.triggerMouseEvent(draggedElement, 'mousedown');
            util.triggerMouseEvent(draggedElement, 'mousemove', 280, 200);
            let element: Element = kanbanObj.element.querySelectorAll('.e-content-row:not(.e-swimlane-row) .e-content-cells').item(1);
            util.triggerMouseEvent(element, 'mousemove', 290, 200);
           });
        it('Single Collapsed column with drag and drop behavior testing - drop the card on collapsed column', () => {
            let droppedElement: Element = kanbanObj.element.querySelectorAll('.e-card[data-id="18"]').item(0);
            util.triggerMouseEvent(droppedElement, 'mousemove', 700, 150);
            util.triggerMouseEvent(droppedElement, 'mouseup', 700, 150);
        });
    });

    describe('Card click event testing', () => {
        let kanbanObj: Kanban;
        let element: HTMLElement;
        beforeAll((done: DoneFn) => {
            let model: KanbanModel = {
                cardClick: (args: CardClickEventArgs) => {
                    expect(args.element).toBe(element);
                    let data: { [key: string]: Object } = kanbanObj.getCardDetails(element);
                    expect(args.data).toBe(data);
                    expect(args.cancel).toBeFalsy();
                    expect(args.name).toBe('cardClick');
                    args.cancel = true;
                },
                cardDoubleClick: (args: CardClickEventArgs) => {
                    expect(args.element).toBe(element);
                    let data: { [key: string]: Object } = kanbanObj.getCardDetails(element);
                    expect(args.data).toBe(data);
                    expect(args.cancel).toBeFalsy();
                    expect(args.name).toBe('cardDoubleClick');
                }
            };
            kanbanObj = util.createKanban(model, kanbanData, done);
        });

        afterAll(() => {
            util.destroy(kanbanObj);
        });

        it('Card click event testing', () => {
            expect(kanbanObj.activeCardData.data).toBeNull();
            expect(kanbanObj.activeCardData.element).toBeNull();
            element = (<NodeListOf<Element>>kanbanObj.element.querySelectorAll('.e-card[data-id="2"]')).item(0) as HTMLElement;
            util.triggerMouseEvent(element, 'click');
            let data: { [key: string]: Object } = kanbanObj.getCardDetails(element);
            expect(kanbanObj.activeCardData.data).toBe(data);
            expect(kanbanObj.activeCardData.element).toBe(element);
        });

        it('Card selection', () => {
            kanbanObj.actionModule.cardSelection(null, false, false);
        });

    });

    describe('Checking Selected card details ', () => {
        let kanbanObj: Kanban;
        let element: HTMLElement;
        beforeAll((done: DoneFn) => {
            let model: KanbanModel = {
                keyField: 'Status',
                columns: [
                    { headerText: 'Backlog', keyField: 'Open' },
                    { headerText: 'In Progress', keyField: 'InProgress' },
                    { headerText: 'Testing', keyField: 'Testing' },
                    { headerText: 'Done', keyField: 'Close' }
                ],
                swimlaneSettings: {
                    keyField: 'Assignee'
                },
                cardSettings: {
                    showHeader: true,
                    contentField: 'Summary',
                    headerField: 'Id',
                    selectionType: 'Multiple'
                }
            };
            kanbanObj = util.createKanban(model, kanbanData, done);
        });

        afterAll(() => {
            util.destroy(kanbanObj);
        });

        it('Testing to get selected cards details', () => {
            element = (<NodeListOf<Element>>kanbanObj.element.querySelectorAll('.e-card[data-id="25"]')).item(0) as HTMLElement;
            let data: { [key: string]: Object } = kanbanObj.getCardDetails(element);
            expect(data.Status).toEqual('Open');
            element = (<NodeListOf<Element>>kanbanObj.element.querySelectorAll('.e-card[data-id="2"]')).item(0) as HTMLElement;
            let card: { [key: string]: Object } = kanbanObj.getCardDetails(element);
            expect(card.Status).toEqual('InProgress');

        });
    });

    describe('Checking Selected cards ', () => {
        let kanbanObj: Kanban;
        beforeAll((done: DoneFn) => {
            let model: KanbanModel = {
                keyField: 'Status',
                columns: [
                    { headerText: 'Backlog', keyField: 'Open' },
                    { headerText: 'In Progress', keyField: 'InProgress' },
                    { headerText: 'Testing', keyField: 'Testing' },
                    { headerText: 'Done', keyField: 'Close' }
                ],
                swimlaneSettings: {
                    keyField: 'Assignee'
                },
                cardSettings: {
                    showHeader: true,
                    contentField: 'Summary',
                    headerField: 'Id',
                    selectionType: 'Multiple'
                }
            };
            kanbanObj = util.createKanban(model, kanbanData, done);
        });

        afterAll(() => {
            util.destroy(kanbanObj);
        });

        it('Testing to get selected cards ', () => {
            expect(kanbanObj.activeCardData.element).toBeNull();
            let element: HTMLElement = kanbanObj.element.querySelector('.e-card[data-id="25"]') as HTMLElement;
            util.triggerMouseEvent(element, 'click');
            expect(element.classList.contains('e-selection')).toBe(true);
            let selectedCards: HTMLElement[] = kanbanObj.getSelectedCards();
            expect(selectedCards.length).toEqual(1);
            expect(selectedCards[0].classList.contains('e-selection')).toBe(true);
        });

        it('Testing to get selected cards ', () => {
            kanbanObj.cardSettings.selectionType = 'None';
            kanbanObj.dataBind();
            let element: HTMLElement = kanbanObj.element.querySelector('.e-card[data-id="25"]') as HTMLElement;
            util.triggerMouseEvent(element, 'click');
            expect(element.classList.contains('e-selection')).toBe(false);
            expect(kanbanObj.getSelectedCards().length).toEqual(0);
        });
    });

    describe('Add column testing ', () => {
        let kanbanObj: Kanban;
        beforeAll((done: DoneFn) => {
            let model: KanbanModel = {
                columns: [
                    { headerText: 'Backlog', keyField: 'Open', allowToggle: true, isExpanded: true },
                    { headerText: 'In Progress', keyField: 'InProgress', allowToggle: true, isExpanded: true },
                    { headerText: 'Testing', keyField: 'Testing', allowToggle: true, isExpanded: true },
                    { headerText: 'Done', keyField: 'Close', allowToggle: true, isExpanded: true }
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

        it('testing to add column  ', () => {
            expect(kanbanObj.columns.length).toEqual(4);
            kanbanObj.addColumn({ headerText: 'Review', keyField: 'Review', allowToggle: true, isExpanded: true }, 3);
            expect(kanbanObj.columns.length).toEqual(5);
        });

    });

    describe('Testing delete column ', () => {
        let kanbanObj: Kanban;
        beforeAll((done: DoneFn) => {
            let model: KanbanModel = {
                columns: [
                    { headerText: 'Backlog', keyField: 'Open', allowToggle: true, isExpanded: true },
                    { headerText: 'In Progress', keyField: 'InProgress', allowToggle: true, isExpanded: true },
                    { headerText: 'Testing', keyField: 'Testing', allowToggle: true, isExpanded: true },
                    { headerText: 'Done', keyField: 'Close', allowToggle: true, isExpanded: true }
                ],
                swimlaneSettings: {
                    keyField: 'Assignee'
                },
            };
            kanbanObj = util.createKanban(model, kanbanData, done);
        });

        afterAll(() => {
            util.destroy(kanbanObj);
        });

        it('testing to delete column  ', () => {
            expect(kanbanObj.columns.length).toEqual(4);
            kanbanObj.deleteColumn(4);
            expect(kanbanObj.columns.length).toEqual(4);
            kanbanObj.deleteColumn(3);
            expect(kanbanObj.columns.length).toEqual(3);
            kanbanObj.deleteColumn(2);
            expect(kanbanObj.columns.length).toEqual(2);
            kanbanObj.deleteColumn(1);
            expect(kanbanObj.columns.length).toEqual(1);
            kanbanObj.deleteColumn(0);
            expect(kanbanObj.columns.length).toEqual(0);
        });

    });

    describe('Testing show and hide column', () => {
        let kanbanObj: Kanban;
        beforeAll((done: DoneFn) => {
            let model: KanbanModel = {
                columns: [
                    { headerText: 'Backlog', keyField: 'Open', allowToggle: true, isExpanded: true },
                    { headerText: 'In Progress', keyField: 'InProgress', allowToggle: true, isExpanded: true },
                    { headerText: 'Testing', keyField: 'Testing', allowToggle: true, isExpanded: true },
                    { headerText: 'Done', keyField: 'Close', allowToggle: true, isExpanded: true }
                ],
                swimlaneSettings: {
                    keyField: 'Assignee'
                },
            };
            kanbanObj = util.createKanban(model, kanbanData, done);
        });

        afterAll(() => {
            util.destroy(kanbanObj);
        });

        it('testing to show and hide column  ', () => {
            expect(kanbanObj.columns.length).toEqual(4);
            kanbanObj.hideColumn('Testing');
            expect(kanbanObj.element.querySelectorAll('.e-header-cells').length).toEqual(3);
        });

        it('testing to show and hide column  ', () => {
            expect(kanbanObj.element.querySelectorAll('.e-header-cells').length).toEqual(3);
            kanbanObj.showColumn('Testing');
            expect(kanbanObj.element.querySelectorAll('.e-header-cells').length).toEqual(4);
            kanbanObj.showColumn('Close');
            expect(kanbanObj.element.querySelectorAll('.e-header-cells').length).toEqual(4);
        });
    });

    describe('Testing localization', () => {
        let kanbanObj: Kanban;
        beforeAll((done: DoneFn) => {
            L10n.load({
                'de': {
                    'kanban': {
                        'items': 'Artikel',
                    }
                },
                'ar': {
                    'kanban': {
                        'items': 'العناصر',
                    }
                },
                'en-US': {
                    'kanban': {
                        'items': 'items',
                    }
                }
            });
            let model: KanbanModel = {
                locale: 'de',
                columns: [
                    { headerText: 'Backlog', keyField: 'Open', allowToggle: true, isExpanded: true },
                    { headerText: 'In Progress', keyField: 'InProgress', allowToggle: true, isExpanded: true },
                    { headerText: 'Testing', keyField: 'Testing', allowToggle: true, isExpanded: true },
                    { headerText: 'Done', keyField: 'Close', allowToggle: true, isExpanded: true }
                ],
                swimlaneSettings: {
                    keyField: 'Assignee'
                },
            };
            kanbanObj = util.createKanban(model, kanbanData, done);
        });
        afterAll(() => {
            util.destroy(kanbanObj);
        });

        it('testing default culture', () => {
            let swimlaneRow: Element = kanbanObj.element.querySelector('.e-content-row.e-swimlane-row');
            expect(swimlaneRow.querySelector('.e-swimlane-item-count').innerHTML).toEqual('- 10 Artikel');
        });

        it('testing to change arabic culture', (done: DoneFn) => {
            kanbanObj.dataBound = () => {
                let content: Element = kanbanObj.element.querySelector('.e-content-row.e-swimlane-row');
                expect(content.querySelector('.e-swimlane-item-count').innerHTML).toEqual('- 10 العناصر');
                done();
            };
            kanbanObj.locale = 'ar';
            kanbanObj.dataBind();
        });

        it('testing to change english culture  ', (done: DoneFn) => {
            kanbanObj.dataBound = () => {
                let swimlane: Element = kanbanObj.element.querySelector('.e-content-row.e-swimlane-row');
                expect(swimlane.querySelector('.e-swimlane-item-count').innerHTML).toEqual('- 10 items');
                done();
            };
            kanbanObj.locale = 'en-US';
            kanbanObj.dataBind();
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
