/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Column drag and drop spec
 */
import { ColumnDragEventArgs, Kanban, KanbanModel, ColumnsModel, StackedHeadersModel } from '../../src/kanban/index';
import { kanbanData } from './common/kanban-data.spec';
import { profile, inMB, getMemoryProfile } from './common/common.spec';
import * as util from './common/util.spec';

describe('Column Drag and Drop - Normal Layout', () => {
    let kanbanObj: Kanban;

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
                headerField: 'Id'
            },
            allowColumnDragAndDrop: true
        };
        kanbanObj = util.createKanban(model, kanbanData, done);
    });

    afterAll(() => {
        util.destroy(kanbanObj);
    });

    it('Column drag and drop property validation', () => {
        expect(kanbanObj.allowColumnDragAndDrop).toBe(true);
        const headerCells: NodeListOf<HTMLElement> = kanbanObj.element.querySelectorAll('.e-header-cells');
        expect(headerCells.length).toBe(4);
        expect(headerCells[0].classList.contains('e-drag')).toBe(true);
    });

    it('Column drag start behavior', () => {
        const headerCell: HTMLElement = kanbanObj.element.querySelectorAll('.e-header-cells')[0] as HTMLElement;
        const draggedIndex: number = Array.from(headerCell.parentElement.children).indexOf(headerCell);
        expect(draggedIndex).toBe(0);
        util.triggerMouseEvent(headerCell, 'mousedown');
        util.triggerMouseEvent(headerCell, 'mousemove', 20, 20);
        expect(headerCell.classList.contains('e-kanban-dragging-header')).toBe(true);
    });

    it('Column drag to another position', () => {
        const targetHeader: HTMLElement = kanbanObj.element.querySelectorAll('.e-header-cells')[2] as HTMLElement;
        util.triggerMouseEvent(targetHeader, 'mousemove', 50, 20);
        expect(document.querySelector('.e-kanban-column-indicator')).not.toBeNull();
    });

    it('Drop column at new position', (done: Function) => {
        const targetHeader: HTMLElement = kanbanObj.element.querySelectorAll('.e-header-cells')[2] as HTMLElement;
        const originalHeaders: string[] = Array.from(kanbanObj.element.querySelectorAll('.e-header-cells'))
            .map((header: HTMLElement) => header.querySelector('.e-header-text').textContent);
        util.triggerMouseEvent(targetHeader, 'mouseup', 50, 20);
        setTimeout(() => {
            const newHeaders: NodeListOf<HTMLElement> = kanbanObj.element.querySelectorAll('.e-header-cells');
            expect(newHeaders[0].querySelector('.e-header-text').textContent).toBe('In Progress');
            expect(newHeaders[2].querySelector('.e-header-text').textContent).toBe('To Do');
            expect(newHeaders[0].classList.contains('e-kanban-dragging-header')).toBe(false);
            expect(document.querySelectorAll('.e-kanban-cloned-header').length).toBe(0);
            done();
        }, 300);
    });
});

