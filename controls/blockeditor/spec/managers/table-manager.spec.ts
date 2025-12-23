import { createElement, remove } from "@syncfusion/ej2-base";
import { createEditor } from "../common/util.spec";
import { BaseStylesProp, BlockModel } from "../../src/models/index";
import { BlockType, CommandName, ContentType } from '../../src/models/enums';
import { BlockEditor } from '../../src/index';
import { IHeadingBlockSettings, TableCellModel, TableColumnModel, ITableBlockSettings, TableRowModel } from '../../src/models/block/block-props';
import { getBlockContentElement, setCursorPosition } from "../../src/common/utils/index";

const domHelpers = {
    query(el: Element | Document, sel: string): HTMLElement { return el.querySelector(sel) as HTMLElement; },
    queryAll(el: Element | Document, sel: string): HTMLElement[] { return Array.from(el.querySelectorAll(sel)) as HTMLElement[]; },
    dispatch(el: Element, type: string, init?: any) {
        const evt = new (window as any).Event(type, { bubbles: true, cancelable: true, ...init });
        el.dispatchEvent(evt);
        return evt;
    },
    input(el: Element, value: string) {
        (el as HTMLElement).textContent = value;
    },
    key(el: Element, key: string, opts: any = {}) {
        const ev = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...opts });
        el.dispatchEvent(ev);
        const up = new KeyboardEvent('keyup', { key, bubbles: true, cancelable: true, ...opts });
        el.dispatchEvent(up);
    },
    paste(el: Element, text: string) {
        const pasteEvt = new ClipboardEvent('paste', { bubbles: true, cancelable: true } as any);
        Object.defineProperty(pasteEvt, 'clipboardData', { value: { getData: () => text } });
        el.dispatchEvent(pasteEvt);
    }
};

function buildTableBlock(id: string, cols: number, rows: number, enableHeader = true, enableRowNumbers = true): BlockModel {
    const columns: TableColumnModel[] = Array.from({ length: cols }).map((_, i) => ({ id: `col${i + 1}`, headerText: `Col ${i + 1}` }));
    const bodyRows: TableRowModel[] = Array.from({ length: rows }).map((_, r) => ({
        id: `row${r + 1}`,
        cells: columns.map((c, cIdx) => ({
            id: `cell_${r + 1}_${cIdx + 1}`,
            columnId: c.id,
            blocks: [{ id: `b_${r + 1}_${cIdx + 1}`, blockType: BlockType.Paragraph, content: [{ id: `c_${r + 1}_${cIdx + 1}`, contentType: ContentType.Text, content: `R${r + 1}C${cIdx + 1}` }] }]
        } as TableCellModel))
    } as TableRowModel));
    const properties: ITableBlockSettings = { columns, rows: bodyRows, width: '100%', enableHeader, enableRowNumbers } as ITableBlockSettings;
    return { id, blockType: BlockType.Table, properties } as BlockModel;
}

function getTable(editorElement: HTMLElement): HTMLTableElement {
    return editorElement.querySelector('.e-table-block table') as HTMLTableElement;
}

function getDataCell(editorElement: HTMLElement, row: number, col: number): HTMLTableCellElement {
    const table = getTable(editorElement);
    return table.querySelector(`td[data-row="${row}"][data-col="${col}"]`) as HTMLTableCellElement;
}

function getHeaderCell(editorElement: HTMLElement, col: number): HTMLTableCellElement | null {
    const table = getTable(editorElement);
    const thead = table.tHead;
    if (!thead) { return null; }
    // Try both dataset and index fallback
    let cell = thead.querySelector(`th[data-row="0"][data-col="${col}"]`) as HTMLTableCellElement;
    if (!cell) { cell = thead.querySelectorAll('th')[col] as HTMLTableCellElement; }
    return cell || null;
}

function getRowNumberCell(editorElement: HTMLElement, bodyRowIndex: number): HTMLTableCellElement {
    const table = getTable(editorElement);
    const tbodyRow = table.tBodies[0].rows[bodyRowIndex];
    return tbodyRow.querySelector('td.e-row-number') as HTMLTableCellElement;
}

function getDataCellEl(editorElement: HTMLElement, row: number, col: number): HTMLTableCellElement {
    const table = getTable(editorElement);
    return table.querySelector(`td[data-row="${row}"][data-col="${col}"]`) as HTMLTableCellElement;
}

function selectRectangle(editorElement: HTMLElement, startRow: number, startCol: number, endRow: number, endCol: number): void {
    const start = getDataCellEl(editorElement, startRow, startCol);
    const end = getDataCellEl(editorElement, endRow, endCol);
    start.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    end.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
    document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
}

