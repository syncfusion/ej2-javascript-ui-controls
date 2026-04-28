import { createEditor, buildTableBlock, getTable, getHeaderCell, getDataCellEl } from '../common/util.spec';
import { BlockEditor } from '../../src/index';
import { ITableBlockSettings } from '../../src/models/block/block-props';
import { createElement } from '@syncfusion/ej2-base';
import { toDomCol } from '../../src/common/utils/index';
import * as constants from '../../src/common/constant';

// Implementations:
// - On mousedown of resize handle, widths convert to px and data-col-width-mode='px'
// - Only the left column (of the boundary) is resized; right column is not auto-shrunk
// - Min column width is clamped to 60
// - Undo/redo tracks px values
// - Add/Delete after a resize keep px mode and preserve widths; new col gets 120px

describe('Table Column Resize - Hover/Handle', () => {
    let editor: BlockEditor;
    let editorElement: HTMLElement;
    let tableBlockEl: HTMLElement;
    let tableEl: HTMLTableElement;

    beforeEach(() => {
        editorElement = createElement('div', { id: 'editor-resizev1-hover' });
        document.body.appendChild(editorElement);
        const tableBlock = buildTableBlock('table_resizev1_hover', 4, 3, true, true);
        editor = createEditor({ blocks: [tableBlock] });
        editor.appendTo('#editor-resizev1-hover');
        tableBlockEl = editorElement.querySelector('.e-table-block') as HTMLElement;
        tableEl = tableBlockEl.querySelector('table') as HTMLTableElement;
    });

    afterEach(() => {
        if (editor) editor.destroy();
        if (editorElement.parentElement) editorElement.parentElement.removeChild(editorElement);
    });

    it('shows resize handle when near right boundary of a data cell', () => {
        const cell = getDataCellEl(editorElement, 1, 1);
        const rect = cell.getBoundingClientRect();
        cell.dispatchEvent(new MouseEvent('mousemove', { clientX: rect.right - 2, clientY: rect.top + 8, bubbles: true }));
        const handle = tableBlockEl.querySelector('.e-col-resize-handle') as HTMLElement;
        expect(handle).toBeTruthy();
        expect(handle.style.display).toBe('block');
    });

    it('hides resize handle when far from any boundary', () => {
        const cell = getDataCellEl(editorElement, 1, 1);
        const rect = cell.getBoundingClientRect();
        cell.dispatchEvent(new MouseEvent('mousemove', { clientX: rect.left + Math.floor(rect.width / 2), clientY: rect.top + 8, bubbles: true }));
        const handle = tableBlockEl.querySelector('.e-col-resize-handle') as HTMLElement;
        expect(handle.style.display).toBe('none');
    });

    it('does not show resize handle on row-number column', () => {
        const rn = tableEl.querySelector('td.e-row-number') as HTMLElement;
        const rect = rn.getBoundingClientRect();
        rn.dispatchEvent(new MouseEvent('mousemove', { clientX: rect.right - 2, clientY: rect.top + 5, bubbles: true }));
        const handle = tableBlockEl.querySelector('.e-col-resize-handle') as HTMLElement;
        expect(handle.style.display).toBe('none');
    });

    it('handle aligns to full table height', () => {
        const cell = getDataCellEl(editorElement, 1, 2);
        const rect = cell.getBoundingClientRect();
        cell.dispatchEvent(new MouseEvent('mousemove', { clientX: rect.right - 2, clientY: rect.top + 10, bubbles: true }));
        const handle = tableBlockEl.querySelector('.e-col-resize-handle') as HTMLElement;
        const h = parseFloat(handle.style.height);
        expect(h).toBeGreaterThan(0);
        expect(h).toBeCloseTo(tableEl.getBoundingClientRect().height, -1);
    });
});

describe('Table Column Resize - Percent mode interactions before any resize', () => {
    let editor: BlockEditor;
    let editorElement: HTMLElement;
    let tableEl: HTMLTableElement;

    const getStyleUnit = (idx: number): string => {
        const cg = tableEl.querySelector('colgroup');
        const el = cg.children[toDomCol(idx, true)] as HTMLTableColElement;
        return (el.style.width || '').trim();
    };

    beforeEach(() => {
        editorElement = createElement('div', { id: 'editor-resizev1-percent' });
        document.body.appendChild(editorElement);
        const tableBlock = buildTableBlock('table_resizev1_percent', 4, 3, true, true);
        editor = createEditor({ blocks: [tableBlock] });
        editor.appendTo('#editor-resizev1-percent');
        tableEl = getTable(editorElement);
    });

    afterEach(() => {
        if (editor) editor.destroy();
        if (editorElement.parentElement) editorElement.parentElement.removeChild(editorElement);
    });

    it('adding a column in percent mode switches to px if equal percent < threshold', (done) => {
        // Editor width ~400, 5 cols => 80px each -> should switch to px
        editor.blockManager.tableService.addColumnAt({ blockId: editor.blocks[0].id, colIndex: 2 });
        setTimeout(() => {
            const mode = tableEl.getAttribute('data-col-width-mode');
            expect(mode).toBe('px');
            const cg = tableEl.querySelector('colgroup');
            const newColPx = parseFloat((cg.children[toDomCol(2, true)] as HTMLTableColElement).style.width || '0');
            expect(Math.round(newColPx)).toBe(constants.TABLE_NEW_COL_WIDTH);
            done();
        }, 60);
    });

    it('deleting a column in percent mode keeps percent distribution', (done) => {
        // Recreate fresh editor in percent mode
        if (editor) { editor.destroy(); }
        editorElement.innerHTML = '';
        const tableBlock = buildTableBlock('table_resizev1_percent_b', 4, 3, true, true);
        editor = new BlockEditor({ blocks: [tableBlock], width: 700 });
        editor.appendTo('#editor-resizev1-percent');
        setTimeout(() => {
            tableEl = getTable(editorElement);
    
            editor.blockManager.tableService.deleteColumnAt({ blockId: editor.blocks[0].id, colIndex: 1 });
            const mode = tableEl.getAttribute('data-col-width-mode') || '';
            expect(mode).not.toBe('px');
            // widths remain percentage strings
            const w0 = getStyleUnit(0); const w1 = getStyleUnit(1); const w2 = getStyleUnit(2);
            expect(/%$/.test(w0)).toBe(true);
            expect(/%$/.test(w1)).toBe(true);
            expect(/%$/.test(w2)).toBe(true);
            done();
        }, 100);
    });
});