describe('Column Drag and Drop - Show/Hide Columns', () => {
    let kanbanObj: Kanban;

    beforeAll((done: DoneFn) => {
        const model: KanbanModel = {
            keyField: 'Status',
            dataSource: kanbanData,
            columns: [
                { headerText: 'To Do', keyField: 'Open'},
                { headerText: 'In Progress', keyField: 'InProgress'},
                { headerText: 'Testing', keyField: 'Testing' },
                { headerText: 'Done', keyField: 'Close' }
            ],
            cardSettings: {
                contentField: 'Summary',
                headerField: 'Id'
            },
            allowColumnDragAndDrop: true
        };
        kanbanObj = util.createKanban(model, kanbanData, done);
    });

    afterAll(() => {
        util.destroy(kanbanObj);
    });

    it('Hide a column and verify column count', () => {
        kanbanObj.hideColumn('Testing');
        const visibleColumns: NodeListOf<HTMLElement> = kanbanObj.element.querySelectorAll('.e-header-cells:not(.e-hide)');
        expect(visibleColumns.length).toBe(3);
        const headerTexts: string[] = Array.from(visibleColumns).map((el: HTMLElement) => el.querySelector('.e-header-text').textContent);
        expect(headerTexts).not.toContain('Testing');
    });

    it('Drag operation with hidden column', () => {
        const headerCell: HTMLElement = kanbanObj.element.querySelectorAll('.e-header-cells:not(.e-hide)')[0] as HTMLElement;
        util.triggerMouseEvent(headerCell, 'mousedown');
        util.triggerMouseEvent(headerCell, 'mousemove', 20, 20);
        expect(headerCell.classList.contains('e-kanban-dragging-header')).toBe(true);
    });

    it('Drop to valid position with hidden columns', (done: Function) => {
        const targetHeader: HTMLElement = kanbanObj.element.querySelectorAll('.e-header-cells:not(.e-hide)')[2] as HTMLElement;
        util.triggerMouseEvent(targetHeader, 'mousemove', 50, 20);
        util.triggerMouseEvent(targetHeader, 'mouseup', 50, 20);
        setTimeout(() => {
            const visibleHeaders: NodeListOf<HTMLElement> = kanbanObj.element.querySelectorAll('.e-header-cells:not(.e-hide)');
            expect(visibleHeaders[0].querySelector('.e-header-text').textContent).toBe('In Progress');
            expect(visibleHeaders[2].querySelector('.e-header-text').textContent).toBe('To Do');
            done();
        }, 300);
    });

    it('Show hidden column and verify order', () => {
        kanbanObj.showColumn('Testing');
        const visibleColumns: NodeListOf<HTMLElement> = kanbanObj.element.querySelectorAll('.e-header-cells:not(.e-hide)');
        expect(visibleColumns.length).toBe(4);
        const headerTexts: string[] = Array.from(visibleColumns).map((el: HTMLElement) => el.querySelector('.e-header-text').textContent);
        expect(headerTexts).toEqual(['In Progress', 'Testing', 'Done', 'To Do']);

    });

    it('Drag column after show/hide operations', (done: Function) => {
        const headerCell: HTMLElement = kanbanObj.element.querySelectorAll('.e-header-cells:not(.e-hide)')[3] as HTMLElement;
        expect(headerCell.querySelector('.e-header-text').textContent).toBe('To Do');
        util.triggerMouseEvent(headerCell, 'mousedown');
        util.triggerMouseEvent(headerCell, 'mousemove', 20, 20);
        const targetHeader: HTMLElement = kanbanObj.element.querySelectorAll('.e-header-cells:not(.e-hide)')[0] as HTMLElement;
        util.triggerMouseEvent(targetHeader, 'mousemove', 50, 20);
        util.triggerMouseEvent(targetHeader, 'mouseup', 50, 20);
        setTimeout(() => {
            const newHeaderTexts: string[] = Array.from(kanbanObj.element.querySelectorAll('.e-header-cells:not(.e-hide)'))
                .map((el: HTMLElement) => el.querySelector('.e-header-text').textContent);
            expect(newHeaderTexts[0]).toBe('To Do');
            expect(newHeaderTexts[1]).toBe('In Progress');
            done();
        }, 300);
    });
});

describe('Column Drag and Drop - Toggle Columns', () => {
    let kanbanObj: Kanban;

    beforeAll((done: DoneFn) => {
        const model: KanbanModel = {
            keyField: 'Status',
            dataSource: kanbanData,
            columns: [
                { headerText: 'To Do', keyField: 'Open', allowToggle: true, isExpanded: true },
                { headerText: 'In Progress', keyField: 'InProgress', allowToggle: true, isExpanded: false },
                { headerText: 'Testing', keyField: 'Testing', allowToggle: true, isExpanded: true },
                { headerText: 'Done', keyField: 'Close', allowToggle: true, isExpanded: true }
            ],
            cardSettings: {
                contentField: 'Summary',
                headerField: 'Id'
            },
            allowColumnDragAndDrop: true
        };
        kanbanObj = util.createKanban(model, kanbanData, done);
    });

    afterAll(() => {
        util.destroy(kanbanObj);
    });

    it('Verify initial toggle state', () => {
        const headerCells: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-header-cells');
        const contentCells: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-content-cells');
        expect(contentCells[1].classList.contains('e-collapsed')).toBe(true);
        expect(contentCells[0].classList.contains('e-collapsed')).toBe(false);
        expect(contentCells[2].classList.contains('e-collapsed')).toBe(false);
        expect(contentCells[3].classList.contains('e-collapsed')).toBe(false);
    });

    it('Drag collapsed column', () => {
        const headerCell: HTMLElement = kanbanObj.element.querySelectorAll('.e-header-cells')[1] as HTMLElement;
        expect(headerCell.querySelector('.e-header-text').textContent).toBe('In Progress');
        util.triggerMouseEvent(headerCell, 'mousedown');
        util.triggerMouseEvent(headerCell, 'mousemove', 20, 20);
        expect(headerCell.classList.contains('e-kanban-dragging-header')).toBe(true);
    });

    it('Drop collapsed column to new position and verify state', (done: Function) => {
        const targetHeader: HTMLElement = kanbanObj.element.querySelectorAll('.e-header-cells')[3] as HTMLElement;
        util.triggerMouseEvent(targetHeader, 'mousemove', 50, 20);
        util.triggerMouseEvent(targetHeader, 'mouseup', 50, 20);
        setTimeout(() => {
            const headers: NodeListOf<HTMLElement> = kanbanObj.element.querySelectorAll('.e-header-cells');
            expect(headers[0].querySelector('.e-header-text').textContent).toBe('To Do');
            expect(headers[3].querySelector('.e-header-text').textContent).toBe('In Progress');
            const contentCells: NodeListOf<HTMLElement> = kanbanObj.element.querySelectorAll('.e-content-cells');
            expect(contentCells[3].classList.contains('e-collapsed')).toBe(true);
            done();
        }, 300);
    });

    it('Toggle a column then drag it', (done: Function) => {
        const headerCell: HTMLElement = kanbanObj.element.querySelectorAll('.e-header-cells')[0] as HTMLElement;
        const toggleIcon: HTMLElement = headerCell.querySelector('.e-icons') as HTMLElement;
        toggleIcon.click();
        const contentCells: NodeListOf<HTMLElement> = kanbanObj.element.querySelectorAll('.e-content-cells');
        expect(contentCells[0].classList.contains('e-collapsed')).toBe(true);
        util.triggerMouseEvent(headerCell, 'mousedown');
        util.triggerMouseEvent(headerCell, 'mousemove', 20, 20);
        const targetHeader: HTMLElement = kanbanObj.element.querySelectorAll('.e-header-cells')[2] as HTMLElement;
        util.triggerMouseEvent(targetHeader, 'mousemove', 50, 20);
        util.triggerMouseEvent(targetHeader, 'mouseup', 50, 20);
        setTimeout(() => {
            const newHeaders: NodeListOf<HTMLElement> = kanbanObj.element.querySelectorAll('.e-header-cells');
            const newContentCells: NodeListOf<HTMLElement> = kanbanObj.element.querySelectorAll('.e-content-cells');
            expect(newHeaders[0].querySelector('.e-header-text').textContent).toBe('Testing');
            expect(newHeaders[2].querySelector('.e-header-text').textContent).toBe('To Do');
            expect(newContentCells[2].classList.contains('e-collapsed')).toBe(true);
            done();
        }, 300);
    });
});