describe('Table Manager', () => {
    beforeAll(() => {
        const isDef: any = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log('Unsupported environment, window.performance.memory is unavailable');
            pending();
            return;
        }
    });

    describe('Table selection - Basic selection (mouse)', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const tableBlock = buildTableBlock('table_block', 3, 3, true, true);
            editor = createEditor({ blocks: [tableBlock] });
            editor.appendTo('#editor');
        });

        afterEach(() => {
            if (editor) { editor.destroy(); }
            if (editorElement && editorElement.parentElement) { editorElement.parentElement.removeChild(editorElement); }
        });

        it('Mouse drag single-cell select adds focus only to that cell', () => {
            const start = getDataCell(editorElement, 1, 1);
            const neighbor = getDataCell(editorElement, 1, 2);

            // Activate rectangle mode by moving to a neighbor, then back to start
            start.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            neighbor.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
            start.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
            document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

            const focused = editorElement.querySelectorAll('.e-cell-focus');
            expect(focused.length).toBe(1);
            expect((focused[0] as HTMLTableCellElement).dataset.row).toBe('1');
            expect((focused[0] as HTMLTableCellElement).dataset.col).toBe('1');
        });

        it('Mouse drag right/down selects rectangular range across rows and columns', () => {
            const start = getDataCell(editorElement, 1, 0);
            const end = getDataCell(editorElement, 2, 2);

            start.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            end.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
            document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

            const focused = editorElement.querySelectorAll('.e-cell-focus');
            expect(focused.length).toBe(6);
        });

        it('Mouse drag left/up from end selects correct rectangular range', () => {
            const start = getDataCell(editorElement, 2, 2);
            const end = getDataCell(editorElement, 1, 1);

            start.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            end.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
            document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

            const focused = editorElement.querySelectorAll('.e-cell-focus');
            expect(focused.length).toBe(4);
        });

        it('Mouse drag starting in header (th) treats start row as 0', () => {
            const th = getHeaderCell(editorElement, 1);
            const end = getDataCell(editorElement, 1, 1);
            if (!th) { pending('Header cells not present or not annotated; skip'); return; }

            th.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            end.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
            document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

            const focused = editorElement.querySelectorAll('.e-cell-focus');
            // Should include header cell column 1 and body row 1 col 1 => at least 2 focused cells
            expect(focused.length).toBeGreaterThanOrEqual(2);
        });

        it('Mouse drag ignores row-number cells as selection anchors', () => {
            const rn = getRowNumberCell(editorElement, 0);
            const end = getDataCell(editorElement, 1, 1);

            rn.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            end.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
            document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

            const focused = editorElement.querySelectorAll('.e-cell-focus');
            expect(focused.length).toBe(0);
        });

        it('Mouse drag entering row-number cells keeps current rectangle intact', () => {
            const start = getDataCell(editorElement, 1, 0);
            const rn = getRowNumberCell(editorElement, 1);
            const end = getDataCell(editorElement, 1, 2);

            start.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            rn.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
            end.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
            document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

            const focused = editorElement.querySelectorAll('.e-cell-focus');
            expect(focused.length).toBe(3);
        });

        it('Mouse drag disables userSelect on table and block wrapper during drag', () => {
            const tableBlockEl = editorElement.querySelector('.e-table-block') as HTMLElement;
            const tableEl = getTable(editorElement);
            const start = getDataCell(editorElement, 1, 1);
            const end = getDataCell(editorElement, 2, 2);

            expect((tableBlockEl.style as any).userSelect).toBe('');
            expect((tableEl.style as any).userSelect).toBe('');

            start.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            end.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));

            expect((tableBlockEl.style as any).userSelect).toBe('none');
            expect((tableEl.style as any).userSelect).toBe('none');
        });

        it('Mouse up restores userSelect styles', () => {
            const tableBlockEl = editorElement.querySelector('.e-table-block') as HTMLElement;
            const tableEl = getTable(editorElement);
            const start = getDataCell(editorElement, 1, 1);
            const end = getDataCell(editorElement, 2, 2);

            start.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            end.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));

            document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

            expect((tableBlockEl.style as any).userSelect).toBe('');
            expect((tableEl.style as any).userSelect).toBe('');
        });

        it('Mouse drag starting and ending in same cell keeps single-cell focus', () => {
            const start = getDataCell(editorElement, 2, 1);
            const neighbor = getDataCell(editorElement, 2, 2);

            start.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            neighbor.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
            start.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
            document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

            const focused = editorElement.querySelectorAll('.e-cell-focus');
            expect(focused.length).toBe(1);
            expect((focused[0] as HTMLTableCellElement).dataset.row).toBe('2');
            expect((focused[0] as HTMLTableCellElement).dataset.col).toBe('1');
        });

        it('Mouse drag over last row/last col clamps to table bounds', () => {
            const start = getDataCell(editorElement, 1, 1);
            const end = getDataCell(editorElement, 2, 2);

            start.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            end.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
            document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

            const focused = editorElement.querySelectorAll('.e-cell-focus');
            expect(focused.length).toBe(4);
        });

        it('Mouse drag over first row/first col clamps to table bounds', () => {
            const start = getDataCell(editorElement, 2, 2);
            const end = getDataCell(editorElement, 1, 0);

            start.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            end.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
            document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

            const focused = editorElement.querySelectorAll('.e-cell-focus');
            expect(focused.length).toBe(6);
        });

        it('Drag rectangle re-renders by clearing previous focus then applying new focus', () => {
            const start = getDataCell(editorElement, 1, 0);
            const end = getDataCell(editorElement, 1, 2);
            const nextEnd = getDataCell(editorElement, 2, 2);

            start.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            end.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));

            let focused = Array.from(editorElement.querySelectorAll('.e-cell-focus')) as HTMLTableCellElement[];
            expect(focused.length).toBe(3);

            // Extend rectangle to include next row; previous 3 should be cleared and new 6 applied
            nextEnd.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
            document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

            focused = Array.from(editorElement.querySelectorAll('.e-cell-focus')) as HTMLTableCellElement[];
            expect(focused.length).toBe(6);
        });

        it('Drag rectangle uses col offset when row numbers enabled', () => {
            const start = getDataCell(editorElement, 1, 0);
            const end = getDataCell(editorElement, 1, 2);

            start.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            end.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
            document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

            const table = getTable(editorElement);
            const focused = Array.from(table.querySelectorAll('td.e-cell-focus')) as HTMLTableCellElement[];
            // Ensure none of the focused cells are row-number cells and count matches expected
            expect(focused.every(c => !c.classList.contains('e-row-number'))).toBe(true);
            expect(focused.length).toBe(3);
        });

        it('Drag rectangle includes header row when spanned', () => {
            const th = getHeaderCell(editorElement, 1);
            const end = getDataCell(editorElement, 1, 1);
            if (!th) { pending('Header cells not present or not annotated; skip'); return; }

            th.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            end.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
            document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

            const table = getTable(editorElement);
            const headerFocused = table.tHead ? table.tHead.querySelectorAll('th.e-cell-focus') : null;
            expect(headerFocused && headerFocused.length).toBeGreaterThanOrEqual(1 as any);
        });

        it('Drag rectangle on tables without header uses row 0 as body', () => {
            // Reinitialize with no header
            if (editor) { editor.destroy(); }
            editorElement.innerHTML = '';
            const tableBlock = buildTableBlock('table_block_nohdr', 2, 2, false, true);
            editor = createEditor({ blocks: [tableBlock] });
            editor.appendTo('#editor');

            const start = getDataCell(editorElement, 0, 0);
            const end = getDataCell(editorElement, 1, 1);

            start.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            end.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
            document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

            const focused = editorElement.querySelectorAll('.e-cell-focus');
            expect(focused.length).toBe(4);
        });
    });

    describe('Table selection - Keyboard multiselect (Shift+Arrows)', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        function focusCellAndSelectAll(row: number, col: number): { cell: HTMLTableCellElement, content: HTMLElement } {
            const cell = getDataCell(editorElement, row, col);
            const block = cell.querySelector('.e-block') as HTMLElement;
            const content = block ? block.querySelector('.e-block-content') as HTMLElement : null;
            expect(block).not.toBeNull();
            expect(content).not.toBeNull();
            // Focus block for TableSelectionManager
            (editor as any).blockManager.setFocusToBlock(block);
            // Select entire content within cell
            const range = document.createRange();
            range.selectNodeContents(content.firstChild);
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
            return { cell, content };
        }

        function pressShiftArrow(key: 'ArrowRight' | 'ArrowLeft' | 'ArrowDown' | 'ArrowUp'): void {
            const ev = new KeyboardEvent('keydown', { key, shiftKey: true, bubbles: true });
            editor.element.dispatchEvent(ev);
        }

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const tableBlock = buildTableBlock('table_block', 3, 3, true, true);
            editor = createEditor({ blocks: [tableBlock] });
            editor.appendTo('#editor');
        });

        afterEach(() => {
            if (editor) { editor.destroy(); }
            if (editorElement && editorElement.parentElement) { editorElement.parentElement.removeChild(editorElement); }
        });

        it('Shift+ArrowRight expands rectangle one column to the right', () => {
            focusCellAndSelectAll(1, 0);
            pressShiftArrow('ArrowRight');
            const focused = editorElement.querySelectorAll('.e-cell-focus');
            expect(focused.length).toBe(2);
        });

        it('Shift+ArrowLeft shrinks/expands rectangle one column to the left', () => {
            focusCellAndSelectAll(1, 1);
            pressShiftArrow('ArrowLeft');
            const focused = editorElement.querySelectorAll('.e-cell-focus');
            expect(focused.length).toBe(2);
        });

        it('Shift+ArrowDown expands rectangle one row down', () => {
            focusCellAndSelectAll(1, 1);
            pressShiftArrow('ArrowDown');
            const focused = editorElement.querySelectorAll('.e-cell-focus');
            expect(focused.length).toBe(2);
        });

        it('Shift+ArrowUp shrinks/expands rectangle one row up', () => {
            focusCellAndSelectAll(2, 1);
            pressShiftArrow('ArrowUp');
            const focused = editorElement.querySelectorAll('.e-cell-focus');
            expect(focused.length).toBe(2);
        });

        it('Shift+Arrow keys clamp to table edges without error (right edge)', () => {
            focusCellAndSelectAll(1, 2);
            pressShiftArrow('ArrowRight');
            const focused = editorElement.querySelectorAll('.e-cell-focus');
            // Cannot expand beyond last column, remains single cell
            expect(focused.length).toBe(1);
        });

        it('Shift+Arrow keys clamp to table edges without error (left/top edges)', () => {
            focusCellAndSelectAll(1, 0);
            pressShiftArrow('ArrowLeft');
            let focused = editorElement.querySelectorAll('.e-cell-focus');
            expect(focused.length).toBe(1);

            focusCellAndSelectAll(1, 1);
            pressShiftArrow('ArrowUp');
            focused = editorElement.querySelectorAll('.e-cell-focus');
            // Up from first body row should include header row or clamp if not allowed
            expect(focused.length).toBeGreaterThanOrEqual(1 as any);
        });

        it('Shift+Arrow+Down from header row updates rectangle including header', () => {
            const th = getHeaderCell(editorElement, 0);
            const block = th.closest('.e-block') as HTMLElement;
            editor.blockManager.setFocusToBlock(block);
            editor.blockManager.tableService.addCellFocus(th);
            setCursorPosition(th, th.textContent.length);

            pressShiftArrow('ArrowDown');
            const table = getTable(editorElement);
            const headerFocused = table.tHead ? table.tHead.querySelectorAll('th.e-cell-focus') : null;
            expect(headerFocused && headerFocused.length).toBeGreaterThanOrEqual(1);
        });

        it('Shift+Arrow+Right from header cell updates rectangle to next header', () => {
            const th = getHeaderCell(editorElement, 0);
            const block = th.closest('.e-block') as HTMLElement;
            editor.blockManager.setFocusToBlock(block);
            editor.blockManager.tableService.addCellFocus(th);
            setCursorPosition(th, th.textContent.length);

            pressShiftArrow('ArrowRight');
            const table = getTable(editorElement);
            const headerFocused = table.tHead ? table.tHead.querySelectorAll('th.e-cell-focus') : null;
            expect(headerFocused && headerFocused.length).toBeGreaterThanOrEqual(2);
        });
        it('Shift+Arrow+Right on header focus and Shift+Arrow+Left defocus cells', () => {
            const th = getHeaderCell(editorElement, 0);
            const block = th.closest('.e-block') as HTMLElement;
            editor.blockManager.setFocusToBlock(block);
            editor.blockManager.tableService.addCellFocus(th);
            setCursorPosition(th, th.textContent.length);

            pressShiftArrow('ArrowRight');
            const table = getTable(editorElement);
            const headerFocused = table.tHead ? table.tHead.querySelectorAll('th.e-cell-focus') : null;
            expect(headerFocused && headerFocused.length).toBeGreaterThanOrEqual(2);

            pressShiftArrow('ArrowLeft');
            const headerFocused1 = table.tHead ? table.tHead.querySelectorAll('th.e-cell-focus') : null;
            expect(headerFocused1 && headerFocused1.length).toBeGreaterThanOrEqual(1);
        });

        it('Shift+Arrow with row numbers enabled correctly maps dom/data cols', () => {
            focusCellAndSelectAll(1, 0);
            pressShiftArrow('ArrowRight');
            const table = getTable(editorElement);
            const focused = Array.from(table.querySelectorAll('td.e-cell-focus')) as HTMLTableCellElement[];
            // Ensure no row-number cells are included
            expect(focused.every(c => !c.classList.contains('e-row-number'))).toBe(true);
            expect(focused.length).toBe(2);
        });

        it('Shift+Arrow when selection does not cover entire cell content is ignored', () => {
            const cell = getDataCell(editorElement, 1, 1);
            const block = cell.querySelector('.e-block') as HTMLElement;
            const content = block.querySelector('.e-block-content') as HTMLElement;
            (editor as any).blockManager.setFocusToBlock(block);

            // Place a collapsed caret in the middle of the content
            const range = document.createRange();
            const textNode = content.firstChild as Text;
            const middle = Math.floor((textNode && textNode.length) ? textNode.length / 2 : 1);
            range.setStart(textNode || content, middle);
            range.collapse(true);
            const sel = window.getSelection();
            sel.removeAllRanges(); sel.addRange(range);

            pressShiftArrow('ArrowRight');
            const focused = editorElement.querySelectorAll('.e-cell-focus');
            // No rectangle selection should be applied
            expect(focused.length).toBe(0);
        });

        it('Shift+Arrow selects sequentially cells', () => {
            focusCellAndSelectAll(1, 0);
            pressShiftArrow('ArrowRight');
            pressShiftArrow('ArrowRight');
            const focused = editorElement.querySelectorAll('.e-cell-focus');
            expect(focused.length).toBe(3);
        });

        it('Shift+Arrow across columns should be proper', () => {
            focusCellAndSelectAll(1, 1);
            pressShiftArrow('ArrowRight'); // cols 1..2
            pressShiftArrow('ArrowLeft');  // cols 0..2 or 0..1 depending on implementation, but >=2 cells
            const focused = editorElement.querySelectorAll('.e-cell-focus');
            expect(focused.length).toBeGreaterThanOrEqual(1);
        });

        it('Shift+Arrow across rows should be proper', () => {
            focusCellAndSelectAll(1, 1);
            pressShiftArrow('ArrowDown'); // rows 1..2
            pressShiftArrow('ArrowUp');   // rows 0..2 or 0..1 depending on implementation, but >=2 cells
            const focused = editorElement.querySelectorAll('.e-cell-focus');
            expect(focused.length).toBeGreaterThanOrEqual(1);
        });

        it('Shift+Arrow within single column expands only vertically', () => {
            focusCellAndSelectAll(1, 0);
            pressShiftArrow('ArrowDown');
            pressShiftArrow('ArrowUp');
            const focused = Array.from(editorElement.querySelectorAll('.e-cell-focus')) as HTMLTableCellElement[];
            // All focused cells share same data-col
            const cols = new Set(focused.map(c => c.dataset.col));
            expect(cols.size).toBe(1);
        });

        it('Shift+Arrow within single row expands only horizontally', () => {
            focusCellAndSelectAll(1, 1);
            pressShiftArrow('ArrowRight');
            pressShiftArrow('ArrowLeft');
            const focused = Array.from(editorElement.querySelectorAll('.e-cell-focus')) as HTMLTableCellElement[];
            // All focused cells share same data-row
            const rows = new Set(focused.map(c => c.dataset.row));
            expect(rows.size).toBe(1);
        });

        it('Shift+Arrow should expand selection for empty cells too', () => {
            selectRectangle(editorElement, 1, 0, 2, 1);
            const targetCell = getDataCellEl(editorElement, 1, 0);
            const targetBlock = targetCell.querySelector('.e-block') as HTMLElement;
            editor.blockManager.setFocusToBlock(targetBlock);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', code: 'Backspace' }));

            focusCellAndSelectAll(1, 0);
            pressShiftArrow('ArrowRight');
            const focused = editorElement.querySelectorAll('.e-cell-focus');
            expect(focused.length).toBe(2);
        });
    });

    describe('Table selection - Keyboard navigation', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        function focusCell(row: number, col: number): { cell: HTMLTableCellElement, block: HTMLElement, content: HTMLElement, textNode: Text } {
            const cell = getDataCell(editorElement, row, col);
            const block = cell.querySelector('.e-block') as HTMLElement;
            const content = block.querySelector('.e-block-content') as HTMLElement;
            const textNode = (content.firstChild as Text) || (content.appendChild(document.createTextNode('')) as any);
            (editor as any).blockManager.setFocusToBlock(block);
            return { cell, block, content, textNode };
        }

        function setCaretPosition(node: Text | HTMLElement, offsetType: 'start' | 'middle' | 'end'): void {
            const range = document.createRange();
            if ((node as any).data !== undefined) {
                const txt = node as Text;
                const len = txt.length || 0;
                const off = offsetType === 'start' ? 0 : (offsetType === 'end' ? len : Math.floor(len / 2));
                range.setStart(txt, off);
            } else {
                const el = node as HTMLElement;
                if (!el.firstChild) { el.appendChild(document.createTextNode('')); }
                const txt = el.firstChild as Text;
                const len = txt.length || 0;
                const off = offsetType === 'start' ? 0 : (offsetType === 'end' ? len : Math.floor(len / 2));
                range.setStart(txt, off);
            }
            range.collapse(true);
            const sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(range);
        }

        function pressArrow(key: 'ArrowRight' | 'ArrowLeft' | 'ArrowDown' | 'ArrowUp'): void {
            const ev = new KeyboardEvent('keydown', { key, bubbles: true });
            (editor as any).element.dispatchEvent(ev);
        }

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const tableBlock = buildTableBlock('table_block', 3, 3, true, true);
            editor = createEditor({ blocks: [tableBlock] });
            editor.appendTo('#editor');
        });

        afterEach(() => {
            if (editor) { editor.destroy(); }
            if (editorElement && editorElement.parentElement) { editorElement.parentElement.removeChild(editorElement); }
        });

        it('ArrowRight inside cell content moves caret within inner block', () => {
            const { cell, textNode } = focusCell(1, 1);
            setCaretPosition(textNode, 'middle');
            pressArrow('ArrowRight');
            const focused = editorElement.querySelectorAll('.e-cell-focus');
            expect(focused.length === 0 || (focused.length === 1 && (focused[0] as HTMLElement).isEqualNode(cell))).toBe(true);
        });

        it('ArrowRight at end of last inner block moves focus to next cell', () => {
            const { textNode } = focusCell(1, 1);
            setCaretPosition(textNode, 'end');
            pressArrow('ArrowRight');
            const nextCell = getDataCell(editorElement, 1, 2);
            const focused = editorElement.querySelector('.e-cell-focus') as HTMLElement;
            expect(focused ? focused.isEqualNode(nextCell) : false).toBe(true);
        });

        it('ArrowRight inside empty cell moves focus to adjacent cell', () => {
            const table = editorElement.querySelector('table');
            editor.blockManager.tableService.clearCellContents(table, [getDataCell(editorElement, 1, 1)]);
            const { cell, textNode } = focusCell(1, 1);
            const target = getDataCell(editorElement, 1, 2);
            setCaretPosition(textNode, 'end');
            pressArrow('ArrowRight');
            const focused = editorElement.querySelectorAll('.e-cell-focus');
            expect((focused.length === 1 && (focused[0] as HTMLElement).isEqualNode(target))).toBe(true);
        });

        it('ArrowRight at end of last column moves to first column of next row', () => {
            const { textNode } = focusCell(1, 2);
            setCaretPosition(textNode, 'end');
            pressArrow('ArrowRight');
            const target = getDataCell(editorElement, 2, 0);
            const focused = editorElement.querySelector('.e-cell-focus') as HTMLElement;
            expect(focused ? focused.isEqualNode(target) : false).toBe(true);
        });

        it('ArrowRight at end of last cell in table does not move', () => {
            const { textNode } = focusCell(3, 2);
            setCaretPosition(textNode, 'end');
            pressArrow('ArrowRight');
            const focused = editorElement.querySelector('.e-cell-focus');
            expect(focused).toBeNull();
        });

        it('ArrowLeft inside cell content moves caret within inner block', () => {
            const { cell, textNode } = focusCell(1, 1);
            setCaretPosition(textNode, 'middle');
            pressArrow('ArrowLeft');
            const focused = editorElement.querySelectorAll('.e-cell-focus');
            expect(focused.length === 0 || (focused.length === 1 && (focused[0] as HTMLElement).isEqualNode(cell))).toBe(true);
        });

        it('ArrowLeft at start with no previous inner block moves to previous cell', () => {
            const { textNode } = focusCell(1, 1);
            setCaretPosition(textNode, 'start');
            pressArrow('ArrowLeft');
            const target = getDataCell(editorElement, 1, 0);
            const focused = editorElement.querySelector('.e-cell-focus') as HTMLElement;
            expect(focused ? focused.isEqualNode(target) : false).toBe(true);
        });

        it('ArrowLeft at first column moves to last column of previous row', () => {
            const { textNode } = focusCell(2, 0);
            setCaretPosition(textNode, 'start');
            pressArrow('ArrowLeft');
            const target = getDataCell(editorElement, 1, 2);
            const focused = editorElement.querySelector('.e-cell-focus') as HTMLElement;
            expect(focused ? focused.isEqualNode(target) : false).toBe(true);
        });

        it('ArrowLeft at first cell of table does not move', () => {
            const { textNode } = focusCell(1, 0);
            setCaretPosition(textNode, 'start');
            pressArrow('ArrowLeft');
            pressArrow('ArrowLeft');
            const focused = editorElement.querySelector('.e-cell-focus');
            expect(focused === null || ((focused as HTMLElement).dataset.row === '1' && (focused as HTMLElement).dataset.col === '0')).toBe(true);
        });

        it('ArrowDown moves to same column next row', () => {
            const { textNode } = focusCell(1, 1);
            setCaretPosition(textNode, 'end');
            pressArrow('ArrowDown');
            const target = getDataCell(editorElement, 2, 1);
            const focused = editorElement.querySelector('.e-cell-focus') as HTMLElement;
            expect(focused ? focused.isEqualNode(target) : false).toBe(true);
        });

        it('ArrowDown on last row does not move', () => {
            const { textNode } = focusCell(3, 1);
            setCaretPosition(textNode, 'end');
            pressArrow('ArrowDown');
            const focused = editorElement.querySelector('.e-cell-focus');
            expect(focused === null || ((focused as HTMLElement).dataset.row === '3' && (focused as HTMLElement).dataset.col === '1')).toBe(true);
        });

        it('ArrowUp moves to same column previous row', () => {
            const { textNode } = focusCell(2, 1);
            setCaretPosition(textNode, 'start');
            pressArrow('ArrowUp');
            const target = getDataCell(editorElement, 1, 1);
            const focused = editorElement.querySelector('.e-cell-focus') as HTMLElement;
            expect(focused ? focused.isEqualNode(target) : false).toBe(true);
        });

        it('ArrowUp on first row does not move', () => {
            const th = getHeaderCell(editorElement, 1);
            if (!th) { pending('Header cell not present; skip'); return; }
            const block = th.querySelector('.e-block') as HTMLElement;
            const content = block ? (block.querySelector('.e-block-content') as HTMLElement) : null;
            if (!block || !content) { pending('Header has no inner content; skip'); return; }
            (editor as any).blockManager.setFocusToBlock(block);
            setCaretPosition(content, 'start');
            pressArrow('ArrowUp');
            const table = getTable(editorElement);
            const headerFocused = table.tHead ? table.tHead.querySelectorAll('th.e-cell-focus') : null;
            expect(headerFocused === null || headerFocused.length === 0).toBe(true);
        });

        it('Any Arrow clears multiselect anchors when not using Shift', () => {
            const start = getDataCell(editorElement, 1, 0);
            const end = getDataCell(editorElement, 1, 2);
            start.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            end.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
            document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

            const block = start.querySelector('.e-block') as HTMLElement;
            (editor as any).blockManager.setFocusToBlock(block);
            const content = block.querySelector('.e-block-content') as HTMLElement;
            setCaretPosition(content, 'end');
            pressArrow('ArrowRight');

            const focused = editorElement.querySelectorAll('.e-cell-focus');
            expect(focused.length <= 1).toBe(true);
        });

        it('Backspace on selected cells should clear its contents', () => {
            selectRectangle(editorElement, 1, 0, 2, 1);
            const targetCell = getDataCellEl(editorElement, 1, 0);
            const targetBlock = targetCell.querySelector('.e-block') as HTMLElement;
            editor.blockManager.setFocusToBlock(targetBlock);
            
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', code: 'Backspace' }));
    
            const props = (editor.blocks[0] as BlockModel).properties as ITableBlockSettings;
            expect(props.rows[0].cells[0].blocks[0].content.length).toBe(0);
            expect(props.rows[0].cells[1].blocks[0].content.length).toBe(0);
            expect(props.rows[1].cells[0].blocks[0].content.length).toBe(0);
            expect(props.rows[1].cells[1].blocks[0].content.length).toBe(0);
            expect(getDataCellEl(editorElement, 1, 0).textContent!.trim()).toBe('');
            expect(getDataCellEl(editorElement, 1, 1).textContent!.trim()).toBe('');
            expect(getDataCellEl(editorElement, 2, 0).textContent!.trim()).toBe('');
            expect(getDataCellEl(editorElement, 2, 1).textContent!.trim()).toBe('');
        });

        it('Delete on selected cells should clear its contents', () => {
            selectRectangle(editorElement, 1, 0, 2, 1);
            const targetCell = getDataCellEl(editorElement, 1, 0);
            const targetBlock = targetCell.querySelector('.e-block') as HTMLElement;
            editor.blockManager.setFocusToBlock(targetBlock);
            
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete', code: 'Delete' }));
    
            const props = (editor.blocks[0] as BlockModel).properties as ITableBlockSettings;
            expect(props.rows[0].cells[0].blocks[0].content.length).toBe(0);
            expect(props.rows[0].cells[1].blocks[0].content.length).toBe(0);
            expect(props.rows[1].cells[0].blocks[0].content.length).toBe(0);
            expect(props.rows[1].cells[1].blocks[0].content.length).toBe(0);
            expect(getDataCellEl(editorElement, 1, 0).textContent!.trim()).toBe('');
            expect(getDataCellEl(editorElement, 1, 1).textContent!.trim()).toBe('');
            expect(getDataCellEl(editorElement, 2, 0).textContent!.trim()).toBe('');
            expect(getDataCellEl(editorElement, 2, 1).textContent!.trim()).toBe('');
        });
    });

    describe('Table selection - Tab navigation and exit', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        function focusCell(row: number, col: number): { cell: HTMLTableCellElement, block: HTMLElement, content: HTMLElement } {
            const cell = getDataCell(editorElement, row, col);
            const block = cell.querySelector('.e-block') as HTMLElement;
            const content = block.querySelector('.e-block-content') as HTMLElement;
            (editor as any).blockManager.setFocusToBlock(block);
            const r = document.createRange(); r.selectNodeContents(content);
            const s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
            return { cell, block, content };
        }

        function pressTab(shiftKey = false): void {
            const ev = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, shiftKey });
            (editor as any).element.dispatchEvent(ev);
        }

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const before: BlockModel = { id: 'before', blockType: BlockType.Paragraph, content: [{ id: 'bc', contentType: ContentType.Text, content: 'Before' }] };
            const table = buildTableBlock('table_block', 3, 2, true, true);
            const after: BlockModel = { id: 'after', blockType: BlockType.Paragraph, content: [{ id: 'ac', contentType: ContentType.Text, content: 'After' }] };
            editor = createEditor({ blocks: [before, table, after] });
            editor.appendTo('#editor');
        });

        afterEach(() => {
            if (editor) { editor.destroy(); }
            if (editorElement && editorElement.parentElement) { editorElement.parentElement.removeChild(editorElement); }
        });

        it('Tab moves to next cell in same row', () => {
            focusCell(1, 0);
            pressTab();
            const next = getDataCell(editorElement, 1, 1);
            const focused = editorElement.querySelector('.e-cell-focus') as HTMLElement;
            expect(focused ? focused.isEqualNode(next) : false).toBe(true);
        });

        it('Tab at last column moves to first column of next row', () => {
            focusCell(1, 2);
            pressTab();
            const target = getDataCell(editorElement, 2, 0);
            const focused = editorElement.querySelector('.e-cell-focus') as HTMLElement;
            expect(focused ? focused.isEqualNode(target) : false).toBe(true);
        });

        it('Tab at last cell creates a new row below', () => {
            focusCell(2, 2);
            pressTab();
            const newCell = getDataCell(editorElement, 3, 0);
            expect(newCell).not.toBeNull();
            const focused = editorElement.querySelector('.e-cell-focus');
            expect(focused ? focused.isEqualNode(newCell) : false).toBe(true);
        });

        it('Shift+Tab moves to previous cell in same row', () => {
            focusCell(1, 2);
            pressTab(true);
            const target = getDataCell(editorElement, 1, 1);
            const focused = editorElement.querySelector('.e-cell-focus') as HTMLElement;
            expect(focused ? focused.isEqualNode(target) : false).toBe(true);
        });

        it('Shift+Tab at first column moves to last column of previous row', () => {
            focusCell(2, 0);
            pressTab(true);
            const target = getDataCell(editorElement, 1, 2);
            const focused = editorElement.querySelector('.e-cell-focus') as HTMLElement;
            expect(focused ? focused.isEqualNode(target) : false).toBe(true);
        });

        it('Shift+Tab at first cell moves focus to prev block if present', () => {
            focusCell(1, 0);
            pressTab(true);
            const focused = editorElement.querySelector('.e-cell-focus');
            expect(focused.innerHTML).toBe('Col 3');
        });

        it('Escape exits table navigation to next block forward', () => {
            focusCell(1, 1);
            const ev = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
            (editor as any).element.dispatchEvent(ev);
            const nextBlock = editorElement.querySelector('#after') as HTMLElement;
            const active = (editor as any).blockManager.currentFocusedBlock as HTMLElement;
            expect(active && nextBlock && nextBlock.contains(active)).toBe(true);
        });

        it('Exit removes all cell focus highlighting from table', () => {
            focusCell(1, 1);
            pressTab();
            pressTab();
            // Now exit with Escape
            const ev = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
            (editor as any).element.dispatchEvent(ev);
            const focused = editorElement.querySelectorAll('.e-cell-focus');
            expect(focused.length).toBe(0);
        });
    });

    describe('Table selection - Header/row-number interactions', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        function pressArrow(key: 'ArrowUp' | 'ArrowDown'): void {
            const ev = new KeyboardEvent('keydown', { key, bubbles: true });
            (editor as any).element.dispatchEvent(ev);
        }

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const table = buildTableBlock('table_block', 3, 2, true, true);
            editor = createEditor({ blocks: [table] });
            editor.appendTo('#editor');
        });

        afterEach(() => {
            if (editor) { editor.destroy(); }
            if (editorElement && editorElement.parentElement) { editorElement.parentElement.removeChild(editorElement); }
        });

        //ISSUE
        // it('Navigation from header cell (th) uses row index 0', () => {
        //     const th = getHeaderCell(editorElement, 1);
        //     if (!th) { pending('Header cell not present; skip'); return; }
        //     const block = th.querySelector('.e-block') as HTMLElement;
        //     const content = block ? block.querySelector('.e-block-content') as HTMLElement : null;
        //     if (!block || !content) { pending('Header has no inner content; skip'); return; }
        //     (editor as any).blockManager.setFocusToBlock(block);
        //     const range = document.createRange(); range.selectNodeContents(content);
        //     const sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(range);

        //     // Move down then up, should navigate from header (row 0) to body row 1 and back
        //     pressArrow('ArrowDown');
        //     const r1 = getDataCell(editorElement, 1, 1);
        //     let focused = editorElement.querySelector('.e-cell-focus') as HTMLElement;
        //     expect(focused ? focused.isEqualNode(r1) : false).toBe(true);
        //     pressArrow('ArrowUp');
        //     // Back to header: no td focused
        //     focused = editorElement.querySelector('.e-cell-focus') as HTMLElement;
        //     expect(focused === null).toBe(true);
        // });

        it('Row numbers enabled: toDomCol offset applies in navigation and selection', () => {
            const start = getDataCell(editorElement, 1, 0);
            const end = getDataCell(editorElement, 1, 2);
            // Drag to create rectangle across columns (should skip row-number col)
            start.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            end.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
            document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

            const tableEl = getTable(editorElement);
            const focused = Array.from(tableEl.querySelectorAll('td.e-cell-focus')) as HTMLTableCellElement[];
            expect(focused.every(c => !c.classList.contains('e-row-number'))).toBe(true);
            expect(focused.length).toBe(3);
        });

        it('Row numbers disabled: no offset applied in navigation and selection', () => {
            if (editor) { editor.destroy(); }
            editorElement.innerHTML = '';
            const table = buildTableBlock('table_block2', 2, 2, true, false);
            editor = createEditor({ blocks: [table] });
            editor.appendTo('#editor');

            const start = getDataCell(editorElement, 1, 0);
            const end = getDataCell(editorElement, 1, 1);
            start.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            end.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
            document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

            const focused = editorElement.querySelectorAll('.e-cell-focus');
            expect(focused.length).toBe(2);
        });

        it('Focus add/remove ignores row-number cells', () => {
            const start = getDataCell(editorElement, 1, 0);
            const rn = getRowNumberCell(editorElement, 1);
            const end = getDataCell(editorElement, 1, 2);
            start.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            rn.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
            end.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
            document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
            const focused = Array.from(editorElement.querySelectorAll('.e-cell-focus')) as HTMLTableCellElement[];
            expect(focused.some(c => c.classList.contains('e-row-number'))).toBe(false);
        });

        it('Row numbering has no effect on ArrowUp/Down movement logic', () => {
            // With row numbers enabled (current setup), ArrowUp/Down should move between same data column
            const start = getDataCell(editorElement, 1, 1);
            const block = start.querySelector('.e-block') as HTMLElement;
            (editor as any).blockManager.setFocusToBlock(block);
            const content = block.querySelector('.e-block-content') as HTMLElement;
            const r = document.createRange(); r.selectNodeContents(content);
            const s = window.getSelection(); s.removeAllRanges(); s.addRange(r);

            pressArrow('ArrowDown');
            let target = getDataCell(editorElement, 2, 1);
            let focused = editorElement.querySelector('.e-cell-focus') as HTMLElement;
            expect(focused ? focused.isEqualNode(target) : false).toBe(true);

            // Reinitialize with row numbers disabled; movement should be same
            if (editor) { editor.destroy(); }
            editorElement.innerHTML = '';
            const table2 = buildTableBlock('table_block3', 3, 2, true, false);
            editor = createEditor({ blocks: [table2] });
            editor.appendTo('#editor');

            const start2 = getDataCell(editorElement, 1, 1);
            const block2 = start2.querySelector('.e-block') as HTMLElement;
            (editor as any).blockManager.setFocusToBlock(block2);
            const content2 = block2.querySelector('.e-block-content') as HTMLElement;
            const r2 = document.createRange(); r2.selectNodeContents(content2);
            const s2 = window.getSelection(); s2.removeAllRanges(); s2.addRange(r2);

            pressArrow('ArrowDown');
            target = getDataCell(editorElement, 2, 1);
            focused = editorElement.querySelector('.e-cell-focus') as HTMLElement;
            expect(focused ? focused.isEqualNode(target) : false).toBe(true);
        });
    });

    describe('Table selection - Bounds and mapping', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        function startDrag(fromRow: number, fromCol: number): HTMLTableCellElement {
            const start = getDataCell(editorElement, fromRow, fromCol);
            start.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            return start;
        }
        function moveDrag(toRow: number, toCol: number): void {
            const end = (toRow === -1)
                ? getHeaderCell(editorElement, toCol) as any
                : getDataCell(editorElement, toRow, toCol);
            end && end.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
        }
        function endDrag(): void { document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true })); }

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const table = buildTableBlock('table_block', 4, 3, true, true);
            editor = createEditor({ blocks: [table] });
            editor.appendTo('#editor');
        });

        afterEach(() => {
            if (editor) { editor.destroy(); }
            if (editorElement && editorElement.parentElement) { editorElement.parentElement.removeChild(editorElement); }
        });

        it('TotalRows calculation includes header when enabled', () => {
            const tableEl = getTable(editorElement);
            const totalDomRows = tableEl.rows.length; // includes thead + tbody
            // 1 header + 3 body = 4 rows
            expect(totalDomRows).toBe(4);
        });

        it('TotalCols calculation equals columns length', () => {
            const tableEl = getTable(editorElement);
            const header = tableEl.tHead!.rows[0];
            // row-number + 4 data cols
            const dataCols = header.cells.length - 1;
            expect(dataCols).toBe(4);
        });

        it('Data-to-DOM col mapping correct for first and last columns', () => {
            // Drag across first (0) to last (3) data columns on body row
            startDrag(1, 0);
            moveDrag(1, 3);
            endDrag();
            const cells = Array.from(editorElement.querySelectorAll('td.e-cell-focus')) as HTMLTableCellElement[];
            expect(cells.length).toBe(4);
            // Ensure none are row-number cells
            expect(cells.every(c => !c.classList.contains('e-row-number'))).toBe(true);
        });

        it('Rectangle focus applies focus class to each dom cell within bounds', () => {
            // Rectangle rows 1..2, cols 1..3 => 2*3 = 6 td
            startDrag(1, 1);
            moveDrag(2, 3);
            endDrag();
            const cells = editorElement.querySelectorAll('td.e-cell-focus');
            expect(cells.length).toBe(6);
        });

        it('Selection across header and body rows applies focus correctly', () => {
            // Span from header col 2 to body row 2, col 2
            const th = getHeaderCell(editorElement, 2);
            if (!th) { pending('No header cell to span; skip'); return; }
            th.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            moveDrag(2, 2);
            endDrag();
            const tableEl = getTable(editorElement);
            const headerFocused = tableEl.tHead ? tableEl.tHead.querySelectorAll('th.e-cell-focus') : null;
            const bodyFocused = tableEl.tBodies[0].querySelectorAll('td.e-cell-focus');
            expect(headerFocused && headerFocused.length).toBeGreaterThanOrEqual(1 as any);
            expect(bodyFocused.length).toBeGreaterThan(0 as any);
        });
    });

    describe('Table selection - Cell content and selection preconditions', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        function focusCell(row: number, col: number): { block: HTMLElement, content: HTMLElement } {
            const cell = getDataCell(editorElement, row, col);
            const block = cell.querySelector('.e-block') as HTMLElement;
            const content = block.querySelector('.e-block-content') as HTMLElement;
            (editor as any).blockManager.setFocusToBlock(block);
            return { block, content };
        }
        function pressShiftArrowRight(): void {
            const ev = new KeyboardEvent('keydown', { key: 'ArrowRight', shiftKey: true, bubbles: true });
            (editor as any).element.dispatchEvent(ev);
        }

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const table = buildTableBlock('table_block', 3, 2, true, true);
            editor = createEditor({ blocks: [table] });
            editor.appendTo('#editor');
        });
        afterEach(() => {
            if (editor) { editor.destroy(); }
            if (editorElement && editorElement.parentElement) { editorElement.parentElement.removeChild(editorElement); }
        });

        it('Multiselect allowed only when selection spans entire cell content', () => {
            const { content } = focusCell(1, 1);
            const r = document.createRange(); r.selectNodeContents(content.firstChild);
            const s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
            pressShiftArrowRight();
            const focused = editorElement.querySelectorAll('.e-cell-focus');
            expect(focused.length).toBe(2);
        });

        it('Multiselect not allowed when selection anchor/focus outside current cell', () => {
            // Select content across two different cells
            const cell1 = getDataCell(editorElement, 1, 0);
            const cell2 = getDataCell(editorElement, 1, 1);
            const block1 = cell1.querySelector('.e-block') as HTMLElement;
            const content1 = block1.querySelector('.e-block-content') as HTMLElement;
            const block2 = cell2.querySelector('.e-block') as HTMLElement;
            const content2 = block2.querySelector('.e-block-content') as HTMLElement;
            (editor as any).blockManager.setFocusToBlock(block1);

            const r = document.createRange();
            r.setStart(content1.firstChild || content1, 0);
            r.setEnd((content2.firstChild as any) || content2, 0);
            const s = window.getSelection(); s.removeAllRanges(); s.addRange(r);

            pressShiftArrowRight();
            const focused = editorElement.querySelectorAll('.e-cell-focus');
            expect(focused.length).toBe(0);
        });

        it('Multiselect should be allowed when selection range is collapsed at end', () => {
            const { content } = focusCell(1, 1);
            const r = document.createRange();
            const tn = (content.firstChild as Text) || content.appendChild(document.createTextNode('')) as any;
            r.setStart(tn, tn.textContent.length); r.collapse(true);
            const s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
            pressShiftArrowRight();
            const focused = editorElement.querySelectorAll('.e-cell-focus');
            expect(focused.length).toBe(2);
        });

        it('Multiselect not allowed when no selection (rangeCount 0)', () => {
            const { block } = focusCell(1, 1);
            const s = window.getSelection(); s.removeAllRanges();
            pressShiftArrowRight();
            const focused = editorElement.querySelectorAll('.e-cell-focus');
            expect(focused.length).toBe(0);
        });
    });

    describe('Table selection - Focus management', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        function setCaretPosition(node: Text | HTMLElement, offsetType: 'start' | 'middle' | 'end'): void {
            const range = document.createRange();
            if ((node as any).data !== undefined) {
                const txt = node as Text;
                const len = txt.length || 0;
                const off = offsetType === 'start' ? 0 : (offsetType === 'end' ? len : Math.floor(len / 2));
                range.setStart(txt, off);
            } else {
                const el = node as HTMLElement;
                if (!el.firstChild) { el.appendChild(document.createTextNode('')); }
                const txt = el.firstChild as Text;
                const len = txt.length || 0;
                const off = offsetType === 'start' ? 0 : (offsetType === 'end' ? len : Math.floor(len / 2));
                range.setStart(txt, off);
            }
            range.collapse(true);
            const sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(range);
        }

        function pressArrowRight(): void {
            const ev = new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true });
            (editor as any).element.dispatchEvent(ev);
        }

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const table = buildTableBlock('table_block', 3, 2, false, false);
            editor = createEditor({ blocks: [table] });
            editor.appendTo('#editor');
        });
        afterEach(() => {
            if (editor) { editor.destroy(); }
            if (editorElement && editorElement.parentElement) { editorElement.parentElement.removeChild(editorElement); }
        });

        it('Moving to a new cell removes previous focus class and applies to target', () => {
            const start = getDataCell(editorElement, 1, 0);
            const block = start.querySelector('.e-block') as HTMLElement;
            editor.blockManager.setFocusToBlock(block);
            const content = block.querySelector('.e-block-content') as HTMLElement;
            setCaretPosition(content, 'end');
            pressArrowRight();
            const focused = editorElement.querySelectorAll('.e-cell-focus');
            expect(focused.length).toBe(1);
        });

        it('Adding focus sets caret to first inner block content element in target cell', () => {
            const start = getDataCell(editorElement, 0, 2);
            const block = start.querySelector('.e-block') as HTMLElement;
            editor.blockManager.setFocusToBlock(block);
            const content = block.querySelector('.e-block-content') as HTMLElement;
            setCaretPosition(content, 'end');
            pressArrowRight(); // to next row first col
            const target = getDataCell(editorElement, 1, 0);
            const targetBlock = target.querySelector('.e-block') as HTMLElement;
            const targetContent = targetBlock.querySelector('.e-block-content') as HTMLElement;
            const sel = window.getSelection();
            expect(sel && sel.anchorNode && targetContent.contains(sel.anchorNode)).toBe(true);
        });

        it('After multi select, pressing arrows clears all focused cells in table', () => {
            // Create a rectangle focus via drag
            const start = getDataCell(editorElement, 1, 0);
            const end = getDataCell(editorElement, 1, 2);
            const block = start.querySelector('.e-block') as HTMLElement;
            editor.blockManager.setFocusToBlock(block);
            start.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            end.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
            document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

            // Now move focus by ArrowRight
            pressArrowRight();

            const focused = editorElement.querySelectorAll('.e-cell-focus');
            expect(focused.length).toBe(1);
        });

        it('Cursor should move to adjacent block rather than move focus to next cell', () => {
            editor.addBlock({
                id: 'newBlock', blockType: BlockType.Paragraph,
                content: [ { contentType: ContentType.Text, content: 'New content' } ]
            }, 'b_1_1');
            const start = getDataCell(editorElement, 0, 0);
            const block = start.querySelector('.e-block') as HTMLElement;
            editor.blockManager.setFocusToBlock(block);
            const content = block.querySelector('.e-block-content') as HTMLElement;
            content.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            setCaretPosition(content, 'end');
            pressArrowRight();
            const focused = editorElement.querySelectorAll('.e-cell-focus');
            expect(focused.length).toBe(1);
            expect(focused[0].isEqualNode(start));
            expect(editor.blockManager.currentFocusedBlock.id).toBe('newBlock');
        });
    });

    describe('Table selection - Edge cases and robustness', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;

        function press(key: string, opts: any = {}): void {
            const ev = new KeyboardEvent('keydown', { key, bubbles: true, ...opts });
            (editor as any).element.dispatchEvent(ev);
        }

        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const before: BlockModel = { id: 'before', blockType: BlockType.Paragraph, content: [{ id: 'bc', contentType: ContentType.Text, content: 'Before' }] };
            const table = buildTableBlock('table_block', 3, 2, true, true);
            const after: BlockModel = { id: 'after', blockType: BlockType.Paragraph, content: [{ id: 'ac', contentType: ContentType.Text, content: 'After' }] };
            editor = createEditor({ blocks: [before, table, after] });
            editor.appendTo('#editor');
        });
        afterEach(() => {
            if (editor) { editor.destroy(); }
            if (editorElement && editorElement.parentElement) { editorElement.parentElement.removeChild(editorElement); }
        });

        it('Keyboard handling ignored when currentFocusedBlock not inside a table', () => {
            const beforeBlock = editorElement.querySelector('#before') as HTMLElement;
            (editor as any).blockManager.setFocusToBlock(beforeBlock);
            press('ArrowRight', { shiftKey: true });
            const focused = editorElement.querySelectorAll('.e-cell-focus');
            expect(focused.length).toBe(0);
        });

        it('Keyboard handling ignored when table element not found under currentFocusedBlock', () => {
            const tableEl = getTable(editorElement);
            const anyCell = getDataCell(editorElement, 1, 1);
            const block = anyCell.querySelector('.e-block') as HTMLElement;
            (editor as any).blockManager.setFocusToBlock(block);
            tableEl.parentElement!.removeChild(tableEl); // detach table
            press('ArrowRight', { shiftKey: true });
            const focused = editorElement.querySelectorAll('.e-cell-focus');
            expect(focused.length).toBe(0);
        });

        it('Keyboard handling ignored when td/th not found for current focus', () => {
            const anyCell = getDataCell(editorElement, 1, 1);
            const block = anyCell.querySelector('.e-block') as HTMLElement;
            (editor as any).blockManager.setFocusToBlock(block);
            // Simulate by removing td wrapper
            const td = anyCell;
            const wrapper = td.parentElement as HTMLElement;
            wrapper.removeChild(td);
            press('ArrowRight', { shiftKey: true });
            const focused = editorElement.querySelectorAll('.e-cell-focus');
            expect(focused.length).toBe(0);
        });

        it('Shift+Arrow with uninitialized anchors initializes start/end to current cell', () => {
            const cell = getDataCell(editorElement, 1, 1);
            const block = cell.querySelector('.e-block') as HTMLElement;
            const content = block.querySelector('.e-block-content') as HTMLElement;
            (editor as any).blockManager.setFocusToBlock(block);
            const r = document.createRange(); r.selectNodeContents(content.firstChild);
            const s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
            press('ArrowRight', { shiftKey: true });
            const focused = editorElement.querySelectorAll('.e-cell-focus');
            expect(focused.length).toBe(2);
        });

        it('Drag selection preserves keyboard selection state after mouseup reset', () => {
            // Drag create 2 cells
            const start = getDataCell(editorElement, 1, 0);
            const end = getDataCell(editorElement, 1, 1);
            start.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            end.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
            document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

            const block = start.querySelector('.e-block') as HTMLElement;
            (editor as any).blockManager.setFocusToBlock(block);
            const content = block.querySelector('.e-block-content') as HTMLElement;
            const r = document.createRange(); r.selectNodeContents(content.firstChild);
            const s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
            press('ArrowRight', { shiftKey: true });
            const focused = editorElement.querySelectorAll('.e-cell-focus');
            expect(focused.length).toBe(2);
        });

        it('Consecutive adds/removes of focus do not leave stale focused cells', () => {
            const cell = getDataCell(editorElement, 1, 1);
            const block = cell.querySelector('.e-block') as HTMLElement;
            const content = block.querySelector('.e-block-content') as HTMLElement;
            (editor as any).blockManager.setFocusToBlock(block);
            const r = document.createRange(); r.selectNodeContents(content);
            const s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
            press('ArrowRight', { shiftKey: true }); // 2 cells
            press('ArrowRight', { shiftKey: true }); // 3 cells
            press('ArrowRight', { shiftKey: true }); // clamp
            const focused = editorElement.querySelectorAll('.e-cell-focus');
            expect(focused.length).toBeLessThanOrEqual(3 as any);
        });

        it('Selection APIs absent or empty range does not throw and yields no multiselect', () => {
            const cell = getDataCell(editorElement, 1, 1);
            const block = cell.querySelector('.e-block') as HTMLElement;
            (editor as any).blockManager.setFocusToBlock(block);
            const s = window.getSelection(); s.removeAllRanges();
            press('ArrowRight', { shiftKey: true });
            const focused = editorElement.querySelectorAll('.e-cell-focus');
            expect(focused.length).toBe(0);
        });

        it('TH navigation with ArrowLeft/Right respects wrapping rules like TD', () => {
            const th = getHeaderCell(editorElement, 0);
            if (!th) { pending('No header cell; skip'); return; }
            const block = th.querySelector('.e-block') as HTMLElement;
            const content = block ? block.querySelector('.e-block-content') as HTMLElement : null;
            if (!block || !content) { pending('Header has no content; skip'); return; }
            (editor as any).blockManager.setFocusToBlock(block);
            const r = document.createRange(); r.selectNodeContents(content);
            const s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
            // Move left at first col should clamp
            press('ArrowLeft');
            let focused = editorElement.querySelectorAll('.e-cell-focus');
            expect(focused.length).toBe(0);
        });

        it('Rightward move from last column when at last row clamps without errors', () => {
            const last = getDataCell(editorElement, 2, 2);
            const block = last.querySelector('.e-block') as HTMLElement;
            const content = block.querySelector('.e-block-content') as HTMLElement;
            (editor as any).blockManager.setFocusToBlock(block);
            const r = document.createRange(); r.selectNodeContents(content);
            const s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
            press('ArrowRight');
            const focused = editorElement.querySelectorAll('.e-cell-focus');
            expect(focused.length === 0 || (focused.length === 1 && (focused[0] as HTMLElement).isEqualNode(last))).toBe(true);
        });

        it('Leftward move from first column when at first row clamps without errors', () => {
            const first = getDataCell(editorElement, 1, 0);
            const block = first.querySelector('.e-block') as HTMLElement;
            const content = block.querySelector('.e-block-content') as HTMLElement;
            (editor as any).blockManager.setFocusToBlock(block);
            const r = document.createRange(); r.selectNodeContents(content);
            const s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
            press('ArrowLeft');
            const focused = editorElement.querySelectorAll('.e-cell-focus');
            expect(focused.length === 0 || (focused.length === 1 && (focused[0] as HTMLElement).isEqualNode(first))).toBe(true);
        });

        it('Tab and Shift+Tab skip over row-number cells when computing domCol', () => {
            const start = getDataCell(editorElement, 1, 0);
            const block = start.querySelector('.e-block') as HTMLElement;
            const content = block.querySelector('.e-block-content') as HTMLElement;
            (editor as any).blockManager.setFocusToBlock(block);
            const r = document.createRange(); r.selectNodeContents(content);
            const s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
            // Tab from col 0 -> col 1 (should not land on row-number)
            press('Tab');
            const focused1 = editorElement.querySelector('.e-cell-focus') as HTMLElement;
            expect(focused1 && !focused1.classList.contains('e-row-number')).toBe(true);
            // Shift+Tab back -> col 0 (still not row-number)
            press('Tab', { shiftKey: true });
            const focused2 = editorElement.querySelector('.e-cell-focus') as HTMLElement;
            expect(focused2 && !focused2.classList.contains('e-row-number')).toBe(true);
        });

        it('Exit table navigation sets editor focus to adjacent block’s content element', () => {
            const cell = getDataCell(editorElement, 1, 1);
            const block = cell.querySelector('.e-block') as HTMLElement;
            const content = block.querySelector('.e-block-content') as HTMLElement;
            (editor as any).blockManager.setFocusToBlock(block);
            const r = document.createRange(); r.selectNodeContents(content);
            const s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
            press('Escape');
            const after = editorElement.querySelector('#after') as HTMLElement;
            const active = (editor as any).blockManager.currentFocusedBlock as HTMLElement;
            expect(active && after && after.contains(active)).toBe(true);
        });

        it('Rectangle selection across entire table (corner to corner) highlights all data cells', () => {
            // From first cell data col to last body row last data col
            const start = getDataCell(editorElement, 1, 0);
            const last = getDataCell(editorElement, 2, 2);
            start.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            last.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
            document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

            const tableEl = getTable(editorElement);
            const bodyFocused = tableEl.tBodies[0].querySelectorAll('td.e-cell-focus');
            // Expect 2 rows x 3 cols = 6 td focused (row-number excluded)
            expect(bodyFocused.length).toBe(3 * 2);
        });
    });

    describe('Table selection - keyboard navigation with headers and exits', () => {
        let editor: BlockEditor;
        let editorElement: HTMLElement;
        // Places a collapsed caret inside the given element
        function setCaretInside(el: HTMLElement, where: 'start' | 'middle' | 'end' = 'start'): void {
            const range = document.createRange();
            if (!el.firstChild) el.appendChild(document.createTextNode(el.textContent || ''));
            const text = el.firstChild as Text;
            const len = text.length || 0;
            const off = where === 'start' ? 0 : where === 'end' ? len : Math.floor(len / 2);
            range.setStart(text, Math.min(len, off));
            range.collapse(true);
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
            // Important: focus the TH so it becomes the event target parent
            (el as HTMLElement).focus();
        }
        function press(el: Element, key: string, opts: any = {}): void {
            const ev = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...opts });
            el.dispatchEvent(ev);
            const up = new KeyboardEvent('keyup', { key, bubbles: true, cancelable: true, ...opts });
            el.dispatchEvent(up);
        }
        beforeEach(() => {
            editorElement = createElement('div', { id: 'editor' });
            document.body.appendChild(editorElement);
            const before: BlockModel = {
                id: 'before',
                blockType: BlockType.Paragraph,
                content: [{ id: 'bc', contentType: ContentType.Text, content: 'Before' }]
            };
            const table = buildTableBlock('table_block', 3, 2, true, true); // header=true, rowNumbers=true
            const after: BlockModel = {
                id: 'after',
                blockType: BlockType.Paragraph,
                content: [{ id: 'ac', contentType: ContentType.Text, content: 'After' }]
            };
            editor = createEditor({ blocks: [before, table, after] });
            editor.appendTo('#editor');
        });
        afterEach(() => {
            if (editor) { editor.destroy(); }
            if (editorElement && editorElement.parentElement) { editorElement.parentElement.removeChild(editorElement); }
        });
        it('ArrowUp from any header exits table backward to previous block', () => {
            const th = getHeaderCell(editorElement, 1);
            expect(th).not.toBeNull();
            // Put caret in the middle (exit should not require boundary in header)
            setCaretInside(th!, 'middle');
            press(th, 'ArrowUp');
            // No td focus; active block should be the "before" block
            const focusedCell = editorElement.querySelector('.e-cell-focus');
            expect(focusedCell).toBeNull();
            const beforeBlock = editorElement.querySelector('#before') as HTMLElement;
            const active = (editor as any).blockManager.currentFocusedBlock as HTMLElement;
            expect(active && beforeBlock && beforeBlock.contains(active)).toBe(true);
        });
        it('ArrowDown from header moves to body first row same column', () => {
            const th = getHeaderCell(editorElement, 2);
            expect(th).not.toBeNull();
            setCaretInside(th!, 'end');
            press(th, 'ArrowDown');
            const target = getDataCell(editorElement, 1, 2);
            const focused = editorElement.querySelector('.e-cell-focus') as HTMLElement;
            expect(focused ? focused.isEqualNode(target) : false).toBe(true);
        });
        it('ArrowLeft/Right moves between headers and keeps caret inside the target TH', () => {
            const th0 = getHeaderCell(editorElement, 0)!;
            setCaretInside(th0, 'end');
            // Right -> TH col 1
            press(th0, 'ArrowRight');
            const th1 = getHeaderCell(editorElement, 1)!;
            expect(th1.classList.contains('e-cell-focus')).toBe(true);
            // Left -> back to TH col 0
            press(th1, 'ArrowLeft');
            expect(th0.classList.contains('e-cell-focus')).toBe(true);
        });
        it('Tab on last header moves to first body cell (row 1, col 0) and caret goes inside cell content', () => {
            const thLast = getHeaderCell(editorElement, 2)!;
            setCaretInside(thLast, 'end');
            press(thLast, 'Tab');
            const target = getDataCell(editorElement, 1, 0);
            const focused = editorElement.querySelector('.e-cell-focus') as HTMLElement;
            expect(focused ? focused.isEqualNode(target) : false).toBe(true);
            const block = target.querySelector('.e-block') as HTMLElement;
            const content = block.querySelector('.e-block-content') as HTMLElement;
            const sel = window.getSelection();
            expect(sel && sel.anchorNode && content.contains(sel.anchorNode)).toBe(true);
        });
        it('Shift+Tab from first body cell (row 1, col 0) moves to last header and caret stays inside TH', () => {
            // Focus first body cell row 1 col 0
            const td = getDataCell(editorElement, 1, 0);
            const block = td.querySelector('.e-block') as HTMLElement;
            const content = block.querySelector('.e-block-content') as HTMLElement;
            (editor as any).blockManager.setFocusToBlock(block);
            const r = document.createRange(); r.selectNodeContents(content);
            const s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
            press(td, 'Tab', { shiftKey: true });
            const thLast = getHeaderCell(editorElement, 2)!;
            expect(thLast.classList.contains('e-cell-focus')).toBe(true);
        });
        it('ArrowUp from first body row -> header; ArrowUp again exits backward', () => {
            // Focus row 1, col 1
            const td = getDataCell(editorElement, 1, 1);
            const block = td.querySelector('.e-block') as HTMLElement;
            const content = block.querySelector('.e-block-content') as HTMLElement;
            (editor as any).blockManager.setFocusToBlock(block);
            const r = document.createRange(); r.selectNodeContents(content);
            const s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
            // Up -> header
            press(td, 'ArrowUp');
            const th = getHeaderCell(editorElement, 1);
            expect(th.classList.contains('e-cell-focus')).toBe(true);
            // Up again -> exit backward
            press(th, 'ArrowUp');
            const beforeBlock = editorElement.querySelector('#before') as HTMLElement;
            const active = (editor as any).blockManager.currentFocusedBlock as HTMLElement;
            expect(active && beforeBlock && beforeBlock.contains(active)).toBe(true);
        });
        it('ArrowDown from last body row exits forward to next block (caret at boundary)', () => {
            // Focus last body row (row 2), col 1, caret at end
            const td = getDataCell(editorElement, 2, 1);
            const block = td.querySelector('.e-block') as HTMLElement;
            const content = block.querySelector('.e-block-content') as HTMLElement;
            (editor as any).blockManager.setFocusToBlock(block);
            const s = window.getSelection();
            const r = document.createRange();
            const tn = (content.firstChild as Text) || content.appendChild(document.createTextNode('')) as Text;
            r.setStart(tn, tn.length || 0);
            r.collapse(true);
            s.removeAllRanges(); s.addRange(r);
            press(td, 'ArrowDown');
            const tdFocused = editorElement.querySelector('.e-cell-focus');
            expect(tdFocused).toBeNull();
            const afterBlock = editorElement.querySelector('#after') as HTMLElement;
            const active = (editor as any).blockManager.currentFocusedBlock as HTMLElement;
            expect(active && afterBlock && afterBlock.contains(active)).toBe(true);
        });
        it('ArrowUp from header exits even if caret is in the middle of the header text', () => {
            const th = getHeaderCell(editorElement, 0)!;
            setCaretInside(th, 'middle');
            press(th, 'ArrowUp');
            const tdFocused = editorElement.querySelector('.e-cell-focus');
            expect(tdFocused).toBeNull();
            const beforeBlock = editorElement.querySelector('#before') as HTMLElement;
            const active = (editor as any).blockManager.currentFocusedBlock as HTMLElement;
            expect(active && beforeBlock && beforeBlock.contains(active)).toBe(true);
        });
        it('Tab and Shift+Tab within headers keep caret inside TH (no td focus)', () => {
            const th1 = getHeaderCell(editorElement, 1)!;
            setCaretInside(th1, 'middle');
            // Tab -> TH col 2 (caret should be in TH)
            press(th1, 'Tab');
            const th2 = getHeaderCell(editorElement, 2)!;
            expect(th2.classList.contains('e-cell-focus')).toBe(true);
            // Shift+Tab -> back to TH col 1
            press(th2, 'Tab', { shiftKey: true });
            expect(th1.classList.contains('e-cell-focus')).toBe(true);
        });
    });
});