describe('Table Column Resize - Additional edge cases', () => {
    let editor: BlockEditor;
    let editorElement: HTMLElement;
    let tableBlockEl: HTMLElement;
    let tableEl: HTMLTableElement;

    const px = (idx: number) => parseFloat(((tableEl.querySelector('colgroup').children[toDomCol(idx, true)] as HTMLTableColElement).style.width || '0').trim());

    function hover(cellCol: number, offset = -2): { sx: number; rect: DOMRect } {
        const cell = getDataCellEl(editorElement, 1, cellCol);
        const rect = cell.getBoundingClientRect() as DOMRect;
        const sx = rect.right + offset;
        cell.dispatchEvent(new MouseEvent('mousemove', { clientX: sx, clientY: rect.top + 6, bubbles: true }));
        return { sx, rect };
    }

    function drag(colIdx: number, dx: number): void {
        const cell = getDataCellEl(editorElement, 1, colIdx);
        const rect = cell.getBoundingClientRect();
        const sx = rect.right - 2;
        cell.dispatchEvent(new MouseEvent('mousemove', { clientX: sx, clientY: rect.top + 6, bubbles: true }));
        const handle = tableBlockEl.querySelector('.e-col-resize-handle') as HTMLElement;
        handle.dispatchEvent(new MouseEvent('mousedown', { clientX: sx, clientY: rect.top + 6, bubbles: true }));
        editorElement.dispatchEvent(new MouseEvent('mousemove', { clientX: sx + dx, clientY: rect.top + 6, bubbles: true }));
        editorElement.dispatchEvent(new MouseEvent('mouseup', { clientX: sx + dx, clientY: rect.top + 6, bubbles: true }));
    }

    beforeEach(() => {
        editorElement = createElement('div', { id: 'editor-resizev1-edges' });
        document.body.appendChild(editorElement);
        const tableBlock = buildTableBlock('table_resizev1_edges', 4, 3, true, true);
        editor = createEditor({ blocks: [tableBlock] });
        editor.appendTo('#editor-resizev1-edges');
        tableBlockEl = editorElement.querySelector('.e-table-block') as HTMLElement;
        tableEl = getTable(editorElement);
    });

    afterEach(() => {
        if (editor) editor.destroy();
        if (editorElement.parentElement) editorElement.parentElement.removeChild(editorElement);
    });

    it('hover near left boundary of first data column does not show handle', () => {
        const cell = getDataCellEl(editorElement, 1, 0);
        const rect = cell.getBoundingClientRect();
        cell.dispatchEvent(new MouseEvent('mousemove', { clientX: rect.left + 1, clientY: rect.top + 6, bubbles: true }));
        const handle = tableBlockEl.querySelector('.e-col-resize-handle') as HTMLElement;
        expect(handle.style.display).toBe('none');
    });

    it('convertColgroupToPxMode assigns px to all columns on first mousedown', (done) => {
        const cell = getDataCellEl(editorElement, 1, 1);
        const rect = cell.getBoundingClientRect();
        const sx = rect.right - 2;
        cell.dispatchEvent(new MouseEvent('mousemove', { clientX: sx, clientY: rect.top + 6, bubbles: true }));
        const handle = tableBlockEl.querySelector('.e-col-resize-handle') as HTMLElement;
        handle.dispatchEvent(new MouseEvent('mousedown', { clientX: sx, clientY: rect.top + 6, bubbles: true }));
        setTimeout(() => {
            const cg = tableEl.querySelector('colgroup');
            Array.from(cg.children).filter((c: Element) => !(c as HTMLElement).classList.contains('e-col-row-number')).forEach((c: Element) => {
                expect(((c as HTMLTableColElement).style.width || '')).toMatch(/px$/);
            });
            document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
            done();
        }, 30);
    });

    it('enforces min width for different columns (col0, col2)', (done) => {
        drag(0, -5000);
        drag(2, -5000);
        setTimeout(() => {
            expect(px(0)).toBeGreaterThanOrEqual(constants.TABLE_COL_MIN_WIDTH);
            expect(px(2)).toBeGreaterThanOrEqual(constants.TABLE_COL_MIN_WIDTH);
            done();
        }, 90);
    });

    it('scrolling the container hides hover/handles', () => {
        const cell = getDataCellEl(editorElement, 1, 1);
        const rect = cell.getBoundingClientRect();
        cell.dispatchEvent(new MouseEvent('mousemove', { clientX: rect.right - 2, clientY: rect.top + 6, bubbles: true }));
        const handle = tableBlockEl.querySelector('.e-col-action-handle') as HTMLElement;
        expect(handle.style.display).toBe('flex');
        // simulate scroll
        tableEl.parentElement.dispatchEvent(new Event('scroll'));
        expect(handle.style.display).toBe('none');
    });

    it('multiple boundaries resized sequentially keep previous widths intact', (done) => {
        drag(1, +25);
        const snap01 = [px(0), px(1)];
        drag(2, -15);
        setTimeout(() => {
            expect(Math.abs(px(0) - snap01[0])).toBeLessThan(1.2);
            expect(Math.abs(px(1) - snap01[1])).toBeLessThan(1.2);
            done();
        }, 80);
    });

    it('model stores px strings for all columns after successive resizes', (done) => {
        drag(0, +15);
        drag(1, +10);
        setTimeout(() => {
            const props = editor.blocks[0].properties as ITableBlockSettings;
            props.columns.forEach(c => expect(String(c.width || '')).toMatch(/px$/));
            done();
        }, 80);
    });

    it('deleteColumnAt reduces colgroup length and updates dataset col', (done) => {
        const cg = tableEl.querySelector('colgroup');
        const beforeCount = Array.from(cg.children).filter((c: Element) => !(c as HTMLElement).classList.contains('e-col-row-number')).length;
        editor.blockManager.tableService.deleteColumnAt({ blockId: editor.blocks[0].id, colIndex: 1 });
        setTimeout(() => {
            const afterCount = Array.from(cg.children).filter((c: Element) => !(c as HTMLElement).classList.contains('e-col-row-number')).length;
            expect(afterCount).toBe(beforeCount - 1);
            const tds = Array.from(tableEl.querySelectorAll('tbody td:not(.e-row-number)')) as HTMLTableCellElement[];
            tds.forEach((td, i) => expect(parseInt(td.dataset.col, 10)).toBe(i % (editor.blocks[0].properties as ITableBlockSettings).columns.length));
            done();
        }, 70);
    });

    it('undo after resize restores px for the specific column only', (done) => {
        drag(3, +30);
        setTimeout(() => {
            const after = px(3);
            editor.blockManager.undoRedoAction.undo();
            const restored = px(3);
            expect(Math.abs(after - restored)).toBeGreaterThan(0);
            done();
        }, 70);
    });

    it('redo after undo reapplies last px width', (done) => {
        drag(2, +18);
        setTimeout(() => {
            const target = px(2);
            editor.blockManager.undoRedoAction.undo();
            editor.blockManager.undoRedoAction.redo();
            expect(px(2)).toBeCloseTo(target, 0);
            done();
        }, 80);
    });

    it('new resize after undo clears redo stack (px mode)', (done) => {
        drag(1, +22);
        setTimeout(() => {
            editor.blockManager.undoRedoAction.undo();
            const u = px(1);
            drag(1, +10);
            setTimeout(() => {
                const after = px(1);
                editor.blockManager.undoRedoAction.redo();
                expect(px(1)).toBeCloseTo(after, 0); // redo should not change
                expect(px(1)).not.toBeCloseTo(u, 0);
                done();
            }, 70);
        }, 70);
    });

    it('resize handle should be shown for last column too', () => {
        // Recreate a 1-col table
        if (editor) { editor.destroy(); }
        editorElement.innerHTML = '';
        const one = buildTableBlock('table_resizev1_onecol', 1, 2, true, true);
        editor = createEditor({ blocks: [one] });
        editor.appendTo('#editor-resizev1-edges');
        tableBlockEl = editorElement.querySelector('.e-table-block') as HTMLElement;
        tableEl = getTable(editorElement);

        const cell = getDataCellEl(editorElement, 1, 0);
        const rect = cell.getBoundingClientRect();
        cell.dispatchEvent(new MouseEvent('mousemove', { clientX: rect.right - 2, clientY: rect.top + 5, bubbles: true }));
        const handle = tableBlockEl.querySelector('.e-col-resize-handle') as HTMLElement;
        expect(handle.style.display).toBe('block');
    });
});