describe('Column Drag and Drop - Virtual Scrolling', () => {
    let kanbanObj: Kanban;

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
                headerField: 'Id'
            },
            allowColumnDragAndDrop: true,
            enableVirtualization: true,
            height: 500
        };
        kanbanObj = util.createKanban(model, kanbanData, done);
    });

    afterAll(() => {
        util.destroy(kanbanObj);
    });

    it('Verify virtual scrolling is enabled', () => {
        expect(kanbanObj.enableVirtualization).toBe(true);
        expect(kanbanObj.element.querySelectorAll('.e-card-virtual-wrapper').length).toBeGreaterThan(0);
    });

    it('Drag column with virtual scrolling', () => {
        const headerCell: HTMLElement = kanbanObj.element.querySelectorAll('.e-header-cells')[0] as HTMLElement;
        util.triggerMouseEvent(headerCell, 'mousedown');
        util.triggerMouseEvent(headerCell, 'mousemove', 20, 20);

        expect(headerCell.classList.contains('e-kanban-dragging-header')).toBe(true);
    });

    it('Drop column and verify virtual scrolling remains intact', (done: Function) => {
        const targetHeader: HTMLElement = kanbanObj.element.querySelectorAll('.e-header-cells')[2] as HTMLElement;
        util.triggerMouseEvent(targetHeader, 'mousemove', 50, 20);
        util.triggerMouseEvent(targetHeader, 'mouseup', 50, 20);
        setTimeout(() => {
            const headers: NodeListOf<HTMLElement> = kanbanObj.element.querySelectorAll('.e-header-cells');
            expect(headers[0].querySelector('.e-header-text').textContent).toBe('In Progress');
            expect(headers[2].querySelector('.e-header-text').textContent).toBe('To Do');
            expect(kanbanObj.element.querySelectorAll('.e-card-virtual-wrapper').length).toBeGreaterThan(0);
            done();
        }, 300);
    });

    it('Virtual content cells should match with header order', () => {
        const headerOrder: string[] = Array.from(kanbanObj.element.querySelectorAll('.e-header-cells'))
            .map((header: HTMLElement) => header.getAttribute('data-key'));
        const contentCells: NodeListOf<HTMLElement> = kanbanObj.element.querySelectorAll('.e-content-cells');
        const contentOrder: string[]  = Array.from(contentCells).map((cell: HTMLElement) => cell.getAttribute('data-key'));
        expect(contentOrder).toEqual(headerOrder);
    });
});

