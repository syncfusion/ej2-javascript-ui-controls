/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * action spec
 */
import { Kanban, KanbanModel, EJ2Instance, CardClickEventArgs, ActionEventArgs, ColumnsModel } from '../../src/kanban/index';
import { detach, isNullOrUndefined, L10n } from '@syncfusion/ej2-base';
import { kanbanData } from './common/kanban-data.spec';
import { profile, inMB, getMemoryProfile } from './common/common.spec';
import * as util from './common/util.spec';

Kanban.Inject();

describe('Action module', () => {
    beforeAll(() => {
        const isDef: (o: any) => boolean = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            // eslint-disable-next-line no-console
            console.log('Unsupported environment, window.performance.memory is unavailable');
            (this as any).skip(); //Skips test (in Chai)
            return;
        }
    });

    afterAll((done: DoneFn) => {
        document.body.querySelector('#Kanban').remove();
        document.body.querySelector('.e-popup').remove();
        done();
    });
    describe('Card click and double click actions testing', () => {
        let kanbanObj: Kanban;
        let isCardClick: boolean = false;
        const cardDoubleClickFunction: () => void = jasmine.createSpy('cardDoubleClick');
        beforeAll((done: DoneFn) => {
            const model: KanbanModel = {
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
            const card: Element = kanbanObj.element.querySelector('.e-card');
            expect(card.classList.contains('e-selection')).toEqual(false);
            util.triggerMouseEvent(card, 'click');
            expect(card.classList.contains('e-selection')).toEqual(false);
        });

        it('card click action event args as true', () => {
            isCardClick = true;
            const card: Element = kanbanObj.element.querySelector('.e-card');
            expect(card.classList.contains('e-selection')).toEqual(false);
            util.triggerMouseEvent(card, 'click');
            expect(card.classList.contains('e-selection')).toEqual(true);
        });

        it('card double click action', () => {
            const card: Element = kanbanObj.element.querySelector('.e-card[data-id="2"]');
            expect(card.classList.contains('e-selection')).toEqual(false);
            util.triggerMouseEvent(card, 'dblclick');
            expect(card.classList.contains('e-selection')).toEqual(true);
            expect(cardDoubleClickFunction).toHaveBeenCalled();
        });

        it('dialog close after card double click', () => {
            kanbanObj.closeDialog();
        });
    });

    describe('row expand and collapse testing', () => {
        let kanbanObj: Kanban;
        const actionCompleteFunction: () => void = jasmine.createSpy('actionComplete');
        beforeAll((done: DoneFn) => {
            const model: KanbanModel = {
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
            const swimlaneRow: Element = kanbanObj.element.querySelector('.e-content-row.e-swimlane-row');
            expect(swimlaneRow.classList.contains('e-collapsed')).toEqual(false);
            expect(swimlaneRow.nextElementSibling.classList.contains('e-collapsed')).toEqual(false);
            util.triggerMouseEvent(swimlaneRow.querySelector('.e-swimlane-row-expand'), 'click');
            expect(swimlaneRow.classList.contains('e-collapsed')).toEqual(false);
            expect(swimlaneRow.nextElementSibling.classList.contains('e-collapsed')).toEqual(false);
        });

        it('action begin testing with cancel as false and row collapsed', () => {
            kanbanObj.actionBegin = (args: ActionEventArgs) => args.cancel = false;
            const swimlaneRow: Element = kanbanObj.element.querySelector('.e-content-row.e-swimlane-row');
            expect(swimlaneRow.classList.contains('e-collapsed')).toEqual(false);
            expect(swimlaneRow.nextElementSibling.classList.contains('e-collapsed')).toEqual(false);
            const rowIcon: Element = swimlaneRow.querySelector('.e-swimlane-row-expand');
            expect(rowIcon).toBeTruthy();
            expect(swimlaneRow.querySelector('.e-swimlane-row-collapse')).not.toBeTruthy();
            util.triggerMouseEvent(rowIcon, 'click');
            expect(swimlaneRow.classList.contains('e-collapsed')).toEqual(true);
            expect(swimlaneRow.nextElementSibling.classList.contains('e-collapsed')).toEqual(true);
        });

        it('action begin testing with cancel as false and row expanded', () => {
            const swimlaneRow: Element = kanbanObj.element.querySelector('.e-content-row.e-swimlane-row');
            expect(swimlaneRow.classList.contains('e-collapsed')).toEqual(true);
            expect(swimlaneRow.nextElementSibling.classList.contains('e-collapsed')).toEqual(true);
            const rowIcon: Element = swimlaneRow.querySelector('.e-swimlane-row-collapse');
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
        const dataSource: Record<string, any>[] = kanbanData.slice(0, 10);
        const actionCompleteFunction: () => void = jasmine.createSpy('actionComplete');
        beforeAll((done: DoneFn) => {
            const model: KanbanModel = {
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
            const columnHeader: HTMLElement = kanbanObj.element.querySelector('.e-header-cells') as HTMLElement;
            expect(columnHeader.classList.contains('e-toggle-header')).toEqual(true);
            expect(columnHeader.classList.contains('e-collapsed')).toEqual(false);
            expect(columnHeader.children[0].children[1].classList.contains('e-column-expand')).toEqual(true);
            expect(columnHeader.children[0].children[1].classList.contains('e-column-collapse')).toEqual(false);
            util.triggerMouseEvent(columnHeader.children[0].children[1], 'click');
            expect(columnHeader.classList.contains('e-toggle-header')).toEqual(true);
            expect(columnHeader.classList.contains('e-collapsed')).toEqual(false);
            expect(columnHeader.children[0].children[1].classList.contains('e-column-expand')).toEqual(true);
            expect(columnHeader.children[0].children[1].classList.contains('e-column-collapse')).toEqual(false);
        });

        it('action begin testing with cancel as false and column collapsed', () => {
            kanbanObj.actionBegin = (args: ActionEventArgs) => args.cancel = false;
            const columnHeader: HTMLElement = kanbanObj.element.querySelector('.e-header-cells') as HTMLElement;
            expect(columnHeader.classList.contains('e-toggle-header')).toEqual(true);
            expect(columnHeader.classList.contains('e-collapsed')).toEqual(false);
            expect(columnHeader.children[0].children[1].classList.contains('e-column-expand')).toEqual(true);
            expect(columnHeader.children[0].children[1].classList.contains('e-column-collapse')).toEqual(false);
            util.triggerMouseEvent(columnHeader.children[0].children[1], 'click');
            expect(columnHeader.classList.contains('e-toggle-header')).toEqual(true);
            expect(columnHeader.classList.contains('e-collapsed')).toEqual(true);
            expect(columnHeader.children[0].children[1].classList.contains('e-column-expand')).toEqual(false);
            expect(columnHeader.children[0].children[1].classList.contains('e-column-collapse')).toEqual(true);
        });

        it('action begin testing with cancel as false and column expanded', () => {
            const columnHeader: HTMLElement = kanbanObj.element.querySelector('.e-header-cells') as HTMLElement;
            expect(columnHeader.classList.contains('e-toggle-header')).toEqual(true);
            expect(columnHeader.classList.contains('e-collapsed')).toEqual(true);
            expect(columnHeader.children[0].children[1].classList.contains('e-column-expand')).toEqual(false);
            expect(columnHeader.children[0].children[1].classList.contains('e-column-collapse')).toEqual(true);
            util.triggerMouseEvent(columnHeader.children[0].children[1], 'click');
            expect(columnHeader.classList.contains('e-toggle-header')).toEqual(true);
            expect(columnHeader.classList.contains('e-collapsed')).toEqual(false);
            expect(columnHeader.children[0].children[1].classList.contains('e-column-expand')).toEqual(true);
            expect(columnHeader.children[0].children[1].classList.contains('e-column-collapse')).toEqual(false);
            expect(actionCompleteFunction).toHaveBeenCalled();
        });

        it('all columns collapsed together', () => {
            const columnKeys: string[] = ['Open', 'InProgress', 'Testing', 'Close'];
            const columnHeaders: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-header-cells');
            columnHeaders.forEach((columnHeader: HTMLElement, index: number) => {
                expect(columnHeader.classList.contains('e-toggle-header')).toEqual(true);
                expect(columnHeader.classList.contains('e-collapsed')).toEqual(false);
                expect(columnHeader.children[0].classList.contains('e-header-wrap')).toEqual(true);
                expect(columnHeader.children[0].children[1].classList.contains('e-column-expand')).toEqual(true);
                expect(columnHeader.children[0].children[1].classList.contains('e-column-collapse')).toEqual(false);
                expect(columnHeader.getAttribute('data-key')).toEqual(columnKeys[index]);
                util.triggerMouseEvent(columnHeader.children[0].children[1], 'click');
                expect(columnHeader.classList.contains('e-toggle-header')).toEqual(true);
                expect(columnHeader.classList.contains('e-collapsed')).toEqual(true);
                expect(columnHeader.children[0].classList.contains('e-header-wrap')).toEqual(true);
                expect(columnHeader.children[0].children[1].classList.contains('e-column-expand')).toEqual(false);
                expect(columnHeader.children[0].children[1].classList.contains('e-column-collapse')).toEqual(true);
                expect(actionCompleteFunction).toHaveBeenCalled();
            });
        });
    });

    xdescribe('Allow Toggle Column', () => {
        let kanbanObj: Kanban;
        beforeAll((done: DoneFn) => {
            const model: KanbanModel = {
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
            const headerCells: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-header-cells');
            expect(headerCells[0].children[0].lastElementChild.classList.contains('e-column-expand')).toBe(false);
            expect(headerCells[1].children[0].lastElementChild.classList.contains('e-column-collapse')).toBe(true);
            expect(headerCells[2].children[0].lastElementChild.classList.contains('e-column-expand')).toBe(false);
            expect(headerCells[3].children[0].lastElementChild.classList.contains('e-column-expand')).toBe(true);
        });
        it('Checked collapesd class added properly on header cell testing', () => {
            const headerCells: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-header-cells');
            expect(headerCells[0].classList.contains('e-collapsed')).toBe(false);
            expect(headerCells[1].classList.contains('e-collapsed')).toBe(true);
            expect(headerCells[2].classList.contains('e-collapsed')).toBe(false);
            expect(headerCells[3].classList.contains('e-collapsed')).toBe(false);
        });

        it('Checked toggle header class added properly on header cell testing', () => {
            const headerCells: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-header-cells');
            expect(headerCells[0].classList.contains('e-toggle-header')).toBe(false);
            expect(headerCells[1].classList.contains('e-toggle-header')).toBe(true);
            expect(headerCells[2].classList.contains('e-toggle-header')).toBe(false);
            expect(headerCells[3].classList.contains('e-toggle-header')).toBe(true);
        });

        it('Checked collapsed class added on content cell testing', () => {
            const headerCells: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-header-cells');
            expect(headerCells[0].classList.contains('e-collapsed')).toBe(false);
            expect(headerCells[1].classList.contains('e-collapsed')).toBe(true);
            expect(headerCells[2].classList.contains('e-collapsed')).toBe(false);
            expect(headerCells[3].classList.contains('e-collapsed')).toBe(false);
        });

        it('Single column collapse testing', () => {
            const element: Element = kanbanObj.element.querySelectorAll('.e-header-cells')[3].children[0].lastElementChild;
            (<HTMLElement>element).click();
            expect(element.classList.contains('e-column-collapse')).toBe(true);
            expect(kanbanObj.element.querySelectorAll('.e-content-cells')[3].classList.contains('e-collapsed')).toBe(true);
        });

        it('Single column expand testing', () => {
            const element: Element = kanbanObj.element.querySelectorAll('.e-header-cells')[3].children[0].lastElementChild;
            (<HTMLElement>element).click();
            expect(element.classList.contains('e-column-expand')).toBe(true);
            expect(kanbanObj.element.querySelectorAll('.e-content-cells')[3].classList.contains('e-collapsed')).toBe(false);
        });

        it('Maintain single collapsed state testing - drag the card', () => {
            const headerCell: Element = kanbanObj.element.querySelectorAll('.e-header-cells')[1].children[0].lastElementChild;
            expect(headerCell.classList.contains('e-column-collapse')).toBe(true);
            expect(kanbanObj.element.querySelectorAll('.e-content-cells')[1].classList.contains('e-collapsed')).toBe(true);
            const draggedElement: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="5"]').item(0) as HTMLElement;
            util.triggerMouseEvent(draggedElement, 'mousedown');
            util.triggerMouseEvent(draggedElement, 'mousemove', 508, 110);
        });

        it('Maintain single collapsed state testing - drag the card checking values', () => {
            const draggedElement: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="5"]').item(0) as HTMLElement;
            expect(draggedElement.classList.contains('e-kanban-dragged-card')).toBeTruthy();
            expect(draggedElement.nextElementSibling.classList.contains('e-target-dragged-clone')).toBeTruthy();
            expect(kanbanObj.element.querySelectorAll('.e-target-dragged-clone').length).toBe(1);
        });

        it('Maintain single collapsed state testing - card moved to another place', () => {
            const droppedElement: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="8"]').item(0) as HTMLElement;
            util.triggerMouseEvent(droppedElement, 'mousemove', 650, 200);
            expect(droppedElement.nextElementSibling.classList.contains('e-target-dropped-clone')).toEqual(true);
            util.triggerMouseEvent(droppedElement, 'mouseup', 650, 200);
        });

        it('Maintain single collapsed state testing - after drag stop', () => {
            expect(kanbanObj.element.querySelectorAll('.e-target-dragged-clone').length).toBe(0);
            expect(kanbanObj.element.querySelectorAll('.e-target-dropped-clone').length).toBe(0);
            expect(kanbanObj.element.querySelectorAll('.e-card.e-cloned-card').length).toBe(0);
            expect(kanbanObj.element.querySelectorAll('.e-kanban-dragged-card').length).toBe(0);
            const headerCell: Element = kanbanObj.element.querySelectorAll('.e-header-cells')[1].children[0].lastElementChild;
            expect(headerCell.classList.contains('e-column-collapse')).toBe(true);
            expect(kanbanObj.element.querySelectorAll('.e-content-cells')[1].classList.contains('e-collapsed')).toBe(true);
        });

        it('Single Collapsed column with drag and drop behavior testing - check the column expand when cursor move', () => {
            const draggedElement: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="1"]').item(0) as HTMLElement;
            util.triggerMouseEvent(draggedElement, 'mousedown');
            util.triggerMouseEvent(draggedElement, 'mousemove', 280, 200);
            const element: Element = kanbanObj.element.querySelectorAll('.e-content-row:not(.e-swimlane-row) .e-content-cells').item(1);
            util.triggerMouseEvent(element, 'mousemove', 290, 200);
        });
        it('Single Collapsed column with drag and drop behavior testing - drop the card on collapsed column', () => {
            const droppedElement: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="14"]').item(0) as HTMLElement;
            util.triggerMouseEvent(droppedElement, 'mousemove', 290, 250);
            util.triggerMouseEvent(droppedElement, 'mouseup', 290, 250);
        });
    });

    describe('All Columns allowed to expand/collapse behavior', () => {
        let kanbanObj: Kanban;
        beforeAll((done: DoneFn) => {
            const model: KanbanModel = {
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
                const element: Element = kanbanObj.element.querySelectorAll('.e-header-cells')[i].children[0].lastElementChild;
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
                const headerCell: Element = kanbanObj.element.querySelectorAll('.e-header-cells')[i].children[0].lastElementChild;
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
            const element: Element = kanbanObj.element.querySelectorAll('.e-header-cells')[0].children[0].lastElementChild;
            (<HTMLElement>element).click();
            expect(element.classList.contains('e-column-collapse')).toBe(true);
            expect(kanbanObj.element.querySelectorAll('.e-content-cells')[0].classList.contains('e-collapsed')).toBe(true);
        });
        it('Second column collapse testing', () => {
            const element: Element = kanbanObj.element.querySelectorAll('.e-header-cells')[1].children[0].lastElementChild;
            (<HTMLElement>element).click();
            expect(element.classList.contains('e-column-collapse')).toBe(true);
            expect(kanbanObj.element.querySelectorAll('.e-content-cells')[1].classList.contains('e-collapsed')).toBe(true);
        });
        it('Third column collapse testing', () => {
            const element: Element = kanbanObj.element.querySelectorAll('.e-header-cells')[2].children[0].lastElementChild;
            (<HTMLElement>element).click();
            expect(element.classList.contains('e-column-collapse')).toBe(true);
            expect(kanbanObj.element.querySelectorAll('.e-content-cells')[2].classList.contains('e-collapsed')).toBe(true);
        });
        it('Forth column collapse testing', () => {
            const element: Element = kanbanObj.element.querySelectorAll('.e-header-cells')[3].children[0].lastElementChild;
            (<HTMLElement>element).click();
            expect(element.classList.contains('e-column-collapse')).toBe(true);
            expect(kanbanObj.element.querySelectorAll('.e-content-cells')[3].classList.contains('e-collapsed')).toBe(true);
        });
        it('Next column expanded when all columns collapsed state testing', () => {
            const headerCell: Element = kanbanObj.element.querySelectorAll('.e-header-cells')[0].children[0].lastElementChild;
            expect(headerCell.classList.contains('e-column-expand')).toBe(true);
            expect(kanbanObj.element.querySelectorAll('.e-content-cells')[0].classList.contains('e-collapsed')).toBe(false);
        });
        it('Next column testing - first column collapsed', () => {
            const element: Element = kanbanObj.element.querySelectorAll('.e-header-cells')[0].children[0].lastElementChild;
            (<HTMLElement>element).click();
            expect(element.classList.contains('e-column-collapse')).toBe(true);
            expect(kanbanObj.element.querySelectorAll('.e-content-cells')[0].classList.contains('e-collapsed')).toBe(true);
        });
        it('Next column testing - second column automatically expanded', () => {
            const headerCells: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-header-cells');
            expect(headerCells[1].children[0].lastElementChild.classList.contains('e-column-expand')).toBe(true);
            expect(kanbanObj.element.querySelectorAll('.e-content-cells')[1].classList.contains('e-collapsed')).toBe(false);
            expect(headerCells[0].children[0].lastElementChild.classList.contains('e-column-collapse')).toBe(true);
            expect(kanbanObj.element.querySelectorAll('.e-content-cells')[0].classList.contains('e-collapsed')).toBe(true);
            expect(headerCells[2].children[0].lastElementChild.classList.contains('e-column-collapse')).toBe(true);
            expect(kanbanObj.element.querySelectorAll('.e-content-cells')[2].classList.contains('e-collapsed')).toBe(true);
            expect(headerCells[3].children[0].lastElementChild.classList.contains('e-column-collapse')).toBe(true);
            expect(kanbanObj.element.querySelectorAll('.e-content-cells')[3].classList.contains('e-collapsed')).toBe(true);
        });

        it('Next column testing - second column collapsed', () => {
            const element: Element = kanbanObj.element.querySelectorAll('.e-header-cells')[1].children[0].lastElementChild;
            (<HTMLElement>element).click();
            expect(element.classList.contains('e-column-collapse')).toBe(true);
            expect(kanbanObj.element.querySelectorAll('.e-content-cells')[1].classList.contains('e-collapsed')).toBe(true);
        });
        it('Next column testing - third column automatically expanded', () => {
            const headerCell: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-header-cells');
            expect(headerCell[2].children[0].lastElementChild.classList.contains('e-column-expand')).toBe(true);
            expect(kanbanObj.element.querySelectorAll('.e-content-cells')[2].classList.contains('e-collapsed')).toBe(false);
            expect(headerCell[0].children[0].lastElementChild.classList.contains('e-column-collapse')).toBe(true);
            expect(kanbanObj.element.querySelectorAll('.e-content-cells')[0].classList.contains('e-collapsed')).toBe(true);
            expect(headerCell[1].children[0].lastElementChild.classList.contains('e-column-collapse')).toBe(true);
            expect(kanbanObj.element.querySelectorAll('.e-content-cells')[1].classList.contains('e-collapsed')).toBe(true);
            expect(headerCell[3].children[0].lastElementChild.classList.contains('e-column-collapse')).toBe(true);
            expect(kanbanObj.element.querySelectorAll('.e-content-cells')[3].classList.contains('e-collapsed')).toBe(true);
        });
        it('Next column testing - third column collapsed', () => {
            const element: Element = kanbanObj.element.querySelectorAll('.e-header-cells')[2].children[0].lastElementChild;
            (<HTMLElement>element).click();
            expect(element.classList.contains('e-column-collapse')).toBe(true);
            expect(kanbanObj.element.querySelectorAll('.e-content-cells')[2].classList.contains('e-collapsed')).toBe(true);
        });
        it('Next column testing - forth column automatically expanded', () => {
            const headerCell: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-header-cells');
            expect(headerCell[3].children[0].lastElementChild.classList.contains('e-column-expand')).toBe(true);
            expect(kanbanObj.element.querySelectorAll('.e-content-cells')[3].classList.contains('e-collapsed')).toBe(false);
            expect(headerCell[0].children[0].lastElementChild.classList.contains('e-column-collapse')).toBe(true);
            expect(kanbanObj.element.querySelectorAll('.e-content-cells')[0].classList.contains('e-collapsed')).toBe(true);
            expect(headerCell[1].children[0].lastElementChild.classList.contains('e-column-collapse')).toBe(true);
            expect(kanbanObj.element.querySelectorAll('.e-content-cells')[1].classList.contains('e-collapsed')).toBe(true);
            expect(headerCell[2].children[0].lastElementChild.classList.contains('e-column-collapse')).toBe(true);
            expect(kanbanObj.element.querySelectorAll('.e-content-cells')[2].classList.contains('e-collapsed')).toBe(true);
        });
    });
    xdescribe('Allow Toggle Colum with swimlanes', () => {
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
            const headerCell: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-header-cells');
            expect(headerCell[0].children[0].lastElementChild.classList.contains('e-column-expand')).toBe(false);
            expect(headerCell[1].children[0].lastElementChild.classList.contains('e-column-collapse')).toBe(true);
            expect(headerCell[2].children[0].lastElementChild.classList.contains('e-column-expand')).toBe(false);
            expect(headerCell[3].children[0].lastElementChild.classList.contains('e-column-expand')).toBe(true);
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
            const element: NodeList = kanbanObj.element.querySelectorAll('.e-content-row:not(.e-swimlane-row) .e-content-cells');
            expect((<Element>element[0]).classList.contains('e-collapsed')).toBe(false);
            expect((<Element>element[1]).classList.contains('e-collapsed')).toBe(true);
            expect((<Element>element[2]).classList.contains('e-collapsed')).toBe(false);
            expect((<Element>element[3]).classList.contains('e-collapsed')).toBe(false);
            const ele: NodeList = util.getElement(kanbanObj, '.e-content-row:not(.e-swimlane-row) .e-content-cells[data-key="InProgress"]');
            for (let i: number = 0; i < ele.length; i++) {
                expect((<Element>ele[i]).classList.contains('e-collapsed')).toBe(true);
            }
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
            const content: NodeList = util.getElement(kanbanObj, '.e-content-row:not(.e-swimlane-row) .e-content-cells');
            expect((content.item(1) as HTMLElement).classList.contains('e-collapsed')).toBe(true);
            const draggedElement: Element = kanbanObj.element.querySelectorAll('.e-card[data-id="45"]').item(0);
            util.triggerMouseEvent(draggedElement, 'mousedown');
            util.triggerMouseEvent(draggedElement, 'mousemove', 700, 210);
            expect(draggedElement.classList.contains('e-kanban-dragged-card')).toBeTruthy();
            expect(draggedElement.nextElementSibling.classList.contains('e-target-dragged-clone')).toBeTruthy();
            expect(kanbanObj.element.querySelectorAll('.e-target-dragged-clone').length).toBe(1);
        });

        it('Maintain single collapsed state testing - card moved to another place', () => {
            const droppedElement: Element = kanbanObj.element.querySelectorAll('.e-card[data-id="37"]').item(0);
            util.triggerMouseEvent(droppedElement, 'mousemove', 700, 210);
            expect(droppedElement.nextElementSibling.classList.contains('e-target-dropped-clone')).toEqual(true);
            util.triggerMouseEvent(droppedElement, 'mouseup', 700, 210);
        });
        it('Maintain single collapsed state testing - after drag stop', () => {
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
        });
        it('Single Collapsed column with drag and drop behavior testing - check the column expand when cursor move', () => {
            const draggedElement: Element = kanbanObj.element.querySelectorAll('.e-card[data-id="25"]').item(0);
            util.triggerMouseEvent(draggedElement, 'mousedown');
            util.triggerMouseEvent(draggedElement, 'mousemove', 280, 200);
            const element: Element = kanbanObj.element.querySelectorAll('.e-content-row:not(.e-swimlane-row) .e-content-cells').item(1);
            util.triggerMouseEvent(element, 'mousemove', 290, 200);
        });
        it('Single Collapsed column with drag and drop behavior testing - drop the card on collapsed column', () => {
            const droppedElement: Element = kanbanObj.element.querySelectorAll('.e-card[data-id="18"]').item(0);
            util.triggerMouseEvent(droppedElement, 'mousemove', 700, 150);
            util.triggerMouseEvent(droppedElement, 'mouseup', 700, 150);
        });
    });

    describe('Card click event testing', () => {
        let kanbanObj: Kanban;
        let element: HTMLElement;
        beforeAll((done: DoneFn) => {
            const model: KanbanModel = {
                cardClick: (args: CardClickEventArgs) => {
                    expect(args.element).toBe(element);
                    const data: Record<string, any> = kanbanObj.getCardDetails(element);
                    expect(args.data).toBe(data);
                    expect(args.cancel).toBeFalsy();
                    expect(args.name).toBe('cardClick');
                    args.cancel = true;
                },
                cardDoubleClick: (args: CardClickEventArgs) => {
                    expect(args.element).toBe(element);
                    const data: Record<string, any> = kanbanObj.getCardDetails(element);
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
            const data: Record<string, any> = kanbanObj.getCardDetails(element);
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
            const model: KanbanModel = {
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
            const data: Record<string, any> = kanbanObj.getCardDetails(element);
            expect(data.Status).toEqual('Open');
            element = (<NodeListOf<Element>>kanbanObj.element.querySelectorAll('.e-card[data-id="2"]')).item(0) as HTMLElement;
            const card: Record<string, any> = kanbanObj.getCardDetails(element);
            expect(card.Status).toEqual('InProgress');
        });
    });

    describe('Checking Selected cards ', () => {
        let kanbanObj: Kanban;
        beforeAll((done: DoneFn) => {
            const model: KanbanModel = {
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
            const element: HTMLElement = kanbanObj.element.querySelector('.e-card[data-id="25"]') as HTMLElement;
            util.triggerMouseEvent(element, 'click');
            expect(element.classList.contains('e-selection')).toBe(true);
            const selectedCards: HTMLElement[] = kanbanObj.getSelectedCards();
            expect(selectedCards.length).toEqual(1);
            expect(selectedCards[0].classList.contains('e-selection')).toBe(true);
        });

        it('Testing to get selected cards ', () => {
            kanbanObj.cardSettings.selectionType = 'None';
            kanbanObj.dataBind();
            const element: HTMLElement = kanbanObj.element.querySelector('.e-card[data-id="25"]') as HTMLElement;
            util.triggerMouseEvent(element, 'click');
            expect(element.classList.contains('e-selection')).toBe(false);
            expect(kanbanObj.getSelectedCards().length).toEqual(0);
        });
    });

    describe('Add column testing ', () => {
        let kanbanObj: Kanban;
        beforeAll((done: DoneFn) => {
            const model: KanbanModel = {
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

    describe('EJ2-54073- When dynamically adding new column after deleting all the columns from Kanban throws console error ', () => {
        let kanbanObj: Kanban;
        let deleteBtn: HTMLButtonElement;
        let addBtn: HTMLButtonElement;
        beforeAll((done: DoneFn) => {
            deleteBtn = document.createElement('button');
            deleteBtn.innerHTML = "DeleteBtn";
            addBtn = document.createElement('button');
            addBtn.innerHTML = "AddBtn";
            document.body.append(deleteBtn);
            document.body.append(addBtn);
            const kanbanDatas: Record<string, any>[] = [
                {
                    'Id': 1,
                    'Status': 'CheckList',
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
                    'Status': 'CheckList',
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
                    'Status': 'CheckList',
                    'Summary': 'Arrange a web meeting with the customer to get the login page requirements.',
                    'Type': 'Others',
                    'Priority': 'Low',
                    'Tags': 'Meeting',
                    'Estimate': 2,
                    'Assignee': 'Michael Suyama',
                    'RankId': 1
                }
            ];
            const model: KanbanModel = {
                keyField: 'Status',
                columns: [
                    { headerText: 'Backlog', keyField: 'Open' },
                    { headerText: 'In Progress', keyField: 'InProgress' },
                    { headerText: 'Review', keyField: 'Review' }
                ],
                cardSettings: {
                    contentField: 'Summary',
                    headerField: 'Id'
                }
            };
            kanbanObj = util.createKanban(model, kanbanDatas, done);

            deleteBtn.addEventListener('click', function() {
                let len: number = kanbanObj.columns.length;
                for (let i: number = len; i >= 0; i--) {
                    kanbanObj.deleteColumn(i);
                }
            });
            addBtn.addEventListener('click', function() {
                let column = { headerText: "Pre Check-List", keyField: "CheckList" };
                kanbanObj.addColumn(column, 0);
            });
        });

        afterAll(() => {
            util.destroy(kanbanObj);
            detach(deleteBtn);
            detach(addBtn);
        });

        it('Delete and Add columns in the kanban ', () => {
            expect(kanbanObj.columns.length).toEqual(4);
            deleteBtn.click();
            expect(kanbanObj.columns.length).toEqual(0);
            addBtn.click();
            expect(kanbanObj.columns.length).toEqual(1);
        });

    });

    describe('Testing delete column ', () => {
        let kanbanObj: Kanban;
        beforeAll((done: DoneFn) => {
            const model: KanbanModel = {
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
            const model: KanbanModel = {
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

    describe('Swimlane item count', () => {
        let kanbanObj: Kanban;
        beforeAll((done: DoneFn) => {
            const model: KanbanModel = {
                dataSource: kanbanData,
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
                },
                swimlaneSettings: {
                    allowDragAndDrop: true,
                    keyField: 'Assignee'
                }
            };
            kanbanObj = util.createKanban(model, kanbanData, done);
        });

        afterAll(() => {
            util.destroy(kanbanObj);
        });

        it('- EJ2-53597 - Item count when there is no data ', () => {
            const curData: Record<string, any> = {
                Id: 111, Status: 'Open', Priority: 'Low', Assignee: 'NewName', Estimate: 0, Tags: 'review', Summary: 'Newly added card'
            };
            kanbanObj.addCard(curData);
            expect(kanbanObj.element.querySelector('.e-swimlane-row[data-key="NewName"]').querySelector('.e-item-count').textContent === '- 1 items').toBe(true);
            kanbanObj.deleteCard(curData);
            expect(kanbanObj.element.querySelector('.e-swimlane-row[data-key="NewName"]').querySelector('.e-item-count').textContent === '- 0 items').toBe(true);
        });
    });

    describe('Testing localization', () => {
        let kanbanObj: Kanban;
        beforeAll((done: DoneFn) => {
            L10n.load({
                'de': {
                    'kanban': {
                        'items': 'Artikel'
                    }
                },
                'ar': {
                    'kanban': {
                        'items': 'العناصر'
                    }
                },
                'en-US': {
                    'kanban': {
                        'items': 'items'
                    }
                }
            });
            const model: KanbanModel = {
                locale: 'de',
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

        it('testing default culture', () => {
            const swimlaneRow: Element = kanbanObj.element.querySelector('.e-content-row.e-swimlane-row');
            expect(swimlaneRow.querySelector('.e-item-count').innerHTML).toEqual('- 10 Artikel');
        });

        it('testing to change arabic culture', (done: DoneFn) => {
            kanbanObj.dataBound = () => {
                const content: Element = kanbanObj.element.querySelector('.e-content-row.e-swimlane-row');
                expect(content.querySelector('.e-item-count').innerHTML).toEqual('- 10 العناصر');
                done();
            };
            kanbanObj.locale = 'ar';
            kanbanObj.dataBind();
        });

        it('testing to change english culture  ', (done: DoneFn) => {
            kanbanObj.dataBound = () => {
                const swimlane: Element = kanbanObj.element.querySelector('.e-content-row.e-swimlane-row');
                expect(swimlane.querySelector('.e-item-count').innerHTML).toEqual('- 10 items');
                done();
            };
            kanbanObj.locale = 'en-US';
            kanbanObj.dataBind();
        });
    });

    describe('row expand and collapse testing', () => {
        let kanbanObj: Kanban;
        let keyModule: any;
        beforeAll((done: DoneFn) => {
            const dataSource: Record<string, any>[] = kanbanData.slice(0, 1);
            let model: KanbanModel = {
                columns: [
                    { headerText: 'Backlog', keyField: 'Open', allowToggle: true, showAddButton: true },
                    { headerText: 'In Progress', keyField: 'InProgress', allowToggle: true, showAddButton: true },
                    { headerText: 'Testing', keyField: 'Testing', allowToggle: true, showAddButton: true },
                    { headerText: 'Done', keyField: 'Close', allowToggle: true, showAddButton: true }
                ],
                allowKeyboard: true,
                swimlaneSettings: {
                    keyField: 'Assignee'
                },
                cardSettings: {
                    selectionType: 'Multiple'
                },
                sortSettings: {
                    direction: 'Descending'
                }
            };
            kanbanObj = util.createKanban(model, dataSource, done);
        });

        afterAll(() => {
            util.destroy(kanbanObj);
        });

        it('ensure module name', () => {
            keyModule = kanbanObj.keyboardModule;
            expect(keyModule).not.toBeNull;
        });

        it('With out data clicking show add button', (done: Function) => {
            let card: HTMLElement = document.querySelector('.e-card');
            let addButton: HTMLElement = kanbanObj.element.querySelector('.e-show-add-button');
            card.click(); card.focus();
            keyModule.keyActionHandler({ action: 'delete' });
            expect(addButton.classList.contains('e-show-add-button')).toBe(true);
            util.triggerMouseEvent(addButton, 'click');
            //addButton.click();
            setTimeout(() => { done(); }, 500);
        });

        it('Popup open', () => {
            let popup: HTMLElement = document.querySelector('.e-dialog.e-kanban-dialog.e-popup');
            expect(popup != null).toBe(true);
            expect(popup.classList.contains('e-popup-close')).toBe(false);
            expect(popup.classList.contains('e-popup-open')).toBe(true);
            let idEle: HTMLElement = popup.querySelector('.e-field.e-control.e-textbox.e-lib.e-input.e-disabled');
            expect((idEle as any).value == '1').toBe(true);
            kanbanObj.closeDialog();
            expect(popup.classList.contains('e-popup-open')).toBe(false);
        });
    });

    describe('row expand and collapse testing', () => {
        let kanbanObj: Kanban;
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
                    keyField: 'Assignee'
                },
                cardSettings: {
                    selectionType: 'Multiple'
                },
                sortSettings: {
                    direction: 'Descending'
                }
            };
            kanbanObj = util.createKanban(model, kanbanData, done);
        });

        afterAll(() => {
            util.destroy(kanbanObj);
        });

        it('With data clicking show add button', () => {
            let addButton: HTMLElement = kanbanObj.element.querySelector('.e-show-add-button');
            expect(addButton.classList.contains('e-show-add-button')).toBe(true);
            util.triggerMouseEvent(addButton, 'click');
            //addButton.click();
        });

        it('Popup open', () => {
            let popup: HTMLElement = document.querySelector('.e-dialog.e-kanban-dialog.e-popup');
            expect(popup != null).toBe(true);
            expect(popup.classList.contains('e-popup-close')).toBe(false);
            expect(popup.classList.contains('e-popup-open')).toBe(true);
            let idEle: HTMLElement = popup.querySelector('.e-field.e-control.e-textbox.e-lib.e-input.e-disabled');
            expect((idEle as any).value == kanbanData.length + 1).toBe(true);
            kanbanObj.closeDialog();
        });

        it('Popup closing and functionalities', () => {
            let swimlaneELe: HTMLElement = document.querySelector('.e-icons.e-swimlane-row-expand');
            util.triggerMouseEvent(swimlaneELe, 'click');
            //swimlaneELe.click();
        });

        it('select card through method', () => {
            let card: HTMLElement = kanbanObj.element.querySelector('.e-card');
            expect(kanbanObj.getSelectedCards().length).toEqual(0);
            kanbanObj.actionModule.cardSelection(card, false, false);
            expect(kanbanObj.getSelectedCards().length).toEqual(1);
        });

        it('Multi card select in various row', () => {
            let card: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="3"]').item(0) as HTMLElement;
            expect(card.classList.contains('e-selection')).toBe(false);
            expect(kanbanObj.getSelectedCards().length).toEqual(1);
            kanbanObj.actionModule.cardSelection(card, false, true);
            expect(card.classList.contains('e-selection')).toBe(false);
            expect(kanbanObj.getSelectedCards().length).toEqual(1);
        });
    });

    describe('Check the card Settings fields', () => {
        let kanbanObj: Kanban;
        beforeAll((done: DoneFn) => {
            let kanbanData: Record<string, any>[] = [
                {
                    'Id': 1,
                    'Title': 'Task 1',
                    'Status': 'Open',
                    'Summary': 'Analyze the new requirements gathered from the customer.',
                    'Type': 'Story',
                    'Priority': 'Low',
                    'Tags': 'Analyze,Customer',
                    'Estimate': 3.5,
                    'Assignee': 'Nancy Davloio',
                    'RankId': 1,
                    'Color': '#ee4e75',
                    'ClassName': 'e-story, e-low, e-nancy'
                },
                {
                    'Id': 2,
                    'Title': 'Task 2',
                    'Status': 'InProgress',
                    'Summary': 'Improve application performance',
                    'Type': 'Improvement',
                    'Priority': 'Normal',
                    'Tags': 'Improvement',
                    'Estimate': 6,
                    'Assignee': 'Andrew Fuller',
                    'RankId': 1,
                    'Color': '#57b94c',
                    'ImageUrl': 'https://ej2.syncfusion.com/demos/src/kanban/images/Andrew%20Fuller.png',
                    'ClassName': 'e-improvement, e-normal, e-andrew'
                },
                {
                    'Id': 3,
                    'Title': 'Task 3',
                    'Status': 'Open',
                    'Summary': 'Arrange a web meeting with the customer to get new requirements.',
                    'Type': 'Others',
                    'Priority': 'Critical',
                    'Tags': 'Meeting',
                    'Estimate': 5.5,
                    'Assignee': 'Janet Leverling',
                    'RankId': 2,
                    'Color': '#5187c6',
                    'ImageUrl': 'https://ej2.syncfusion.com/demos/src/kanban/images/Janet%20Leverling.png',
                    'ClassName': 'e-others, e-critical, e-janet'
                },
                {
                    'Id': 4,
                    'Title': 'Task 4',
                    'Status': 'InProgress',
                    'Summary': 'Fix the issues reported in the IE browser.',
                    'Type': 'Bug',
                    'Priority': 'Release Breaker',
                    'Tags': 'IE',
                    'Estimate': 2.5,
                    'Assignee': 'Janet Leverling',
                    'RankId': 2,
                    'Color': '#ee4e75',
                    'ImageUrl': 'https://ej2.syncfusion.com/demos/src/kanban/images/Janet%20Leverling.png',
                    'ClassName': 'e-bug, e-release, e-janet'
                },
                {
                    'Id': 5,
                    'Title': 'Task 5',
                    'Status': 'Testing',
                    'Summary': 'Fix the issues reported by the customer.',
                    'Type': 'Bug',
                    'Priority': 'Low',
                    'Tags': 'Customer',
                    'Estimate': '3.5',
                    'Assignee': 'Steven walker',
                    'RankId': 1,
                    'Color': '#ee4e75',
                    'ImageUrl': 'https://ej2.syncfusion.com/demos/src/kanban/images/Steven%20walker.png',
                    'ClassName': 'e-bug, e-low, e-steven'
                }];
            let model: KanbanModel = {
                keyField: 'Status',
                columns: [
                    { headerText: 'Backlog', keyField: 'Open', allowToggle: true, showAddButton: true },
                    { headerText: 'In Progress', keyField: 'InProgress', allowToggle: true, showAddButton: true },
                    { headerText: 'Testing', keyField: 'Testing', allowToggle: true, showAddButton: true },
                    { headerText: 'Done', keyField: 'Close', allowToggle: true, showAddButton: true }
                ],
                cardSettings: {
                    contentField: 'Summary',
                    headerField: 'Title',
                    tagsField: 'Tags',
                    grabberField: 'Color',
                    footerCssField: 'ClassName'
                }
            };
            kanbanObj = util.createKanban(model, kanbanData, done);
        });

        afterAll(() => {
            util.destroy(kanbanObj);
        });

        it('check tagField,grabbedField,CssField', () => {
            expect(kanbanObj.cardSettings.tagsField).toEqual('Tags');
            expect(isNullOrUndefined((kanbanObj.kanbanData[0] as any).Tags)).toBe(false);
            expect(kanbanObj.cardSettings.grabberField).toEqual('Color');
            expect(isNullOrUndefined((kanbanObj.kanbanData[0] as any).Color)).toBe(false);
            expect(kanbanObj.cardSettings.footerCssField).toEqual('ClassName');
            expect(isNullOrUndefined((kanbanObj.kanbanData[0] as any).ClassName)).toBe(false);
        });
    });

    describe('EJ2-47242 - Script error thrown when hide the column', () => {
        let kanbanObj: Kanban;
        beforeAll((done: DoneFn) => {
            const model: KanbanModel = {
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
        it('testing to show and hide column  ', () => {
            expect(kanbanObj.columns.length).toEqual(4);
            const card: Element = kanbanObj.element.querySelector('.e-card[data-id="2"]');
            util.triggerMouseEvent(card, 'dblclick');
        });
        it('Check the opened dropdown list values', () => {
            let element = (document.getElementById("Kanban_dialog_wrapper").getElementsByClassName('e-dropdownlist')[0] as EJ2Instance);
            expect((element.ej2_instances[0] as any).getItems().length).toEqual(4);
        });
        it('dialog close after card double click', () => {
            kanbanObj.closeDialog();
        });
        it('testing to show and hide column  ', () => {
            expect(kanbanObj.columns.length).toEqual(4);
            kanbanObj.hideColumn('Testing');
            expect(kanbanObj.element.querySelectorAll('.e-header-cells').length).toEqual(3);
            expect(kanbanObj.columns.length).toEqual(4);
            const card: Element = kanbanObj.element.querySelector('.e-card[data-id="2"]');
            util.triggerMouseEvent(card, 'dblclick');
        });
        it('Check the opened dropdown list values', () => {
            let dialogWrapper: Element = document.getElementById("Kanban_dialog_wrapper");
            let element: EJ2Instance = (dialogWrapper.getElementsByClassName('e-dropdownlist')[0] as EJ2Instance);
            expect((element.ej2_instances[0] as any).getItems().length).toEqual(3);
        });
        it('dialog close after card double click', () => {
            kanbanObj.closeDialog();
        });
    });

    describe('882869 - Toggle columns not working properly when there is no cards in the Kanban', () => {
        let kanbanObj: Kanban;
        beforeAll((done: DoneFn) => {
            const model: KanbanModel = {
                columns: [
                    { headerText: 'Backlog', keyField: 'Open', allowToggle: true, isExpanded: true },
                    { headerText: 'In Progress', keyField: 'InProgress', allowToggle: true, isExpanded: true },
                    { headerText: 'Testing', keyField: 'Testing', allowToggle: true, isExpanded: true },
                    { headerText: 'Done', keyField: 'Close', allowToggle: true, isExpanded: true }
                ],
            };
            kanbanObj = util.createKanban(model, [], done);
        });
        afterAll((done) => {
            util.destroy(kanbanObj);
            done();
        });
        it('Columns toggle when you click the toggle icon.', (done) => {
            let toggle = kanbanObj.element.querySelector(".e-kanban-table.e-header-table .e-header-cells");
            (toggle.querySelector(".e-column-expand") as HTMLElement).click();
            expect(toggle.classList.contains("e-collapsed")).toEqual(true);
            (toggle.querySelector(".e-column-collapse") as HTMLElement).click();
            expect(toggle.classList.contains("e-collapsed")).toEqual(false);
            done();
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