describe('Table Column Resize - Drag/Clamp/Mode', () => {
    let editor: BlockEditor;
    let editorElement: HTMLElement;
    let tableBlockEl: HTMLElement;
    let tableEl: HTMLTableElement;

    const getLeftPx = (dataIdx: number): number => {
        const colgroup = tableEl.querySelector('colgroup');
        const left = colgroup.children[toDomCol(dataIdx, true)] as HTMLTableColElement;
        const w = (left.style.width || '').trim();
        return parseFloat(w);
    };

    beforeEach(() => {
        editorElement = createElement('div', { id: 'editor-resizev1-drag' });
        document.body.appendChild(editorElement);
        const tableBlock = buildTableBlock('table_resizev1_drag', 4, 3, true, true);
        editor = createEditor({ blocks: [tableBlock] });
        editor.appendTo('#editor-resizev1-drag');
        tableBlockEl = editorElement.querySelector('.e-table-block') as HTMLElement;
        tableEl = tableBlockEl.querySelector('table') as HTMLTableElement;
    });

    afterEach(() => {
        if (editor) editor.destroy();
        if (editorElement.parentElement) editorElement.parentElement.removeChild(editorElement);
    });

    function startDragAtBoundary(dataColIdx: number, dx: number): void {
        const cell = getDataCellEl(editorElement, 1, dataColIdx);
        const rect = cell.getBoundingClientRect();
        const startX = rect.right - 2;
        cell.dispatchEvent(new MouseEvent('mousemove', { clientX: startX, clientY: rect.top + 8, bubbles: true }));
        const handle = tableBlockEl.querySelector('.e-col-resize-handle') as HTMLElement;
        handle.dispatchEvent(new MouseEvent('mousedown', { clientX: startX, clientY: rect.top + 8, bubbles: true }));
        editorElement.dispatchEvent(new MouseEvent('mousemove', { clientX: startX + dx, clientY: rect.top + 8, bubbles: true }));
        editorElement.dispatchEvent(new MouseEvent('mouseup', { clientX: startX + dx, clientY: rect.top + 8, bubbles: true }));
    }

    it('switches to px mode on mousedown', (done) => {
        const cell = getDataCellEl(editorElement, 1, 1);
        const rect = cell.getBoundingClientRect();
        const startX = rect.right - 2;
        cell.dispatchEvent(new MouseEvent('mousemove', { clientX: startX, clientY: rect.top + 8, bubbles: true }));
        const handle = tableBlockEl.querySelector('.e-col-resize-handle') as HTMLElement;
        handle.dispatchEvent(new MouseEvent('mousedown', { clientX: startX, clientY: rect.top + 8, bubbles: true }));
        setTimeout(() => {
            expect(tableEl.getAttribute('data-col-width-mode')).toBe('px');
            // cleanup mouseup
            document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
            done();
        }, 20);
    });

    it('resizes only the left column (increase on drag right)', (done) => {
        const before = getLeftPx(1) || (tableEl.clientWidth / 4);
        startDragAtBoundary(1, +60);
        setTimeout(() => {
            const after = getLeftPx(1);
            expect(after).toBeGreaterThan(before);
            done();
        }, 50);
    });

    it('resizes only the left column (decrease on drag left, clamped)', (done) => {
        startDragAtBoundary(1, -1000);
        setTimeout(() => {
            const after = getLeftPx(1);
            expect(after).toBeGreaterThanOrEqual(constants.TABLE_COL_MIN_WIDTH);
            done();
        }, 60);
    });

    it('hover line shows during drag and hides on mouseup', (done) => {
        const cell = getDataCellEl(editorElement, 1, 2);
        const rect = cell.getBoundingClientRect();
        const sx = rect.right - 2;
        cell.dispatchEvent(new MouseEvent('mousemove', { clientX: sx, clientY: rect.top + 8, bubbles: true }));
        const handle = tableBlockEl.querySelector('.e-col-resize-handle') as HTMLElement;
        handle.dispatchEvent(new MouseEvent('mousedown', { clientX: sx, clientY: rect.top + 8, bubbles: true }));
        editorElement.dispatchEvent(new MouseEvent('mousemove', { clientX: sx + 40, clientY: rect.top + 8, bubbles: true }));
        const hoverLine = tableBlockEl.querySelector('.e-col-hover-line') as HTMLElement;
        expect(hoverLine.style.display).toBe('block');
        editorElement.dispatchEvent(new MouseEvent('mouseup', { clientX: sx + 40, clientY: rect.top + 8, bubbles: true }));
        setTimeout(() => { expect(hoverLine.style.display).toBe('none'); done(); }, 40);
    });

    it('updates model columns[i].width as px string after resize', (done) => {
        startDragAtBoundary(1, +30);
        setTimeout(() => {
            const props = editor.blocks[0].properties as ITableBlockSettings;
            expect(String(props.columns[1].width)).toMatch(/px$/);
            done();
        }, 60);
    });

    it('no-op click without movement leaves widths unchanged', (done) => {
        const before = getLeftPx(2) || (tableEl.clientWidth / 4);
        const cell = getDataCellEl(editorElement, 1, 2);
        const rect = cell.getBoundingClientRect();
        const sx = rect.right - 2;
        cell.dispatchEvent(new MouseEvent('mousemove', { clientX: sx, clientY: rect.top + 8, bubbles: true }));
        const handle = tableBlockEl.querySelector('.e-col-resize-handle') as HTMLElement;
        handle.dispatchEvent(new MouseEvent('mousedown', { clientX: sx, clientY: rect.top + 8, bubbles: true }));
        editorElement.dispatchEvent(new MouseEvent('mouseup', { clientX: sx, clientY: rect.top + 8, bubbles: true }));
        setTimeout(() => {
            const after = getLeftPx(2) || (tableEl.clientWidth / 4);
            expect(Math.abs(after - before)).toBeLessThan(1);
            done();
        }, 40);
    });

    it('read-only table prevents resize', (done) => {
        const props = editor.blocks[0].properties as ITableBlockSettings;
        props.readOnly = true;
        editor.blockManager.stateManager.updateManagerBlocks();
        const before = getLeftPx(1) || (tableEl.clientWidth / 4);
        startDragAtBoundary(1, +50);
        setTimeout(() => {
            const after = getLeftPx(1) || (tableEl.clientWidth / 4);
            expect(Math.abs(after - before)).toBeLessThan(1);
            done();
        }, 60);
    });

    it('header cell boundary behaves same as body cell', (done) => {
        const header = getHeaderCell(editorElement, 1);
        const rect = header.getBoundingClientRect();
        const sx = rect.right - 2;
        header.dispatchEvent(new MouseEvent('mousemove', { clientX: sx, clientY: rect.top + 8, bubbles: true }));
        const handle = tableBlockEl.querySelector('.e-col-resize-handle') as HTMLElement;
        handle.dispatchEvent(new MouseEvent('mousedown', { clientX: sx, clientY: rect.top + 8, bubbles: true }));
        editorElement.dispatchEvent(new MouseEvent('mousemove', { clientX: sx + 25, clientY: rect.top + 8, bubbles: true }));
        editorElement.dispatchEvent(new MouseEvent('mouseup', { clientX: sx + 25, clientY: rect.top + 8, bubbles: true }));
        setTimeout(() => {
            const after = getLeftPx(1);
            expect(after).toBeGreaterThan(120);
            done();
        }, 60);
    });

    it('table sets data-col-width-mode=px after first drag', (done) => {
        startDragAtBoundary(0, +10);
        setTimeout(() => { expect(tableEl.getAttribute('data-col-width-mode')).toBe('px'); done(); }, 30);
    });

    it('hover line position tracks clamped boundary when dragging left beyond min', (done) => {
        const cell = getDataCellEl(editorElement, 1, 1);
        const rect = cell.getBoundingClientRect();
        const sx = rect.right - 2;
        cell.dispatchEvent(new MouseEvent('mousemove', { clientX: sx, clientY: rect.top + 8, bubbles: true }));
        const handle = tableBlockEl.querySelector('.e-col-resize-handle') as HTMLElement;
        handle.dispatchEvent(new MouseEvent('mousedown', { clientX: sx, clientY: rect.top + 8, bubbles: true }));
        editorElement.dispatchEvent(new MouseEvent('mousemove', { clientX: sx - 5000, clientY: rect.top + 8, bubbles: true }));
        const hoverLine = tableBlockEl.querySelector('.e-col-hover-line') as HTMLElement;
        const leftPx = parseFloat(hoverLine.style.left);
        expect(isNaN(leftPx)).toBe(false);
        expect(leftPx).toBeGreaterThanOrEqual(0);
        document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
        setTimeout(() => { expect(hoverLine.style.display).toBe('none'); done(); }, 40);
    });

    it('multiple drags accumulate changes to the left column', (done) => {
        const before = getLeftPx(2) || (tableEl.clientWidth / 4);
        startDragAtBoundary(2, +20);
        startDragAtBoundary(2, -10);
        startDragAtBoundary(2, +15);
        setTimeout(() => {
            const after = getLeftPx(2);
            expect(after).toBeGreaterThan(before);
            done();
        }, 80);
    });
});