describe('Column Drag and Drop - Events', () => {
    let kanbanObj: Kanban;
    let dragStartArgs: ColumnDragEventArgs;
    let dragArgs: ColumnDragEventArgs;
    let dropArgs: ColumnDragEventArgs;

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
                headerField: 'Id'
            },
            allowColumnDragAndDrop: true,
            columnDragStart: (args: ColumnDragEventArgs) => {
                dragStartArgs = args;
            },
            columnDrag: (args: ColumnDragEventArgs) => {
                dragArgs = args;
            },
            columnDrop: (args: ColumnDragEventArgs) => {
                dropArgs = args;
            }
        };
        kanbanObj = util.createKanban(model, kanbanData, done);
    });

    afterAll(() => {
        util.destroy(kanbanObj);
    });

    it('columnDragStart event should be triggered with correct arguments', () => {
        const headerCell: HTMLElement = kanbanObj.element.querySelectorAll('.e-header-cells')[0] as HTMLElement;
        util.triggerMouseEvent(headerCell, 'mousedown');
        util.triggerMouseEvent(headerCell, 'mousemove', 20, 20);
        expect(dragStartArgs).not.toBeUndefined();
        expect(dragStartArgs.fromIndex).toBe(0);
        expect(dragStartArgs.element).toBe(headerCell);
        expect(dragStartArgs.column).toEqual(kanbanObj.columns[0]);
        expect(dragStartArgs.cancel).toBe(false);
    });

    it('columnDrag event should be triggered when dragging over target', () => {
        const targetHeader: HTMLElement = kanbanObj.element.querySelectorAll('.e-header-cells')[2] as HTMLElement;
        util.triggerMouseEvent(targetHeader, 'mousemove', 50, 20);
        expect(dragArgs).not.toBeUndefined();
        expect(dragArgs.fromIndex).toBe(0);
        expect(dragArgs.toIndex).toBe(2);
    });

    it('columnDrop event should be triggered with correct drop information', (done: Function) => {
        const targetHeader: HTMLElement = kanbanObj.element.querySelectorAll('.e-header-cells')[2] as HTMLElement;
        util.triggerMouseEvent(targetHeader, 'mouseup', 50, 20);
        setTimeout(() => {
            expect(dropArgs).not.toBeUndefined();
            expect(dropArgs.fromIndex).toBe(0);
            expect(dropArgs.toIndex).toBe(2);
            expect(dropArgs.dropIndex).toBe(2);
            expect((dropArgs.column as ColumnsModel).headerText).toBe('To Do');
            expect((dropArgs.column as ColumnsModel).keyField).toBe('Open');
            done();
        }, 300);
    });
});

describe('Column Drag and Drop - Stacked Headers', () => {
    let kanbanObj: Kanban;

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
                headerField: 'Id'
            },
            allowColumnDragAndDrop: true,
            stackedHeaders: [
                { text: 'Backlog', keyFields: 'Open' },
                { text: 'Development', keyFields: 'InProgress, Testing' },
                { text: 'Completed', keyFields: 'Close' }
            ]
        };
        kanbanObj = util.createKanban(model, kanbanData, done);
    });

    afterAll(() => {
        util.destroy(kanbanObj);
    });

    it('Stacked header property validation', () => {
        expect(kanbanObj.stackedHeaders.length).toBe(3);
        const stackedHeaderCells: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-stacked-header-cell');
        expect(stackedHeaderCells.length).toBe(3);
        expect(stackedHeaderCells[0].classList.contains('e-drag')).toBe(true);
    });

    it('Stacked header drag start behavior', () => {
        const stackedHeader: HTMLElement = kanbanObj.element.querySelectorAll('.e-stacked-header-cell')[0] as HTMLElement;
        const draggedIndex: number = Array.from(stackedHeader.parentElement.children).indexOf(stackedHeader);
        expect(draggedIndex).toBe(0);
        util.triggerMouseEvent(stackedHeader, 'mousedown');
        util.triggerMouseEvent(stackedHeader, 'mousemove', 20, 20);
        expect(stackedHeader.classList.contains('e-kanban-dragging-header')).toBe(true);
    });

    it('Stacked header drag to another position', () => {
        const targetHeader: HTMLElement = kanbanObj.element.querySelectorAll('.e-stacked-header-cell')[2] as HTMLElement;
        util.triggerMouseEvent(targetHeader, 'mousemove', 50, 20);
        expect(document.querySelector('.e-kanban-column-indicator')).not.toBeNull();
    });

    it('Drop stacked header at new position', (done: Function) => {
        const targetHeader: HTMLElement = kanbanObj.element.querySelectorAll('.e-stacked-header-cell')[2] as HTMLElement;
        util.triggerMouseEvent(targetHeader, 'mouseup', 50, 20);
        setTimeout(() => {
            const newStackedHeaders: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-stacked-header-cell');
            expect(newStackedHeaders[0].textContent.trim()).toBe('Development');
            expect(newStackedHeaders[2].textContent.trim()).toBe('Backlog');
            expect(newStackedHeaders[0].classList.contains('e-kanban-dragging-header')).toBe(false);
            expect(document.querySelectorAll('.e-kanban-cloned-header').length).toBe(0);
            done();
        }, 300);
    });
});

