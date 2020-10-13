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
        // tslint:disable:no-any
        const isDef: (o: any) => boolean = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            // tslint:disable-next-line:no-console
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
            let colElements: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-header-table colgroup col');
            kanbanObj.columns.forEach((column: ColumnsModel, index: number) => {
                expect(colElements.item(index).getAttribute('data-key')).toEqual(column.keyField);
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
            let headerCells: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-header-cells');
            kanbanObj.columns.forEach((column: ColumnsModel, index: number) => {
                expect(headerCells.item(index).getAttribute('data-key')).toBe(column.keyField);
                expect(headerCells.item(index).getAttribute('data-role')).toBe('kanban-column');
            });
        });

        it('Header text testing', () => {
            let headerText: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-header-cells .e-header-text');
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
            let colElements: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-content-table colgroup col');
            kanbanObj.columns.forEach((column: ColumnsModel, index: number) => {
                expect(colElements.item(index).getAttribute('data-key')).toBe(column.keyField);
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
            let colElements: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-header-table colgroup col');
            kanbanObj.columns.forEach((column: ColumnsModel, index: number) => {
                expect(colElements.item(index).getAttribute('data-key')).toBe(column.keyField);
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
            let headerCells: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-header-cells');
            kanbanObj.columns.forEach((column: ColumnsModel, index: number) => {
                expect(headerCells.item(index).getAttribute('data-key')).toBe(column.keyField);
                expect(headerCells.item(index).getAttribute('data-role')).toBe('kanban-column');
            });
        });

        it('Header text testing', () => {
            let headerText: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-header-cells .e-header-text');
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
            let colElements: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-content-table colgroup col');
            kanbanObj.columns.forEach((column: ColumnsModel, index: number) => {
                expect(colElements.item(index).getAttribute('data-key')).toBe(column.keyField);
            });
        });

        it('Content table data testing', () => {
            expect(kanbanObj.element.querySelector('.e-content-table tbody').childElementCount).toBe(1);
            expect(kanbanObj.element.querySelector('.e-content-row').childElementCount).toEqual(4);
        });

        it('Datasource property and card rendering testing', () => {
            expect((kanbanObj.dataSource as Object[]).length).toBe(75);
            expect(kanbanObj.element.querySelectorAll('.e-card').length).toBe(64);
        });

        it('Content table height testing', () => {
            expect((kanbanObj.element.querySelectorAll('.e-kanban-content').item(0) as HTMLElement).style.height).not.toBe('0px');
        });

        it('Content table colgroup testing', () => {
            expect(kanbanObj.element.querySelector('.e-content-table colgroup').childElementCount).toEqual(4);
        });

        it('Content table colgroup data-key testing', () => {
            let colElements: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-content-table colgroup col');
            kanbanObj.columns.forEach((column: ColumnsModel, index: number) => {
                expect(colElements.item(index).getAttribute('data-key')).toBe(column.keyField);
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
            let contentCells: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-content-cells');
            kanbanObj.columns.forEach((column: ColumnsModel, index: number) => {
                expect(contentCells.item(index).getAttribute('data-key')).toBe(column.keyField);
                expect(contentCells.item(index).getAttribute('data-role')).toBe('kanban-column');
                expect(contentCells.item(index).firstElementChild.classList.contains('e-card-wrapper')).toBe(true);
            });
        });

        it('Card count testing', () => {
            let contentCells: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-content-cells');
            expect(contentCells.item(0).firstElementChild.childElementCount).toBe(14);
            expect(contentCells.item(1).firstElementChild.childElementCount).toBe(13);
            expect(contentCells.item(2).firstElementChild.childElementCount).toBe(15);
            expect(contentCells.item(3).firstElementChild.childElementCount).toBe(22);
        });

        it('First column card class and inner layout testing', () => {
            let cards: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-content-cells:nth-child(1) .e-card');
            expect(kanbanObj.element.querySelector('.e-kanban-content').classList.contains('e-draggable')).toBe(true);
            cards.forEach((card: HTMLElement) => {
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
            let cards: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-content-cells:nth-child(2) .e-card');
            expect(kanbanObj.element.querySelector('.e-kanban-content').classList.contains('e-draggable')).toBe(true);
            cards.forEach((card: HTMLElement) => {
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
            let cards: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-content-cells:nth-child(3) .e-card');
            expect(kanbanObj.element.querySelector('.e-kanban-content').classList.contains('e-draggable')).toBe(true);
            cards.forEach((card: HTMLElement) => {
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
            let cards: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-content-cells:nth-child(4) .e-card');
            expect(kanbanObj.element.querySelector('.e-kanban-content').classList.contains('e-draggable')).toBe(true);
            cards.forEach((card: HTMLElement) => {
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

    xdescribe('actionFailure testing', () => {
        let actionFailedFunction: () => void = jasmine.createSpy('actionFailure');
        let kanbanObj: Kanban;
        beforeAll(() => {
            jasmine.Ajax.install();
            let dataManager: DataManager = new DataManager({ url: 'api/Kanban/Cards/' });
            let model: KanbanModel = { actionFailure: actionFailedFunction };
            kanbanObj = util.createKanban(model, dataManager);
        });
        beforeEach((done: Function) => {
            let request: JasmineAjaxRequest = jasmine.Ajax.requests.at(1);
            request.respondWith({ 'status': 404, 'contentType': 'application/json', 'responseText': 'Page not found' });
            done();
        });
        it('actionFailure testing', () => {
            expect(actionFailedFunction).toHaveBeenCalled();
        });
        afterAll(() => {
            util.destroy(kanbanObj);
            jasmine.Ajax.uninstall();
        });
    });

    describe('actionFailure event after kanban destroy testing', () => {
        let actionFailedFunction: () => void = jasmine.createSpy('actionFailure');
        let kanbanObj: Kanban;
        beforeAll(() => {
            jasmine.Ajax.install();
            let dataManager: DataManager = new DataManager({ url: 'api/Kanban/Cards/' });
            let model: KanbanModel = { actionFailure: actionFailedFunction };
            kanbanObj = util.createKanban(model, dataManager);
            util.destroy(kanbanObj);
        });
        beforeEach((done: Function) => {
            let request: JasmineAjaxRequest = jasmine.Ajax.requests.at(1);
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
            let model: KanbanModel = {
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
            let colElements: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-header-table colgroup col');
            kanbanObj.columns.forEach((column: ColumnsModel, index: number) => {
                expect(colElements.item(index).getAttribute('data-key')).toBe(column.keyField);
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
            let headerCells: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-header-cells');
            kanbanObj.columns.forEach((column: ColumnsModel, index: number) => {
                expect(headerCells.item(index).getAttribute('data-key')).toBe(column.keyField);
                expect(headerCells.item(index).getAttribute('data-role')).toBe('kanban-column');
            });
        });

        it('Header text testing', () => {
            let headerText: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-header-cells .e-header-text');
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
            let colElements: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-content-table colgroup col');
            kanbanObj.columns.forEach((column: ColumnsModel, index: number) => {
                expect(colElements.item(index).getAttribute('data-key')).toBe(column.keyField);
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
            let swimlaneRows: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-swimlane-row');
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
            let colElements: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-content-table colgroup col');
            kanbanObj.columns.forEach((column: ColumnsModel, index: number) => {
                expect(colElements.item(index).getAttribute('data-key')).toBe(column.keyField);
            });
        });

        it('Swimlane rows data-key and rendering layout testing', () => {
            let swimlaneRows: NodeList = kanbanObj.element.querySelectorAll('.e-swimlane-row');
            for (let i: number = 0; i < swimlaneRows.length; i++) {
                expect((<HTMLElement>swimlaneRows[i]).getAttribute('data-key')).toBe(rows[i]);
                expect((<HTMLElement>swimlaneRows[i]).childElementCount).toBe(1);
                let child: HTMLElement = (<HTMLElement>swimlaneRows[i]).firstElementChild as HTMLElement;
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
            let cells: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-content-row:not(.e-swimlane-row) .e-content-cells');
            kanbanObj.columns.forEach((column: ColumnsModel, index: number) => {
                expect(cells.item(index).getAttribute('data-key')).toBe(column.keyField);
                expect(cells.item(index).getAttribute('data-role')).toBe('kanban-column');
                expect(cells.item(index).firstElementChild.classList.contains('e-card-wrapper')).toBe(true);
            });
        });

        it('Card count testing', () => {
            let cells: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-content-row:not(.e-swimlane-row) .e-content-cells');
            expect(cells.item(0).firstElementChild.childElementCount).toBe(4);
            expect(cells.item(1).firstElementChild.childElementCount).toBe(1);
            expect(cells.item(2).firstElementChild.childElementCount).toBe(1);
            expect(cells.item(3).firstElementChild.childElementCount).toBe(4);
        });

        it('First column card class and inner layout testing', () => {
            let columnSelector: string = '.e-content-row:not(.e-swimlane-row) .e-content-cells:nth-child(1) .e-card';
            let cards: NodeListOf<Element> = kanbanObj.element.querySelectorAll(columnSelector);
            expect(kanbanObj.element.querySelector('.e-kanban-content').classList.contains('e-draggable')).toBe(true);
            cards.forEach((card: HTMLElement) => {
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
            let columnSelector: string = '.e-content-row:not(.e-swimlane-row) .e-content-cells:nth-child(2) .e-card';
            let cards: NodeListOf<Element> = kanbanObj.element.querySelectorAll(columnSelector);
            expect(kanbanObj.element.querySelector('.e-kanban-content').classList.contains('e-draggable')).toBe(true);
            cards.forEach((card: HTMLElement) => {
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
            let columnSelector: string = '.e-content-row:not(.e-swimlane-row) .e-content-cells:nth-child(3) .e-card';
            let cards: NodeListOf<Element> = kanbanObj.element.querySelectorAll(columnSelector);
            expect(kanbanObj.element.querySelector('.e-kanban-content').classList.contains('e-draggable')).toBe(true);
            cards.forEach((card: HTMLElement) => {
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
            let columnSelector: string = '.e-content-row:not(.e-swimlane-row) .e-content-cells:nth-child(4) .e-card';
            let cards: NodeListOf<Element> = kanbanObj.element.querySelectorAll(columnSelector);
            expect(kanbanObj.element.querySelector('.e-kanban-content').classList.contains('e-draggable')).toBe(true);
            cards.forEach((card: HTMLElement) => {
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
            let element: HTMLElement = kanbanObj.element.querySelector('.e-swimlane-row .e-icons');
            element.click();
            expect(element.classList.contains('e-swimlane-row-collapse')).toBe(true);
            expect(kanbanObj.element.querySelector('.e-content-row').nextElementSibling.classList.contains('e-collapsed')).toBe(true);
        });

        it('Swimlane expand testing', () => {
            let element: HTMLElement = kanbanObj.element.querySelector('.e-swimlane-row .e-icons');
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
            let model: KanbanModel = { query: new Query().take(5) };
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
        let headTemplate: Element = createElement('div', { id: 'headtemplate' });
        let cardTemplate: Element = createElement('div', { id: 'cardtemplate' });
        // tslint:disable-next-line:max-func-body-length
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
            let commonCss: string = '.e-kanban th.e-template {' +
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
            let defaultOptions: KanbanModel = {
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
            let css: string = commonCss;
            let style: HTMLStyleElement = document.createElement('style');
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
            let headerCells: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-header-cells');
            for (let i: number = 0; i < headerCells.length; i++) {
                let header: Element = headerCells[i];
                let key: string = kanbanObj.columns[i].keyField;
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
            let cards: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-card');
            expect(kanbanObj.element.querySelector('.e-kanban-content').classList.contains('e-draggable')).toBe(true);
            for (let i: number = 0; i < cards.length; i++) {
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
                let element: Element = cards[i].firstElementChild.lastElementChild.firstElementChild;
                expect(element.tagName).toBe('TR');
                expect(element.children[0].tagName).toBe('TD');
                expect(element.children[0].classList.contains('card-icon-wrap')).toBe(true);
                expect(element.children[0].children[0].classList.contains('card-icon')).toBe(true);
                expect(element.children[0].children[0].classList.contains('e-icons')).toBe(true);
            }
        });
        it('Layout rendering with template class in card details', () => {
            let cards: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-card');
            for (let i: number = 0; i < cards.length; i++) {
                let element: Element = cards[i].firstElementChild.lastElementChild.firstElementChild.children[1];
                expect(element.tagName).toBe('TD');
                expect(element.classList.contains('card-details-wrap')).toBe(true);
                expect(element.children[0].tagName).toBe('TABLE');
                expect(element.children[0].children[0].tagName).toBe('TBODY');
                expect(element.children[0].children[0].childElementCount).toBe(4);
                let childElement: HTMLCollection = element.children[0].children[0].children;
                expect(childElement[0].tagName).toBe('TR');
                expect(childElement[0].childElementCount).toBe(2);
                expect(childElement[0].children[0].tagName).toBe('TD');
                expect(childElement[0].children[0].classList.contains('CardHeader')).toBe(true);
                expect(childElement[0].children[1].tagName).toBe('TD');
            }
        });
    });

    describe('Stacked header rows', () => {
        let kanbanObj: Kanban;
        beforeAll((done: DoneFn) => {
            let defaultOptions: KanbanModel = {
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
            let element: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-header-row');
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
            let element: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-header-row');
            expect(element[0].firstElementChild.getAttribute('colspan')).toBe('3');
            expect(element[0].lastElementChild.getAttribute('colspan')).toBe('1');
            expect(element[0].firstElementChild.firstElementChild.innerHTML).toBe('Unresolved');
            expect(element[0].lastElementChild.firstElementChild.innerHTML).toBe('Resolved');
        });
    });

    describe('WIP validation without swimlane', () => {
        let kanbanObj: Kanban;
        beforeAll((done: DoneFn) => {
            let model: KanbanModel = {
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
            let model: KanbanModel = {
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
            expect(kanbanObj.element.querySelector('.e-kanban-content').classList.contains('e-draggable')).toBe(true);
            kanbanObj.allowDragAndDrop = false;
            kanbanObj.dataBind();
            expect(kanbanObj.element.querySelector('.e-kanban-content').classList.contains('e-draggable')).toBe(false);
            kanbanObj.allowDragAndDrop = true;
            kanbanObj.dataBind();
            expect(kanbanObj.element.querySelector('.e-kanban-content').classList.contains('e-draggable')).toBe(true);
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

    it('memory leak', () => {
        profile.sample();
        // tslint:disable:no-any
        let average: any = inMB(profile.averageChange);
        //Check average change in memory samples to not be over 10MB
        expect(average).toBeLessThan(10);
        let memory: any = inMB(getMemoryProfile());
        //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
        // tslint:enable:no-any
    });

});