describe('Table Column Resize - Undo/Redo (px)', () => {
    let editor: BlockEditor;
    let editorElement: HTMLElement;
    let tableBlockEl: HTMLElement;
    let tableEl: HTMLTableElement;

    const getPx = (idx: number): number => {
        const cg = tableEl.querySelector('colgroup');
        const el = cg.children[toDomCol(idx, true)] as HTMLTableColElement;
        return parseFloat((el.style.width || '').trim());
    };

    function drag(colIdx: number, dx: number): void {
        const cell = getDataCellEl(editorElement, 1, colIdx);
        const rect = cell.getBoundingClientRect();
        const sx = rect.right - 2;
        cell.dispatchEvent(new MouseEvent('mousemove', { clientX: sx, clientY: rect.top + 8, bubbles: true }));
        const handle = tableBlockEl.querySelector('.e-col-resize-handle') as HTMLElement;
        handle.dispatchEvent(new MouseEvent('mousedown', { clientX: sx, clientY: rect.top + 8, bubbles: true }));
        editorElement.dispatchEvent(new MouseEvent('mousemove', { clientX: sx + dx, clientY: rect.top + 8, bubbles: true }));
        editorElement.dispatchEvent(new MouseEvent('mouseup', { clientX: sx + dx, clientY: rect.top + 8, bubbles: true }));
    }

    beforeEach(() => {
        editorElement = createElement('div', { id: 'editor-resizev1-undo' });
        document.body.appendChild(editorElement);
        const tableBlock = buildTableBlock('table_resizev1_undo', 4, 3, true, true);
        editor = createEditor({ blocks: [tableBlock], enableUndo: true } as any);
        editor.appendTo('#editor-resizev1-undo');
        tableBlockEl = editorElement.querySelector('.e-table-block') as HTMLElement;
        tableEl = getTable(editorElement);
    });

    afterEach(() => {
        if (editor) editor.destroy();
        if (editorElement.parentElement) editorElement.parentElement.removeChild(editorElement);
    });

    it('undo restores previous px width', (done) => {
        drag(1, +40);
        setTimeout(() => {
            const after = getPx(1);
            editor.blockManager.undoRedoAction.undo();
            const restored = getPx(1);
            expect(Math.abs(restored - after)).toBeGreaterThan(0); // changed back
            done();
        }, 60);
    });

    it('redo reapplies px width', (done) => {
        drag(2, +30);
        setTimeout(() => {
            const after = getPx(2);
            editor.blockManager.undoRedoAction.undo();
            editor.blockManager.undoRedoAction.redo();
            const re = getPx(2);
            expect(Math.abs(re - after)).toBeLessThan(1.1);
            done();
        }, 80);
    });

    it('multiple resizes push multiple undo steps', (done) => {
        drag(1, +20);
        drag(1, -10);
        drag(1, +18);
        setTimeout(() => {
            const snap = getPx(1);
            editor.blockManager.undoRedoAction.undo();
            const u1 = getPx(1);
            editor.blockManager.undoRedoAction.undo();
            const u2 = getPx(1);
            expect(u1).not.toBeNaN();
            expect(u2).not.toBeNaN();
            expect(Math.abs(snap - u1)).toBeGreaterThan(0);
            done();
        }, 100);
    });

    it('no-op drag does not push undo', (done) => {
        const cell = getDataCellEl(editorElement, 1, 1);
        const rect = cell.getBoundingClientRect();
        const sx = rect.right - 2;
        const beforeIdx = editor.blockManager.undoRedoAction.index;
        cell.dispatchEvent(new MouseEvent('mousemove', { clientX: sx, clientY: rect.top + 8, bubbles: true }));
        const handle = tableBlockEl.querySelector('.e-col-resize-handle') as HTMLElement;
        handle.dispatchEvent(new MouseEvent('mousedown', { clientX: sx, clientY: rect.top + 8, bubbles: true }));
        editorElement.dispatchEvent(new MouseEvent('mouseup', { clientX: sx, clientY: rect.top + 8, bubbles: true }));
        setTimeout(() => {
            const afterIdx = editor.blockManager.undoRedoAction.index;
            expect(afterIdx).toBe(beforeIdx);
            done();
        }, 40);
    });

    it('read-only resize attempt does not push undo', (done) => {
        const props = editor.blocks[0].properties as ITableBlockSettings;
        props.readOnly = true;
        editor.blockManager.stateManager.updateManagerBlocks();
        const beforeIdx = editor.blockManager.undoRedoAction.index;
        drag(1, +25);
        setTimeout(() => {
            const afterIdx = editor.blockManager.undoRedoAction.index;
            expect(afterIdx).toBe(beforeIdx);
            done();
        }, 60);
    });
});