describe('Stacked Header with Toggle Columns', () => {
    let kanbanObj: Kanban;

    beforeAll((done: DoneFn) => {
        const model: KanbanModel = {
            keyField: 'Status',
            dataSource: kanbanData,
            columns: [
                { headerText: 'To Do', keyField: 'Open', allowToggle: true, isExpanded: true },
                { headerText: 'In Progress', keyField: 'InProgress', allowToggle: true, isExpanded: false },
                { headerText: 'Testing', keyField: 'Testing', allowToggle: true, isExpanded: true },
                { headerText: 'Done', keyField: 'Close', allowToggle: true, isExpanded: true }
            ],
            cardSettings: {
                contentField: 'Summary',
                headerField: 'Id'
            },
            allowColumnDragAndDrop: true,
            stackedHeaders: [
                { text: 'Backlog', keyFields: 'Open' },
                { text: 'Development', keyFields: 'InProgress, Testing' },
                { text: 'Completed', keyFields: 'Close' }
            ]
        };
        kanbanObj = util.createKanban(model, kanbanData, done);
    });

    afterAll(() => {
        util.destroy(kanbanObj);
    });

    it('Verify initial toggle state with stacked headers', () => {
        const contentCells: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-content-cells');
        expect(contentCells[1].classList.contains('e-collapsed')).toBe(true);
        expect(contentCells[0].classList.contains('e-collapsed')).toBe(false);
        expect(contentCells[2].classList.contains('e-collapsed')).toBe(false);
        expect(contentCells[3].classList.contains('e-collapsed')).toBe(false);
    });

    it('Drag stacked header with collapsed column', () => {
        const stackedHeader: HTMLElement = kanbanObj.element.querySelectorAll('.e-stacked-header-cell')[1] as HTMLElement;
        expect(stackedHeader.textContent.trim()).toBe('Development');
        util.triggerMouseEvent(stackedHeader, 'mousedown');
        util.triggerMouseEvent(stackedHeader, 'mousemove', 20, 20);
        expect(stackedHeader.classList.contains('e-kanban-dragging-header')).toBe(true);
    });

    it('Drop stacked header and check if collapsed state persists', (done: Function) => {
        const targetHeader: HTMLElement = kanbanObj.element.querySelectorAll('.e-stacked-header-cell')[2] as HTMLElement;
        util.triggerMouseEvent(targetHeader, 'mousemove', 50, 20);
        util.triggerMouseEvent(targetHeader, 'mouseup', 50, 20);
        setTimeout(() => {
            const stackedHeaders: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-stacked-header-cell');
            expect(stackedHeaders[0].textContent.trim()).toBe('Backlog');
            expect(stackedHeaders[2].textContent.trim()).toBe('Development');
            // Check if InProgress is still collapsed
            const contentCells: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-content-cells');
            const inProgressCell: Element = Array.from(contentCells).find((cell: Element) =>
                cell.getAttribute('data-key') === 'InProgress');
            expect(inProgressCell.classList.contains('e-collapsed')).toBe(true);
            done();
        }, 300);
    });
});

describe('Stacked Header with Virtual Scrolling', () => {
    let kanbanObj: Kanban;

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
                headerField: 'Id'
            },
            allowColumnDragAndDrop: true,
            enableVirtualization: true,
            height: 500,
            stackedHeaders: [
                { text: 'Backlog', keyFields: 'Open' },
                { text: 'Development', keyFields: 'InProgress, Testing' },
                { text: 'Completed', keyFields: 'Close' }
            ]
        };
        kanbanObj = util.createKanban(model, kanbanData, done);
    });

    afterAll(() => {
        util.destroy(kanbanObj);
    });

    it('Verify stacked headers with virtual scrolling', () => {
        expect(kanbanObj.enableVirtualization).toBe(true);
        expect(kanbanObj.stackedHeaders.length).toBe(3);
        expect(kanbanObj.element.querySelectorAll('.e-card-virtual-wrapper').length).toBeGreaterThan(0);
    });

    it('Drag stacked header with virtual scrolling enabled', () => {
        const stackedHeader: HTMLElement = kanbanObj.element.querySelectorAll('.e-stacked-header-cell')[0] as HTMLElement;
        util.triggerMouseEvent(stackedHeader, 'mousedown');
        util.triggerMouseEvent(stackedHeader, 'mousemove', 20, 20);
        expect(stackedHeader.classList.contains('e-kanban-dragging-header')).toBe(true);
    });
    it('Drop stacked header and verify virtual content updates', (done: Function) => {
        const targetHeader: HTMLElement = kanbanObj.element.querySelectorAll('.e-stacked-header-cell')[2] as HTMLElement;
        util.triggerMouseEvent(targetHeader, 'mousemove', 50, 20);
        util.triggerMouseEvent(targetHeader, 'mouseup', 50, 20);
        setTimeout(() => {
            const stackedHeaders: NodeListOf<Element> = kanbanObj.element.querySelectorAll('.e-stacked-header-cell');
            expect(stackedHeaders[0].textContent.trim()).toBe('Development');
            expect(stackedHeaders[2].textContent.trim()).toBe('Backlog');
            // Verify virtual scrolling still works
            expect(kanbanObj.element.querySelectorAll('.e-card-virtual-wrapper').length).toBeGreaterThan(0);
            // Verify stacked header columns are properly reordered
            expect(kanbanObj.stackedHeaders[0].text).toBe('Development');
            expect(kanbanObj.stackedHeaders[2].text).toBe('Backlog');
            done();
        }, 300);
    });
});

