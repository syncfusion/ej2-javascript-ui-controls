/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Kanban base spec
 */
import { createElement, remove } from '@syncfusion/ej2-base';
import { Query, DataManager } from '@syncfusion/ej2-data';
import { Kanban, KanbanModel, ColumnsModel } from '../../src/kanban/index';
import { kanbanData } from './common/kanban-data.spec';
import { profile, inMB, getMemoryProfile } from './common/common.spec';
import * as util from './common/util.spec';

Kanban.Inject();

describe('Kanban base module', () => {
    beforeAll(() => {
        const isDef: (o: any) => boolean = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            // eslint-disable-next-line no-console
            console.log('Unsupported environment, window.performance.memory is unavailable');
            (this as any).skip(); //Skips test (in Chai)
            return;
        }
    });

    describe('Basic Layout Rendering without model', () => {
        let kanbanObj: Kanban;
        beforeAll((done: DoneFn) => {
            kanbanObj = util.createKanban({}, kanbanData, done);
        });

        afterAll(() => {
            util.destroy(kanbanObj);
        });

        it('control class testing', () => {
            expect(kanbanObj.element.classList.contains('e-kanban')).toEqual(true);
        });

        it('get component name testing', () => {
            expect(kanbanObj.getModuleName()).toEqual('kanban');
        });

        it('Kanban children testing', () => {
            expect(kanbanObj.element.childElementCount).toBe(3);
            expect(kanbanObj.element.firstElementChild.classList.contains('e-spinner-pane')).toBeTruthy();
        });
    });

    describe('Basic Layout Rendering without card data', () => {
        let kanbanObj: Kanban;
        beforeAll((done: DoneFn) => {
            kanbanObj = util.createKanban({ cssClass: 'custom-kanban-class' }, [], done);
        });

        afterAll(() => {
            util.destroy(kanbanObj);
        });

        it('control class testing', () => {
            expect(kanbanObj.element.classList.contains('e-kanban')).toEqual(true);
            expect(kanbanObj.element.classList.contains('custom-kanban-class')).toEqual(true);
        });

        it('get component name testing', () => {
            expect(kanbanObj.getModuleName()).toEqual('kanban');
            expect(kanbanObj.requiredModules().length).toEqual(0);
            (kanbanObj as any).getPersistData();
        });

        it('Kanban children testing', () => {
            expect(kanbanObj.element.childElementCount).toBe(3);
            expect(kanbanObj.element.firstElementChild.classList.contains('e-spinner-pane')).toBeTruthy();
            expect(kanbanObj.element.children[1].classList.contains('e-kanban-header')).toBeTruthy();
            expect(kanbanObj.element.lastElementChild.classList.contains('e-kanban-content')).toBeTruthy();
        });

        it('Header table colgroup testing', () => {
            expect(kanbanObj.element.querySelectorAll('.e-header-table colgroup').item(0).childElementCount).toEqual(4);
        });

        it('Header table colgroup data-key testing', () => {
            const colElements: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-header-table colgroup col');
            kanbanObj.columns.forEach((column: ColumnsModel, index: number) => {
                expect(colElements.item(index).getAttribute('data-key')).toEqual(column.keyField as string);
            });
        });

        it('Header row testing', () => {
            expect(kanbanObj.element.querySelector('.e-header-row').childElementCount).toEqual(4);
        });

        it('Header content cell rendering testing', () => {
            expect(kanbanObj.element.querySelectorAll('.e-header-table').length).toBe(1);
            expect(kanbanObj.element.querySelectorAll('.e-header-cells').length).toEqual(4);
        });

        it('Header table content cell data-key testing and data-role testing', () => {
            const headerCells: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-header-cells');
            kanbanObj.columns.forEach((column: ColumnsModel, index: number) => {
                expect(headerCells.item(index).getAttribute('data-key')).toBe(column.keyField as string);
                expect(headerCells.item(index).getAttribute('data-role')).toBe('kanban-column');
            });
        });

        it('Header text testing', () => {
            const headerText: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-header-cells .e-header-text');
            kanbanObj.columns.forEach((column: ColumnsModel, index: number) => {
                expect((headerText.item(index) as HTMLElement).innerText).toBe(column.headerText);
            });
        });

        it('Content rendering testing', () => {
            expect(kanbanObj.element.querySelectorAll('.e-content-table').length).toBe(1);
        });

        it('Content table colgroup testing', () => {
            expect(kanbanObj.element.querySelector('.e-content-table colgroup').childElementCount).toEqual(4);
        });

        it('Content table colgroup data-key testing', () => {
            const colElements: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-content-table colgroup col');
            kanbanObj.columns.forEach((column: ColumnsModel, index: number) => {
                expect(colElements.item(index).getAttribute('data-key')).toBe(column.keyField as string);
            });
        });

        it('Content table data testing', () => {
            expect(kanbanObj.element.querySelector('.e-content-table tbody').childElementCount).toBe(0);
        });

        it('Datasource property and card rendering testing', () => {
            expect(kanbanObj.kanbanData.length).toEqual(0);
            expect(kanbanObj.element.querySelectorAll('.e-card').length).toEqual(0);
        });
    });

    describe('Basic Layout Rendering with card data', () => {
        let kanbanObj: Kanban;
        beforeAll((done: DoneFn) => {
            kanbanObj = util.createKanban({}, kanbanData, done);
        });

        afterAll(() => {
            util.destroy(kanbanObj);
        });

        it('control class testing', () => {
            expect(kanbanObj.element.classList.contains('e-kanban')).toEqual(true);
        });

        it('get component name testing', () => {
            expect(kanbanObj.getModuleName()).toEqual('kanban');
        });

        it('Kanban children testing', () => {
            expect(kanbanObj.element.childElementCount).toBe(3);
            expect(kanbanObj.element.firstElementChild.classList.contains('e-spinner-pane')).toBeTruthy();
            expect(kanbanObj.element.children[1].classList.contains('e-kanban-header')).toBeTruthy();
            expect(kanbanObj.element.lastElementChild.classList.contains('e-kanban-content')).toBeTruthy();
        });

        it('Header table colgroup testing', () => {
            expect(kanbanObj.element.querySelectorAll('.e-header-table colgroup').item(0).childElementCount).toEqual(4);
        });

        it('Header table colgroup data-key testing', () => {
            const colElements: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-header-table colgroup col');
            kanbanObj.columns.forEach((column: ColumnsModel, index: number) => {
                expect(colElements.item(index).getAttribute('data-key')).toBe(column.keyField as string);
            });
        });

        it('Header row testing', () => {
            expect(kanbanObj.element.querySelector('.e-header-row').childElementCount).toEqual(4);
        });

        it('Header content cell rendering testing', () => {
            expect(kanbanObj.element.querySelectorAll('.e-header-table').length).toBe(1);
            expect(kanbanObj.element.querySelectorAll('.e-header-cells').length).toEqual(4);
        });

        it('Header table content cell data-key testing and data-role testing', () => {
            const headerCells: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-header-cells');
            kanbanObj.columns.forEach((column: ColumnsModel, index: number) => {
                expect(headerCells.item(index).getAttribute('data-key')).toBe(column.keyField as string);
                expect(headerCells.item(index).getAttribute('data-role')).toBe('kanban-column');
            });
        });

        it('Header text testing', () => {
            const headerText: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-header-cells .e-header-text');
            kanbanObj.columns.forEach((column: ColumnsModel, index: number) => {
                expect((headerText.item(index) as HTMLElement).innerText).toBe(column.headerText);
            });
        });

        it('Content rendering testing', () => {
            expect(kanbanObj.element.querySelectorAll('.e-content-table').length).toBe(1);
        });

        it('Content table colgroup testing', () => {
            expect(kanbanObj.element.querySelector('.e-content-table colgroup').childElementCount).toEqual(4);
        });

        it('Content table colgroup data-key testing', () => {
            const colElements: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-content-table colgroup col');
            kanbanObj.columns.forEach((column: ColumnsModel, index: number) => {
                expect(colElements.item(index).getAttribute('data-key')).toBe(column.keyField as string);
            });
        });

        it('Content table data testing', () => {
            expect(kanbanObj.element.querySelector('.e-content-table tbody').childElementCount).toBe(1);
            expect(kanbanObj.element.querySelector('.e-content-row').childElementCount).toEqual(4);
        });

        it('Datasource property and card rendering testing', () => {
            expect((kanbanObj.dataSource as Record<string, any>[]).length).toBe(75);
            expect(kanbanObj.element.querySelectorAll('.e-card').length).toBe(64);
        });

        it('Content table height testing', () => {
            expect((kanbanObj.element.querySelectorAll('.e-kanban-content').item(0) as HTMLElement).style.height).not.toBe('0px');
        });

        it('Content table colgroup testing', () => {
            expect(kanbanObj.element.querySelector('.e-content-table colgroup').childElementCount).toEqual(4);
        });

        it('Content table colgroup data-key testing', () => {
            const colElements: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-content-table colgroup col');
            kanbanObj.columns.forEach((column: ColumnsModel, index: number) => {
                expect(colElements.item(index).getAttribute('data-key')).toBe(column.keyField as string);
            });
        });

        it('Content row testing', () => {
            expect(kanbanObj.element.querySelector('.e-content-row').childElementCount).toEqual(4);
        });

        it('Content cell rendering testing', () => {
            expect(kanbanObj.element.querySelectorAll('.e-content-row').length).toBe(1);
            expect(kanbanObj.element.querySelectorAll('.e-content-cells').length).toEqual(4);
        });

        it('Content cell data-key testing and data-role testing', () => {
            const contentCells: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-content-cells');
            kanbanObj.columns.forEach((column: ColumnsModel, index: number) => {
                expect(contentCells.item(index).getAttribute('data-key')).toBe(column.keyField as string);
                expect(contentCells.item(index).getAttribute('data-role')).toBe('kanban-column');
                expect(contentCells.item(index).lastElementChild.classList.contains('e-card-wrapper')).toBe(true);
            });
        });

        it('Card count testing', () => {
            const contentCells: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-content-cells');
            expect(contentCells.item(0).lastElementChild.childElementCount).toBe(14);
            expect(contentCells.item(1).lastElementChild.childElementCount).toBe(13);
            expect(contentCells.item(2).lastElementChild.childElementCount).toBe(15);
            expect(contentCells.item(3).lastElementChild.childElementCount).toBe(22);
        });

        it('First column card class and inner layout testing', () => {
            const cards: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-content-cells:nth-child(1) .e-card');
            cards.forEach((card: HTMLElement) => {
                expect(card.classList.contains('e-draggable')).toBe(true);
                expect(card.classList.contains('e-card')).toBe(true);
                expect(card.getAttribute('data-key')).toBe('Open');
                expect(card.hasAttribute('data-id')).toBe(true);
                expect(card.childElementCount).toBe(2);
                expect(card.children[0].classList.contains('e-card-header')).toEqual(true);
                expect(card.children[1].classList.contains('e-card-content')).toEqual(true);
                expect(card.children[0].firstElementChild.classList.contains('e-card-header-caption')).toEqual(true);
            });
        });

        it('Second column card class and inner layout testing', () => {
            const cards: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-content-cells:nth-child(2) .e-card');
            cards.forEach((card: HTMLElement) => {
                expect(card.classList.contains('e-draggable')).toBe(true);
                expect(card.classList.contains('e-card')).toBe(true);
                expect(card.getAttribute('data-key')).toBe('InProgress');
                expect(card.hasAttribute('data-id')).toBe(true);
                expect(card.childElementCount).toBe(2);
                expect(card.children[0].classList.contains('e-card-header')).toEqual(true);
                expect(card.children[1].classList.contains('e-card-content')).toEqual(true);
                expect(card.children[0].firstElementChild.classList.contains('e-card-header-caption')).toEqual(true);
            });
        });

        it('Third column card class and inner layout testing', () => {
            const cards: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-content-cells:nth-child(3) .e-card');
            cards.forEach((card: HTMLElement) => {
                expect(card.classList.contains('e-draggable')).toBe(true);
                expect(card.classList.contains('e-card')).toBe(true);
                expect(card.getAttribute('data-key')).toBe('Testing');
                expect(card.hasAttribute('data-id')).toBe(true);
                expect(card.childElementCount).toBe(2);
                expect(card.children[0].classList.contains('e-card-header')).toEqual(true);
                expect(card.children[1].classList.contains('e-card-content')).toEqual(true);
                expect(card.children[0].firstElementChild.classList.contains('e-card-header-caption')).toEqual(true);
            });
        });

        it('Forth column card class and inner layout testing', () => {
            const cards: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-content-cells:nth-child(4) .e-card');
            cards.forEach((card: HTMLElement) => {
                expect(card.classList.contains('e-draggable')).toBe(true);
                expect(card.classList.contains('e-card')).toBe(true);
                expect(card.getAttribute('data-key')).toBe('Close');
                expect(card.hasAttribute('data-id')).toBe(true);
                expect(card.childElementCount).toBe(2);
                expect(card.children[0].classList.contains('e-card-header')).toEqual(true);
                expect(card.children[1].classList.contains('e-card-content')).toEqual(true);
                expect(card.children[0].firstElementChild.classList.contains('e-card-header-caption')).toEqual(true);
            });
        });
    });

    describe('actionFailure testing', () => {
        const actionFailedFunction: () => void = jasmine.createSpy('actionFailure');
        let kanbanObj: Kanban;
        beforeAll(() => {
            jasmine.Ajax.install();
            const dataManager: DataManager = new DataManager({ url: 'api/Kanban/Cards/' });
            const model: KanbanModel = { actionFailure: actionFailedFunction };
            kanbanObj = util.createKanban(model, dataManager);
        });
        beforeEach((done: DoneFn) => {
            const request: JasmineAjaxRequest = jasmine.Ajax.requests.mostRecent();
            request.respondWith({ 'status': 404, 'contentType': 'application/json', 'responseText': 'Page not found' });
            done();
        });
        it('actionFailure testing', (done: Function) => {
            setTimeout(() => {
                expect(actionFailedFunction).toHaveBeenCalled();
                done();
            }, 500);
        });
        afterAll(() => {
            util.destroy(kanbanObj);
            jasmine.Ajax.uninstall();
        });
    });

    describe('actionFailure event after kanban destroy testing', () => {
        const actionFailedFunction: () => void = jasmine.createSpy('actionFailure');
        let kanbanObj: Kanban;
        beforeAll(() => {
            jasmine.Ajax.install();
            const dataManager: DataManager = new DataManager({ url: 'api/Kanban/Cards/' });
            const model: KanbanModel = { actionFailure: actionFailedFunction };
            kanbanObj = util.createKanban(model, dataManager);
            util.destroy(kanbanObj);
        });
        beforeEach((done: DoneFn) => {
            const request: JasmineAjaxRequest = jasmine.Ajax.requests.at(1);
            request.respondWith({ 'status': 404, 'contentType': 'application/json', 'responseText': 'Page not found' });
            done();
        });
        it('actionFailure testing', () => {
            expect(actionFailedFunction).not.toHaveBeenCalled();
        });
        afterAll(() => {
            jasmine.Ajax.uninstall();
        });
    });

    describe('Swimlane Layout Rendering', () => {
        let kanbanObj: Kanban;
        let allKeys: string[];
        let rows: string[];
        beforeAll((done: DoneFn) => {
            const model: KanbanModel = {
                swimlaneSettings: {
                    keyField: 'Assignee'
                }
            };
            kanbanObj = util.createKanban(model, kanbanData, done);
            allKeys = kanbanData.map((obj: { [key: string]: string }) => obj[kanbanObj.swimlaneSettings.keyField]);
            rows = allKeys.filter((key: string, index: number) => allKeys.indexOf(key) === index).sort();
        });

        afterAll(() => {
            util.destroy(kanbanObj);
        });

        it('control class testing', () => {
            expect(kanbanObj.element.classList.contains('e-kanban')).toEqual(true);
        });

        it('get component name testing', () => {
            expect(kanbanObj.getModuleName()).toEqual('kanban');
        });

        it('Kanban children testing', () => {
            expect(kanbanObj.element.childElementCount).toBe(3);
            expect(kanbanObj.element.firstElementChild.classList.contains('e-spinner-pane')).toBeTruthy();
            expect(kanbanObj.element.children[1].classList.contains('e-kanban-header')).toBeTruthy();
            expect(kanbanObj.element.lastElementChild.classList.contains('e-kanban-content')).toBeTruthy();
        });

        it('Header swimlane class testing', () => {
            expect(kanbanObj.element.children[1].firstElementChild.classList.contains('e-swimlane')).toEqual(true);
        });

        it('Header table colgroup testing', () => {
            expect(kanbanObj.element.querySelector('.e-header-table colgroup').childElementCount).toEqual(4);
        });

        it('Header table colgroup data-key testing', () => {
            const colElements: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-header-table colgroup col');
            kanbanObj.columns.forEach((column: ColumnsModel, index: number) => {
                expect(colElements.item(index).getAttribute('data-key')).toBe(column.keyField as string);
            });
        });

        it('Header row testing', () => {
            expect(kanbanObj.element.querySelector('.e-header-row').childElementCount).toEqual(4);
        });

        it('Header content cell rendering testing', () => {
            expect(kanbanObj.element.querySelectorAll('.e-header-table').length).toBe(1);
            expect(kanbanObj.element.querySelectorAll('.e-header-cells').length).toEqual(4);
        });

        it('Header table content cell data-key testing and data-role testing', () => {
            const headerCells: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-header-cells');
            kanbanObj.columns.forEach((column: ColumnsModel, index: number) => {
                expect(headerCells.item(index).getAttribute('data-key')).toBe(column.keyField as string);
                expect(headerCells.item(index).getAttribute('data-role')).toBe('kanban-column');
            });
        });

        it('Header text testing', () => {
            const headerText: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-header-cells .e-header-text');
            kanbanObj.columns.forEach((column: ColumnsModel, index: number) => {
                expect((headerText.item(index) as HTMLElement).innerText).toBe(column.headerText);
            });
        });

        it('Content rendering testing', () => {
            expect(kanbanObj.element.querySelectorAll('.e-content-table').length).toBe(1);
        });

        it('Content swimlane class testing', () => {
            expect(kanbanObj.element.children[2].firstElementChild.classList.contains('e-swimlane')).toEqual(true);
        });

        it('Content table colgroup testing', () => {
            expect(kanbanObj.element.querySelector('.e-content-table colgroup').childElementCount).toEqual(4);
        });

        it('Content table colgroup data-key testing', () => {
            const colElements: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-content-table colgroup col');
            kanbanObj.columns.forEach((column: ColumnsModel, index: number) => {
                expect(colElements.item(index).getAttribute('data-key')).toBe(column.keyField as string);
            });
        });

        it('Content table tbody and content row count testing', () => {
            expect(kanbanObj.element.querySelector('.e-content-table tbody').childElementCount).toBe(rows.length * 2);
            expect(kanbanObj.element.querySelectorAll('.e-content-row').length).toEqual(rows.length * 2);
        });

        it('Swimlane row and content row count testing', () => {
            expect(kanbanObj.element.querySelectorAll('.e-swimlane-row').length).toEqual(rows.length);
            expect(kanbanObj.element.querySelectorAll('.e-content-row:not(.e-swimlane-row)').length).toEqual(rows.length);
        });

        it('Swimlane row has class of content row testing', () => {
            const swimlaneRows: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-swimlane-row');
            swimlaneRows.forEach((row: HTMLElement) => {
                expect(row.classList.contains('e-content-row')).toBe(true);
            });
        });

        it('Datasource property and card rendering testing', () => {
            expect(kanbanObj.kanbanData.length).toBe(75);
            expect(kanbanObj.element.querySelectorAll('.e-card').length).toBe(64);
        });

        it('Content table height testing', () => {
            expect((kanbanObj.element.querySelectorAll('.e-kanban-content').item(0) as HTMLElement).style.height).not.toBe('0px');
        });

        it('Content table colgroup testing', () => {
            expect(kanbanObj.element.querySelector('.e-content-table colgroup').childElementCount).toEqual(4);
        });

        it('Content table colgroup data-key testing', () => {
            const colElements: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-content-table colgroup col');
            kanbanObj.columns.forEach((column: ColumnsModel, index: number) => {
                expect(colElements.item(index).getAttribute('data-key')).toBe(column.keyField as string);
            });
        });

        it('Swimlane rows data-key and rendering layout testing', () => {
            const swimlaneRows: NodeList = kanbanObj.element.querySelectorAll('.e-swimlane-row');
            for (let i: number = 0; i < swimlaneRows.length; i++) {
                expect((<HTMLElement>swimlaneRows[i]).getAttribute('data-key')).toBe(rows[i]);
                expect((<HTMLElement>swimlaneRows[i]).childElementCount).toBe(1);
                const child: HTMLElement = (<HTMLElement>swimlaneRows[i]).firstElementChild as HTMLElement;
                expect(child.classList.contains('e-content-cells')).toBe(true);
                expect(child.getAttribute('data-role')).toBe('kanban-column');
                expect(child.getAttribute('colspan')).toEqual(kanbanObj.columns.length.toString());
                expect(child.children[0].childElementCount).toEqual(3);
                expect(child.children[0].children[0].classList.contains('e-icons')).toEqual(true);
                expect(child.children[0].children[0].classList.contains('e-swimlane-row-expand')).toEqual(true);
                expect(child.children[0].children[1].children[0].classList.contains('e-swimlane-text')).toEqual(true);
                expect(child.children[0].children[1].children[0].getAttribute('data-role')).toEqual(rows[i]);
                expect(child.children[0].children[1].children[0].innerHTML).toEqual(rows[i]);
                expect(child.children[0].children[2].classList.contains('e-item-count')).toEqual(true);
            }
        });

        it('Content cell data-key testing and data-role testing', () => {
            const cells: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-content-row:not(.e-swimlane-row) .e-content-cells');
            kanbanObj.columns.forEach((column: ColumnsModel, index: number) => {
                expect(cells.item(index).getAttribute('data-key')).toBe(column.keyField as string);
                expect(cells.item(index).getAttribute('data-role')).toBe('kanban-column');
                expect(cells.item(index).firstElementChild.classList.contains('e-card-wrapper')).toBe(true);
            });
        });

        it('Card count testing', () => {
            const cells: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-content-row:not(.e-swimlane-row) .e-content-cells');
            expect(cells.item(0).firstElementChild.childElementCount).toBe(4);
            expect(cells.item(1).firstElementChild.childElementCount).toBe(1);
            expect(cells.item(2).firstElementChild.childElementCount).toBe(1);
            expect(cells.item(3).firstElementChild.childElementCount).toBe(4);
        });

        it('First column card class and inner layout testing', () => {
            const columnSelector: string = '.e-content-row:not(.e-swimlane-row) .e-content-cells:nth-child(1) .e-card';
            const cards: NodeListOf<Element> = kanbanObj.element.querySelectorAll(columnSelector);
            cards.forEach((card: HTMLElement) => {
                expect(card.classList.contains('e-draggable')).toBe(true);
                expect(card.classList.contains('e-card')).toBe(true);
                expect(card.getAttribute('data-key')).toBe('Open');
                expect(card.hasAttribute('data-id')).toBe(true);
                expect(card.childElementCount).toBe(2);
                expect(card.children[0].classList.contains('e-card-header')).toEqual(true);
                expect(card.children[1].classList.contains('e-card-content')).toEqual(true);
                expect(card.children[0].firstElementChild.classList.contains('e-card-header-caption')).toEqual(true);
            });
        });

        it('Second column card class and inner layout testing', () => {
            const columnSelector: string = '.e-content-row:not(.e-swimlane-row) .e-content-cells:nth-child(2) .e-card';
            const cards: NodeListOf<Element> = kanbanObj.element.querySelectorAll(columnSelector);
            cards.forEach((card: HTMLElement) => {
                expect(card.classList.contains('e-draggable')).toBe(true);
                expect(card.classList.contains('e-card')).toBe(true);
                expect(card.getAttribute('data-key')).toBe('InProgress');
                expect(card.hasAttribute('data-id')).toBe(true);
                expect(card.childElementCount).toBe(2);
                expect(card.children[0].classList.contains('e-card-header')).toEqual(true);
                expect(card.children[1].classList.contains('e-card-content')).toEqual(true);
                expect(card.children[0].firstElementChild.classList.contains('e-card-header-caption')).toEqual(true);
            });
        });

        it('Third column card class and inner layout testing', () => {
            const columnSelector: string = '.e-content-row:not(.e-swimlane-row) .e-content-cells:nth-child(3) .e-card';
            const cards: NodeListOf<Element> = kanbanObj.element.querySelectorAll(columnSelector);
            cards.forEach((card: HTMLElement) => {
                expect(card.classList.contains('e-draggable')).toBe(true);
                expect(card.classList.contains('e-card')).toBe(true);
                expect(card.getAttribute('data-key')).toBe('Testing');
                expect(card.hasAttribute('data-id')).toBe(true);
                expect(card.childElementCount).toBe(2);
                expect(card.children[0].classList.contains('e-card-header')).toEqual(true);
                expect(card.children[1].classList.contains('e-card-content')).toEqual(true);
                expect(card.children[0].firstElementChild.classList.contains('e-card-header-caption')).toEqual(true);
            });
        });

        it('Forth column card class and inner layout testing', () => {
            const columnSelector: string = '.e-content-row:not(.e-swimlane-row) .e-content-cells:nth-child(4) .e-card';
            const cards: NodeListOf<Element> = kanbanObj.element.querySelectorAll(columnSelector);
            cards.forEach((card: HTMLElement) => {
                expect(card.classList.contains('e-draggable')).toBe(true);
                expect(card.classList.contains('e-card')).toBe(true);
                expect(card.getAttribute('data-key')).toBe('Close');
                expect(card.hasAttribute('data-id')).toBe(true);
                expect(card.childElementCount).toBe(2);
                expect(card.children[0].classList.contains('e-card-header')).toEqual(true);
                expect(card.children[1].classList.contains('e-card-content')).toEqual(true);
                expect(card.children[0].firstElementChild.classList.contains('e-card-header-caption')).toEqual(true);
            });
        });

        it('Swimlane collapse testing', () => {
            const element: HTMLElement = kanbanObj.element.querySelector('.e-swimlane-row .e-icons');
            element.click();
            expect(element.classList.contains('e-swimlane-row-collapse')).toBe(true);
            expect(kanbanObj.element.querySelector('.e-content-row').nextElementSibling.classList.contains('e-collapsed')).toBe(true);
        });

        it('Swimlane expand testing', () => {
            const element: HTMLElement = kanbanObj.element.querySelector('.e-swimlane-row .e-icons');
            element.click();
            expect(element.classList.contains('e-swimlane-row-expand')).toBe(true);
            expect(kanbanObj.element.querySelector('.e-content-row').nextElementSibling.classList.contains('e-collapsed')).toBe(false);
        });

        it('showItemCount property testing', () => {
            kanbanObj.columns[0].showItemCount = false;
            kanbanObj.columns[1].showItemCount = false;
            kanbanObj.columns[2].showItemCount = false;
            kanbanObj.columns[3].showItemCount = false;
            kanbanObj.dataBind();
            expect(kanbanObj.element.querySelectorAll('.e-header-cells .e-item-count').length).toEqual(0);
            kanbanObj.columns[0].showItemCount = true;
            kanbanObj.dataBind();
            expect(kanbanObj.element.querySelectorAll('.e-header-cells .e-item-count').length).toEqual(1);
            kanbanObj.columns[1].showItemCount = true;
            kanbanObj.dataBind();
            expect(kanbanObj.element.querySelectorAll('.e-header-cells .e-item-count').length).toEqual(2);
        });

        it('swimlane descending order rendering', () => {
            expect(kanbanObj.element.querySelector('.e-swimlane-text').innerHTML).toEqual('Andrew Fuller');
            kanbanObj.swimlaneSettings.sortDirection = 'Descending';
            kanbanObj.dataBind();
            expect(kanbanObj.element.querySelector('.e-swimlane-text').innerHTML).toEqual('Steven walker');
        });

        it('stacked header row rendering testing', () => {
            expect(kanbanObj.element.querySelectorAll('.e-stacked-header-row').length).toEqual(0);
            expect(kanbanObj.element.querySelectorAll('.e-stacked-header-cell').length).toEqual(0);
            kanbanObj.stackedHeaders = [
                { text: 'Unresolved', keyFields: 'Open, InProgress, Testing' },
                { text: 'Resolved', keyFields: 'Close' }
            ];
            kanbanObj.dataBind();
            expect(kanbanObj.element.querySelectorAll('.e-stacked-header-row').length).toEqual(1);
            expect(kanbanObj.element.querySelectorAll('.e-stacked-header-cell').length).toEqual(2);
        });

        it('swimlane template testing', () => {
            expect(kanbanObj.element.querySelectorAll('.swimlane-template').length).toEqual(0);
            kanbanObj.swimlaneSettings.template = '<div class="swimlane-template">${textField}</div>';
            kanbanObj.dataBind();
            expect(kanbanObj.element.querySelectorAll('.swimlane-template').length).toEqual(8);
        });
    });

    describe('Query data testing', () => {
        let kanbanObj: Kanban;
        beforeAll((done: DoneFn) => {
            const model: KanbanModel = { query: new Query().take(5) };
            kanbanObj = util.createKanban(model, kanbanData, done);
        });

        it('Generate query testing', () => {
            expect(kanbanObj.dataModule.getQuery() instanceof Query).toBe(true);
            expect(kanbanObj.kanbanData.length).toBe(5);
        });

        afterAll(() => {
            util.destroy(kanbanObj);
        });
    });

    describe('OnProperty Change', () => {
        let kanbanObj: Kanban;
        beforeAll((done: DoneFn) => {
            kanbanObj = util.createKanban({}, kanbanData, done);
        });

        afterAll(() => {
            util.destroy(kanbanObj);
        });

        it('RTL class testing', () => {
            kanbanObj.enableRtl = true;
            kanbanObj.dataBind();
            expect(kanbanObj.element.classList.contains('e-rtl')).toBe(true);
        });

        it('CSS class testing', () => {
            kanbanObj.cssClass = 'e-custom-class';
            kanbanObj.dataBind();
            expect(kanbanObj.element.classList.contains('e-custom-class')).toBe(true);
        });
    });

    describe('Template rendering testing', () => {
        let kanbanObj: Kanban;
        const headTemplate: Element = createElement('div', { id: 'headtemplate' });
        const cardTemplate: Element = createElement('div', { id: 'cardtemplate' });
        beforeAll((done: DoneFn) => {
            headTemplate.innerHTML = '<div class="header-template-wrap">' +
                '<div class="header-icon e-icons ${keyField}"></div>' +
                '<div class="header-text">${headerText}</div>' +
                '</div>';
            document.body.appendChild(headTemplate);
            cardTemplate.innerHTML = '<table class="card-template-wrap">' +
                '<colgroup>' +
                '<col style="width:15%">' +
                '<col style="width:85%">' +
                '</colgroup>' +
                '<tbody>' +
                '<tr>' +
                '<td class="card-icon-wrap">' +
                '<div class="card-icon e-icons ${Status}"></div>' +
                '</td>' +
                '<td class="card-details-wrap">' +
                '<table>' +
                '<tbody>' +
                '<tr>' +
                '<td class="CardHeader">Id:</td>' +
                '<td>${Id}</td>' +
                '</tr>' +
                '<tr>' +
                '<td class="CardHeader">Type:</td>' +
                '<td>${Type}</td>' +
                '</tr>' +
                '<tr>' +
                '<td class="CardHeader">Priority:</td>' +
                '<td>${Priority}</td>' +
                '</tr>' +
                '<tr>' +
                '<td class="CardHeader">Summary:</td>' +
                '<td>${Summary}</td>' +
                '</tr>' +
                '</tbody>' +
                '</table>' +
                '</td>' +
                '</tr>' +
                '</tbody>' +
                '</table>';
            document.body.appendChild(cardTemplate);
            const commonCss: string = '.e-kanban th.e-template {' +
                'text-align: center;' +
                '}' +

                '.e-kanban .header-template-wrap {' +
                'color: #e3165b;' +
                'display: inline-flex;' +
                'font-size: 18px;' +
                'font-weight: 500;' +
                '}' +

                '.e-kanban .header-template-wrap .header-icon {' +
                'margin-top: 3px;' +
                'width: 10%;' +
                '}' +

                '.e-kanban .header-template-wrap .header-icon::before {' +
                'font-size: 18px;' +
                '}' +

                '.e-kanban .header-template-wrap .header-text {' +
                'margin-left: 15px;' +
                '}' +

                '.e-kanban .e-card {' +
                'height: auto !important;' +
                '}' +

                '.e-kanban .card-template-wrap {' +
                'line-height: 1.2;' +
                'font-size: 12px;' +
                'height: 100%;' +
                'table-layout: fixed;' +
                'width: 100%;' +
                '}' +

                '.e-kanban .card-template-wrap td {' +
                'background: none !important;' +
                'border: none !important;' +
                'height: auto !important;' +
                'padding: 2px;' +
                'line-height: 1.6;' +
                '}' +

                '.e-kanban .card-template-wrap .card-icon-wrap {' +
                'padding-left: 6%;' +
                'vertical-align: middle !important;' +
                '}' +

                '.e-kanban .card-details-wrap .CardHeader {' +
                'font-weight: 500;' +
                '}' +

                '.e-kanban .Backlog::before,' +
                '.e-kanban .Open::before {' +
                'content: "\e607";' +
                'color: #6495ed;' +
                'font-size: 16px;' +
                '}' +

                '.e-kanban .InProgress::before {' +
                'content: "\e606";' +
                'color: #0000ff;' +
                'font-size: 16px;' +
                '}' +

                '.e-kanban .Testing::before {' +
                'content: "\e345";' +
                'color: #ffa500;' +
                'font-size: 16px;' +
                '}' +

                '.e-kanban .Close::before {' +
                'content: "\ea84";' +
                'color: #008000;' +
                'font-size: 16px;' +
                '}';
            const defaultOptions: KanbanModel = {
                keyField: 'Status',
                columns: [
                    { headerText: 'Backlog', keyField: 'Open', template: '#headtemplate' },
                    { headerText: 'In Progress', keyField: 'InProgress', template: '#headtemplate' },
                    { headerText: 'Testing', keyField: 'Testing', template: '#headtemplate' },
                    { headerText: 'Done', keyField: 'Close', template: '#headtemplate' }
                ],
                cardSettings: {
                    headerField: 'Id',
                    template: '#cardtemplate'
                },
                width: '900px'
            };
            kanbanObj = util.createKanban(defaultOptions, kanbanData, done);
            const css: string = commonCss;
            const style: HTMLStyleElement = document.createElement('style');
            style.type = 'text/css';
            style.id = 'scroll';
            style.appendChild(document.createTextNode(css));
            document.getElementById('Kanban').appendChild(style);
        });

        afterAll(() => {
            util.destroy(kanbanObj);
            remove(headTemplate);
            remove(cardTemplate);
        });
        it('Layout rendering with template class in header cells', () => {
            const headerCells: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-header-cells');
            for (let i: number = 0; i < headerCells.length; i++) {
                const header: Element = headerCells[i];
                const key: string = kanbanObj.columns[i].keyField as string;
                expect(header.classList.contains('e-template')).toBe(true);
                expect(header.getAttribute('data-role')).toBe('kanban-column');
                expect(header.getAttribute('data-key')).toBe(key);
                expect(header.firstElementChild.children[0].children[0].classList.contains('header-template-wrap')).toBe(true);
                expect(header.firstElementChild.children[0].children[0].childElementCount).toBe(2);
                expect(header.firstElementChild.children[0].children[0].children[0].classList.contains('header-icon')).toBe(true);
                expect(header.firstElementChild.children[0].children[0].children[0].classList.contains('e-icons')).toBe(true);
                expect(header.firstElementChild.children[0].children[0].children[0].classList.contains(key)).toBe(true);
                expect(header.firstElementChild.children[0].children[0].children[1].classList.contains('header-text')).toBe(true);
                expect(header.firstElementChild.children[0].children[0].children[1].innerHTML).toBe(kanbanObj.columns[i].headerText);
            }
        });
        it('Layout rendering with template class in card', () => {
            const cards: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-card');
            for (let i: number = 0; i < cards.length; i++) {
                expect(cards[i].classList.contains('e-draggable')).toBe(true);
                expect(cards[i].classList.contains('e-template')).toBe(true);
                expect(cards[i].hasAttribute('data-id')).toBe(true);
                expect(cards[i].firstElementChild.classList.contains('card-template-wrap')).toBe(true);
                expect(cards[i].firstElementChild.tagName).toBe('TABLE');
                expect(cards[i].firstElementChild.childElementCount).toBe(2);
                expect(cards[i].firstElementChild.children[0].tagName).toBe('COLGROUP');
                expect(cards[i].firstElementChild.children[1].tagName).toBe('TBODY');
                expect(cards[i].firstElementChild.children[0].children[0].tagName).toBe('COL');
                expect(cards[i].firstElementChild.children[0].children[1].tagName).toBe('COL');
                expect(cards[i].firstElementChild.children[0].children[0].getAttribute('style')).toBe('width:15%');
                expect(cards[i].firstElementChild.children[0].children[1].getAttribute('style')).toBe('width:85%');
                expect(cards[i].firstElementChild.lastElementChild.tagName).toBe('TBODY');
                const element: Element = cards[i].firstElementChild.lastElementChild.firstElementChild;
                expect(element.tagName).toBe('TR');
                expect(element.children[0].tagName).toBe('TD');
                expect(element.children[0].classList.contains('card-icon-wrap')).toBe(true);
                expect(element.children[0].children[0].classList.contains('card-icon')).toBe(true);
                expect(element.children[0].children[0].classList.contains('e-icons')).toBe(true);
            }
        });
        it('Layout rendering with template class in card details', () => {
            const cards: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-card');
            for (let i: number = 0; i < cards.length; i++) {
                const element: Element = cards[i].firstElementChild.lastElementChild.firstElementChild.children[1];
                expect(element.tagName).toBe('TD');
                expect(element.classList.contains('card-details-wrap')).toBe(true);
                expect(element.children[0].tagName).toBe('TABLE');
                expect(element.children[0].children[0].tagName).toBe('TBODY');
                expect(element.children[0].children[0].childElementCount).toBe(4);
                const childElement: HTMLCollection = element.children[0].children[0].children;
                expect(childElement[0].tagName).toBe('TR');
                expect(childElement[0].childElementCount).toBe(2);
                expect(childElement[0].children[0].tagName).toBe('TD');
                expect(childElement[0].children[0].classList.contains('CardHeader')).toBe(true);
                expect(childElement[0].children[1].tagName).toBe('TD');
            }
        });
    });

    describe('Default rendering header count testing -', () => {
        let kanbanObj: Kanban;
        let dragElement: HTMLElement;
        const headTemplate: Element = createElement('div', { id: 'headtemplate' });
        const cardTemplate: Element = createElement('div', { id: 'cardtemplate' });
        beforeAll((done: DoneFn) => {
            headTemplate.innerHTML = '<div class="header-template-wrap">' +
                '<div class="header-icon e-icons ${keyField}"></div>' +
                '<div class="header-text">${headerText}-${count}</div>' +
                '</div>';
            document.body.appendChild(headTemplate);
            cardTemplate.innerHTML = '<table class="card-template-wrap">' +
                '<colgroup>' +
                '<col style="width:15%">' +
                '<col style="width:85%">' +
                '</colgroup>' +
                '<tbody>' +
                '<tr>' +
                '<td class="card-icon-wrap">' +
                '<div class="card-icon e-icons ${Status}"></div>' +
                '</td>' +
                '<td class="card-details-wrap">' +
                '<table>' +
                '<tbody>' +
                '<tr>' +
                '<td class="CardHeader">Id:</td>' +
                '<td>${Id}</td>' +
                '</tr>' +
                '<tr>' +
                '<td class="CardHeader">Type:</td>' +
                '<td>${Type}</td>' +
                '</tr>' +
                '<tr>' +
                '<td class="CardHeader">Priority:</td>' +
                '<td>${Priority}</td>' +
                '</tr>' +
                '<tr>' +
                '<td class="CardHeader">Summary:</td>' +
                '<td>${Summary}</td>' +
                '</tr>' +
                '</tbody>' +
                '</table>' +
                '</td>' +
                '</tr>' +
                '</tbody>' +
                '</table>';
            document.body.appendChild(cardTemplate);
            const commonCss: string = '.e-kanban th.e-template {' +
                'text-align: center;' +
                '}' +

                '.e-kanban .header-template-wrap {' +
                'color: #e3165b;' +
                'display: inline-flex;' +
                'font-size: 18px;' +
                'font-weight: 500;' +
                '}' +

                '.e-kanban .header-template-wrap .header-icon {' +
                'margin-top: 3px;' +
                'width: 10%;' +
                '}' +

                '.e-kanban .header-template-wrap .header-icon::before {' +
                'font-size: 18px;' +
                '}' +

                '.e-kanban .header-template-wrap .header-text {' +
                'margin-left: 15px;' +
                '}' +

                '.e-kanban .e-card {' +
                'height: auto !important;' +
                '}' +

                '.e-kanban .card-template-wrap {' +
                'line-height: 1.2;' +
                'font-size: 12px;' +
                'height: 100%;' +
                'table-layout: fixed;' +
                'width: 100%;' +
                '}' +

                '.e-kanban .card-template-wrap td {' +
                'background: none !important;' +
                'border: none !important;' +
                'height: auto !important;' +
                'padding: 2px;' +
                'line-height: 1.6;' +
                '}' +

                '.e-kanban .card-template-wrap .card-icon-wrap {' +
                'padding-left: 6%;' +
                'vertical-align: middle !important;' +
                '}' +

                '.e-kanban .card-details-wrap .CardHeader {' +
                'font-weight: 500;' +
                '}' +

                '.e-kanban .Backlog::before,' +
                '.e-kanban .Open::before {' +
                'content: "\e607";' +
                'color: #6495ed;' +
                'font-size: 16px;' +
                '}' +

                '.e-kanban .InProgress::before {' +
                'content: "\e606";' +
                'color: #0000ff;' +
                'font-size: 16px;' +
                '}' +

                '.e-kanban .Testing::before {' +
                'content: "\e345";' +
                'color: #ffa500;' +
                'font-size: 16px;' +
                '}' +

                '.e-kanban .Close::before {' +
                'content: "\ea84";' +
                'color: #008000;' +
                'font-size: 16px;' +
                '}';
            const defaultOptions: KanbanModel = {
                keyField: 'Status',
                allowDragAndDrop: true,
                columns: [
                    { headerText: 'Backlog', keyField: 'Open', template: '#headtemplate' },
                    { headerText: 'In Progress', keyField: 'InProgress', template: '#headtemplate' },
                    { headerText: 'Testing', keyField: 'Testing', template: '#headtemplate' },
                    { headerText: 'Done', keyField: 'Close', template: '#headtemplate' }
                ],
                cardSettings: {
                    headerField: 'Id',
                    template: '#cardtemplate'
                },
                width: '900px'
            };
            kanbanObj = util.createKanban(defaultOptions, kanbanData, done);
            const css: string = commonCss;
            const style: HTMLStyleElement = document.createElement('style');
            style.type = 'text/css';
            style.id = 'scroll';
            style.appendChild(document.createTextNode(css));
            document.getElementById('Kanban').appendChild(style);
        });

        afterAll(() => {
            util.destroy(kanbanObj);
            remove(headTemplate);
            remove(cardTemplate);
        });
        it('Templates with drag and drop between columns', () => {
            // Mouse down action
            dragElement = kanbanObj.element.querySelectorAll('.e-card[data-id="1"]').item(0) as HTMLElement;
            util.triggerMouseEvent(dragElement, 'mousedown');
            util.triggerMouseEvent(dragElement, 'mousemove', 100, 100);
            // Mouse move action
            const element: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="2"].e-card').item(0) as HTMLElement;
            util.triggerMouseEvent(element, 'mousemove', 240, 330);
            expect(document.querySelector('.e-kanban-header').querySelectorAll('.e-header-cells')[0].querySelector('.header-text').innerHTML === 'Backlog-14').toBe(true);
            expect(document.querySelector('.e-kanban-header').querySelectorAll('.e-header-cells')[1].querySelector('.header-text').innerHTML === 'In Progress-13').toBe(true);
            util.triggerMouseEvent(element, 'mouseup', 240, 330);
            expect(document.querySelector('.e-kanban-header').querySelectorAll('.e-header-cells')[0].querySelector('.header-text').innerHTML === 'Backlog-13').toBe(true);
            expect(document.querySelector('.e-kanban-header').querySelectorAll('.e-header-cells')[1].querySelector('.header-text').innerHTML === 'In Progress-14').toBe(true);
        });
    });

    describe('Swimlane rendering header count testing -', () => {
        let kanbanObj: Kanban;
        let dragElement: HTMLElement;
        const headTemplate: Element = createElement('div', { id: 'headtemplate' });
        const cardTemplate: Element = createElement('div', { id: 'cardtemplate' });
        beforeAll((done: DoneFn) => {
            headTemplate.innerHTML = '<div class="header-template-wrap">' +
                '<div class="header-icon e-icons ${keyField}"></div>' +
                '<div class="header-text">${headerText}-${count}</div>' +
                '</div>';
            document.body.appendChild(headTemplate);
            cardTemplate.innerHTML = '<table class="card-template-wrap">' +
                '<colgroup>' +
                '<col style="width:15%">' +
                '<col style="width:85%">' +
                '</colgroup>' +
                '<tbody>' +
                '<tr>' +
                '<td class="card-icon-wrap">' +
                '<div class="card-icon e-icons ${Status}"></div>' +
                '</td>' +
                '<td class="card-details-wrap">' +
                '<table>' +
                '<tbody>' +
                '<tr>' +
                '<td class="CardHeader">Id:</td>' +
                '<td>${Id}</td>' +
                '</tr>' +
                '<tr>' +
                '<td class="CardHeader">Type:</td>' +
                '<td>${Type}</td>' +
                '</tr>' +
                '<tr>' +
                '<td class="CardHeader">Priority:</td>' +
                '<td>${Priority}</td>' +
                '</tr>' +
                '<tr>' +
                '<td class="CardHeader">Summary:</td>' +
                '<td>${Summary}</td>' +
                '</tr>' +
                '</tbody>' +
                '</table>' +
                '</td>' +
                '</tr>' +
                '</tbody>' +
                '</table>';
            document.body.appendChild(cardTemplate);
            const commonCss: string = '.e-kanban th.e-template {' +
                'text-align: center;' +
                '}' +

                '.e-kanban .header-template-wrap {' +
                'color: #e3165b;' +
                'display: inline-flex;' +
                'font-size: 18px;' +
                'font-weight: 500;' +
                '}' +

                '.e-kanban .header-template-wrap .header-icon {' +
                'margin-top: 3px;' +
                'width: 10%;' +
                '}' +

                '.e-kanban .header-template-wrap .header-icon::before {' +
                'font-size: 18px;' +
                '}' +

                '.e-kanban .header-template-wrap .header-text {' +
                'margin-left: 15px;' +
                '}' +

                '.e-kanban .e-card {' +
                'height: auto !important;' +
                '}' +

                '.e-kanban .card-template-wrap {' +
                'line-height: 1.2;' +
                'font-size: 12px;' +
                'height: 100%;' +
                'table-layout: fixed;' +
                'width: 100%;' +
                '}' +

                '.e-kanban .card-template-wrap td {' +
                'background: none !important;' +
                'border: none !important;' +
                'height: auto !important;' +
                'padding: 2px;' +
                'line-height: 1.6;' +
                '}' +

                '.e-kanban .card-template-wrap .card-icon-wrap {' +
                'padding-left: 6%;' +
                'vertical-align: middle !important;' +
                '}' +

                '.e-kanban .card-details-wrap .CardHeader {' +
                'font-weight: 500;' +
                '}' +

                '.e-kanban .Backlog::before,' +
                '.e-kanban .Open::before {' +
                'content: "\e607";' +
                'color: #6495ed;' +
                'font-size: 16px;' +
                '}' +

                '.e-kanban .InProgress::before {' +
                'content: "\e606";' +
                'color: #0000ff;' +
                'font-size: 16px;' +
                '}' +

                '.e-kanban .Testing::before {' +
                'content: "\e345";' +
                'color: #ffa500;' +
                'font-size: 16px;' +
                '}' +

                '.e-kanban .Close::before {' +
                'content: "\ea84";' +
                'color: #008000;' +
                'font-size: 16px;' +
                '}';
            const defaultOptions: KanbanModel = {
                keyField: 'Status',
                allowDragAndDrop: true,
                columns: [
                    { headerText: 'Backlog', keyField: 'Open', template: '#headtemplate' },
                    { headerText: 'In Progress', keyField: 'InProgress', template: '#headtemplate' },
                    { headerText: 'Testing', keyField: 'Testing', template: '#headtemplate' },
                    { headerText: 'Done', keyField: 'Close', template: '#headtemplate' }
                ],
                swimlaneSettings: {
                    keyField: 'Assignee'
                },
                cardSettings: {
                    headerField: 'Id',
                    template: '#cardtemplate'
                },
                width: '900px'
            };
            kanbanObj = util.createKanban(defaultOptions, kanbanData, done);
            const css: string = commonCss;
            const style: HTMLStyleElement = document.createElement('style');
            style.type = 'text/css';
            style.id = 'scroll';
            style.appendChild(document.createTextNode(css));
            document.getElementById('Kanban').appendChild(style);
        });

        afterAll(() => {
            util.destroy(kanbanObj);
            remove(headTemplate);
            remove(cardTemplate);
        });
        it('Templates with drag and drop between columns', () => {
            // Mouse down action
            dragElement = kanbanObj.element.querySelectorAll('.e-card[data-id="25"]').item(0) as HTMLElement;
            util.triggerMouseEvent(dragElement, 'mousedown');
            util.triggerMouseEvent(dragElement, 'mousemove', 100, 100);
            // Mouse move action
            const element: HTMLElement = kanbanObj.element.querySelectorAll('.e-card[data-id="2"].e-card').item(0) as HTMLElement;
            util.triggerMouseEvent(element, 'mousemove', 240, 330);
            expect(document.querySelector('.e-kanban-header').querySelectorAll('.e-header-cells')[0].querySelector('.header-text').innerHTML === 'Backlog-14').toBe(true);
            expect(document.querySelector('.e-kanban-header').querySelectorAll('.e-header-cells')[1].querySelector('.header-text').innerHTML === 'In Progress-13').toBe(true);
            util.triggerMouseEvent(element, 'mouseup', 240, 330);
            expect(document.querySelector('.e-kanban-header').querySelectorAll('.e-header-cells')[0].querySelector('.header-text').innerHTML === 'Backlog-13').toBe(true);
            expect(document.querySelector('.e-kanban-header').querySelectorAll('.e-header-cells')[1].querySelector('.header-text').innerHTML === 'In Progress-14').toBe(true);
        });
    });

    describe('Stacked header rows', () => {
        let kanbanObj: Kanban;
        beforeAll((done: DoneFn) => {
            const defaultOptions: KanbanModel = {
                keyField: 'Status',
                columns: [
                    { headerText: 'Backlog', keyField: 'Open' },
                    { headerText: 'In Progress', keyField: 'InProgress' },
                    { headerText: 'Testing', keyField: 'Testing' },
                    { headerText: 'Done', keyField: 'Close' }
                ],
                stackedHeaders: [
                    { text: 'Unresolved', keyFields: 'Open, InProgress, Testing' },
                    { text: 'Resolved', keyFields: 'Close' }
                ],
                swimlaneSettings: {
                    keyField: 'Assignee'
                },
                cardSettings: {
                    showHeader: true,
                    contentField: 'Summary',
                    headerField: 'Id'
                },
                width: '900px'
            };
            kanbanObj = util.createKanban(defaultOptions, kanbanData, done);
        });

        afterAll(() => {
            util.destroy(kanbanObj);
        });

        it('Stacked header class layout testing', () => {
            const element: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-header-row');
            for (let i: number = 0; i < element.length - 1; i++) {
                expect(element[i].classList.contains('e-stacked-header-row')).toBe(true);
                expect(element[i].tagName).toBe('TR');
                expect(element[i].firstElementChild.classList.contains('e-header-cells')).toBe(true);
                expect(element[i].firstElementChild.tagName).toBe('TH');
                expect(element[i].firstElementChild.classList.contains('e-stacked-header-cell')).toBe(true);
                expect(element[i].firstElementChild.hasAttribute('colspan')).toBe(true);
                expect(element[i].firstElementChild.firstElementChild.classList.contains('e-header-text')).toBe(true);
                expect(element[i].firstElementChild.firstElementChild.tagName).toBe('DIV');
            }
        });
        it('Stacked header colspan layout testing', () => {
            const element: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-header-row');
            expect(element[0].firstElementChild.getAttribute('colspan')).toBe('3');
            expect(element[0].lastElementChild.getAttribute('colspan')).toBe('1');
            expect(element[0].firstElementChild.firstElementChild.innerHTML).toBe('Unresolved');
            expect(element[0].lastElementChild.firstElementChild.innerHTML).toBe('Resolved');
        });
    });

    describe('WIP validation without swimlane', () => {
        let kanbanObj: Kanban;
        beforeAll((done: DoneFn) => {
            const model: KanbanModel = {
                columns: [
                    { headerText: 'Backlog', keyField: 'Open, Review', allowToggle: true, minCount: 5, maxCount: 10 },
                    { headerText: 'In Progress', keyField: 'InProgress', allowToggle: true, minCount: 1, maxCount: 3 },
                    { headerText: 'Testing', keyField: 'Testing', allowToggle: true, minCount: 1, maxCount: 5 },
                    { headerText: 'Done', keyField: 'Close', allowToggle: true, minCount: 0, maxCount: 0 }
                ],
                constraintType: 'Column'
            };
            kanbanObj = util.createKanban(model, kanbanData.slice(0, 20), done);
        });

        afterAll(() => {
            util.destroy(kanbanObj);
        });

        it('min count testing', () => {
            expect(kanbanObj.element.querySelectorAll('.e-min-count').length).toEqual(3);
            expect(kanbanObj.element.querySelectorAll('.e-min-color').length).toEqual(2);
        });
        it('max count testing', () => {
            expect(kanbanObj.element.querySelectorAll('.e-max-count').length).toEqual(3);
            expect(kanbanObj.element.querySelectorAll('.e-max-color').length).toEqual(2);
        });
    });

    describe('WIP validation with swimlane', () => {
        let kanbanObj: Kanban;
        beforeAll((done: DoneFn) => {
            const model: KanbanModel = {
                columns: [
                    { headerText: 'Backlog', keyField: 'Open, Review', allowToggle: true, minCount: 5, maxCount: 10 },
                    { headerText: 'In Progress', keyField: 'InProgress', allowToggle: true, minCount: 1, maxCount: 3 },
                    { headerText: 'Testing', keyField: 'Testing', allowToggle: true, minCount: 1, maxCount: 5 },
                    { headerText: 'Done', keyField: 'Close', allowToggle: true, minCount: 0, maxCount: 0 }
                ],
                swimlaneSettings: {
                    keyField: 'Assignee'
                },
                constraintType: 'Swimlane'
            };
            kanbanObj = util.createKanban(model, kanbanData.slice(0, 20), done);
        });

        afterAll(() => {
            util.destroy(kanbanObj);
        });

        it('min count testing', () => {
            expect(kanbanObj.element.querySelectorAll('.e-min-count').length).toEqual(24);
            expect(kanbanObj.element.querySelectorAll('.e-min-color').length).toEqual(17);
        });
        it('max count testing', () => {
            expect(kanbanObj.element.querySelectorAll('.e-max-count').length).toEqual(24);
            expect(kanbanObj.element.querySelectorAll('.e-max-color').length).toEqual(0);
        });
    });

    describe('Set model testing', () => {
        let kanbanObj: Kanban;
        beforeAll((done: DoneFn) => {
            kanbanObj = util.createKanban({ cssClass: 'custom-kanban-class', width: 'auto', allowKeyboard: false }, [], done);
        });

        afterAll(() => {
            util.destroy(kanbanObj);
        });

        it('cssClass property testing', () => {
            expect(kanbanObj.element.classList.contains('custom-kanban-class')).toEqual(true);
            kanbanObj.cssClass = null;
            kanbanObj.dataBind();
            expect(kanbanObj.element.classList.contains('custom-kanban-class')).toEqual(false);
        });

        it('dataSource property testing', (done: DoneFn) => {
            kanbanObj.dataBound = () => {
                expect(kanbanObj.kanbanData.length).toEqual(10);
                expect(kanbanObj.element.querySelectorAll('.e-card').length).toEqual(9);
                done();
            };
            expect(kanbanObj.kanbanData.length).toEqual(0);
            expect(kanbanObj.element.querySelectorAll('.e-card').length).toEqual(0);
            kanbanObj.dataSource = util.cloneDataSource(kanbanData.slice(0, 10));
            kanbanObj.dataBind();
        });

        it('swimlaneSettings property testing', () => {
            expect(kanbanObj.element.querySelectorAll('.e-swimlane').length).toEqual(0);
            expect(kanbanObj.element.querySelectorAll('.e-swimlane-row').length).toEqual(0);
            kanbanObj.swimlaneSettings.keyField = 'Assignee';
            kanbanObj.dataBind();
            expect(kanbanObj.element.querySelectorAll('.e-swimlane').length).toEqual(2);
            expect(kanbanObj.element.querySelectorAll('.e-swimlane-row').length).toEqual(7);
        });

        it('allowDragAndDrop propety testing', () => {
            expect(kanbanObj.element.querySelector('.e-card').classList.contains('e-draggable')).toBe(true);
            kanbanObj.allowDragAndDrop = false;
            kanbanObj.dataBind();
            expect(kanbanObj.element.querySelector('.e-card').classList.contains('e-draggable')).toBe(false);
            kanbanObj.allowDragAndDrop = true;
            kanbanObj.dataBind();
            expect(kanbanObj.element.querySelector('.e-card').classList.contains('e-draggable')).toBe(true);
        });

        it('allowKeyboard propety testing', () => {
            expect(kanbanObj.element.classList.contains('e-keyboard')).toEqual(false);
            kanbanObj.allowKeyboard = true;
            kanbanObj.dataBind();
            expect(kanbanObj.element.classList.contains('e-keyboard')).toEqual(true);
            kanbanObj.allowKeyboard = false;
            kanbanObj.dataBind();
            expect(kanbanObj.element.classList.contains('e-keyboard')).toEqual(false);
        });

        it('cardSettings propety testing', () => {
            expect(kanbanObj.element.querySelectorAll('.e-card').length).toEqual(9);
            expect(kanbanObj.element.querySelectorAll('.e-card-header').length).toEqual(9);
            kanbanObj.cardSettings.showHeader = false;
            kanbanObj.dataBind();
            expect(kanbanObj.element.querySelectorAll('.e-card').length).toEqual(9);
            expect(kanbanObj.element.querySelectorAll('.e-card-header').length).toEqual(0);
            kanbanObj.cardSettings.showHeader = true;
            kanbanObj.dataBind();
            expect(kanbanObj.element.querySelectorAll('.e-card').length).toEqual(9);
            expect(kanbanObj.element.querySelectorAll('.e-card-header').length).toEqual(9);
        });

        it('height propety testing', () => {
            expect(kanbanObj.element.style.height).toEqual('auto');
            kanbanObj.height = 500;
            kanbanObj.dataBind();
            expect(kanbanObj.element.style.height).toEqual('500px');
        });

        it('width propety testing', () => {
            expect(kanbanObj.element.style.width).toEqual('auto');
            kanbanObj.width = 500;
            kanbanObj.dataBind();
            expect(kanbanObj.element.style.width).toEqual('500px');
        });

        it('template parser method testing', () => {
            expect(kanbanObj.templateParser(null)).toBeUndefined();
            expect(kanbanObj.templateParser('<div></div>')({}).length).toEqual(1);
        });
    });

    describe('RenderHeader using method', () => {
        let kanbanObj: Kanban;
        let dataSourceEventCalled: boolean = false;
        beforeAll((done: DoneFn) => {
            const model: KanbanModel = {
                columns: [
                    { headerText: 'Backlog', keyField: 'Open, Review', allowToggle: true, minCount: 5, maxCount: 10 },
                    { headerText: 'In Progress', keyField: 'InProgress', allowToggle: true, minCount: 1, maxCount: 3 },
                    { headerText: 'Testing', keyField: 'Testing', allowToggle: true, minCount: 1, maxCount: 5 },
                    { headerText: 'Done', keyField: 'Close', allowToggle: true, minCount: 0, maxCount: 0 }
                ],
                swimlaneSettings: {
                    keyField: 'Assignee'
                },
                sortSettings: {
                    direction: 'Descending',
                    sortBy: 'DataSourceOrder'
                },
                dialogSettings: {
                    model: { width: 500 },
                    fields: [
                        { text: 'ID', key: 'Id', type: 'TextBox' },
                        { key: 'Status', type: 'DropDown' },
                        { key: 'Assignee', type: 'DropDown' },
                        { key: 'Estimate', type: 'Numeric', validationRules: { range: [0, 1000] } },
                        { key: 'Summary', type: 'TextArea', validationRules: { required: true } }
                    ]
                },
                constraintType: 'Swimlane',
                dataSourceChanged: dataSourceChangedEvent
            };
            kanbanObj = util.createKanban(model, kanbanData.slice(0, 20), done);
            
            function dataSourceChangedEvent (args: any) {
                dataSourceEventCalled = true;
            }
        });

        afterAll(() => {
            util.destroy(kanbanObj);
        });

        it('reRender the header using public method', () => {
            kanbanObj.refreshHeader();
        });

        it('onProperty change of dialogSettings', () => {
            expect(kanbanObj.dialogSettings.model.width === 500).toBe(true);
            kanbanObj.dialogSettings.model = { width: 1000 };
            kanbanObj.dataBind();
            expect(kanbanObj.dialogSettings.model.width === 1000).toBe(true);
        });

        it('onProperty change of sortSettings', () => {
            expect(kanbanObj.sortSettings.direction === 'Descending').toBe(true);
            kanbanObj.sortSettings.direction = 'Ascending';
            kanbanObj.dataBind();
            expect(kanbanObj.sortSettings.direction === 'Ascending').toBe(true);
        });

        it('update a card', () => {
            const card: Record<string, any> = kanbanObj.kanbanData[0];
            (card as any).Summary = 'updateCard';
            kanbanObj.updateCard(card, 0);
            expect((card as any).Summary === 'updateCard').toBe(true);
            expect(dataSourceEventCalled).toBe(true);
        });

        it('Add a new card', () => {
            const card: Record<string, any> = kanbanObj.kanbanData[0];
            const length: number = kanbanObj.kanbanData.length;
            (card as any).Id = kanbanObj.kanbanData.length + 1;
            kanbanObj.addCard(card, 0);
            expect(length + 1 === kanbanObj.kanbanData.length).toBe(true);

        });
    });

    describe('Local data with id as string type', () => {
        let kanbanObj: Kanban;
        beforeAll((done: DoneFn) => {
            const kanbanData: Record<string, any>[] = [
                {
                    'Id': '1',
                    'Status': 'Backlog',
                    'Summary': 'Analyze the new requirements gathered from the customer.',
                    'Type': 'Story'
                },
                {
                    'Id': '2',
                    'Status': 'InProgress',
                    'Summary': 'Improve application performance',
                    'Type': 'Improvement'
                },
                {
                    'Id': '3',
                    'Status': 'Backlog',
                    'Summary': 'Arrange a web meeting with the customer to get new requirements.',
                    'Type': 'Others'
                },
                {
                    'Id': '4',
                    'Status': 'InProgress',
                    'Summary': 'Fix the issues reported in the IE browser.',
                    'Type': 'Bug'
                },
                {
                    'Id': '5',
                    'Status': 'Done',
                    'Summary': 'Fix the issues reported by the customer.',
                    'Type': 'Bug'
                }];
            const model: KanbanModel = {
                columns: [
                    { headerText: 'Backlog', keyField: 'Open, Review', allowToggle: true, minCount: 5, maxCount: 10 },
                    { headerText: 'In Progress', keyField: 'InProgress', allowToggle: true, minCount: 1, maxCount: 3 },
                    { headerText: 'Testing', keyField: 'Testing', allowToggle: true, minCount: 1, maxCount: 5 },
                    { headerText: 'Done', keyField: 'Close', allowToggle: true, minCount: 0, maxCount: 0 }
                ],
                swimlaneSettings: {
                    keyField: 'Assignee'
                },
                sortSettings: {
                    direction: 'Descending',
                    sortBy: 'Index'
                },
                dialogSettings: {
                    model: { width: 500 },
                    fields: [
                        { text: 'ID', key: 'Id', type: 'TextBox' },
                        { key: 'Status', type: 'DropDown' },
                        { key: 'Assignee', type: 'DropDown' },
                        { key: 'Estimate', type: 'Numeric', validationRules: { range: [0, 1000] } },
                        { key: 'Summary', type: 'TextArea', validationRules: { required: true } }
                    ]
                },
                constraintType: 'Swimlane'
            };
            kanbanObj = util.createKanban(model, kanbanData, done);
        });

        afterAll(() => {
            util.destroy(kanbanObj);
        });

        it('check Id type as string', () => {
            const target: HTMLElement = document.querySelector('.e-card');
            const cardDetail: Object = kanbanObj.getCardDetails(target);
            expect(typeof (cardDetail as any).Id === 'string').toBe(true);
        });
        it('get Column data as []', () => {
            const data: Object = kanbanObj.getColumnData('conpleted', kanbanObj.kanbanData);
            expect((data as any).length === 0).toBe(true);
            const data1: Object = kanbanObj.getSwimlaneData('John');
            expect((data1 as any).length === 0).toBe(true);
        });

        it('onProperty change of dialogSettings', () => {
            expect(kanbanObj.dialogSettings.model.width === 500).toBe(true);
            kanbanObj.dialogSettings.model = { width: 1000 };
            kanbanObj.dataBind();
            expect(kanbanObj.dialogSettings.model.width === 1000).toBe(true);
        });
    });
    describe('EJ2-54420-Swimlane row is not created when kanban keyField has 0 value alone -', () => {
        let kanbanObj: Kanban;
        let allKeys: string[];
        let rows: string[];
        beforeAll((done: DoneFn) => {
            const kanbanData: Record<string, any>[] = [
                {
                    'Id': 1,
                    'Status': 0,
                    'Summary': 'Analyze the new requirements gathered from the customer.',
                    'Type': 'Story',
                    'Priority': 'Low',
                    'Tags': 'Analyze,Customer',
                    'Estimate': 3.5,
                    'Assignee': 'group 0',
                    'RankId': 0
                },
                {
                    'Id': 2,
                    'Status': 0,
                    'Summary': 'Improve application performance',
                    'Type': 'Improvement',
                    'Priority': 'Normal',
                    'Tags': 'Improvement',
                    'Estimate': 6,
                    'Assignee': 'group 0',
                    'RankId': 0
                },
                {
                    'Id': 3,
                    'Status': 0,
                    'Summary': 'Arrange a web meeting with the customer to get new requirements.',
                    'Type': 'Others',
                    'Priority': 'Critical',
                    'Tags': 'Meeting',
                    'Estimate': 5.5,
                    'Assignee': 'group 0',
                    'RankId': 2
                },
                {
                    'Id': 4,
                    'Status': 2,
                    'Summary': 'Fix the issues reported in the IE browser.',
                    'Type': 'Bug',
                    'Priority': 'Release Breaker',
                    'Tags': 'IE',
                    'Estimate': 2.5,
                    'Assignee': 'group 2',
                    'RankId': 2
                },
                {
                    'Id': 5,
                    'Status': 1,
                    'Summary': 'Fix the issues reported by the customer.',
                    'Type': 'Bug',
                    'Priority': 'Low',
                    'Tags': 'Customer',
                    'Estimate': '3.5',
                    'Assignee': 'group 1',
                    'RankId': 1
                },
                {
                    'Id': 6,
                    'Status': 2,
                    'Summary': 'Arrange a web meeting with the customer to get the login page requirements.',
                    'Type': 'Others',
                    'Priority': 'Low',
                    'Tags': 'Meeting',
                    'Estimate': 2,
                    'Assignee': 'group 2',
                    'RankId': 1
                },
                {
                    'Id': 7,
                    'Status': 1,
                    'Summary': 'Validate new requirements',
                    'Type': 'Improvement',
                    'Priority': 'Low',
                    'Tags': 'Validation',
                    'Estimate': 1.5,
                    'Assignee': 'group 1',
                    'RankId': 1
                },
                {
                    'Id': 8,
                    'Status': 2,
                    'Summary': 'Login page validation',
                    'Type': 'Story',
                    'Priority': 'Release Breaker',
                    'Tags': 'Validation,Fix',
                    'Estimate': 2.5,
                    'Assignee': 'group 3',
                    'RankId': 2
                },
                {
                    'Id': 9,
                    'Status': 1,
                    'Summary': 'Fix the issues reported in Safari browser.',
                    'Type': 'Bug',
                    'Priority': 'Release Breaker',
                    'Tags': 'Fix,Safari',
                    'Estimate': 1.5,
                    'Assignee': 'group 2',
                    'RankId': 2
                },
                {
                    'Id': 10,
                    'Status': 3,
                    'Summary': 'Test the application in the IE browser.',
                    'Type': 'Story',
                    'Priority': 'Low',
                    'Tags': 'Testing,IE',
                    'Estimate': 5.5,
                    'Assignee': 'group 3',
                    'RankId': 3
                }
            ];
            const model: KanbanModel = {
                keyField: 'Status',
                columns: [
                    { headerText: 'Backlog', keyField: 0 },
                    { headerText: 'In Progress', keyField: 1 },
                    { headerText: 'Testing', keyField: 2 },
                    { headerText: 'Done', keyField: 3 }
                ],
                swimlaneSettings: {
                    keyField: 'Assignee'
                },
                cardSettings: {
                    contentField: 'Summary',
                    headerField: 'Id'
                }
            };
            kanbanObj = util.createKanban(model, kanbanData, done);
            allKeys = kanbanData.map((obj: { [key: string]: string }) => obj[kanbanObj.swimlaneSettings.keyField]);
            rows = allKeys.filter((key: string, index: number) => allKeys.indexOf(key) === index).sort();
        });

        afterAll(() => {
            util.destroy(kanbanObj);
        });

        it('Check swimlane rendered when Kanban KeyField has value as zero', () => {
            expect(kanbanObj.element.querySelectorAll('.e-swimlane-row').length).toEqual(rows.length);
            expect(kanbanObj.element.querySelectorAll('.e-content-row:not(.e-swimlane-row)').length).toEqual(rows.length);
        });
    });

    describe('EJ2-54004-Card is not rendered when Kanban KeyField has value 0 -', () => {
        let kanbanObj: Kanban;
        beforeAll((done: DoneFn) => {
            const kanbanData: Record<string, any>[] = [
                {
                    'Id': 10,
                    'Status': 'Backlog',
                    'Summary': 'Analyze the new requirements gathered from the customer.',
                    'Type': 'Story',
                    'Assignee': 'Janet Leverling',
                    'RankId': 1
                },
                {
                    'Id': 9,
                    'Status': 'InProgress',
                    'Summary': 'Improve application performance',
                    'Type': 'Improvement',
                    'Assignee': 'Janet Leverling',
                    'RankId': 0
                },
                {
                    'Id': 8,
                    'Status': 'Backlog',
                    'Summary': 'Arrange a web meeting with the customer to get new requirements.',
                    'Type': 'Others',
                    'Assignee': 'Janet',
                    'RankId': 2
                },
                {
                    'Id': 7,
                    'Status': 'InProgress',
                    'Summary': 'Fix the issues reported in the IE browser.',
                    'Type': 'Bug',
                    'Assignee': 'Janet Leverling',
                    'RankId': 2
                },
                {
                    'Id': 6,
                    'Status': 'Done',
                    'Summary': 'Fix the issues reported by the customer.',
                    'Type': 'Bug',
                    'Assignee': 'Janet',
                    'RankId': 0
                }
            ];
            const model: KanbanModel = {
                columns: [
                    { headerText: 'Backlog', keyField: 0},
                    { headerText: 'In Progress', keyField: 1 },
                    { headerText: 'Testing', keyField: 0 },
                    { headerText: 'Done', keyField: 2 }
                ],
                swimlaneSettings: {
                    keyField: 'Assignee'
                },
                cardSettings: {
                    showHeader: true,
                    contentField: 'Summary',
                    headerField: 'Id'
                },
                keyField: 'RankId',
            };
            kanbanObj = util.createKanban(model, kanbanData, done);
        });

        afterAll(() => {
            util.destroy(kanbanObj);
        });

        it('Check card rendered when Kanban KeyField has value as zero', () => {
            expect(document.querySelector('tr[data-key="Janet"] .e-item-count').innerHTML).toEqual('- 2 items');
            expect(document.querySelector('tr[data-key="Janet Leverling"] .e-item-count').innerHTML).toEqual('- 3 items');
        });
    });

    describe('Check kanban with scroller', () => {
        let kanbanObj: Kanban;
        beforeAll((done: DoneFn) => {
            const model: KanbanModel = {
                keyField: 'Status',
                height: '550px',
                columns: [
                    { headerText: 'Backlog', keyField: 'Open', showAddButton: true, isExpanded: false },
                    { headerText: 'In Progress', keyField: 'InProgress' },
                    { headerText: 'Testing', keyField: 'Testing' },
                    { headerText: 'Done', keyField: 'Close' }
                ],
                sortSettings: {
                    sortBy: 'Custom',
                    field: 'Summary',
                    direction: 'Descending'
                },
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

        it('Content Scroller functionality checking', () => {
            const contentArea: HTMLElement = document.querySelector('.e-kanban-content');
            expect(kanbanObj.scrollPosition.content.left).toEqual(0);
            expect(kanbanObj.scrollPosition.content.top).toEqual(0);
            util.triggerScrollEvent(contentArea, 300);
        });
        it('Content Scroller functionality checking top and height value', () => {
            expect(kanbanObj.scrollPosition.content.left).toEqual(0);
            (kanbanObj.element.querySelector('.e-content-cells') as any).height = '500px';
        });
        it('Column Scroller functionality checking', () => {
            const contentArea: HTMLElement = kanbanObj.element.querySelector('.e-card-wrapper');
            const key: any = contentArea.offsetParent.getAttribute('data-key');
            expect(kanbanObj.scrollPosition.column[key].left).toEqual(0);
            expect(kanbanObj.scrollPosition.column[key].top).toEqual(0);
            util.triggerScrollEvent(contentArea, 300);
        });
        it('Column Scroller functionality checking', () => {
            const contentArea: HTMLElement = kanbanObj.element.querySelector('.e-card-wrapper');
            const key: any = contentArea.offsetParent.getAttribute('data-key');
            expect(kanbanObj.scrollPosition.column[key].top).toEqual(300);
            expect(kanbanObj.scrollPosition.column[key].left).toEqual(0);
        });
    });

    describe('Key field as number type using methods', () => {
        let kanbanObj: Kanban;
        beforeAll((done: DoneFn) => {
            const data: Record<string, any>[] = [
                {
                    'Id': 1,
                    'Status': 'Open',
                    'StatusNum' : 1,
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
                    'StatusNum' : 2,
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
                    'StatusNum' : 1,
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
                    'StatusNum' : 2,
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
                    'Status': 'Testing',
                    'StatusNum' : 3,
                    'Summary': 'Fix the issues reported by the customer.',
                    'Type': 'Bug',
                    'Priority': 'Low',
                    'Tags': 'Customer',
                    'Estimate': '3.5',
                    'Assignee': 'Steven walker',
                    'AssigneeName': 'Steven',
                    'RankId': 1
                },
                {
                    'Id': 6,
                    'Status': 'Close',
                    'StatusNum' : 4,
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
                    'Id': 7,
                    'Status': 'Validate',
                    'StatusNum' : 5,
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
                    'Id': 8,
                    'Status': 'Close',
                    'StatusNum' : 4,
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
                    'Id': 9,
                    'Status': 'Testing',
                    'StatusNum' : 3,
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
                    'Id': 10,
                    'Status': 'Close',
                    'StatusNum' : 4,
                    'Summary': 'Test the application in the IE browser.',
                    'Type': 'Story',
                    'Priority': 'Low',
                    'Tags': 'Testing,IE',
                    'Estimate': 5.5,
                    'Assignee': 'Janet Leverling',
                    'AssigneeName': 'Janet',
                    'RankId': 3
                }
            ];
            const model: KanbanModel = {
                keyField: 'StatusNum',
                dataSource: data,
                columns: [
                    { headerText: 'Backlog', keyField: 1 },
                    { headerText: 'In Progress', keyField: 2 },
                    { headerText: 'Testing', keyField: 3 },
                    { headerText: 'Done', keyField: 4 }
                ],
                sortSettings: {
                    sortBy: 'Custom',
                    field: 'Summary',
                    direction: 'Descending'
                },
                cardSettings: {
                    contentField: 'Summary',
                    headerField: 'Id'
                }
            };
            kanbanObj = util.createKanban(model, data, done);
        });

        afterAll(() => {
            util.destroy(kanbanObj);
        });

        it('testing to show and hide column', () => {
            expect(kanbanObj.columns.length).toEqual(4);
            kanbanObj.hideColumn(2);
            expect(kanbanObj.element.querySelectorAll('.e-header-cells').length).toEqual(3);
        });

        it('testing to show and hide column', () => {
            expect(kanbanObj.element.querySelectorAll('.e-header-cells').length).toEqual(3);
            kanbanObj.showColumn(2);
            expect(kanbanObj.element.querySelectorAll('.e-header-cells').length).toEqual(4);
            kanbanObj.showColumn(4);
            expect(kanbanObj.element.querySelectorAll('.e-header-cells').length).toEqual(4);
        });

        it('testing to update card method', () => {
            const cardData: Record<string, any> = kanbanObj.kanbanData.filter((data: Record<string, any>) =>
            data[kanbanObj.cardSettings.headerField] === 2)[0] as Record<string, any>;
            expect((cardData as any).StatusNum === 2).toBe(true);
            const curData: Record<string, any> = {
                Id: 2, StatusNum: 1, Priority: '', Assignee: 'Andrew Fuller', Estimate: 0, Tags: '', Summary: 'Content for 2'
            };
            kanbanObj.updateCard(curData);
            const cardData1: Record<string, any> = kanbanObj.kanbanData.filter((data: Record<string, any>) =>
            data[kanbanObj.cardSettings.headerField] === 2)[0] as Record<string, any>;
            expect((cardData1 as any).StatusNum === 1).toBe(true);
        });

        it('testing to getColumnCards', () => {
            kanbanObj.getColumnData(1);
            expect(kanbanObj.element.querySelectorAll('.e-content-cells[data-key="' + 1 + '"] .e-card').length).toEqual(3);
            kanbanObj.getColumnData(2);
            expect(kanbanObj.element.querySelectorAll('.e-content-cells[data-key="' + 2 + '"] .e-card').length).toEqual(1);
            kanbanObj.getColumnData(3);
            expect(kanbanObj.element.querySelectorAll('.e-content-cells[data-key="' + 3 + '"] .e-card').length).toEqual(2);
            kanbanObj.getColumnData(4);
            expect(kanbanObj.element.querySelectorAll('.e-content-cells[data-key="' + 4 + '"] .e-card').length).toEqual(3);
        });
    });

    describe('Check frozen row', () => {
        let kanbanObj: Kanban;
        beforeAll((done: DoneFn) => {
            const model: KanbanModel = {
                keyField: 'Status',
                height: 500,
                columns: [
                    { headerText: 'Backlog', keyField: 'Open', showAddButton: true, isExpanded: false },
                    { headerText: 'In Progress', keyField: 'InProgress' },
                    { headerText: 'Testing', keyField: 'Testing' },
                    { headerText: 'Done', keyField: 'Close' }
                ],
                cardSettings: {
                    contentField: 'Summary',
                    headerField: 'Id'
                },
                swimlaneSettings: {
                    keyField: 'Assignee',
                    enableFrozenRows: true
                }
            };
            kanbanObj = util.createKanban(model, kanbanData, done);
        });

        afterAll(() => {
            util.destroy(kanbanObj);
        });

        it('Check freeze row', () => {
            const contentArea: HTMLElement = document.querySelector('.e-kanban-content');
            expect(kanbanObj.scrollPosition.content.left).toEqual(0);
            expect(kanbanObj.scrollPosition.content.top).toEqual(0);
            util.triggerScrollEvent(contentArea, 300);
        });
        it('Check freeze swimlane row with root element', () => {
            const kanban: HTMLElement = document.querySelector('.e-kanban');
            expect(kanban.firstElementChild.classList.contains('e-frozen-swimlane-row')).toEqual(true);
            expect(kanban.children[1].classList.contains('e-spinner-pane')).toEqual(true);
            expect(kanban.children[2].classList.contains('e-kanban-header')).toEqual(true);
            expect(kanban.children[3].classList.contains('e-kanban-content')).toEqual(true);
        });
        it('Render the freeze swimlane row', () => {
            const frozenSwimlaneRow: HTMLElement = document.querySelector('.e-frozen-swimlane-row');
            expect(frozenSwimlaneRow.firstElementChild.classList.contains('e-frozen-row')).toEqual(true);
            expect(frozenSwimlaneRow.querySelector('.e-frozen-row').firstElementChild.classList.contains('e-swimlane-header')).toEqual(true);
            expect(frozenSwimlaneRow.querySelector('.e-swimlane-header').childElementCount).toEqual(3);
            expect(frozenSwimlaneRow.querySelector('.e-swimlane-header').firstElementChild.classList.contains('e-icons')).toEqual(true);
            expect(frozenSwimlaneRow.querySelector('.e-swimlane-header').firstElementChild.classList.contains('e-swimlane-row-expand')).toEqual(true);
            expect(frozenSwimlaneRow.querySelector('.e-header-wrap').firstElementChild.classList.contains('e-swimlane-text')).toEqual(true);
            expect(frozenSwimlaneRow.querySelector('.e-header-wrap').firstElementChild.getAttribute('data-role')).toEqual('Andrew Fuller');
            expect(frozenSwimlaneRow.querySelector('.e-item-count').innerHTML).toEqual('- 10 items');
        });
        it('Dynamically changed the freeze swimlane row content', () => {
            const contentArea: HTMLElement = document.querySelector('.e-kanban-content');
            expect(kanbanObj.scrollPosition.content.left).toEqual(0);
            expect(kanbanObj.scrollPosition.content.top).toEqual(300);
            util.triggerScrollEvent(contentArea, 600);
        });
        it('Check dynamically changed the freeze swimlane row content', () => {
            const frozenSwimlaneRow: HTMLElement = document.querySelector('.e-frozen-swimlane-row');
            expect(frozenSwimlaneRow.firstElementChild.classList.contains('e-frozen-row')).toEqual(true);
            expect(frozenSwimlaneRow.querySelector('.e-frozen-row').firstElementChild.classList.contains('e-swimlane-header')).toEqual(true);
            expect(frozenSwimlaneRow.querySelector('.e-swimlane-header').childElementCount).toEqual(3);
            expect(frozenSwimlaneRow.querySelector('.e-swimlane-header').firstElementChild.classList.contains('e-icons')).toEqual(true);
            expect(frozenSwimlaneRow.querySelector('.e-swimlane-header').firstElementChild.classList.contains('e-swimlane-row-expand')).toEqual(true);
            expect(frozenSwimlaneRow.querySelector('.e-header-wrap').firstElementChild.classList.contains('e-swimlane-text')).toEqual(true);
            expect(frozenSwimlaneRow.querySelector('.e-header-wrap').firstElementChild.getAttribute('data-role')).toEqual('Janet Leverling');
            expect(frozenSwimlaneRow.querySelector('.e-item-count').innerHTML).toEqual('- 12 items');
        });
        it('Dynamically disabled the freeze swimlane row property', () => {
            const contentArea: HTMLElement = document.querySelector('.e-kanban-content');
            expect(kanbanObj.swimlaneSettings.enableFrozenRows).toEqual(true);
            kanbanObj.swimlaneSettings.enableFrozenRows = false;
            kanbanObj.dataBind();
            expect(kanbanObj.swimlaneSettings.enableFrozenRows).toEqual(false);
            const kanban: HTMLElement = document.querySelector('.e-kanban');
            expect(kanban.firstElementChild.classList.contains('e-frozen-swimlane-row')).toEqual(false);
        });
        it('Disabled freeze swimlane row property', () => {
            const kanban: HTMLElement = document.querySelector('.e-kanban');
            expect(kanban.firstElementChild.classList.contains('e-frozen-swimlane-row')).toEqual(false);
            const contentArea: HTMLElement = document.querySelector('.e-kanban-content');
            expect(kanbanObj.scrollPosition.content.left).toEqual(0);
            expect(kanbanObj.scrollPosition.content.top).toEqual(0);
        });
    });

    describe('EJ2-52138 - Undefined key field data source', () => {
        let kanbanObj: Kanban;
        beforeAll((done: DoneFn) => {
            const kanbanData: Record<string, any>[] = [
                {
                    'Id': 1,
                    'Status': 'Open',
                    'StatusNum' : 1,
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
                    'StatusNum' : 2,
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
                    'StatusNum' : 1,
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
                    'Status': '',
                    'StatusNum' : 2,
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
                    'Status': 'Testing',
                    'StatusNum' : 3,
                    'Summary': 'Fix the issues reported by the customer.',
                    'Type': 'Bug',
                    'Priority': 'Low',
                    'Tags': 'Customer',
                    'Estimate': '3.5',
                    'Assignee': 'Steven walker',
                    'AssigneeName': 'Steven',
                    'RankId': 1
                },
                {
                    'Id': 6,
                    'Status': 'Close',
                    'StatusNum' : 4,
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
                    'Id': 7,
                    'StatusNum' : 4,
                    'Summary': 'Arrange a web meeting with the customer to get the login page requirements.',
                    'Type': 'Others',
                    'Priority': 'Low',
                    'Tags': 'Meeting',
                    'Estimate': 2,
                    'Assignee': 'Robert',
                    'RankId': 1
                }
            ];
            const model: KanbanModel = {
                keyField: 'Status',
                dataSource: kanbanData,
                height: 500,
                columns: [
                    { headerText: 'Backlog', keyField: 'Open', showAddButton: true },
                    { headerText: 'In Progress', keyField: 'InProgress' },
                    { headerText: 'Testing', keyField: 'Testing' },
                    { headerText: 'Done', keyField: 'Close' }
                ],
                cardSettings: {
                    contentField: 'Summary',
                    headerField: 'Id'
                },
                swimlaneSettings: {
                    keyField: 'Assignee',
                    showEmptyRow: true
                }
            };
            kanbanObj = util.createKanban(model, kanbanData, done);
        });

        afterAll(() => {
            util.destroy(kanbanObj);
        });

        it('KeyField as undefined', () => {
            expect(kanbanObj.element.querySelectorAll('.e-content-table').length).toBe(1);
        });

        it('Card rendering testing', () => {
            expect(kanbanObj.kanbanData.length).toEqual(7);
            expect(kanbanObj.element.querySelectorAll('.e-card').length).toEqual(4);
        });
        it('Swimlane row and content row count testing', () => {
            expect(kanbanObj.element.querySelectorAll('.e-swimlane-row').length).toEqual(4);
            expect(kanbanObj.element.querySelectorAll('.e-content-row:not(.e-swimlane-row)').length).toEqual(4);
            kanbanObj.swimlaneSettings.showEmptyRow = false;
            kanbanObj.dataBind();
            expect(kanbanObj.element.querySelectorAll('.e-swimlane-row').length).toEqual(2);
            expect(kanbanObj.element.querySelectorAll('.e-content-row:not(.e-swimlane-row)').length).toEqual(2);
        });
    });

    it('memory leak', () => {
        profile.sample();
        const average: number = inMB(profile.averageChange);
        //Check average change in memory samples to not be over 10MB
        expect(average).toBeLessThan(10);
        const memory: number = inMB(getMemoryProfile());
        //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    });

});
describe('EJ2-62999-In kanban unique Id is not generated automatically when we do not set the Id property', () => {
    let kanbanObj: Kanban;
    const divElement: HTMLElement = createElement('div', {
        className: 'defaultKanban' });
    beforeAll((done: DoneFn) => {
        document.body.appendChild(divElement);
        kanbanObj = new Kanban({});
        const target: HTMLElement = document.querySelector('.defaultKanban');
        kanbanObj.appendTo(target);
        done();
    });
    afterAll(() => {
        util.destroy(kanbanObj);
    });
    it('check the id genarated or not', () => {
        expect(kanbanObj.element.hasAttribute('id')).toBe(true);
    });
});