describe('Table Column Resize - Add/Delete columns in px mode', () => {
    let editor: BlockEditor;
    let editorElement: HTMLElement;
    let tableBlockEl: HTMLElement;
    let tableEl: HTMLTableElement;

    const getPx = (idx: number): number => {
        const cg = tableEl.querySelector('colgroup');
        const el = cg.children[toDomCol(idx, true)] as HTMLTableColElement;
        return parseFloat((el.style.width || '').trim());
    };

    function drag(colIdx: number, dx: number): void {
        const cell = getDataCellEl(editorElement, 1, colIdx);
        const rect = cell.getBoundingClientRect();
        const sx = rect.right - 2;
        cell.dispatchEvent(new MouseEvent('mousemove', { clientX: sx, clientY: rect.top + 8, bubbles: true }));
        const handle = tableBlockEl.querySelector('.e-col-resize-handle') as HTMLElement;
        handle.dispatchEvent(new MouseEvent('mousedown', { clientX: sx, clientY: rect.top + 8, bubbles: true }));
        editorElement.dispatchEvent(new MouseEvent('mousemove', { clientX: sx + dx, clientY: rect.top + 8, bubbles: true }));
        editorElement.dispatchEvent(new MouseEvent('mouseup', { clientX: sx + dx, clientY: rect.top + 8, bubbles: true }));
    }

    beforeEach(() => {
        editorElement = createElement('div', { id: 'editor-resizev1-adddel' });
        document.body.appendChild(editorElement);
        const tableBlock = buildTableBlock('table_resizev1_adddel', 4, 3, true, true);
        editor = createEditor({ blocks: [tableBlock] });
        editor.appendTo('#editor-resizev1-adddel');
        tableBlockEl = editorElement.querySelector('.e-table-block') as HTMLElement;
        tableEl = getTable(editorElement);
    });

    afterEach(() => {
        if (editor) editor.destroy();
        if (editorElement.parentElement) editorElement.parentElement.removeChild(editorElement);
    });

    it('after resize, adding a column keeps px mode and sets new col to def col value', (done) => {
        drag(1, +40);
        setTimeout(() => {
            editor.blockManager.tableService.addColumnAt({ blockId: editor.blocks[0].id, colIndex: 2 });
            setTimeout(() => {
                const mode = tableEl.getAttribute('data-col-width-mode');
                expect(mode).toBe('px');
                const newColPx = getPx(2);
                expect(Math.round(newColPx)).toBe(constants.TABLE_NEW_COL_WIDTH);
                done();
            }, 60);
        }, 50);
    });

    it('after resize, deleting a column keeps px mode and preserves other px widths', (done) => {
        drag(2, +30);
        setTimeout(() => {
            const before = [getPx(0), getPx(1), getPx(2), getPx(3)];
            editor.blockManager.tableService.deleteColumnAt({ blockId: editor.blocks[0].id, colIndex: 3 });
            setTimeout(() => {
                const mode = tableEl.getAttribute('data-col-width-mode');
                expect(mode).toBe('px');
                const after = [getPx(0), getPx(1), getPx(2)];
                expect(after[0]).toBeCloseTo(before[0], 0);
                expect(after[1]).toBeCloseTo(before[1], 0);
                done();
            }, 60);
        }, 60);
    });
});