describe('Stacked Header Events', () => {
    let kanbanObj: Kanban;
    let dragStartArgs: ColumnDragEventArgs;
    let dragArgs: ColumnDragEventArgs;
    let dropArgs: ColumnDragEventArgs;

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
                headerField: 'Id'
            },
            allowColumnDragAndDrop: true,
            stackedHeaders: [
                { text: 'Backlog', keyFields: 'Open' },
                { text: 'Development', keyFields: 'InProgress, Testing' },
                { text: 'Completed', keyFields: 'Close' }
            ],
            columnDragStart: (args: ColumnDragEventArgs) => {
                dragStartArgs = args;
            },
            columnDrag: (args: ColumnDragEventArgs) => {
                dragArgs = args;
            },
            columnDrop: (args: ColumnDragEventArgs) => {
                dropArgs = args;
            }
        };
        kanbanObj = util.createKanban(model, kanbanData, done);
    });

    afterAll(() => {
        util.destroy(kanbanObj);
    });

    it('columnDragStart event should be triggered for stacked header', () => {
        const stackedHeader: HTMLElement = kanbanObj.element.querySelectorAll('.e-stacked-header-cell')[0] as HTMLElement;
        util.triggerMouseEvent(stackedHeader, 'mousedown');
        util.triggerMouseEvent(stackedHeader, 'mousemove', 20, 20);
        expect(dragStartArgs).not.toBeUndefined();
        expect(dragStartArgs.fromIndex).toBe(0);
        expect(dragStartArgs.element).toBe(stackedHeader);
        expect(dragStartArgs.column).toEqual(kanbanObj.stackedHeaders[0]);
    });

    it('columnDrag event should be triggered for stacked header', () => {
        const targetHeader: HTMLElement = kanbanObj.element.querySelectorAll('.e-stacked-header-cell')[2] as HTMLElement;
        util.triggerMouseEvent(targetHeader, 'mousemove', 50, 20);
        expect(dragArgs).not.toBeUndefined();
        expect(dragArgs.fromIndex).toBe(0);
        expect(dragArgs.toIndex).toBe(2);
    });

    it('columnDrop event should be triggered with stacked header information', (done: Function) => {
        const targetHeader: HTMLElement = kanbanObj.element.querySelectorAll('.e-stacked-header-cell')[2] as HTMLElement;
        util.triggerMouseEvent(targetHeader, 'mouseup', 50, 20);
        setTimeout(() => {
            expect(dropArgs).not.toBeUndefined();
            expect(dropArgs.fromIndex).toBe(0);
            expect(dropArgs.toIndex).toBe(2);
            expect(dropArgs.dropIndex).toBe(2);
            expect((dropArgs.column as StackedHeadersModel).text).toBe('Backlog');
            expect((dropArgs.column as StackedHeadersModel).keyFields).toBe('Open');
            done();
        }, 300);
    });
});