describe('Table Column Resize - Misc interactions', () => {
    let editor: BlockEditor;
    let editorElement: HTMLElement;
    let tableBlockEl: HTMLElement;
    let tableEl: HTMLTableElement;

    beforeEach(() => {
        editorElement = createElement('div', { id: 'editor-resizev1-misc' });
        document.body.appendChild(editorElement);
        const tableBlock = buildTableBlock('table_resizev1_misc', 4, 3, true, true);
        editor = createEditor({ blocks: [tableBlock] });
        editor.appendTo('#editor-resizev1-misc');
        tableBlockEl = editorElement.querySelector('.e-table-block') as HTMLElement;
        tableEl = getTable(editorElement);
    });

    afterEach(() => {
        if (editor) editor.destroy();
        if (editorElement.parentElement) editorElement.parentElement.removeChild(editorElement);
    });

    it('outside clicks do not trigger resize', () => {
        const colgroup = tableEl.querySelector('colgroup');
        const before = parseFloat((colgroup.children[toDomCol(1, true)] as HTMLTableColElement).style.width || '0');
        document.body.dispatchEvent(new MouseEvent('mousedown', { clientX: 0, clientY: 0, bubbles: true }));
        document.body.dispatchEvent(new MouseEvent('mouseup', { clientX: 0, clientY: 0, bubbles: true }));
        const after = parseFloat((colgroup.children[toDomCol(1, true)] as HTMLTableColElement).style.width || '0');
        expect(after).toBe(before);
    });

    it('hover/resize UI cleans up on mouseleave', () => {
        const cell = getDataCellEl(editorElement, 1, 1);
        const rect = cell.getBoundingClientRect();
        cell.dispatchEvent(new MouseEvent('mousemove', { clientX: rect.right - 2, clientY: rect.top + 8, bubbles: true }));
        const handle = tableBlockEl.querySelector('.e-col-resize-handle') as HTMLElement;
        expect(handle.style.display).toBe('block');
        tableBlockEl.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
        expect(handle.style.display).toBe('none');
    });

    it('resizing does not modify header text content', (done) => {
        const header = getHeaderCell(editorElement, 1);
        const prev = header.textContent;
        const rect = header.getBoundingClientRect();
        const sx = rect.right - 2;
        header.dispatchEvent(new MouseEvent('mousemove', { clientX: sx, clientY: rect.top + 6, bubbles: true }));
        const handle = tableBlockEl.querySelector('.e-col-resize-handle') as HTMLElement;
        handle.dispatchEvent(new MouseEvent('mousedown', { clientX: sx, clientY: rect.top + 6, bubbles: true }));
        editorElement.dispatchEvent(new MouseEvent('mousemove', { clientX: sx + 25, clientY: rect.top + 6, bubbles: true }));
        editorElement.dispatchEvent(new MouseEvent('mouseup', { clientX: sx + 25, clientY: rect.top + 6, bubbles: true }));
        setTimeout(() => { expect(header.textContent).toBe(prev); done(); }, 50);
    });

    it('resizing boundary 0|1 then 2|3 leaves 0|1 width intact after second', (done) => {
        const cell01 = getDataCellEl(editorElement, 1, 0);
        const r1 = cell01.getBoundingClientRect();
        const sx1 = r1.right - 2;
        cell01.dispatchEvent(new MouseEvent('mousemove', { clientX: sx1, clientY: r1.top + 6, bubbles: true }));
        let handle = tableBlockEl.querySelector('.e-col-resize-handle') as HTMLElement;
        handle.dispatchEvent(new MouseEvent('mousedown', { clientX: sx1, clientY: r1.top + 6, bubbles: true }));
        editorElement.dispatchEvent(new MouseEvent('mousemove', { clientX: sx1 + 25, clientY: r1.top + 6, bubbles: true }));
        editorElement.dispatchEvent(new MouseEvent('mouseup', { clientX: sx1 + 25, clientY: r1.top + 6, bubbles: true }));

        const before01 = [
            parseFloat((tableEl.querySelector('colgroup').children[toDomCol(0, true)] as HTMLTableColElement).style.width || '0'),
            parseFloat((tableEl.querySelector('colgroup').children[toDomCol(1, true)] as HTMLTableColElement).style.width || '0')
        ];

        const cell23 = getDataCellEl(editorElement, 1, 2);
        const r2 = cell23.getBoundingClientRect();
        const sx2 = r2.right - 2;
        cell23.dispatchEvent(new MouseEvent('mousemove', { clientX: sx2, clientY: r2.top + 6, bubbles: true }));
        handle = tableBlockEl.querySelector('.e-col-resize-handle') as HTMLElement;
        handle.dispatchEvent(new MouseEvent('mousedown', { clientX: sx2, clientY: r2.top + 6, bubbles: true }));
        editorElement.dispatchEvent(new MouseEvent('mousemove', { clientX: sx2 - 22, clientY: r2.top + 6, bubbles: true }));
        editorElement.dispatchEvent(new MouseEvent('mouseup', { clientX: sx2 - 22, clientY: r2.top + 6, bubbles: true }));

        setTimeout(() => {
            const after01 = [
                parseFloat((tableEl.querySelector('colgroup').children[toDomCol(0, true)] as HTMLTableColElement).style.width || '0'),
                parseFloat((tableEl.querySelector('colgroup').children[toDomCol(1, true)] as HTMLTableColElement).style.width || '0')
            ];
            expect(Math.abs(after01[0] - before01[0])).toBeLessThan(1.1);
            expect(Math.abs(after01[1] - before01[1])).toBeLessThan(1.1);
            done();
        }, 80);
    });

    it('resizing does not alter non-adjacent columns immediately', (done) => {
        const before = [0, 1, 2, 3].map(i => parseFloat((tableEl.querySelector('colgroup').children[toDomCol(i, true)] as HTMLTableColElement).style.width || '0'));
        const cell = getDataCellEl(editorElement, 1, 1);
        const rect = cell.getBoundingClientRect();
        const sx = rect.right - 2;
        cell.dispatchEvent(new MouseEvent('mousemove', { clientX: sx, clientY: rect.top + 6, bubbles: true }));
        const handle = tableBlockEl.querySelector('.e-col-resize-handle') as HTMLElement;
        handle.dispatchEvent(new MouseEvent('mousedown', { clientX: sx, clientY: rect.top + 6, bubbles: true }));
        editorElement.dispatchEvent(new MouseEvent('mousemove', { clientX: sx + 18, clientY: rect.top + 6, bubbles: true }));
        editorElement.dispatchEvent(new MouseEvent('mouseup', { clientX: sx + 18, clientY: rect.top + 6, bubbles: true }));
        setTimeout(() => {
            const after = [0, 1, 2, 3].map(i => parseFloat((tableEl.querySelector('colgroup').children[toDomCol(i, true)] as HTMLTableColElement).style.width || '0'));
            // Only col1 should have changed notably
            expect(Math.abs(after[0] - before[0])).toBeLessThan(1.1);
            expect(Math.abs(after[2] - before[2])).toBeLessThan(1.1);
            expect(Math.abs(after[3] - before[3])).toBeLessThan(1.1);
            done();
        }, 80);
    });

    it('resizing at header uses same logic as body cells (px mode)', (done) => {
        const header = getHeaderCell(editorElement, 2);
        const rect = header.getBoundingClientRect();
        const sx = rect.right - 2;
        header.dispatchEvent(new MouseEvent('mousemove', { clientX: sx, clientY: rect.top + 6, bubbles: true }));
        const handle = tableBlockEl.querySelector('.e-col-resize-handle') as HTMLElement;
        handle.dispatchEvent(new MouseEvent('mousedown', { clientX: sx, clientY: rect.top + 6, bubbles: true }));
        editorElement.dispatchEvent(new MouseEvent('mousemove', { clientX: sx + 22, clientY: rect.top + 6, bubbles: true }));
        editorElement.dispatchEvent(new MouseEvent('mouseup', { clientX: sx + 22, clientY: rect.top + 6, bubbles: true }));
        setTimeout(() => {
            const px = parseFloat((tableEl.querySelector('colgroup').children[toDomCol(2, true)] as HTMLTableColElement).style.width || '0');
            expect(px).toBeGreaterThanOrEqual(120);
            done();
        }, 60);
    });

    it('does not respond to hover over TH row-number cell', () => {
        const th = tableEl.querySelector('thead th.e-row-number') as HTMLElement;
        const rect = th.getBoundingClientRect();
        th.dispatchEvent(new MouseEvent('mousemove', { clientX: rect.right - 2, clientY: rect.top + 4, bubbles: true }));
        const handle = tableBlockEl.querySelector('.e-col-resize-handle') as HTMLElement;
        expect(handle.style.display).toBe('none');
    });
});