describe('Subheader Drag with Stacked Headers', () => {
    let kanbanObj: Kanban;

    beforeAll((done: DoneFn) => {
        const model: KanbanModel = {
            keyField: 'Status',
            dataSource: kanbanData,
            columns: [
                { headerText: 'To Do', keyField: 'Open' },
                { headerText: 'In Progress', keyField: 'InProgress' },
                { headerText: 'Testing', keyField: 'Testing' },
                { headerText: 'Done', keyField: 'Close' },
                { headerText: 'Review', keyField: 'Review' } // Column not in any stacked header
            ],
            cardSettings: {
                contentField: 'Summary',
                headerField: 'Id'
            },
            allowColumnDragAndDrop: true,
            stackedHeaders: [
                { text: 'Backlog', keyFields: 'Open' },
                { text: 'Development', keyFields: 'InProgress, Testing' },
                { text: 'Completed', keyFields: 'Close' }
            ]
        };
        kanbanObj = util.createKanban(model, kanbanData, done);
    });

    afterAll(() => {
        util.destroy(kanbanObj);
    });

    it('Should prevent dragging subheader to non-stacked area', () => {
        const todoHeader: HTMLElement = Array.from(
            kanbanObj.element.querySelectorAll('.e-header-cells')
        ).find((header: HTMLElement) =>
            header.querySelector('.e-header-text').textContent === 'To Do') as HTMLElement;
        const reviewHeader: HTMLElement = Array.from(
            kanbanObj.element.querySelectorAll('.e-header-cells')
        ).find((header: HTMLElement) =>
            header.querySelector('.e-header-text').textContent === 'Review') as HTMLElement;
        util.triggerMouseEvent(todoHeader, 'mousedown');
        util.triggerMouseEvent(todoHeader, 'mousemove', 20, 20);
        util.triggerMouseEvent(reviewHeader, 'mousemove', 50, 20);
        const indicator: HTMLElement = document.querySelector('.e-kanban-column-indicator') as HTMLElement;
        expect(indicator.style.display).toBe('none');
        util.triggerMouseEvent(reviewHeader, 'mouseup', 50, 20);
    });
    it('Should prevent dragging between different stacked groups', () => {
        const todoHeader: HTMLElement = Array.from(
            kanbanObj.element.querySelectorAll('.e-header-cells')
        ).find((header: HTMLElement) =>
            header.querySelector('.e-header-text').textContent === 'To Do') as HTMLElement;
        const testingHeader: HTMLElement = Array.from(
            kanbanObj.element.querySelectorAll('.e-header-cells')
        ).find((header: HTMLElement) =>
            header.querySelector('.e-header-text').textContent === 'Testing') as HTMLElement;
        util.triggerMouseEvent(todoHeader, 'mousedown');
        util.triggerMouseEvent(todoHeader, 'mousemove', 20, 20);
        util.triggerMouseEvent(testingHeader, 'mousemove', 50, 20);
        const indicator: HTMLElement = document.querySelector('.e-kanban-column-indicator') as HTMLElement;
        expect(indicator.style.display).toBe('none');
        util.triggerMouseEvent(testingHeader, 'mouseup', 50, 20);
    });

    it('Should allow dragging within same stacked group', () => {
        const inProgressHeader: HTMLElement = Array.from(
            kanbanObj.element.querySelectorAll('.e-header-cells')
        ).find((header: HTMLElement) =>
            header.querySelector('.e-header-text').textContent === 'In Progress') as HTMLElement;

        const testingHeader: HTMLElement = Array.from(
            kanbanObj.element.querySelectorAll('.e-header-cells')
        ).find((header: HTMLElement) =>
            header.querySelector('.e-header-text').textContent === 'Testing') as HTMLElement;
        util.triggerMouseEvent(inProgressHeader, 'mousedown');
        util.triggerMouseEvent(inProgressHeader, 'mousemove', 20, 20);
        util.triggerMouseEvent(testingHeader, 'mousemove', 50, 20);
        const indicator: HTMLElement = document.querySelector('.e-kanban-column-indicator') as HTMLElement;
        expect(indicator.style.display).toBe('block');
        util.triggerMouseEvent(testingHeader, 'mouseup', 50, 20);
    });
});

describe('Test Empty Array Initialization in Stacked Header Reordering', () => {
    let kanbanObj: Kanban;

    beforeAll((done: DoneFn) => {
        const model: KanbanModel = {
            keyField: 'Status',
            dataSource: kanbanData,
            columns: [
                { headerText: 'To Do', keyField: 'Open' },
                { headerText: 'In Progress', keyField: 'InProgress' },
                { headerText: 'Testing', keyField: 'Testing' },
                { headerText: 'Done', keyField: 'Close' },
                { headerText: 'Review', keyField: 'Review' }
            ],
            cardSettings: {
                contentField: 'Summary',
                headerField: 'Id'
            },
            allowColumnDragAndDrop: true,
            stackedHeaders: [
                { text: 'Backlog', keyFields: 'Open' },
                { text: 'Development', keyFields: 'InProgress, Testing' },
                { text: 'Completed', keyFields: 'Close' }
            ]
        };
        kanbanObj = util.createKanban(model, kanbanData, done);
    });

    afterAll(() => {
        util.destroy(kanbanObj);
    });

    it('Should initialize and populate empty newColumnsArray correctly', (done: Function) => {
        // Verify initial state
        expect(kanbanObj.columns.length).toBe(5);
        // Store original column IDs
        const originalColumnIds: string[] = kanbanObj.columns.map((col: ColumnsModel) => col.keyField.toString());
        // Trigger the reordering that initializes empty array
        const firstHeader: HTMLElement = kanbanObj.element.querySelectorAll('.e-stacked-header-cell')[0] as HTMLElement;
        const lastHeader: HTMLElement = kanbanObj.element.querySelectorAll('.e-stacked-header-cell')[2] as HTMLElement;
        util.triggerMouseEvent(firstHeader, 'mousedown');
        util.triggerMouseEvent(firstHeader, 'mousemove', 20, 20);
        util.triggerMouseEvent(lastHeader, 'mousemove', 50, 20);
        util.triggerMouseEvent(lastHeader, 'mouseup', 50, 20);
        setTimeout(() => {
            // Verify array was initialized and populated correctly
            expect(kanbanObj.columns.length).toBe(5);
            // All original columns should still exist
            originalColumnIds.forEach((id: string) => {
                const columnExists: boolean = kanbanObj.columns.some((col: ColumnsModel) => 
                    col.keyField.toString() === id);
                expect(columnExists).toBe(true);
            });
            // Non-stacked column should be preserved
            const hasReviewColumn: boolean = kanbanObj.columns.some((col: ColumnsModel) => 
                col.keyField === 'Review');
            expect(hasReviewColumn).toBe(true);
            done();
        }, 300);
    });
});

describe('Column Drag - Coverage Tests for Uncovered Branches', () => {
    let kanbanObj: Kanban;
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
                headerField: 'Id'
            },
            allowColumnDragAndDrop: true,
            stackedHeaders: [
                { text: 'Backlog', keyFields: 'Open' },
                { text: 'Development', keyFields: 'InProgress, Testing' },
                { text: 'Completed', keyFields: 'Close' }
            ]
        };
        kanbanObj = util.createKanban(model, kanbanData, done);
    });

    afterAll(() => {
        util.destroy(kanbanObj);
    });
    it('Should return early from columnDrag when isDragging is false', () => {
        const dragModule: any = (kanbanObj as any).columnDragAndDropModule;
        dragModule.isDragging = false;
        const headerCell: HTMLElement = kanbanObj.element.querySelectorAll('.e-header-cells')[0] as HTMLElement;
        util.triggerMouseEvent(headerCell, 'mousemove', 20, 20);
        const indicator: HTMLElement = document.querySelector('.e-kanban-column-indicator') as HTMLElement;
        expect(indicator.style.display).not.toBe('block');
    });

    it('Should return early from columnDrag when targetHeader is null', () => {
        const dragModule: any = (kanbanObj as any).columnDragAndDropModule;
        const headerCell: HTMLElement = kanbanObj.element.querySelectorAll('.e-header-cells')[0] as HTMLElement;
        util.triggerMouseEvent(headerCell, 'mousedown');
        util.triggerMouseEvent(headerCell, 'mousemove', 20, 20);
        const originalFindTarget: (e: MouseEvent) => HTMLElement = dragModule.findTargetHeader;
        dragModule.findTargetHeader = function (): null {
            return null;
        };
        util.triggerMouseEvent(document.body, 'mousemove', 100, 100);
        const indicator: HTMLElement = document.querySelector('.e-kanban-column-indicator') as HTMLElement;
        expect(indicator.style.display).toBe('none');
        dragModule.findTargetHeader = originalFindTarget;
        util.triggerMouseEvent(document.body, 'mouseup');
    });

    it('Should return early when parent stacked headers have different keyFields', () => {
        const todoHeader: HTMLElement = Array.from(
            kanbanObj.element.querySelectorAll('.e-header-cells')
        ).find((header: HTMLElement) =>
            header.querySelector('.e-header-text').textContent === 'To Do') as HTMLElement;
        const testingHeader: HTMLElement = Array.from(
            kanbanObj.element.querySelectorAll('.e-header-cells')
        ).find((header: HTMLElement) =>
            header.querySelector('.e-header-text').textContent === 'Testing') as HTMLElement;
        util.triggerMouseEvent(todoHeader, 'mousedown');
        util.triggerMouseEvent(todoHeader, 'mousemove', 20, 20);
        util.triggerMouseEvent(testingHeader, 'mousemove', 50, 20);
        const indicator: HTMLElement = document.querySelector('.e-kanban-column-indicator') as HTMLElement;
        expect(indicator.style.display).toBe('none');
        util.triggerMouseEvent(testingHeader, 'mouseup');
    });
});

describe('Column Drag - Coverage Tests dynamic chaning API', () => {
    let kanbanObj: Kanban;
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
                headerField: 'Id'
            },
            allowColumnDragAndDrop: true
        };
        kanbanObj = util.createKanban(model, kanbanData, done);
    });

    afterAll(() => {
        util.destroy(kanbanObj);
    });
    it('coverage for the dynamic changing modue wihout enablevirutualization', () => {
        kanbanObj.allowColumnDragAndDrop = false;
        kanbanObj.dataBind();
        kanbanObj.allowColumnDragAndDrop = true;
        kanbanObj.dataBind();
    });
});


describe('Column Drag - Coverage Tests dynamic chaning API', () => {
    let kanbanObj: Kanban;
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
                headerField: 'Id'
            },
            allowColumnDragAndDrop: true,
            enableVirtualization: true
        };
        kanbanObj = util.createKanban(model, kanbanData, done);
    });

    afterAll(() => {
        util.destroy(kanbanObj);
    });
    it('coverage for the dynamic changing modue with enablevirutualization', () => {
        kanbanObj.allowColumnDragAndDrop = false;
        kanbanObj.dataBind();
        kanbanObj.allowColumnDragAndDrop = true;
        kanbanObj.dataBind();
    });
});


// Memory leak testing
it('Memory leak test for column drag and drop', () => {
    profile.sample();
    const average: number = inMB(profile.averageChange);
    expect(average).toBeLessThan(10);
    const memory: number = inMB(getMemoryProfile());
    expect(memory).toBeLessThan(profile.samples[0] + 0.25);
});