describe('Table Scroll', () => {
    let editor: BlockEditor;
    let host: HTMLElement;
    let tableEl: HTMLTableElement;
    let container: HTMLElement; // scrollable wrapper (table.parentElement)

    function setup(cols: number, rows: number): void {
        host = createElement('div', { id: 'auto-scroll-editor' });
        document.body.appendChild(host);
        const tableBlock = buildTableBlock('t_auto_scroll', cols, rows, true, true);
        editor = createEditor({ blocks: [tableBlock] } as any);
        editor.appendTo('#auto-scroll-editor');
        tableEl = getTable(host);
        container = tableEl.parentElement as HTMLElement;
        // Constrain container width to force horizontal scrolling
        container.style.width = '300px';
        container.style.overflowX = 'auto';
    }

    function teardown(): void {
        if (editor) { editor.destroy(); }
        if (host && host.parentElement) { host.parentElement.removeChild(host); }
    }

    function focusCell(row: number, col: number): HTMLElement {
        const td = getDataCellEl(host, row, col) as HTMLElement;
        editor.blockManager.tableService.addCellFocus(td, true, true);
        return td;
    }

    function dispatchKey(target: HTMLElement, key: string, shift = false): void {
        const ev = new KeyboardEvent('keydown', { key, bubbles: true, shiftKey: shift });
        target.dispatchEvent(ev);
    }

    beforeEach(() => setup(12, 3));
    afterEach(teardown);

    it('Tab navigation scrolls horizontally to reveal far-right cell', (done) => {
        container.scrollLeft = 0;

        // Press Tab enough times to reach last column in first row
        for (let i = 0; i < 11; i++) {
            const cell = focusCell(1, i);
            dispatchKey(cell, 'Tab');
        }

        setTimeout(() => {
            expect(container.scrollLeft).toBeGreaterThan(0);
            done();
        }, 500);
    });

    it('Shift+Tab navigation scrolls back left to reveal first cell', (done) => {
        focusCell(1, 11);
        container.scrollLeft = 500; // simulate already scrolled right

        for (let i = 11; i > 0; i--) {
            const cell = focusCell(1, i);
            dispatchKey(cell, 'Tab', true);
        }

        setTimeout(() => {
            expect(container.scrollLeft).toBeLessThan(100);
            done();
        }, 20);
    });

    it('ArrowRight navigations scroll to reveal cells beyond viewport', (done) => {
        focusCell(1, 0);
        container.scrollLeft = 0;

        // Move right across many columns
        for (let i = 0; i < 9; i++) {
            const cell = focusCell(1, i);
            dispatchKey(cell, 'ArrowRight');
        }

        setTimeout(() => {
            expect(container.scrollLeft).toBeGreaterThan(0);
            done();
        }, 500);
    });

    it('ArrowLeft navigations scroll back left to reveal first cells', (done) => {
        focusCell(1, 5);
        container.scrollLeft = 500;

        for (let i = 5; i > 0; i--) {
            const cell = focusCell(1, i);
            dispatchKey(cell, 'ArrowLeft');
        }

        setTimeout(() => {
            expect(container.scrollLeft).toBeLessThan(200);
            done();
        }, 20);
    });

    it('Drag multi-select to a far-right cell scrolls into view on mousemove', (done) => {
        // Start selection at a left-visible cell
        const start = getDataCellEl(host, 1, 0);
        container.scrollLeft = 0;

        start.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

        // Move to a far-right cell to trigger ensureCellVisible during drag
        const end = getDataCellEl(host, 1, 10);
        end.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));

        document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

        setTimeout(() => {
            expect(container.scrollLeft).toBeGreaterThan(0);
            done();
        }, 400);
    });

    it('Drag multi-select back to far-left cell scrolls back into view', (done) => {
        // First, move right
        const start = getDataCellEl(host, 1, 0);
        start.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        const endRight = getDataCellEl(host, 1, 10);
        endRight.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
        document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

        // Now drag back left
        container.scrollLeft = 500;
        const start2 = getDataCellEl(host, 1, 10);
        start2.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        const endLeft = getDataCellEl(host, 1, 0);
        endLeft.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
        document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

        setTimeout(() => {
            expect(container.scrollLeft).toBeLessThan(200);
            done();
        }, 20);
    });
});
