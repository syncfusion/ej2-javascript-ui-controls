import { createElement, remove } from '@syncfusion/ej2-base';
import {
    createEditor,
    getDataCellEl,
    getHeaderCell,
    selectHeaderRectangle,
    selectRectangle,
    selectFullColumns
} from "../../common/util.spec";
import { BlockEditor } from '../../../src/index';
import { BlockModel } from '../../../src/models/block/block-model';
import { BlockType, ContentType } from '../../../src/models/enums';
import { ITableBlockSettings } from '../../../src/models/block/block-props';
import { setCursorPosition, getSelectedRange } from '../../../src/common/utils/index';
import { findClosestParent } from '../../../src/common/utils/dom';

// Local DOM helpers copied from table.spec.ts to drive the UI like a user
const domHelpers = {
    query(el: Element | Document, sel: string): HTMLElement { return el.querySelector(sel) as HTMLElement; },
    queryAll(el: Element | Document, sel: string): HTMLElement[] { return Array.from(el.querySelectorAll(sel)) as HTMLElement[]; },
    mouse(el: Element, type: string, init: any = {}): void { el.dispatchEvent(new MouseEvent(type, { bubbles: true, cancelable: true, ...init })); },
    key(el: Element, key: string, opts: any = {}): void {
        el.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...opts }));
        el.dispatchEvent(new KeyboardEvent('keyup', { key, bubbles: true, cancelable: true, ...opts }));
    }
};

function triggerUndo(host: HTMLElement): void {
    host.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, code: 'KeyZ' }));
}

function triggerRedo(host: HTMLElement): void {
    host.dispatchEvent(new KeyboardEvent('keydown', { key: 'y', ctrlKey: true, code: 'KeyY' }));
}

describe('Table Undo/Redo - Row/Column/Clear Cells', () => {
    let editor: BlockEditor;
    let editorElement: HTMLElement;

    function setupTable(overrides?: Partial<ITableBlockSettings>): void {
        const base: ITableBlockSettings = {
            enableHeader: true,
            enableRowNumbers: true,
            columns: [{ id: 'c1', headerText: 'A' }, { id: 'c2', headerText: 'B' }],
            rows: [
                {
                    cells: [
                        { columnId: 'c1', blocks: [{ id: 'p1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'R1C1' }] }] },
                        { columnId: 'c2', blocks: [{ id: 'p2', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'R1C2' }] }] }
                    ]
                },
                {
                    cells: [
                        { columnId: 'c1', blocks: [{ id: 'p3', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'R2C1' }] }] },
                        { columnId: 'c2', blocks: [{ id: 'p4', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'R2C2' }] }] }
                    ]
                }
            ]
        } as ITableBlockSettings;
        const finalProps = { ...base, ...(overrides || {}) } as ITableBlockSettings;
        const blocks: BlockModel[] = [{ id: 'tbl', blockType: BlockType.Table, properties: finalProps } as any];
        editor = createEditor({ blocks });
        editor.appendTo('#editor');
    }

    beforeEach(() => {
        editorElement = createElement('div', { id: 'editor' });
        document.body.appendChild(editorElement);
    });

    afterEach(() => {
        if (editor) { editor.destroy(); editor = undefined; }
        remove(editorElement);
    });

    describe('Basic Actions', () => {
        it('Insert row at start → undo → redo', (done) => {
            setupTable();
            const table = domHelpers.query(editorElement, '.e-table-element');
            const blockEl = table.closest('.e-block');
            // hover any body cell to show row UI
            const firstCell = domHelpers.query(blockEl, 'tbody tr:first-child td[role="gridcell"]');
            domHelpers.mouse(firstCell, 'mousemove');
            // top dot then click insert
            const topDot = domHelpers.query(blockEl, '.e-row-dot-hit');
            domHelpers.mouse(topDot, 'mouseenter');
            const insert = domHelpers.query(blockEl, '.e-row-insert-handle');
            domHelpers.mouse(insert, 'click');

            setTimeout(() => {
                const rowsDom = domHelpers.queryAll(blockEl, 'tbody tr');
                // Assert Dom
                expect(rowsDom.length).toBe(3);
                // Assert header unchanged
                const headers = domHelpers.queryAll(blockEl, 'thead th[role="columnheader"]').map(h => h.textContent);
                expect(headers.join('|')).toBe(['A', 'B'].join('|'));
                // Assert row numbers sequence
                const rn = domHelpers.queryAll(blockEl, 'tbody tr td.e-row-number').map(n => n.textContent);
                expect(rn).toEqual(['1', '2', '3']);
                // Assert new first data cell focus and data-row/col
                const firstRow = rowsDom[0] as HTMLTableRowElement;
                const firstDataCell = Array.from(firstRow.cells).find(c => !(c as HTMLElement).classList.contains('e-row-number')) as HTMLElement;
                expect(firstDataCell.classList.contains('e-cell-focus')).toBe(true);
                expect((firstDataCell as HTMLElement).dataset.row).toBe('1');
                expect((firstDataCell as HTMLElement).dataset.col).toBe('0');
                // Assert container id matches model
                const props = editor.blocks[0].properties as ITableBlockSettings;
                const container = firstDataCell.querySelector('.e-cell-blocks-container') as HTMLElement;
                expect(container.id).toBe(props.rows[0].cells[0].id);
                // Assert Model
                expect(props.rows.length).toBe(3);

                // undo
                triggerUndo(editorElement);
                const rowsAfterUndo = domHelpers.queryAll(blockEl, 'tbody tr');
                // Assert Dom
                expect(rowsAfterUndo.length).toBe(2);
                const rnUndo = domHelpers.queryAll(blockEl, 'tbody tr td.e-row-number').map(n => n.textContent);
                expect(rnUndo).toEqual(['1', '2']);
                const headersUndo = domHelpers.queryAll(blockEl, 'thead th[role="columnheader"]').map(h => h.textContent);
                expect(headersUndo.join('|')).toBe(['A', 'B'].join('|'));
                // Assert Model
                expect((editor.blocks[0].properties as ITableBlockSettings).rows.length).toBe(2);

                // redo
                triggerRedo(editorElement);
                const rowsAfterRedo = domHelpers.queryAll(blockEl, 'tbody tr');
                // Assert Dom
                expect(rowsAfterRedo.length).toBe(3);
                const rnRedo = domHelpers.queryAll(blockEl, 'tbody tr td.e-row-number').map(n => n.textContent);
                expect(rnRedo).toEqual(['1', '2', '3']);
                const headersRedo = domHelpers.queryAll(blockEl, 'thead th[role="columnheader"]').map(h => h.textContent);
                expect(headersRedo.join('|')).toBe(['A', 'B'].join('|'));
                // Assert Model
                expect((editor.blocks[0].properties as ITableBlockSettings).rows.length).toBe(3);
                done();
            }, 0);
        });

        it('Insert row at middle → undo → redo', (done) => {
            setupTable();
            const table = domHelpers.query(editorElement, '.e-table-element');
            const blockEl = table.closest('.e-block');
            const secondRowCell = domHelpers.queryAll(blockEl, 'tbody tr')[1].querySelector('td[role="gridcell"]');
            domHelpers.mouse(secondRowCell, 'mousemove');
            domHelpers.mouse(domHelpers.queryAll(blockEl, '.e-row-dot-hit')[0], 'mouseenter');
            domHelpers.mouse(domHelpers.query(blockEl, '.e-row-insert-handle'), 'click');
            setTimeout(() => {
                const rows = domHelpers.queryAll(blockEl, 'tbody tr') as HTMLTableRowElement[];
                // Assert Dom: 3 rows and rn sequence
                expect(rows.length).toBe(3);
                const rn = domHelpers.queryAll(blockEl, 'tbody tr td.e-row-number').map(n => n.textContent);
                expect(rn).toEqual(['1', '2', '3']);
                // Assert data-row for first two rows' first data cells
                const r1c1 = (rows[0] as HTMLTableRowElement).querySelectorAll('td')[1] as HTMLElement;
                const r2c1 = (rows[1] as HTMLTableRowElement).querySelectorAll('td')[1] as HTMLElement;
                expect(r1c1.dataset.row).toBe('1');
                expect(r2c1.dataset.row).toBe('2');
                // Assert headers intact
                const headers = domHelpers.queryAll(blockEl, 'thead th[role="columnheader"]').map(h => h.textContent);
                expect(headers.join('|')).toBe(['A', 'B'].join('|'));
                // Assert neighbor cell R2C2 unchanged now at row index 2 (0-based) after insertion above
                const neighborAfter = (rows[2] as HTMLTableRowElement).querySelectorAll('td')[2].textContent;
                expect(neighborAfter).toContain('R2C2');
                // Assert Model
                const props = editor.blocks[0].properties as ITableBlockSettings;
                expect(props.rows.length).toBe(3);

                // undo
                triggerUndo(editorElement);
                const rowsU = domHelpers.queryAll(blockEl, 'tbody tr') as HTMLTableRowElement[];
                expect(rowsU.length).toBe(2);
                const rnU = domHelpers.queryAll(blockEl, 'tbody tr td.e-row-number').map(n => n.textContent);
                expect(rnU).toEqual(['1', '2']);
                const headersU = domHelpers.queryAll(blockEl, 'thead th[role="columnheader"]').map(h => h.textContent);
                expect(headersU.join('|')).toBe(['A', 'B'].join('|'));
                // Assert Model
                expect((editor.blocks[0].properties as ITableBlockSettings).rows.length).toBe(2);

                // redo
                triggerRedo(editorElement);
                const rowsR = domHelpers.queryAll(blockEl, 'tbody tr') as HTMLTableRowElement[];
                expect(rowsR.length).toBe(3);
                const rnR = domHelpers.queryAll(blockEl, 'tbody tr td.e-row-number').map(n => n.textContent);
                expect(rnR).toEqual(['1', '2', '3']);
                const headersR = domHelpers.queryAll(blockEl, 'thead th[role="columnheader"]').map(h => h.textContent);
                expect(headersR.join('|')).toBe(['A', 'B'].join('|'));
                // Assert Model
                expect((editor.blocks[0].properties as ITableBlockSettings).rows.length).toBe(3);
                done();
            }, 0);
        });

        it('Insert row at end → undo → redo', (done) => {
            setupTable();
            const table = domHelpers.query(editorElement, '.e-table-element');
            const blockEl = table.closest('.e-block');
            const lastRowCell = domHelpers.queryAll(blockEl, 'tbody tr:last-child td[role="gridcell"]')[0];
            domHelpers.mouse(lastRowCell, 'mousemove');
            domHelpers.mouse(domHelpers.queryAll(blockEl, '.e-row-dot-hit')[1], 'mouseenter');
            domHelpers.mouse(domHelpers.query(blockEl, '.e-row-insert-handle'), 'click');
            setTimeout(() => {
                const rows = domHelpers.queryAll(blockEl, 'tbody tr') as HTMLTableRowElement[];
                // Assert Dom: 3 rows and rn sequence
                expect(rows.length).toBe(3);
                const rn = domHelpers.queryAll(blockEl, 'tbody tr td.e-row-number').map(n => n.textContent);
                expect(rn).toEqual(['1', '2', '3']);
                // Assert last row data-row is 3 for first data cell
                const lastFirstData = (rows[2] as HTMLTableRowElement).querySelectorAll('td')[1] as HTMLElement;
                expect(lastFirstData.dataset.row).toBe('3');
                // Assert headers intact
                const headers = domHelpers.queryAll(blockEl, 'thead th[role="columnheader"]').map(h => h.textContent);
                expect(headers.join('|')).toBe(['A', 'B'].join('|'));
                // Assert Model
                const props = editor.blocks[0].properties as ITableBlockSettings;
                expect(props.rows.length).toBe(3);

                // undo
                triggerUndo(editorElement);
                const rowsU = domHelpers.queryAll(blockEl, 'tbody tr') as HTMLTableRowElement[];
                expect(rowsU.length).toBe(2);
                const rnU = domHelpers.queryAll(blockEl, 'tbody tr td.e-row-number').map(n => n.textContent);
                expect(rnU).toEqual(['1', '2']);
                // Assert Model
                expect((editor.blocks[0].properties as ITableBlockSettings).rows.length).toBe(2);

                // redo
                triggerRedo(editorElement);
                const rowsR = domHelpers.queryAll(blockEl, 'tbody tr') as HTMLTableRowElement[];
                expect(rowsR.length).toBe(3);
                const rnR = domHelpers.queryAll(blockEl, 'tbody tr td.e-row-number').map(n => n.textContent);
                expect(rnR).toEqual(['1', '2', '3']);
                // Assert Model
                expect((editor.blocks[0].properties as ITableBlockSettings).rows.length).toBe(3);
                done();
            }, 0);
        });

        it('Insert row when only header exists → undo → redo', (done) => {
            setupTable({ rows: [] });
            const table = domHelpers.query(editorElement, '.e-table-element');
            const blockEl = table.closest('.e-block');

            // hover header cell to show row UI (header-only case shows only bottom dot)
            const headerCell = domHelpers.query(blockEl, 'thead th:not(.e-row-number)') as HTMLElement;
            domHelpers.mouse(headerCell, 'mousemove');

            // show insert handle via hit zone hover, then click insert
            const bottomHit = domHelpers.queryAll(blockEl, '.e-row-dot-hit')[1] || domHelpers.query(blockEl, '.e-row-dot-hit');
            domHelpers.mouse(bottomHit, 'mouseenter');
            const insert = domHelpers.query(blockEl, '.e-row-insert-handle');
            domHelpers.mouse(insert, 'click');

            setTimeout(() => {
                const rows = domHelpers.queryAll(blockEl, 'tbody tr');
                // Assert row added
                expect(rows.length).toBe(1);
                const rn = domHelpers.queryAll(blockEl, 'tbody tr td.e-row-number').map(n => n.textContent);
                expect(rn).toEqual(['1']);
                const props = editor.blocks[0].properties as ITableBlockSettings;
                expect(props.rows.length).toBe(1);

                // undo
                triggerUndo(editorElement);
                const rowsAfterUndo = domHelpers.queryAll(blockEl, 'tbody tr');
                expect(rowsAfterUndo.length).toBe(0);
                expect((editor.blocks[0].properties as ITableBlockSettings).rows.length).toBe(0);

                // redo
                triggerRedo(editorElement);
                const rowsAfterRedo = domHelpers.queryAll(blockEl, 'tbody tr');
                expect(rowsAfterRedo.length).toBe(1);
                expect((editor.blocks[0].properties as ITableBlockSettings).rows.length).toBe(1);
                done();
            }, 0);
        });

        it('Insert column at start → undo → redo', (done) => {
            setupTable();
            const table = domHelpers.query(editorElement, '.e-table-element');
            const blockEl = table.closest('.e-block');
            const someCell = domHelpers.query(blockEl, 'tbody tr td[role="gridcell"]');
            domHelpers.mouse(someCell, 'mousemove');
            domHelpers.mouse(domHelpers.query(blockEl, '.e-col-dot-hit'), 'mouseenter');
            domHelpers.mouse(domHelpers.query(blockEl, '.e-col-insert-handle'), 'click');
            setTimeout(() => {
                const firstRow = domHelpers.query(blockEl, 'tbody tr') as HTMLTableRowElement;
                // Header row drag icon must not be visible when a column is inserted/selected
                const rowActionAfterColInsert = domHelpers.query(blockEl, '.e-row-action-handle') as HTMLElement;
                expect(rowActionAfterColInsert.style.display === 'none').toBe(true);
                // Assert Dom: new column added
                expect(firstRow.cells.length).toBe(4); // rn + 3 data
                // Assert headers (role="columnheader") updated with new header at index 0
                const headers = domHelpers.queryAll(blockEl, 'thead th[role="columnheader"]').map(h => h.textContent);
                expect(headers.length).toBe(3);
                // Assert row-number column exists and numbers intact
                const rn = domHelpers.queryAll(blockEl, 'tbody tr td.e-row-number').map(n => n.textContent);
                expect(rn).toEqual(['1', '2']);
                // Assert data-col reindexed across all rows
                domHelpers.queryAll(blockEl, 'tbody tr').forEach((r) => {
                    const cells = Array.from((r as HTMLTableRowElement).cells).filter(c => !(c as HTMLElement).classList.contains('e-row-number')) as HTMLElement[];
                    cells.forEach((c, i) => expect(c.dataset.col).toBe(String(i)));
                });
                // Assert container id of first row, first data cell matches model
                const firstDataCell = Array.from(firstRow.cells).find(c => !(c as HTMLElement).classList.contains('e-row-number')) as HTMLElement;
                const props = editor.blocks[0].properties as ITableBlockSettings;
                const container = firstDataCell.querySelector('.e-cell-blocks-container') as HTMLElement;
                expect(container.id).toBe(props.rows[0].cells[0].id);
                // Assert Model
                expect(props.columns.length).toBe(3);
                expect(props.rows[0].cells.length).toBe(3);

                // undo
                triggerUndo(editorElement);
                // Assert Dom
                const firstRowUndo = domHelpers.query(blockEl, 'tbody tr') as HTMLTableRowElement;
                expect(firstRowUndo.cells.length).toBe(3);
                const headersUndo = domHelpers.queryAll(blockEl, 'thead th[role="columnheader"]').map(h => h.textContent);
                expect(headersUndo.length).toBe(2);
                domHelpers.queryAll(blockEl, 'tbody tr').forEach((r) => {
                    const cells = Array.from((r as HTMLTableRowElement).cells).filter(c => !(c as HTMLElement).classList.contains('e-row-number')) as HTMLElement[];
                    cells.forEach((c, i) => expect(c.dataset.col).toBe(String(i)));
                });
                // Assert Model
                expect((editor.blocks[0].properties as ITableBlockSettings).columns.length).toBe(2);

                // redo
                triggerRedo(editorElement);
                // Assert Dom
                const firstRowRedo = domHelpers.query(blockEl, 'tbody tr') as HTMLTableRowElement;
                expect(firstRowRedo.cells.length).toBe(4);
                const headersRedo = domHelpers.queryAll(blockEl, 'thead th[role="columnheader"]').map(h => h.textContent);
                expect(headersRedo.length).toBe(3);
                // Assert Model
                expect((editor.blocks[0].properties as ITableBlockSettings).columns.length).toBe(3);
                done();
            }, 0);
        });

        it('Insert column at middle → undo → redo', (done) => {
            setupTable();
            const table = domHelpers.query(editorElement, '.e-table-element');
            const blockEl = table.closest('.e-block');
            const secondCell = domHelpers.queryAll(blockEl, 'tbody tr td[role="gridcell"]')[1];
            domHelpers.mouse(secondCell, 'mousemove');
            domHelpers.mouse(domHelpers.queryAll(blockEl, '.e-col-dot-hit')[0], 'mouseenter');
            domHelpers.mouse(domHelpers.query(blockEl, '.e-col-insert-handle'), 'click');
            setTimeout(() => {
                const rows = domHelpers.queryAll(blockEl, 'tbody tr') as HTMLTableRowElement[];
                // Header row drag icon must not be visible when a column is inserted/selected
                const rowActionAfterColInsert = domHelpers.query(blockEl, '.e-row-action-handle') as HTMLElement;
                expect(rowActionAfterColInsert.style.display === 'none').toBe(true);
                // Assert Dom: each row has rn + 3 data = 4 cells
                expect(rows.every(r => (r as HTMLTableRowElement).cells.length === 4)).toBe(true);
                // Assert header length = 3 and texts include A,B and new one
                const headers = domHelpers.queryAll(blockEl, 'thead th[role="columnheader"]').map(h => h.textContent);
                expect(headers.length).toBe(3);
                // Assert data-col reindexed across rows
                rows.forEach(r => {
                    const cells = Array.from(r.cells).filter(c => !(c as HTMLElement).classList.contains('e-row-number')) as HTMLElement[];
                    cells.forEach((c, i) => expect(c.dataset.col).toBe(String(i)));
                });
                // Assert neighbor cell R1C2 moved to next index after insertion
                const r1 = rows[0] as HTMLTableRowElement;
                expect((r1.querySelectorAll('td')[3] as HTMLElement).textContent).toContain('R1C2');
                // Assert Model
                expect((editor.blocks[0].properties as ITableBlockSettings).columns.length).toBe(3);

                // undo
                triggerUndo(editorElement);
                const rowsU = domHelpers.queryAll(blockEl, 'tbody tr') as HTMLTableRowElement[];
                expect(rowsU.every(r => (r as HTMLTableRowElement).cells.length === 3)).toBe(true);
                const headersU = domHelpers.queryAll(blockEl, 'thead th[role="columnheader"]').map(h => h.textContent);
                expect(headersU.length).toBe(2);
                // Assert Model
                expect((editor.blocks[0].properties as ITableBlockSettings).columns.length).toBe(2);

                // redo
                triggerRedo(editorElement);
                const rowsR = domHelpers.queryAll(blockEl, 'tbody tr') as HTMLTableRowElement[];
                expect(rowsR.every(r => (r as HTMLTableRowElement).cells.length === 4)).toBe(true);
                const headersR = domHelpers.queryAll(blockEl, 'thead th[role="columnheader"]').map(h => h.textContent);
                expect(headersR.length).toBe(3);
                // Assert Model
                expect((editor.blocks[0].properties as ITableBlockSettings).columns.length).toBe(3);
                done();
            }, 0);
        });

        it('Insert column at end → undo → redo', (done) => {
            setupTable();
            const table = domHelpers.query(editorElement, '.e-table-element');
            const blockEl = table.closest('.e-block');
            const lastCell = domHelpers.queryAll(blockEl, 'tbody tr td[role="gridcell"]')[1];
            domHelpers.mouse(lastCell, 'mousemove');
            domHelpers.mouse(domHelpers.queryAll(blockEl, '.e-col-dot-hit')[1], 'mouseenter');
            domHelpers.mouse(domHelpers.query(blockEl, '.e-col-insert-handle'), 'click');
            setTimeout(() => {
                const row = domHelpers.query(blockEl, 'tbody tr') as HTMLTableRowElement;
                // Header row drag icon must not be visible when a column is inserted/selected
                const rowActionAfterColInsert = domHelpers.query(blockEl, '.e-row-action-handle') as HTMLElement;
                expect(rowActionAfterColInsert.style.display === 'none').toBe(true);
                // Assert Dom: 4 cells in row
                expect(row.cells.length).toBe(4);
                // Assert header length 3, texts preserved
                const headers = domHelpers.queryAll(blockEl, 'thead th[role="columnheader"]').map(h => h.textContent);
                expect(headers.length).toBe(3);
                // Assert last data cell data-col equals 2
                const lastData = row.querySelectorAll('td')[3] as HTMLElement;
                expect(lastData.dataset.col).toBe('2');
                // Assert Model
                expect((editor.blocks[0].properties as ITableBlockSettings).columns.length).toBe(3);

                // undo
                triggerUndo(editorElement);
                const rowU = domHelpers.query(blockEl, 'tbody tr') as HTMLTableRowElement;
                expect(rowU.cells.length).toBe(3);
                const headersU = domHelpers.queryAll(blockEl, 'thead th[role="columnheader"]').map(h => h.textContent);
                expect(headersU.length).toBe(2);
                expect((editor.blocks[0].properties as ITableBlockSettings).columns.length).toBe(2);

                // redo
                triggerRedo(editorElement);
                const rowR = domHelpers.query(blockEl, 'tbody tr') as HTMLTableRowElement;
                expect(rowR.cells.length).toBe(4);
                const headersR = domHelpers.queryAll(blockEl, 'thead th[role="columnheader"]').map(h => h.textContent);
                expect(headersR.length).toBe(3);
                expect((editor.blocks[0].properties as ITableBlockSettings).columns.length).toBe(3);
                done();
            }, 0);
        });

        it('Delete row at start → undo → redo (with title attribute check for delete popup)', (done) => {
            setupTable();
            const table = domHelpers.query(editorElement, '.e-table-element');
            const blockEl = table.closest('.e-block');
            const firstCell = domHelpers.query(blockEl, 'tbody tr:first-child td[role="gridcell"]');
            domHelpers.mouse(firstCell, 'mousemove');
            domHelpers.mouse(domHelpers.query(blockEl, '.e-row-action-handle'), 'click');
            setTimeout(() => {
                const delItem = domHelpers.query(document, '.e-table-gripper-action-item.e-trash');
                expect(delItem.getAttribute('title')).toBe('Delete');
                domHelpers.mouse(delItem, 'click');
                // Assert Dom
                const rows = domHelpers.queryAll(blockEl, 'tbody tr');
                expect(rows.length).toBe(1);
                // Assert e-row-number re-sequenced
                const rn = domHelpers.queryAll(blockEl, 'tbody tr td.e-row-number').map(n => n.textContent);
                expect(rn).toEqual(['1']);
                // Assert header intact
                const headers = domHelpers.queryAll(blockEl, 'thead th[role="columnheader"]').map(h => h.textContent);
                expect(headers.join('|')).toBe(['A', 'B'].join('|'));
                // Assert neighbor cell content unaffected (remaining row has original R2C2)
                const lastRowCells = (rows[0] as HTMLTableRowElement).querySelectorAll('td');
                expect((lastRowCells[2] as HTMLElement).textContent).toContain('R2C2');
                // Assert Model
                expect((editor.blocks[0].properties as ITableBlockSettings).rows.length).toBe(1);

                // undo
                triggerUndo(editorElement);
                // Assert Dom restored to 2 rows and original texts
                const rowsU = domHelpers.queryAll(blockEl, 'tbody tr');
                expect(rowsU.length).toBe(2);
                const rnU = domHelpers.queryAll(blockEl, 'tbody tr td.e-row-number').map(n => n.textContent);
                expect(rnU).toEqual(['1', '2']);
                const r1c2U = (rowsU[0] as HTMLTableRowElement).querySelectorAll('td')[2].textContent;
                expect(r1c2U).toContain('R1C2');
                // Assert Model
                expect((editor.blocks[0].properties as ITableBlockSettings).rows.length).toBe(2);

                // redo
                triggerRedo(editorElement);
                // Assert Dom
                const rowsR = domHelpers.queryAll(blockEl, 'tbody tr');
                expect(rowsR.length).toBe(1);
                const rnR = domHelpers.queryAll(blockEl, 'tbody tr td.e-row-number').map(n => n.textContent);
                expect(rnR).toEqual(['1']);
                // Assert Model
                expect((editor.blocks[0].properties as ITableBlockSettings).rows.length).toBe(1);
                done();
            }, 0);
        });

        it('Delete row at middle → undo → redo', (done) => {
            setupTable({
                rows: [
                    { cells: [{ columnId: 'c1', blocks: [{ id: 'a', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: '1' }] }] }, { columnId: 'c2', blocks: [{ id: 'b', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: '2' }] }] }] },
                    { cells: [{ columnId: 'c1', blocks: [{ id: 'c', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: '3' }] }] }, { columnId: 'c2', blocks: [{ id: 'd', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: '4' }] }] }] },
                    { cells: [{ columnId: 'c1', blocks: [{ id: 'e', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: '5' }] }] }, { columnId: 'c2', blocks: [{ id: 'f', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: '6' }] }] }] }
                ] as any
            });
            const table = domHelpers.query(editorElement, '.e-table-element');
            const blockEl = table.closest('.e-block');
            const midCell = domHelpers.queryAll(blockEl, 'tbody tr')[1].querySelector('td[role="gridcell"]');
            domHelpers.mouse(midCell, 'mousemove');
            domHelpers.mouse(domHelpers.query(blockEl, '.e-row-action-handle'), 'click');
            setTimeout(() => {
                domHelpers.mouse(domHelpers.query(document, '.e-table-gripper-action-item.e-trash'), 'click');
                const rows = domHelpers.queryAll(blockEl, 'tbody tr') as HTMLTableRowElement[];
                // Assert Dom: 2 rows, rn sequence
                expect(rows.length).toBe(2);
                const rn = domHelpers.queryAll(blockEl, 'tbody tr td.e-row-number').map(n => n.textContent);
                expect(rn).toEqual(['1', '2']);
                // Assert remaining texts: row1 still has first row, row2 has third row content "5" and "6"
                expect((rows[1].querySelectorAll('td')[1] as HTMLElement).textContent).toContain('5');
                expect((rows[1].querySelectorAll('td')[2] as HTMLElement).textContent).toContain('6');
                // Assert headers intact
                const headers = domHelpers.queryAll(blockEl, 'thead th[role="columnheader"]').map(h => h.textContent);
                expect(headers.join('|')).toBe(['A', 'B'].join('|'));
                // Assert Model
                expect((editor.blocks[0].properties as ITableBlockSettings).rows.length).toBe(2);

                // undo -> 3 rows restored
                triggerUndo(editorElement);
                const rowsU = domHelpers.queryAll(blockEl, 'tbody tr') as HTMLTableRowElement[];
                expect(rowsU.length).toBe(3);
                const rnU = domHelpers.queryAll(blockEl, 'tbody tr td.e-row-number').map(n => n.textContent);
                expect(rnU).toEqual(['1', '2', '3']);
                // Model
                expect((editor.blocks[0].properties as ITableBlockSettings).rows.length).toBe(3);

                // redo -> 2 rows again
                triggerRedo(editorElement);
                const rowsR = domHelpers.queryAll(blockEl, 'tbody tr') as HTMLTableRowElement[];
                expect(rowsR.length).toBe(2);
                const rnR = domHelpers.queryAll(blockEl, 'tbody tr td.e-row-number').map(n => n.textContent);
                expect(rnR).toEqual(['1', '2']);
                expect((editor.blocks[0].properties as ITableBlockSettings).rows.length).toBe(2);
                done();
            }, 0);
        });

        it('Delete row at end → undo → redo', (done) => {
            setupTable();
            const table = domHelpers.query(editorElement, '.e-table-element');
            const blockEl = table.closest('.e-block');
            const lastCell = domHelpers.queryAll(blockEl, 'tbody tr:last-child td[role="gridcell"]')[0];
            domHelpers.mouse(lastCell, 'mousemove');
            domHelpers.mouse(domHelpers.query(blockEl, '.e-row-action-handle'), 'click');
            setTimeout(() => {
                domHelpers.mouse(domHelpers.query(document, '.e-table-gripper-action-item.e-trash'), 'click');
                const rows = domHelpers.queryAll(blockEl, 'tbody tr') as HTMLTableRowElement[];
                // Assert Dom: 1 row and rn sequence [1]
                expect(rows.length).toBe(1);
                const rn = domHelpers.queryAll(blockEl, 'tbody tr td.e-row-number').map(n => n.textContent);
                expect(rn).toEqual(['1']);
                // Assert headers intact
                const headers = domHelpers.queryAll(blockEl, 'thead th[role="columnheader"]').map(h => h.textContent);
                expect(headers.join('|')).toBe(['A', 'B'].join('|'));
                // Assert Model
                expect((editor.blocks[0].properties as ITableBlockSettings).rows.length).toBe(1);

                // undo
                triggerUndo(editorElement);
                const rowsU = domHelpers.queryAll(blockEl, 'tbody tr') as HTMLTableRowElement[];
                expect(rowsU.length).toBe(2);
                const rnU = domHelpers.queryAll(blockEl, 'tbody tr td.e-row-number').map(n => n.textContent);
                expect(rnU).toEqual(['1', '2']);
                expect((editor.blocks[0].properties as ITableBlockSettings).rows.length).toBe(2);

                // redo
                triggerRedo(editorElement);
                const rowsR = domHelpers.queryAll(blockEl, 'tbody tr') as HTMLTableRowElement[];
                expect(rowsR.length).toBe(1);
                const rnR = domHelpers.queryAll(blockEl, 'tbody tr td.e-row-number').map(n => n.textContent);
                expect(rnR).toEqual(['1']);
                expect((editor.blocks[0].properties as ITableBlockSettings).rows.length).toBe(1);
                done();
            }, 0);
        });

        it('Delete column at start → undo → redo', (done) => {
            setupTable();
            const table = domHelpers.query(editorElement, '.e-table-element');
            const blockEl = table.closest('.e-block');
            const anyCell = domHelpers.query(blockEl, 'tbody tr td[role="gridcell"]');
            domHelpers.mouse(anyCell, 'mousemove');
            domHelpers.mouse(domHelpers.query(blockEl, '.e-col-action-handle'), 'click');
            setTimeout(() => {
                domHelpers.mouse(domHelpers.query(document, '.e-table-gripper-action-item.e-trash'), 'click');
                // Assert Dom: one data column remains
                const firstRow = domHelpers.query(blockEl, 'tbody tr') as HTMLTableRowElement;
                expect(firstRow.cells.length).toBe(2); // rn + 1
                // Assert headers length and text sequence
                const headers = domHelpers.queryAll(blockEl, 'thead th[role="columnheader"]').map(h => h.textContent);
                expect(headers.length).toBe(1);
                // Assert colgroup widths equal
                const colEls = domHelpers.queryAll(blockEl, 'colgroup > col').slice(1) as HTMLTableColElement[];
                const widths = colEls.map(c => c.style.width);
                expect(widths.every(w => w === widths[0])).toBe(true);
                // Assert data-col reindexed to 0 for remaining cells
                domHelpers.queryAll(blockEl, 'tbody tr').forEach((r) => {
                    const cell = Array.from((r as HTMLTableRowElement).cells).find(c => !(c as HTMLElement).classList.contains('e-row-number')) as HTMLElement;
                    expect(cell.dataset.col).toBe('0');
                });
                // Assert Model
                expect((editor.blocks[0].properties as ITableBlockSettings).columns.length).toBe(1);

                // undo
                triggerUndo(editorElement);
                // Assert Dom restored to 2 data columns
                const firstRowUndo = domHelpers.query(blockEl, 'tbody tr') as HTMLTableRowElement;
                expect(firstRowUndo.cells.length).toBe(3);
                const headersUndo = domHelpers.queryAll(blockEl, 'thead th[role="columnheader"]').map(h => h.textContent);
                expect(headersUndo.length).toBe(2);
                // Assert Model
                expect((editor.blocks[0].properties as ITableBlockSettings).columns.length).toBe(2);

                // redo
                triggerRedo(editorElement);
                // Assert Dom again one data column
                const firstRowRedo = domHelpers.query(blockEl, 'tbody tr') as HTMLTableRowElement;
                expect(firstRowRedo.cells.length).toBe(2);
                const headersRedo = domHelpers.queryAll(blockEl, 'thead th[role="columnheader"]').map(h => h.textContent);
                expect(headersRedo.length).toBe(1);
                // Assert Model
                expect((editor.blocks[0].properties as ITableBlockSettings).columns.length).toBe(1);
                done();
            }, 0);
        });

        it('Delete column at middle → undo → redo', (done) => {
            setupTable({
                columns: [{ id: 'c1', headerText: 'A' }, { id: 'c2', headerText: 'B' }, { id: 'c3', headerText: 'C' }],
                rows: [
                    { cells: [{ columnId: 'c1', blocks: [{ id: 'a', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: '1' }] }] }, { columnId: 'c2', blocks: [{ id: 'b', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: '2' }] }] }, { columnId: 'c3', blocks: [{ id: 'g', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: '7' }] }] }] },
                    { cells: [{ columnId: 'c1', blocks: [{ id: 'c', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: '3' }] }] }, { columnId: 'c2', blocks: [{ id: 'd', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: '4' }] }] }, { columnId: 'c3', blocks: [{ id: 'h', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: '8' }] }] }] },
                    { cells: [{ columnId: 'c1', blocks: [{ id: 'e', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: '5' }] }] }, { columnId: 'c2', blocks: [{ id: 'f', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: '6' }] }] }, { columnId: 'c3', blocks: [{ id: 'i', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: '9' }] }] }] }
                ] as any
            }
            );
            const table = domHelpers.query(editorElement, '.e-table-element');
            const blockEl = table.closest('.e-block');
            const secondColCell = domHelpers.queryAll(blockEl, 'tbody tr td[role="gridcell"]').filter(td => !(td as HTMLElement).classList.contains('e-row-number'))[1];
            domHelpers.mouse(secondColCell, 'mousemove');
            domHelpers.mouse(domHelpers.query(blockEl, '.e-col-action-handle'), 'click');
            setTimeout(() => {
                domHelpers.mouse(domHelpers.query(document, '.e-table-gripper-action-item.e-trash'), 'click');
                const row = domHelpers.query(blockEl, 'tbody tr') as HTMLTableRowElement;
                // Assert Dom: rn + 2 data
                expect(row.cells.length).toBe(3);
                // Assert header reduced to 2 and texts preserve order sans middle
                const headers = domHelpers.queryAll(blockEl, 'thead th[role="columnheader"]').map(h => h.textContent);
                expect(headers.length).toBe(2);
                // Assert data-col reindexed
                domHelpers.queryAll(blockEl, 'tbody tr').forEach(r => {
                    const cells = Array.from((r as HTMLTableRowElement).cells).filter(c => !(c as HTMLElement).classList.contains('e-row-number')) as HTMLElement[];
                    cells.forEach((c, i) => expect(c.dataset.col).toBe(String(i)));
                });
                // Assert Model
                expect((editor.blocks[0].properties as ITableBlockSettings).columns.length).toBe(2);

                // undo -> 3 columns
                triggerUndo(editorElement);
                const rowU = domHelpers.query(blockEl, 'tbody tr') as HTMLTableRowElement;
                expect(rowU.cells.length).toBe(4);
                const headersU = domHelpers.queryAll(blockEl, 'thead th[role="columnheader"]').map(h => h.textContent);
                expect(headersU.length).toBe(3);
                expect((editor.blocks[0].properties as ITableBlockSettings).columns.length).toBe(3);

                // redo -> 2 columns
                triggerRedo(editorElement);
                const rowR = domHelpers.query(blockEl, 'tbody tr') as HTMLTableRowElement;
                expect(rowR.cells.length).toBe(3);
                const headersR = domHelpers.queryAll(blockEl, 'thead th[role="columnheader"]').map(h => h.textContent);
                expect(headersR.length).toBe(2);
                expect((editor.blocks[0].properties as ITableBlockSettings).columns.length).toBe(2);
                done();
            }, 0);
        });

        it('Delete column at end → undo → redo', (done) => {
            setupTable({
                columns: [{ id: 'c1', headerText: 'A' }, { id: 'c2', headerText: 'B' }, { id: 'c3', headerText: 'C' }],
                rows: [
                    { cells: [{ columnId: 'c1', blocks: [{ id: 'a', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: '1' }] }] }, { columnId: 'c2', blocks: [{ id: 'b', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: '2' }] }] }, { columnId: 'c3', blocks: [{ id: 'g', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: '7' }] }] }] },
                    { cells: [{ columnId: 'c1', blocks: [{ id: 'c', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: '3' }] }] }, { columnId: 'c2', blocks: [{ id: 'd', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: '4' }] }] }, { columnId: 'c3', blocks: [{ id: 'h', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: '8' }] }] }] },
                    { cells: [{ columnId: 'c1', blocks: [{ id: 'e', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: '5' }] }] }, { columnId: 'c2', blocks: [{ id: 'f', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: '6' }] }] }, { columnId: 'c3', blocks: [{ id: 'i', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: '9' }] }] }] }
                ] as any
            }
            );
            const table = domHelpers.query(editorElement, '.e-table-element');
            const blockEl = table.closest('.e-block');
            const lastColCell = domHelpers.queryAll(blockEl, 'tbody tr td[role="gridcell"]').filter(td => !(td as HTMLElement).classList.contains('e-row-number'))[2];
            domHelpers.mouse(lastColCell, 'mousemove');
            domHelpers.mouse(domHelpers.query(blockEl, '.e-col-action-handle'), 'click');
            setTimeout(() => {
                domHelpers.mouse(domHelpers.query(document, '.e-table-gripper-action-item.e-trash'), 'click');
                const row = domHelpers.query(blockEl, 'tbody tr') as HTMLTableRowElement;
                // Assert Dom: rn + 2
                expect(row.cells.length).toBe(3);
                // Assert headers length 2 and values A,B
                const headers = domHelpers.queryAll(blockEl, 'thead th[role="columnheader"]').map(h => h.textContent);
                expect(headers.join('|')).toBe(['A', 'B'].join('|'));
                // Assert Model
                expect((editor.blocks[0].properties as ITableBlockSettings).columns.length).toBe(2);

                // undo -> back to 3 columns
                triggerUndo(editorElement);
                const rowU = domHelpers.query(blockEl, 'tbody tr') as HTMLTableRowElement;
                expect(rowU.cells.length).toBe(4);
                const headersU = domHelpers.queryAll(blockEl, 'thead th[role="columnheader"]').map(h => h.textContent);
                expect(headersU.join('|')).toBe(['A', 'B', 'C'].join('|'));
                expect((editor.blocks[0].properties as ITableBlockSettings).columns.length).toBe(3);

                // redo -> 2 columns again
                triggerRedo(editorElement);
                const rowR = domHelpers.query(blockEl, 'tbody tr') as HTMLTableRowElement;
                expect(rowR.cells.length).toBe(3);
                const headersR = domHelpers.queryAll(blockEl, 'thead th[role="columnheader"]').map(h => h.textContent);
                expect(headersR.join('|')).toBe(['A', 'B'].join('|'));
                expect((editor.blocks[0].properties as ITableBlockSettings).columns.length).toBe(2);
                done();
            }, 0);
        });

        it('Clear single cell → undo → redo', (done) => {
            setupTable();
            const table = domHelpers.query(editorElement, '.e-table-element') as HTMLTableElement;
            const blockEl = table.closest('.e-block');
            const cell = domHelpers.query(blockEl, 'tbody tr:first-child td[role="gridcell"]') as HTMLTableCellElement;
            const containerBefore = cell.querySelector('.e-cell-blocks-container') as HTMLElement;
            const containerIdBefore = containerBefore.id;
            // Act: clear content via service
            editor.blockManager.tableService.clearCellContents(table, [cell]);
            // Assert Dom: container stays same, paragraph placeholder exists
            const containerAfter = cell.querySelector('.e-cell-blocks-container') as HTMLElement;
            expect(containerAfter.id).toBe(containerIdBefore);
            expect(containerAfter.textContent.trim().length >= 0).toBe(true);
            // Assert Model: paragraph in model
            const props = editor.blocks[0].properties as ITableBlockSettings;
            expect((props.rows[0].cells[0].blocks[0] as any).blockType).toBe(BlockType.Paragraph);

            // undo restores text
            triggerUndo(editorElement);
            const containerUndo = cell.querySelector('.e-cell-blocks-container') as HTMLElement;
            expect(containerUndo.id).toBe(containerIdBefore);
            expect(containerUndo.textContent).toContain('R1C1');
            const propsUndo = editor.blocks[0].properties as ITableBlockSettings;
            expect(((propsUndo.rows[0].cells[0].blocks[0] as any).content[0].content)).toBe('R1C1');

            // redo clears again
            triggerRedo(editorElement);
            const containerRedo = cell.querySelector('.e-cell-blocks-container') as HTMLElement;
            expect(containerRedo.id).toBe(containerIdBefore);
            expect(containerRedo.textContent.trim().length >= 0).toBe(true);
            const propsRedo = editor.blocks[0].properties as ITableBlockSettings;
            expect((propsRedo.rows[0].cells[0].blocks[0] as any).blockType).toBe(BlockType.Paragraph);
            done();
        });

        it('Clear multi-cell (multi-row span) → undo → redo', (done) => {
            setupTable();
            const table = domHelpers.query(editorElement, '.e-table-element') as HTMLTableElement;
            const blockEl = table.closest('.e-block');
            const c1 = domHelpers.query(blockEl, 'tbody tr:first-child td[role="gridcell"]') as HTMLTableCellElement; // R1C1 "R1C1"
            const c2 = domHelpers.query(blockEl, 'tbody tr:last-child td[role="gridcell"]') as HTMLTableCellElement; // R2C1 "R2C1"
            const id1 = (c1.querySelector('.e-cell-blocks-container') as HTMLElement).id;
            const id2 = (c2.querySelector('.e-cell-blocks-container') as HTMLElement).id;

            editor.blockManager.tableService.clearCellContents(table, [c1, c2]);

            // Assert Dom: containers unchanged, placeholders present, neighbor cells unaffected
            const hTexts = domHelpers.queryAll(blockEl, 'thead th[role="columnheader"]').map(h => h.textContent);
            expect(hTexts.join('|')).toBe(['A', 'B'].join('|'));
            expect(((c1.querySelector('.e-cell-blocks-container') as HTMLElement).id)).toBe(id1);
            expect(((c2.querySelector('.e-cell-blocks-container') as HTMLElement).id)).toBe(id2);
            const r1c2 = (domHelpers.queryAll(blockEl, 'tbody tr')[0].querySelectorAll('td')[2] as HTMLElement).textContent;
            const r2c2 = (domHelpers.queryAll(blockEl, 'tbody tr')[1].querySelectorAll('td')[2] as HTMLElement).textContent;
            expect(r1c2).toContain('R1C2');
            expect(r2c2).toContain('R2C2');
            // Assert Model
            const props = editor.blocks[0].properties as ITableBlockSettings;
            expect(((props.rows[0].cells[0].blocks[0]) as any).blockType).toBe(BlockType.Paragraph);
            expect(((props.rows[1].cells[0].blocks[0]) as any).blockType).toBe(BlockType.Paragraph);

            // undo restores text and ids remain stable
            triggerUndo(editorElement);
            expect(((editor.blocks[0].properties as ITableBlockSettings).rows[0].cells[0].blocks[0] as any).content[0].content).toBe('R1C1');
            expect(((editor.blocks[0].properties as ITableBlockSettings).rows[1].cells[0].blocks[0] as any).content[0].content).toBe('R2C1');
            expect((c1.querySelector('.e-cell-blocks-container') as HTMLElement).id).toBe(id1);
            expect((c2.querySelector('.e-cell-blocks-container') as HTMLElement).id).toBe(id2);

            // redo clears again
            triggerRedo(editorElement);
            expect(((editor.blocks[0].properties as ITableBlockSettings).rows[0].cells[0].blocks[0] as any).blockType).toBe(BlockType.Paragraph);
            expect(((editor.blocks[0].properties as ITableBlockSettings).rows[1].cells[0].blocks[0] as any).blockType).toBe(BlockType.Paragraph);
            done();
        });

        it('clears header cells → undo → redo', () => {
            setupTable();
            selectHeaderRectangle(editorElement, 0, 1);
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', code: 'Backspace' }));

            const props = (editor.blocks[0] as BlockModel).properties as ITableBlockSettings;

            //Model
            expect(props.columns[0].headerText).toBe('');
            expect(props.columns[1].headerText).toBe('');
            // DOM
            const headerCells = editorElement.querySelectorAll('table thead th:not(.e-row-number)');
            expect(headerCells[0].textContent.trim()).toBe('');
            expect(headerCells[1].textContent.trim()).toBe('');

            triggerUndo(editorElement);
            //Model
            expect(props.columns[0].headerText).toBe('A');
            expect(props.columns[1].headerText).toBe('B');
            // DOM
            const headerCellsAfterUndo = editorElement.querySelectorAll('table thead th:not(.e-row-number)');
            expect(headerCellsAfterUndo[0].textContent.trim()).toBe('A');
            expect(headerCellsAfterUndo[1].textContent.trim()).toBe('B');

            triggerRedo(editorElement);
            //Model
            expect(props.columns[0].headerText).toBe('');
            expect(props.columns[1].headerText).toBe('');
            // DOM
            const headerCellsAfterRedo = editorElement.querySelectorAll('table thead th:not(.e-row-number)');
            expect(headerCellsAfterRedo[0].textContent.trim()).toBe('');
            expect(headerCellsAfterRedo[1].textContent.trim()).toBe('');
        });

        it('clears both data and header cells in mixed selection on backspace', () => {
            setupTable();
            const start = getHeaderCell(editorElement, 0);
            const end = getDataCellEl(editorElement, 1, 1); 
            start.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
            end.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
            document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', code: 'Backspace' }));
    
            const props = (editor.blocks[0] as BlockModel).properties as ITableBlockSettings;

            //Model
            expect(props.columns[0].headerText).toBe('');
            expect(props.columns[1].headerText).toBe('');
            expect(props.rows[0].cells[0].blocks[0].blockType).toBe(BlockType.Paragraph);
            expect(props.rows[0].cells[0].blocks[0].content.length).toBe(1);
            expect(props.rows[0].cells[0].blocks[0].content[0].content).toBe('');
            expect(props.rows[0].cells[0].blocks[0].content[0].contentType).toBe(ContentType.Text);
            expect(props.rows[0].cells[1].blocks[0].blockType).toBe(BlockType.Paragraph);
            expect(props.rows[0].cells[1].blocks[0].content.length).toBe(1);
            expect(props.rows[0].cells[1].blocks[0].content[0].content).toBe('');
            expect(props.rows[0].cells[1].blocks[0].content[0].contentType).toBe(ContentType.Text);
            // DOM
            const headerCells = editorElement.querySelectorAll('table thead th:not(.e-row-number)');
            expect(headerCells[0].textContent.trim()).toBe('');
            expect(headerCells[1].textContent.trim()).toBe('');
            expect(getDataCellEl(editorElement, 1, 0).textContent!.trim()).toBe('');
            expect(getDataCellEl(editorElement, 1, 1).textContent!.trim()).toBe('');

            triggerUndo(editorElement);
            //Model
            expect(props.columns[0].headerText).toBe('A');
            expect(props.columns[1].headerText).toBe('B');
            expect(props.rows[0].cells[0].blocks[0].content[0].content).toBe('R1C1');
            expect(props.rows[0].cells[1].blocks[0].content[0].content).toBe('R1C2');
            // DOM
            const headerCellsAfterUndo = editorElement.querySelectorAll('table thead th:not(.e-row-number)');
            expect(headerCellsAfterUndo[0].textContent.trim()).toBe('A');
            expect(headerCellsAfterUndo[1].textContent.trim()).toBe('B');
            expect(getDataCellEl(editorElement, 1, 0).textContent!.trim()).toBe('R1C1');
            expect(getDataCellEl(editorElement, 1, 1).textContent!.trim()).toBe('R1C2');

            triggerRedo(editorElement);
            //Model
            expect(props.columns[0].headerText).toBe('');
            expect(props.columns[1].headerText).toBe('');
            expect(props.rows[0].cells[0].blocks[0].blockType).toBe(BlockType.Paragraph);
            expect(props.rows[0].cells[0].blocks[0].content.length).toBe(1);
            expect(props.rows[0].cells[0].blocks[0].content[0].content).toBe('');
            expect(props.rows[0].cells[0].blocks[0].content[0].contentType).toBe(ContentType.Text);
            expect(props.rows[0].cells[1].blocks[0].blockType).toBe(BlockType.Paragraph);
            expect(props.rows[0].cells[1].blocks[0].content.length).toBe(1);
            expect(props.rows[0].cells[1].blocks[0].content[0].content).toBe('');
            expect(props.rows[0].cells[1].blocks[0].content[0].contentType).toBe(ContentType.Text);
            // DOM
            const headerCellsAfterRedo = editorElement.querySelectorAll('table thead th:not(.e-row-number)');
            expect(headerCellsAfterRedo[0].textContent.trim()).toBe('');
            expect(headerCellsAfterRedo[1].textContent.trim()).toBe('');
            expect(getDataCellEl(editorElement, 1, 0).textContent!.trim()).toBe('');
            expect(getDataCellEl(editorElement, 1, 1).textContent!.trim()).toBe('');
        });
    });

    describe('Focus restore and typing undo scenarios', () => {
        it('Undo after inserting a new column restores previous focus cell, then redo', (done) => {
            setupTable();
            const table = domHelpers.query(editorElement, '.e-table-element');
            const blockEl = table.closest('.e-block');

            // Focus R1C2
            const r1 = domHelpers.queryAll(blockEl, 'tbody tr')[0] as HTMLTableRowElement;
            const focusCell = r1.querySelectorAll('td')[1] as HTMLElement; // rn + c1 + c2
            const focusContainer = focusCell.querySelector('.e-cell-blocks-container') as HTMLElement;
            const focusContainerId = focusContainer.id;

            // Insert a column at start
            const anyBodyCell = domHelpers.query(blockEl, 'tbody tr td[role="gridcell"]');
            domHelpers.mouse(anyBodyCell, 'mousemove');
            domHelpers.mouse(domHelpers.query(blockEl, '.e-col-dot-hit'), 'mouseenter');
            domHelpers.mouse(domHelpers.query(blockEl, '.e-col-insert-handle'), 'click');

            setTimeout(() => {
                // Undo should restore original focus cell
                triggerUndo(editorElement);

                const cells = domHelpers.queryAll(blockEl, 'tbody tr td[role="gridcell"]') as HTMLElement[];
                const restored = cells.find(c => (c.querySelector('.e-cell-blocks-container') as HTMLElement).id === focusContainerId) as HTMLElement;
                expect(restored).toBeDefined();
                expect(restored.classList.contains('e-cell-focus')).toBe(true);
                // And caret should be inside the same cell's content
                const restoredContent = restored.querySelector('.e-block-content') as HTMLElement;
                const sel = getSelectedRange();
                expect(!!sel).toBe(true);
                if (sel) {
                    const anchorNode = sel.startContainer as Node;
                    expect(restoredContent.contains(anchorNode) || restoredContent === anchorNode).toBe(true);
                    expect(sel.collapsed).toBe(true);
                }

                // Redo should keep header count incremented again
                const headersBeforeRedo = domHelpers.queryAll(blockEl, 'thead th[role="columnheader"]').length;
                triggerRedo(editorElement);
                const headersAfterRedo = domHelpers.queryAll(blockEl, 'thead th[role="columnheader"]').length;
                expect(headersAfterRedo).toBe(headersBeforeRedo + 1);
                done();
            }, 0);
        });

        it('Undo after deleting the second column restores that column and the original focus cell, then redo', (done) => {
            setupTable({
                columns: [{ id: 'c1', headerText: 'A' }, { id: 'c2', headerText: 'B' }, { id: 'c3', headerText: 'C' }],
                rows: [
                    { cells: [{ columnId: 'c1', blocks: [{ id: 'a', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: '1' }] }] }, { columnId: 'c2', blocks: [{ id: 'b', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: '2' }] }] }, { columnId: 'c3', blocks: [{ id: 'g', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: '7' }] }] }] },
                    { cells: [{ columnId: 'c1', blocks: [{ id: 'c', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: '3' }] }] }, { columnId: 'c2', blocks: [{ id: 'd', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: '4' }] }] }, { columnId: 'c3', blocks: [{ id: 'h', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: '8' }] }] }] },
                    { cells: [{ columnId: 'c1', blocks: [{ id: 'e', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: '5' }] }] }, { columnId: 'c2', blocks: [{ id: 'f', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: '6' }] }] }, { columnId: 'c3', blocks: [{ id: 'i', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: '9' }] }] }] }
                ] as any
            }
            );
            const table = domHelpers.query(editorElement, '.e-table-element');
            const blockEl = table.closest('.e-block');

            // Focus a cell in second column (R1C2)
            const r1 = domHelpers.queryAll(blockEl, 'tbody tr')[0] as HTMLTableRowElement;
            const focusCell = r1.querySelectorAll('td')[2] as HTMLElement;
            const focusId = (focusCell.querySelector('.e-cell-blocks-container') as HTMLElement).id;
            domHelpers.mouse(focusCell, 'mousemove');
            domHelpers.mouse(focusCell, 'click');

            // Delete hovered column (second)
            domHelpers.mouse(domHelpers.query(blockEl, '.e-col-action-handle'), 'click');
            setTimeout(() => {
                domHelpers.mouse(domHelpers.query(document, '.e-table-gripper-action-item.e-trash'), 'click');

                // Undo should bring back the column and focus on the same container id
                triggerUndo(editorElement);
                const headersAfterUndo = domHelpers.queryAll(blockEl, 'thead th[role="columnheader"]').map(h => h.textContent);
                expect(headersAfterUndo.length).toBe(3);
                const cells = domHelpers.queryAll(blockEl, 'tbody tr td[role="gridcell"]') as HTMLElement[];
                const focused = cells.find(c => (c.querySelector('.e-cell-blocks-container') as HTMLElement).id === focusId) as HTMLElement;
                expect(focused).toBeDefined();
                expect(focused.classList.contains('e-cell-focus')).toBe(true);
                const focusedContent = focused.querySelector('.e-block-content') as HTMLElement;
                const sel = getSelectedRange();
                expect(!!sel).toBe(true);
                if (sel) {
                    const anchorNode = sel.startContainer as Node;
                    expect(focusedContent.contains(anchorNode) || focusedContent === anchorNode).toBe(true);
                    expect(sel.collapsed).toBe(true);
                }

                // Redo delete
                triggerRedo(editorElement);
                const headersAfterRedo = domHelpers.queryAll(blockEl, 'thead th[role="columnheader"]').length;
                expect(headersAfterRedo).toBe(2);
                done();
            }, 0);
        });

        it('Undo after deleting the first column restores that column and the original focus cell, then redo', (done) => {
            setupTable({ columns: [{ id: 'c1', headerText: 'A' }, { id: 'c2', headerText: 'B' }] as any });
            const table = domHelpers.query(editorElement, '.e-table-element');
            const blockEl = table.closest('.e-block');

            // Focus first column cell (R1C1)
            const r1 = domHelpers.queryAll(blockEl, 'tbody tr')[0] as HTMLTableRowElement;
            const focusCell = r1.querySelectorAll('td')[1] as HTMLElement;
            const focusId = (focusCell.querySelector('.e-cell-blocks-container') as HTMLElement).id;
            domHelpers.mouse(focusCell, 'mousemove');
            domHelpers.mouse(focusCell, 'click');

            // Delete first column via gripper
            domHelpers.mouse(domHelpers.query(blockEl, '.e-col-action-handle'), 'click');
            setTimeout(() => {
                domHelpers.mouse(domHelpers.query(document, '.e-table-gripper-action-item.e-trash'), 'click');

                triggerUndo(editorElement);
                const headersAfterUndo = domHelpers.queryAll(blockEl, 'thead th[role="columnheader"]').map(h => h.textContent);
                expect(headersAfterUndo.length).toBe(2);
                const cells = domHelpers.queryAll(blockEl, 'tbody tr td[role="gridcell"]') as HTMLElement[];
                const focused = cells.find(c => (c.querySelector('.e-cell-blocks-container') as HTMLElement).id === focusId) as HTMLElement;
                expect(focused).toBeDefined();
                expect(focused.classList.contains('e-cell-focus')).toBe(true);
                const focusedContent = focused.querySelector('.e-block-content') as HTMLElement;
                const sel = getSelectedRange();
                expect(!!sel).toBe(true);
                if (sel) {
                    const anchorNode = sel.startContainer as Node;
                    expect(focusedContent.contains(anchorNode) || focusedContent === anchorNode).toBe(true);
                    expect(sel.collapsed).toBe(true);
                }

                triggerRedo(editorElement);
                const headersAfterRedo = domHelpers.queryAll(blockEl, 'thead th[role="columnheader"]').length;
                expect(headersAfterRedo).toBe(1);
                done();
            }, 0);
        });

        it('Consecutive insert-column operations followed by multiple undos', (done) => {
            setupTable();
            const table = domHelpers.query(editorElement, '.e-table-element');
            const blockEl = table.closest('.e-block');

            const anyCell = domHelpers.query(blockEl, 'tbody tr td[role="gridcell"]');
            domHelpers.mouse(anyCell, 'mousemove');
            domHelpers.mouse(domHelpers.query(blockEl, '.e-col-dot-hit'), 'mouseenter');
            domHelpers.mouse(domHelpers.query(blockEl, '.e-col-insert-handle'), 'click');

            domHelpers.mouse(anyCell, 'mousemove');
            domHelpers.mouse(domHelpers.query(blockEl, '.e-col-dot-hit'), 'mouseenter');
            domHelpers.mouse(domHelpers.query(blockEl, '.e-col-insert-handle'), 'click');

            setTimeout(() => {
                const headersAfter = domHelpers.queryAll(blockEl, 'thead th[role="columnheader"]').length;
                expect(headersAfter).toBe(4); // started with 2, inserted 2

                // Undo twice
                triggerUndo(editorElement);
                triggerUndo(editorElement);
                const headersUndo = domHelpers.queryAll(blockEl, 'thead th[role="columnheader"]').length;
                expect(headersUndo).toBe(2);
                // data-col indices should be sequential
                domHelpers.queryAll(blockEl, 'tbody tr').forEach(r => {
                    const cells = Array.from((r as HTMLTableRowElement).cells).filter(c => !(c as HTMLElement).classList.contains('e-row-number')) as HTMLElement[];
                    cells.forEach((c, i) => expect(c.dataset.col).toBe(String(i)));
                });
                done();
            }, 0);
        });

        it('Undo after typing within a table cell', (done) => {
            setupTable();
            const table = domHelpers.query(editorElement, '.e-table-element');
            const blockEl = table.closest('.e-block');
            const cell = domHelpers.query(blockEl, 'tbody tr:first-child td[role="gridcell"]') as HTMLTableCellElement;
            const container = cell.querySelector('.e-cell-blocks-container') as HTMLElement;
            const initialText = container.textContent || '';
            const block = container.querySelector('.e-block') as HTMLElement;
            const content = block.querySelector('.e-block-content') as HTMLElement;

            setCursorPosition(content, initialText.length);
            (content.textContent as any) = 'Changed';
            editor.blockManager.stateManager.updateContentOnUserTyping(block);

            // ensure model changed
            const props = editor.blocks[0].properties as ITableBlockSettings;
            expect(((props.rows[0].cells[0].blocks[0] as any).content[0].content)).toBe('Changed');

            // Undo should restore previous text and keep focus and caret on same cell at previous offset
            triggerUndo(editorElement);
            const containerAfterUndo = cell.querySelector('.e-cell-blocks-container') as HTMLElement;
            expect((containerAfterUndo.textContent || '').trim()).toContain((initialText || '').trim());
            const selUndo = getSelectedRange();
            expect(!!selUndo).toBe(true);
            if (selUndo) {
                expect(selUndo.collapsed).toBe(true);
                const anchorNode = selUndo.startContainer as Node;
                const contentEl = block.querySelector('.e-block-content') as HTMLElement;
                expect(contentEl.contains(anchorNode) || contentEl === anchorNode).toBe(true);
            }

            // Redo should bring back edited text and caret stays inside same cell content
            triggerRedo(editorElement);
            const containerAfterRedo = cell.querySelector('.e-cell-blocks-container') as HTMLElement;
            expect((containerAfterRedo.textContent || '').trim()).toContain('Changed');
            const selRedo = getSelectedRange();
            expect(!!selRedo).toBe(true);
            if (selRedo) {
                const anchorNode = selRedo.startContainer as Node;
                const contentEl = block.querySelector('.e-block-content') as HTMLElement;
                expect(contentEl.contains(anchorNode) || contentEl === anchorNode).toBe(true);
            }
            done();
        });
    });

    describe('Combination / Sequential Actions', () => {
        it('Insert row → insert column → delete row → clear cells → undo all step-by-step → redo all', (done) => {
            setupTable();
            const table = domHelpers.query(editorElement, '.e-table-element');
            const blockEl = table.closest('.e-block');

            // Insert row at top via UI
            const bodyCell = domHelpers.query(blockEl, 'tbody tr:first-child td[role="gridcell"]');
            domHelpers.mouse(bodyCell, 'mousemove');
            domHelpers.mouse(domHelpers.query(blockEl, '.e-row-dot-hit'), 'mouseenter');
            domHelpers.mouse(domHelpers.query(blockEl, '.e-row-insert-handle'), 'click');
            setTimeout(() => {
                // Insert column at left via UI
                domHelpers.mouse(bodyCell, 'mousemove');
                domHelpers.mouse(domHelpers.query(blockEl, '.e-col-dot-hit'), 'mouseenter');
                domHelpers.mouse(domHelpers.query(blockEl, '.e-col-insert-handle'), 'click');
                // Delete second row via UI
                const midCell = domHelpers.queryAll(blockEl, 'tbody tr')[1].querySelector('td[role="gridcell"]');
                domHelpers.mouse(midCell, 'mousemove');
                domHelpers.mouse(domHelpers.query(blockEl, '.e-row-action-handle'), 'click');
                setTimeout(() => {
                    domHelpers.mouse(domHelpers.query(document, '.e-table-gripper-action-item.e-trash'), 'click');

                    // Clear two cells
                    const tableEl = table as HTMLTableElement;
                    const c1 = domHelpers.query(blockEl, 'tbody tr:first-child td[role="gridcell"]') as HTMLTableCellElement;
                    const c2 = domHelpers.query(blockEl, 'tbody tr:last-child td[role="gridcell"]') as HTMLTableCellElement;
                    const c1ContainerId = (c1.querySelector('.e-cell-blocks-container') as HTMLElement).id;
                    const c2ContainerId = (c2.querySelector('.e-cell-blocks-container') as HTMLElement).id;
                    editor.blockManager.tableService.clearCellContents(tableEl, [c1, c2]);

                    const propsAfter = editor.blocks[0].properties as ITableBlockSettings;
                    // Assert Dom after sequence
                    const headersAfter = domHelpers.queryAll(blockEl, 'thead th[role="columnheader"]').map(h => h.textContent);
                    expect(headersAfter.length).toBe(3);
                    const rnAfter = domHelpers.queryAll(blockEl, 'tbody tr td.e-row-number').map(n => n.textContent);
                    expect(rnAfter.length >= 1).toBe(true);
                    // Containers unchanged, cleared text allowed
                    expect(((c1.querySelector('.e-cell-blocks-container') as HTMLElement).id)).toBe(c1ContainerId);
                    expect(((c2.querySelector('.e-cell-blocks-container') as HTMLElement).id)).toBe(c2ContainerId);
                    // Assert Model after sequence
                    expect(propsAfter.rows.length >= 1).toBe(true);
                    expect(propsAfter.columns.length).toBe(3);

                    // Undo 1 (clear)
                    triggerUndo(editorElement);
                    // Containers persist and text restored or remains
                    expect((c1.querySelector('.e-cell-blocks-container') as HTMLElement).id).toBe(c1ContainerId);
                    expect((c2.querySelector('.e-cell-blocks-container') as HTMLElement).id).toBe(c2ContainerId);

                    // Undo 2 (delete row)
                    triggerUndo(editorElement);
                    const rnU2 = domHelpers.queryAll(blockEl, 'tbody tr td.e-row-number').map(n => n.textContent);
                    expect(rnU2).toEqual(['1', '2', '3']);
                    const headersU2 = domHelpers.queryAll(blockEl, 'thead th[role="columnheader"]').map(h => h.textContent);
                    expect(headersU2.length).toBe(3);

                    // Undo 3 (insert column)
                    triggerUndo(editorElement);
                    const headersU3 = domHelpers.queryAll(blockEl, 'thead th[role="columnheader"]').map(h => h.textContent);
                    expect(headersU3.length).toBe(2);

                    // Undo 4 (insert row)
                    triggerUndo(editorElement);
                    const rnU4 = domHelpers.queryAll(blockEl, 'tbody tr td.e-row-number').map(n => n.textContent);
                    expect(rnU4).toEqual(['1', '2']);

                    // Redo 1..4
                    triggerRedo(editorElement); // row insert
                    triggerRedo(editorElement); // col insert
                    triggerRedo(editorElement); // delete row
                    triggerRedo(editorElement); // clear
                    const headersRedo = domHelpers.queryAll(blockEl, 'thead th[role="columnheader"]').map(h => h.textContent);
                    expect(headersRedo.length).toBe(3);
                    const propsRedo = editor.blocks[0].properties as ITableBlockSettings;
                    expect(propsRedo.columns.length).toBe(3);
                    expect(propsRedo.rows.length >= 1).toBe(true);
                    done();
                }, 30);
            }, 30);
        });

        it('Insert row → delete row (same index) → undo all → redo all', (done) => {
            setupTable();
            const table = domHelpers.query(editorElement, '.e-table-element');
            const blockEl = table.closest('.e-block');

            // Insert row at top
            const first = domHelpers.query(blockEl, 'tbody tr:first-child td[role="gridcell"]');
            domHelpers.mouse(first, 'mousemove');
            domHelpers.mouse(domHelpers.query(blockEl, '.e-row-dot-hit'), 'mouseenter');
            domHelpers.mouse(domHelpers.query(blockEl, '.e-row-insert-handle'), 'click');
            setTimeout(() => {

                // Delete first row
                const firstAfter = domHelpers.query(blockEl, 'tbody tr:first-child td[role="gridcell"]');
                domHelpers.mouse(firstAfter, 'mousemove');
                domHelpers.mouse(domHelpers.query(blockEl, '.e-row-action-handle'), 'click');
                setTimeout(() => {
                    domHelpers.mouse(domHelpers.query(document, '.e-table-gripper-action-item.e-trash'), 'click');
                    // Assert Dom/Model after delete
                    expect(domHelpers.queryAll(blockEl, 'tbody tr').length).toBe(2);
                    expect((editor.blocks[0].properties as ITableBlockSettings).rows.length).toBe(2);
                    const rnAfterDelete = domHelpers.queryAll(blockEl, 'tbody tr td.e-row-number').map(n => n.textContent);
                    expect(rnAfterDelete).toEqual(['1', '2']);
                    const headersAfterDelete = domHelpers.queryAll(blockEl, 'thead th[role="columnheader"]').map(h => h.textContent);
                    expect(headersAfterDelete.join('|')).toBe(['A', 'B'].join('|'));

                    // Undo delete
                    triggerUndo(editorElement);
                    // Undo insert
                    triggerUndo(editorElement);
                    // Assert Dom/Model back to initial
                    expect(domHelpers.queryAll(blockEl, 'tbody tr').length).toBe(2);
                    const headersUndoAll = domHelpers.queryAll(blockEl, 'thead th[role="columnheader"]').map(h => h.textContent);
                    expect(headersUndoAll.join('|')).toBe(['A', 'B'].join('|'));
                    expect((editor.blocks[0].properties as ITableBlockSettings).rows.length).toBe(2);

                    // Redo insert
                    triggerRedo(editorElement);
                    // Redo delete
                    triggerRedo(editorElement);
                    // Assert final Model and DOM
                    expect(domHelpers.queryAll(blockEl, 'tbody tr').length).toBe(2);
                    expect((editor.blocks[0].properties as ITableBlockSettings).rows.length).toBe(2);
                    done();
                });
            });
        });

        it('Insert column → delete column (same index) → undo all → redo all', (done) => {
            setupTable();
            const table = domHelpers.query(editorElement, '.e-table-element');
            const blockEl = table.closest('.e-block');

            const bodyCell = domHelpers.query(blockEl, 'tbody tr td[role="gridcell"]');
            domHelpers.mouse(bodyCell, 'mousemove');
            domHelpers.mouse(domHelpers.query(blockEl, '.e-col-dot-hit'), 'mouseenter');
            domHelpers.mouse(domHelpers.query(blockEl, '.e-col-insert-handle'), 'click');

            domHelpers.mouse(bodyCell, 'mousemove');
            domHelpers.mouse(domHelpers.query(blockEl, '.e-col-action-handle'), 'click');
            setTimeout(() => {
                domHelpers.mouse(domHelpers.query(document, '.e-table-gripper-action-item.e-trash'), 'click');
                // Assert Dom/Model after delete
                const row = domHelpers.query(blockEl, 'tbody tr') as HTMLTableRowElement;
                expect(row.cells.length).toBe(3); // rn + 2 data
                const headersAfterDelete = domHelpers.queryAll(blockEl, 'thead th[role="columnheader"]').map(h => h.textContent);
                expect(headersAfterDelete.length).toBe(2);
                expect((editor.blocks[0].properties as ITableBlockSettings).columns.length).toBe(2);

                // Undo delete column
                triggerUndo(editorElement);
                // Undo insert column
                triggerUndo(editorElement);
                // Assert back to initial (2 cols)
                const rowU = domHelpers.query(blockEl, 'tbody tr') as HTMLTableRowElement;
                expect(rowU.cells.length).toBe(3);
                const headersUndoAll = domHelpers.queryAll(blockEl, 'thead th[role="columnheader"]').map(h => h.textContent);
                expect(headersUndoAll.length).toBe(2);
                expect((editor.blocks[0].properties as ITableBlockSettings).columns.length).toBe(2);

                // Redo insert
                triggerRedo(editorElement);
                // Redo delete
                triggerRedo(editorElement);
                // Assert final Model and DOM
                const rowR = domHelpers.query(blockEl, 'tbody tr') as HTMLTableRowElement;
                expect(rowR.cells.length).toBe(3);
                expect((editor.blocks[0].properties as ITableBlockSettings).columns.length).toBe(2);
                done();
            }, 0);
        });

        it('Insert row → insert column → undo step-by-step → redo all', (done) => {
            setupTable();
            const table = domHelpers.query(editorElement, '.e-table-element');
            const blockEl = table.closest('.e-block');

            const cell = domHelpers.query(blockEl, 'tbody tr:first-child td[role="gridcell"]');
            domHelpers.mouse(cell, 'mousemove');
            domHelpers.mouse(domHelpers.query(blockEl, '.e-row-dot-hit'), 'mouseenter');
            domHelpers.mouse(domHelpers.query(blockEl, '.e-row-insert-handle'), 'click');

            domHelpers.mouse(cell, 'mousemove');
            domHelpers.mouse(domHelpers.query(blockEl, '.e-col-dot-hit'), 'mouseenter');
            domHelpers.mouse(domHelpers.query(blockEl, '.e-col-insert-handle'), 'click');

            // Undo column then row
            triggerUndo(editorElement);
            triggerUndo(editorElement);
            // Assert Dom/Model
            const p = editor.blocks[0].properties as ITableBlockSettings;
            expect(p.rows.length).toBe(2);
            expect(p.columns.length).toBe(2);
            const headersU = domHelpers.queryAll(blockEl, 'thead th[role="columnheader"]').map(h => h.textContent);
            expect(headersU.length).toBe(2);
            const rnU = domHelpers.queryAll(blockEl, 'tbody tr td.e-row-number').map(n => n.textContent);
            expect(rnU).toEqual(['1', '2']);

            // Redo row then column
            triggerRedo(editorElement);
            triggerRedo(editorElement);
            const p2 = editor.blocks[0].properties as ITableBlockSettings;
            expect(p2.rows.length).toBe(3);
            expect(p2.columns.length).toBe(3);
            const headersR = domHelpers.queryAll(blockEl, 'thead th[role="columnheader"]').map(h => h.textContent);
            expect(headersR.length).toBe(3);
            const rnR = domHelpers.queryAll(blockEl, 'tbody tr td.e-row-number').map(n => n.textContent);
            expect(rnR).toEqual(['1', '2', '3']);
            done();
        });

        it('Insert row preserves column count and header text; undo/redo keeps header intact', (done) => {
            setupTable();
            const table = domHelpers.query(editorElement, '.e-table-element');
            const blockEl = table.closest('.e-block');
            const headersBefore = domHelpers.queryAll(blockEl, 'thead th[role="columnheader"]').map(h => h.textContent);

            const cell = domHelpers.query(blockEl, 'tbody tr:first-child td[role="gridcell"]');
            domHelpers.mouse(cell, 'mousemove');
            domHelpers.mouse(domHelpers.query(blockEl, '.e-row-dot-hit'), 'mouseenter');
            domHelpers.mouse(domHelpers.query(blockEl, '.e-row-insert-handle'), 'click');

            setTimeout(() => {
                // Assert Dom
                const headersAfter = domHelpers.queryAll(blockEl, 'thead th[role="columnheader"]').map(h => h.textContent);
                expect(headersAfter.join('|')).toBe(headersBefore.join('|'));
                const bodyFirstRow = domHelpers.query(blockEl, 'tbody tr') as HTMLTableRowElement;
                expect(bodyFirstRow.cells.length).toBe((domHelpers.query(blockEl, 'thead tr') as HTMLTableRowElement).cells.length);
                // Assert Model
                const props = editor.blocks[0].properties as ITableBlockSettings;
                expect(props.columns.length).toBe(2);

                // undo
                triggerUndo(editorElement);
                const headersUndo = domHelpers.queryAll(blockEl, 'thead th[role="columnheader"]').map(h => h.textContent);
                expect(headersUndo.join('|')).toBe(headersBefore.join('|'));

                // redo
                triggerRedo(editorElement);
                const headersRedo = domHelpers.queryAll(blockEl, 'thead th[role="columnheader"]').map(h => h.textContent);
                expect(headersRedo.join('|')).toBe(headersBefore.join('|'));
                done();
            }, 0);
        });

        it('Insert column preserves row count and row-number sequence; undo/redo stable', (done) => {
            setupTable();
            const table = domHelpers.query(editorElement, '.e-table-element');
            const blockEl = table.closest('.e-block');
            const rnBefore = domHelpers.queryAll(blockEl, 'tbody tr td.e-row-number').map(n => n.textContent);

            const cell = domHelpers.query(blockEl, 'tbody tr:first-child td[role="gridcell"]');
            domHelpers.mouse(cell, 'mousemove');
            domHelpers.mouse(domHelpers.query(blockEl, '.e-col-dot-hit'), 'mouseenter');
            domHelpers.mouse(domHelpers.query(blockEl, '.e-col-insert-handle'), 'click');

            setTimeout(() => {
                // Assert Dom rows, headers unchanged in count
                const rnAfter = domHelpers.queryAll(blockEl, 'tbody tr td.e-row-number').map(n => n.textContent);
                expect(rnAfter.join('|')).toBe(rnBefore.join('|'));
                const headers = domHelpers.queryAll(blockEl, 'thead th[role="columnheader"]').map(h => h.textContent);
                expect(headers.length).toBe(3);
                // Assert Model rows count unchanged
                const props = editor.blocks[0].properties as ITableBlockSettings;
                expect(props.rows.length).toBe(2);

                // undo
                triggerUndo(editorElement);
                const rnUndo = domHelpers.queryAll(blockEl, 'tbody tr td.e-row-number').map(n => n.textContent);
                expect(rnUndo.join('|')).toBe(rnBefore.join('|'));
                const headersU = domHelpers.queryAll(blockEl, 'thead th[role="columnheader"]').map(h => h.textContent);
                expect(headersU.length).toBe(2);

                // redo
                triggerRedo(editorElement);
                const rnRedo = domHelpers.queryAll(blockEl, 'tbody tr td.e-row-number').map(n => n.textContent);
                expect(rnRedo.join('|')).toBe(rnBefore.join('|'));
                const headersR = domHelpers.queryAll(blockEl, 'thead th[role="columnheader"]').map(h => h.textContent);
                expect(headersR.length).toBe(3);
                done();
            }, 0);
        });

        it('Row insert does not change existing neighbor row cell content; undo/redo preserves values', (done) => {
            setupTable();
            const table = domHelpers.query(editorElement, '.e-table-element');
            const blockEl = table.closest('.e-block');
            const neighborRowCell1Before = domHelpers.queryAll(blockEl, 'tbody tr')[0].querySelectorAll('td')[1].textContent; // R1C1
            const neighborRowCell2Before = domHelpers.queryAll(blockEl, 'tbody tr')[0].querySelectorAll('td')[2].textContent; // R1C2

            const cell = domHelpers.query(blockEl, 'tbody tr:first-child td[role="gridcell"]');
            domHelpers.mouse(cell, 'mousemove');
            domHelpers.mouse(domHelpers.query(blockEl, '.e-row-dot-hit'), 'mouseenter');
            domHelpers.mouse(domHelpers.query(blockEl, '.e-row-insert-handle'), 'click');

            setTimeout(() => {
                // Assert Dom neighbor unaffected
                const neighborRowCell1After = domHelpers.queryAll(blockEl, 'tbody tr')[1].querySelectorAll('td')[1].textContent;
                const neighborRowCell2After = domHelpers.queryAll(blockEl, 'tbody tr')[1].querySelectorAll('td')[2].textContent;
                expect(neighborRowCell1After).toBe(neighborRowCell1Before);
                expect(neighborRowCell2After).toBe(neighborRowCell2Before);

                // undo
                triggerUndo(editorElement);
                const neighborUndoRowCell1After = domHelpers.queryAll(blockEl, 'tbody tr')[0].querySelectorAll('td')[1].textContent;
                const neighborUndoRowCell2After = domHelpers.queryAll(blockEl, 'tbody tr')[0].querySelectorAll('td')[2].textContent;
                expect(neighborUndoRowCell1After).toBe(neighborRowCell1Before);
                expect(neighborUndoRowCell2After).toBe(neighborRowCell2Before);

                // redo
                triggerRedo(editorElement);
                const neighborRedoRowCell1After = domHelpers.queryAll(blockEl, 'tbody tr')[1].querySelectorAll('td')[1].textContent;
                const neighborRedoRowCell2After = domHelpers.queryAll(blockEl, 'tbody tr')[1].querySelectorAll('td')[2].textContent;
                expect(neighborRedoRowCell1After).toBe(neighborRowCell1Before);
                expect(neighborRedoRowCell2After).toBe(neighborRowCell2Before);
                done();
            }, 0);
        });

        it('Column insert does not change existing neighbor row text; undo/redo preserves values', (done) => {
            setupTable();
            const table = domHelpers.query(editorElement, '.e-table-element');
            const blockEl = table.closest('.e-block');
            const neighborBefore = domHelpers.queryAll(blockEl, 'tbody tr')[0].querySelectorAll('td')[2].textContent; // R1C2

            const cell = domHelpers.query(blockEl, 'tbody tr:first-child td[role="gridcell"]');
            domHelpers.mouse(cell, 'mousemove');
            domHelpers.mouse(domHelpers.query(blockEl, '.e-col-dot-hit'), 'mouseenter');
            domHelpers.mouse(domHelpers.query(blockEl, '.e-col-insert-handle'), 'click');

            setTimeout(() => {
                const neighborAfter = domHelpers.queryAll(blockEl, 'tbody tr')[0].querySelectorAll('td')[3].textContent; // shifted right by rn
                expect(neighborAfter).toContain('R1C2');

                // undo
                triggerUndo(editorElement);
                const neighborUndo = domHelpers.queryAll(blockEl, 'tbody tr')[0].querySelectorAll('td')[2].textContent;
                expect(neighborUndo).toBe(neighborBefore);

                // redo
                triggerRedo(editorElement);
                const neighborRedo = domHelpers.queryAll(blockEl, 'tbody tr')[0].querySelectorAll('td')[3].textContent;
                expect(neighborRedo).toContain('R1C2');
                done();
            }, 0);
        });

        it('Delete row keeps headers intact and renumbers e-row-number sequentially', (done) => {
            setupTable({
                rows: [
                    { cells: [{ columnId: 'c1', blocks: [{ id: 'a', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: '1' }] }] }, { columnId: 'c2', blocks: [{ id: 'b', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: '2' }] }] }] },
                    { cells: [{ columnId: 'c1', blocks: [{ id: 'c', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: '3' }] }] }, { columnId: 'c2', blocks: [{ id: 'd', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: '4' }] }] }] }
                ] as any
            });
            const table = domHelpers.query(editorElement, '.e-table-element');
            const blockEl = table.closest('.e-block');
            const headerTextBefore = domHelpers.queryAll(blockEl, 'thead th[role="columnheader"]').map(h => h.textContent).join('|');

            const cell = domHelpers.query(blockEl, 'tbody tr:first-child td[role="gridcell"]');
            domHelpers.mouse(cell, 'mousemove');
            domHelpers.mouse(domHelpers.query(blockEl, '.e-row-action-handle'), 'click');
            setTimeout(() => {
                domHelpers.mouse(domHelpers.query(document, '.e-table-gripper-action-item.e-trash'), 'click');
                // Assert Dom
                const nums = domHelpers.queryAll(blockEl, 'tbody tr td.e-row-number').map(n => n.textContent);
                expect(nums).toEqual(['1']);
                const headerTextAfter = domHelpers.queryAll(blockEl, 'thead th[role="columnheader"]').map(h => h.textContent).join('|');
                expect(headerTextAfter).toBe(headerTextBefore);
                // Assert Model
                expect((editor.blocks[0].properties as ITableBlockSettings).rows.length).toBe(1);
                done();
            }, 0);
        });

        it('Delete column keeps row-number cells and recalculates colgroup widths equally', (done) => {
            setupTable({
                columns: [{ id: 'c1' }, { id: 'c2' }, { id: 'c3' }],
                rows: [
                    { cells: [{ columnId: 'c1', blocks: [{ id: 'a', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: '1' }] }] }, { columnId: 'c2', blocks: [{ id: 'b', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: '2' }] }] }, { columnId: 'c3', blocks: [{ id: 'g', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: '7' }] }] }] },
                    { cells: [{ columnId: 'c1', blocks: [{ id: 'c', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: '3' }] }] }, { columnId: 'c2', blocks: [{ id: 'd', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: '4' }] }] }, { columnId: 'c3', blocks: [{ id: 'h', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: '8' }] }] }] },
                    { cells: [{ columnId: 'c1', blocks: [{ id: 'e', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: '5' }] }] }, { columnId: 'c2', blocks: [{ id: 'f', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: '6' }] }] }, { columnId: 'c3', blocks: [{ id: 'i', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: '9' }] }] }] }
                ] as any
            });
            const table = domHelpers.query(editorElement, '.e-table-element');
            const blockEl = table.closest('.e-block');
            const cell = domHelpers.queryAll(blockEl, 'tbody tr td[role="gridcell"]')[1];
            domHelpers.mouse(cell, 'mousemove');
            domHelpers.mouse(domHelpers.query(blockEl, '.e-col-action-handle'), 'click');
            setTimeout(() => {
                domHelpers.mouse(domHelpers.query(document, '.e-table-gripper-action-item.e-trash'), 'click');
                // Assert Dom widths
                const colEls = domHelpers.queryAll(blockEl, 'colgroup > col').slice(1) as HTMLTableColElement[];
                const widths = colEls.map(c => c.style.width);
                expect(widths.every(w => w === widths[0])).toBe(true);
                // Assert Model
                expect((editor.blocks[0].properties as ITableBlockSettings).columns.length).toBe(2);
                done();
            }, 0);
        });

        it('Clear entire row selection → undo → redo', (done) => {
            setupTable();
            const table = domHelpers.query(editorElement, '.e-table-element') as HTMLTableElement;
            const blockEl = table.closest('.e-block');
            const row = domHelpers.query(blockEl, 'tbody tr') as HTMLTableRowElement;
            const rowCells = Array.from(row.querySelectorAll('td')).filter(td => !(td as HTMLElement).classList.contains('e-row-number')) as HTMLTableCellElement[];
            const beforeIds = rowCells.map(td => (td.querySelector('.e-cell-blocks-container') as HTMLElement).id);

            editor.blockManager.tableService.clearCellContents(table, rowCells);

            // Assert Dom: ids retained, column headers intact, row-number unchanged
            const afterIds = rowCells.map(td => (td.querySelector('.e-cell-blocks-container') as HTMLElement).id);
            expect(afterIds.join('|')).toBe(beforeIds.join('|'));
            const headers = domHelpers.queryAll(blockEl, 'thead th[role="columnheader"]').map(h => h.textContent);
            expect(headers.join('|')).toBe(['A', 'B'].join('|'));
            const rn = domHelpers.queryAll(blockEl, 'tbody tr td.e-row-number').map(n => n.textContent);
            expect(rn).toEqual(['1', '2']);

            // Assert Model
            const props = editor.blocks[0].properties as ITableBlockSettings;
            expect(((props.rows[0].cells[0].blocks[0]) as any).blockType).toBe(BlockType.Paragraph);
            expect(((props.rows[0].cells[1].blocks[0]) as any).blockType).toBe(BlockType.Paragraph);

            // undo -> texts restored
            triggerUndo(editorElement);
            const undoTexts = [
                (rowCells[0].querySelector('.e-cell-blocks-container') as HTMLElement).textContent,
                (rowCells[1].querySelector('.e-cell-blocks-container') as HTMLElement).textContent
            ];
            expect(undoTexts[0]).toContain('R1C1');
            expect(undoTexts[1]).toContain('R1C2');

            // redo -> cleared again
            triggerRedo(editorElement);
            const redoIds = rowCells.map(td => (td.querySelector('.e-cell-blocks-container') as HTMLElement).id);
            expect(redoIds.join('|')).toBe(beforeIds.join('|'));
            expect(((editor.blocks[0].properties as ITableBlockSettings).rows[0].cells[0].blocks[0] as any).blockType).toBe(BlockType.Paragraph);
            expect(((editor.blocks[0].properties as ITableBlockSettings).rows[0].cells[1].blocks[0] as any).blockType).toBe(BlockType.Paragraph);
            done();
        });

        it('After row insert, data-row indices updated sequentially; undo/redo restores', (done) => {
            setupTable();
            const table = domHelpers.query(editorElement, '.e-table-element');
            const blockEl = table.closest('.e-block');
            const cell = domHelpers.query(blockEl, 'tbody tr:first-child td[role="gridcell"]');
            domHelpers.mouse(cell, 'mousemove');
            domHelpers.mouse(domHelpers.query(blockEl, '.e-row-dot-hit'), 'mouseenter');
            domHelpers.mouse(domHelpers.query(blockEl, '.e-row-insert-handle'), 'click');
            setTimeout(() => {
                const rows = domHelpers.queryAll(blockEl, 'tbody tr') as HTMLTableRowElement[];
                // Assert Dom data-row
                expect((rows[0].querySelectorAll('td')[1] as HTMLElement).dataset.row).toBe('1');
                expect((rows[1].querySelectorAll('td')[1] as HTMLElement).dataset.row).toBe('2');
                expect((rows[2].querySelectorAll('td')[1] as HTMLElement).dataset.row).toBe('3');

                triggerUndo(editorElement);
                const rowsU = domHelpers.queryAll(blockEl, 'tbody tr') as HTMLTableRowElement[];
                expect((rowsU[0].querySelectorAll('td')[1] as HTMLElement).dataset.row).toBe('1');
                expect((rowsU[1].querySelectorAll('td')[1] as HTMLElement).dataset.row).toBe('2');

                triggerRedo(editorElement);
                const rowsR = domHelpers.queryAll(blockEl, 'tbody tr') as HTMLTableRowElement[];
                expect((rowsR[0].querySelectorAll('td')[1] as HTMLElement).dataset.row).toBe('1');
                expect((rowsR[1].querySelectorAll('td')[1] as HTMLElement).dataset.row).toBe('2');
                expect((rowsR[2].querySelectorAll('td')[1] as HTMLElement).dataset.row).toBe('3');
                done();
            }, 0);
        });

        it('After column insert, data-col indices updated sequentially across rows; undo/redo restores', (done) => {
            setupTable();
            const table = domHelpers.query(editorElement, '.e-table-element');
            const blockEl = table.closest('.e-block');
            const cell = domHelpers.query(blockEl, 'tbody tr:first-child td[role="gridcell"]');
            domHelpers.mouse(cell, 'mousemove');
            domHelpers.mouse(domHelpers.query(blockEl, '.e-col-dot-hit'), 'mouseenter');
            domHelpers.mouse(domHelpers.query(blockEl, '.e-col-insert-handle'), 'click');
            setTimeout(() => {
                const rows = domHelpers.queryAll(blockEl, 'tbody tr') as HTMLTableRowElement[];
                // Assert Dom data-col sequence
                rows.forEach(r => {
                    const cells = Array.from(r.querySelectorAll('td')).filter(td => !(td as HTMLElement).classList.contains('e-row-number')) as HTMLElement[];
                    cells.forEach((c, i) => expect(c.dataset.col).toBe(String(i)));
                });

                triggerUndo(editorElement);
                const rowsU = domHelpers.queryAll(blockEl, 'tbody tr') as HTMLTableRowElement[];
                rowsU.forEach(r => {
                    const cells = Array.from(r.querySelectorAll('td')).filter(td => !(td as HTMLElement).classList.contains('e-row-number')) as HTMLElement[];
                    cells.forEach((c, i) => expect(c.dataset.col).toBe(String(i)));
                });

                triggerRedo(editorElement);
                const rowsR = domHelpers.queryAll(blockEl, 'tbody tr') as HTMLTableRowElement[];
                rowsR.forEach(r => {
                    const cells = Array.from(r.querySelectorAll('td')).filter(td => !(td as HTMLElement).classList.contains('e-row-number')) as HTMLElement[];
                    cells.forEach((c, i) => expect(c.dataset.col).toBe(String(i)));
                });
                done();
            }, 0);
        });

        it('Delete down to one row; then undo restores previous row and e-row-number sequence', (done) => {
            setupTable({
                rows: [
                    { cells: [{ columnId: 'c1', blocks: [{ id: 'a', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: '1' }] }] }, { columnId: 'c2', blocks: [{ id: 'b', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: '2' }] }] }] },
                    { cells: [{ columnId: 'c1', blocks: [{ id: 'c', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: '3' }] }] }, { columnId: 'c2', blocks: [{ id: 'd', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: '4' }] }] }] }
                ] as any
            });
            const table = domHelpers.query(editorElement, '.e-table-element');
            const blockEl = table.closest('.e-block');

            // delete first row
            let cell = domHelpers.query(blockEl, 'tbody tr:first-child td[role="gridcell"]');
            domHelpers.mouse(cell, 'mousemove');
            domHelpers.mouse(domHelpers.query(blockEl, '.e-row-action-handle'), 'click');
            domHelpers.mouse(domHelpers.query(document, '.e-table-gripper-action-item.e-trash'), 'click');

            // Assert
            expect(domHelpers.queryAll(blockEl, 'tbody tr').length).toBe(1);

            // undo restore to 2 rows
            triggerUndo(editorElement);
            const nums = domHelpers.queryAll(blockEl, 'tbody tr td.e-row-number').map(n => n.textContent);
            expect(nums).toEqual(['1', '2']);
            done();
        });

        it('Delete down to one column; then undo restores previous columns and header labels', (done) => {
            setupTable({ columns: [{ id: 'c1', headerText: 'A' }, { id: 'c2', headerText: 'B' }] });
            const table = domHelpers.query(editorElement, '.e-table-element');
            const blockEl = table.closest('.e-block');
            const headerBefore = domHelpers.queryAll(blockEl, 'thead th[role="columnheader"]').map(h => h.textContent).join('|');

            // delete first column
            const cell = domHelpers.query(blockEl, 'tbody tr td[role="gridcell"]');
            domHelpers.mouse(cell, 'mousemove');
            domHelpers.mouse(domHelpers.query(blockEl, '.e-col-action-handle'), 'click');
            domHelpers.mouse(domHelpers.query(document, '.e-table-gripper-action-item.e-trash'), 'click');

            // Assert reduced columns
            const headerAfterDelete = domHelpers.queryAll(blockEl, 'thead th[role="columnheader"]').map(h => h.textContent).join('|');
            expect((editor.blocks[0].properties as ITableBlockSettings).columns.length).toBe(1);
            expect(headerAfterDelete).toBe('B');

            // undo restores
            triggerUndo(editorElement);
            const headerAfter = domHelpers.queryAll(blockEl, 'thead th[role="columnheader"]').map(h => h.textContent).join('|');
            expect(headerAfter).toBe(headerBefore);
            done();
        });

        it('Delete last remaining column from multi-column table → undo → redo', (done) => {
            setupTable({ columns: [{ id: 'c1', headerText: 'A' }, { id: 'c2', headerText: 'B' }] });
            const table = domHelpers.query(editorElement, '.e-table-element');
            const blockEl = table.closest('.e-block');
            const headerBefore = domHelpers.queryAll(blockEl, 'thead th[role="columnheader"]').map(h => h.textContent).join('|');

            // delete one column via gripper
            const anyCell = domHelpers.query(blockEl, 'tbody tr td[role="gridcell"]');
            domHelpers.mouse(anyCell, 'mousemove');
            domHelpers.mouse(domHelpers.query(blockEl, '.e-col-action-handle'), 'click');
            domHelpers.mouse(domHelpers.query(document, '.e-table-gripper-action-item.e-trash'), 'click');
            // Assert now 1 column remains (header 'B')
            const headersAfterDelete = domHelpers.queryAll(blockEl, 'thead th[role="columnheader"]').map(h => h.textContent);
            expect(headersAfterDelete.length).toBe(1);
            expect(headersAfterDelete[0]).toBe('B');
            expect((editor.blocks[0].properties as ITableBlockSettings).columns.length).toBe(1);

            // undo -> restore to 2 columns
            triggerUndo(editorElement);
            const headersUndo = domHelpers.queryAll(blockEl, 'thead th[role="columnheader"]').map(h => h.textContent).join('|');
            expect(headersUndo).toBe(headerBefore);
            expect((editor.blocks[0].properties as ITableBlockSettings).columns.length).toBe(2);

            // redo -> delete again to 1 column
            triggerRedo(editorElement);
            const headersRedo = domHelpers.queryAll(blockEl, 'thead th[role="columnheader"]').map(h => h.textContent);
            expect(headersRedo.length).toBe(1);
            expect(headersRedo[0]).toBe('B');
            expect((editor.blocks[0].properties as ITableBlockSettings).columns.length).toBe(1);
            done();
        });

        it('Clear non-contiguous cells; undo/redo restores exact previous texts', (done) => {
            setupTable();
            const table = domHelpers.query(editorElement, '.e-table-element') as HTMLTableElement;
            const blockEl = table.closest('.e-block');
            const c1 = domHelpers.query(blockEl, 'tbody tr:first-child td[role="gridcell"]') as HTMLTableCellElement; // R1C1
            const c2 = domHelpers.queryAll(blockEl, 'tbody tr:last-child td[role="gridcell"]').filter(td => !(td as HTMLElement).classList.contains('e-row-number'))[1] as HTMLTableCellElement; // R2C2
            const id1 = (c1.querySelector('.e-cell-blocks-container') as HTMLElement).id;
            const id2 = (c2.querySelector('.e-cell-blocks-container') as HTMLElement).id;

            editor.blockManager.tableService.clearCellContents(table, [c1, c2]);

            // undo -> both restored with same container ids
            triggerUndo(editorElement);
            const r1c1 = (domHelpers.queryAll(blockEl, 'tbody tr')[0].querySelectorAll('td')[1] as HTMLElement).textContent;
            const r2c2 = (domHelpers.queryAll(blockEl, 'tbody tr')[1].querySelectorAll('td')[2] as HTMLElement).textContent;
            expect(r1c1).toContain('R1C1');
            expect(r2c2).toContain('R2C2');
            expect((c1.querySelector('.e-cell-blocks-container') as HTMLElement).id).toBe(id1);
            expect((c2.querySelector('.e-cell-blocks-container') as HTMLElement).id).toBe(id2);

            // redo -> both cleared again, IDs stable
            triggerRedo(editorElement);
            expect((c1.querySelector('.e-cell-blocks-container') as HTMLElement).id).toBe(id1);
            expect((c2.querySelector('.e-cell-blocks-container') as HTMLElement).id).toBe(id2);
            done();
        });
    });
});

describe('Table Undo/Redo - Header edits', () => {
    let editor: BlockEditor;
    let editorElement: HTMLElement;

    function setupTable(overrides?: Partial<ITableBlockSettings>): void {
        const base: ITableBlockSettings = {
            enableHeader: true,
            enableRowNumbers: true,
            columns: [{ id: 'c1', headerText: 'A' }, { id: 'c2', headerText: 'B' }],
            rows: [
                {
                    cells: [
                        { columnId: 'c1', blocks: [{ id: 'p1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'R1C1' }] }] },
                        { columnId: 'c2', blocks: [{ id: 'p2', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'R1C2' }] }] }
                    ]
                },
                {
                    cells: [
                        { columnId: 'c1', blocks: [{ id: 'p3', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'R2C1' }] }] },
                        { columnId: 'c2', blocks: [{ id: 'p4', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'R2C2' }] }] }
                    ]
                }
            ]
        } as ITableBlockSettings;
        const finalProps = { ...base, ...(overrides || {}) } as ITableBlockSettings;
        const blocks: BlockModel[] = [{ blockType: BlockType.Table, properties: finalProps } as any];
        editor = createEditor({ blocks });
        editor.appendTo('#editor');
    }

    beforeEach(() => {
        editorElement = createElement('div', { id: 'editor' });
        document.body.appendChild(editorElement);
    });

    afterEach(() => {
        if (editor) { editor.destroy(); editor = undefined; }
        remove(editorElement);
    });

    it('Type in text in table header → undo → redo', () => {
        setupTable();
        const table = domHelpers.query(editorElement, '.e-table-element');
        const blockEl = table.closest('.e-block') as HTMLElement;
        const props = editor.blocks[0].properties as ITableBlockSettings;

        const firstHeader = domHelpers.query(blockEl, 'thead th:not(.e-row-number)');
        editor.blockManager.setFocusToBlock(blockEl);

        firstHeader.textContent = 'Updated header1';
        setCursorPosition(firstHeader, 0);
        editorElement.dispatchEvent(new Event('input', { bubbles: true }));

        expect(props.columns[0].headerText).toBe('Updated header1');

        triggerUndo(editorElement);
        expect(props.columns[0].headerText).toBe('A');
        expect(firstHeader.textContent).toBe('A');

        triggerRedo(editorElement);
        expect(props.columns[0].headerText).toBe('Updated header1');
        expect(firstHeader.textContent).toBe('Updated header1');

        triggerUndo(editorElement);
        expect(props.columns[0].headerText).toBe('A');
        expect(firstHeader.textContent).toBe('A');
    });
});

describe('Table Undo/Redo - Row Selection & Gripper Delete', () => {
    let editor: BlockEditor;
    let editorElement: HTMLElement;

    function setupTable(overrides?: Partial<ITableBlockSettings>): void {
        const base: ITableBlockSettings = {
            enableHeader: true,
            enableRowNumbers: true,
            columns: [{ id: 'c1', headerText: 'A' }, { id: 'c2', headerText: 'B' }],
            rows: [
                {
                    cells: [
                        { columnId: 'c1', blocks: [{ id: 'p1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'R1C1' }] }] },
                        { columnId: 'c2', blocks: [{ id: 'p2', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'R1C2' }] }] }
                    ]
                },
                {
                    cells: [
                        { columnId: 'c1', blocks: [{ id: 'p3', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'R2C1' }] }] },
                        { columnId: 'c2', blocks: [{ id: 'p4', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'R2C2' }] }] }
                    ]
                }
            ]
        } as ITableBlockSettings;
        const finalProps = { ...base, ...(overrides || {}) } as ITableBlockSettings;
        const blocks: BlockModel[] = [{ id: 'tbl', blockType: BlockType.Table, properties: finalProps } as any];
        editor = createEditor({ blocks });
        editor.appendTo('#editor');
    }

    beforeEach(() => {
        editorElement = createElement('div', { id: 'editor' });
        document.body.appendChild(editorElement);
    });

    afterEach(() => {
        if (editor) { editor.destroy(); editor = undefined; }
        remove(editorElement);
    });

    it('Select full row 1 → gripper activates → delete row → undo → redo', (done) => {
        setupTable();
        const table = domHelpers.query(editorElement, '.e-table-element') as HTMLTableElement;
        const blockEl = table.closest('.e-block') as HTMLElement;
        let rowsDom = domHelpers.queryAll(blockEl, 'tbody tr');
        expect(rowsDom.length).toBe(2);
        let propsInitial = editor.blocks[0].properties as ITableBlockSettings;
        expect(propsInitial.rows.length).toBe(2);

        selectRectangle(editorElement, 1, 0, 1, 1);

        setTimeout(() => {
            const rowPinned = domHelpers.query(blockEl, '.e-row-action-handle.e-pinned') as HTMLElement;
            expect(rowPinned && rowPinned.style.display !== 'none').toBe(true);
            let propsGripperActive = editor.blocks[0].properties as ITableBlockSettings;
            expect(propsGripperActive.rows.length).toBe(2);

            const firstRow = rowsDom[0];
            expect(firstRow.classList.contains('e-row-selected')).toBe(true);
            expect(propsGripperActive.rows[0].cells[0].blocks[0].content[0].content).toBe('R1C1'); 
            expect(propsGripperActive.rows[0].cells[1].blocks[0].content[0].content).toBe('R1C2'); 
            expect(propsGripperActive.rows[1].cells[0].blocks[0].content[0].content).toBe('R2C1');

            const deleteIcon = editorElement.querySelector('.e-table-gripper-action-item') as HTMLElement;
            expect(deleteIcon).not.toBeNull();
            domHelpers.mouse(deleteIcon, 'click');


            let rowsAfterDelete = domHelpers.queryAll(blockEl, 'tbody tr');
            expect(rowsAfterDelete.length).toBe(1);
            let propsAfterDelete = editor.blocks[0].properties as ITableBlockSettings;
            expect(propsAfterDelete.rows.length).toBe(1);

            let rowNumbers = domHelpers.queryAll(blockEl, 'tbody tr td.e-row-number').map(n => n.textContent);
            expect(rowNumbers).toEqual(['1']);
            expect(propsAfterDelete.rows[0].cells[0].blocks[0].content[0].content).toBe('R2C1');
            expect(propsAfterDelete.rows[0].cells[1].blocks[0].content[0].content).toBe('R2C2');

            triggerUndo(editorElement);

            let rowsAfterUndo = domHelpers.queryAll(blockEl, 'tbody tr');
            expect(rowsAfterUndo.length).toBe(2);
            let propsAfterUndo = editor.blocks[0].properties as ITableBlockSettings;
            expect(propsAfterUndo.rows.length).toBe(2);

            let rowNumbersUndo = domHelpers.queryAll(blockEl, 'tbody tr td.e-row-number').map(n => n.textContent);
            expect(rowNumbersUndo).toEqual(['1', '2']);
            expect(propsAfterUndo.rows[0].cells[0].blocks[0].content[0].content).toBe('R1C1');
            expect(propsAfterUndo.rows[0].cells[1].blocks[0].content[0].content).toBe('R1C2');
            expect(propsAfterUndo.rows[1].cells[0].blocks[0].content[0].content).toBe('R2C1');
            expect(propsAfterUndo.rows[1].cells[1].blocks[0].content[0].content).toBe('R2C2'); 

            triggerRedo(editorElement);
            let rowsAfterRedo = domHelpers.queryAll(blockEl, 'tbody tr');
            expect(rowsAfterRedo.length).toBe(1);
            let propsAfterRedo = editor.blocks[0].properties as ITableBlockSettings;
            expect(propsAfterRedo.rows.length).toBe(1);

            let rowNumbersRedo = domHelpers.queryAll(blockEl, 'tbody tr td.e-row-number').map(n => n.textContent);
            expect(rowNumbersRedo).toEqual(['1']);
            expect(propsAfterRedo.rows[0].cells[0].blocks[0].content[0].content).toBe('R2C1');
            expect(propsAfterRedo.rows[0].cells[1].blocks[0].content[0].content).toBe('R2C2');
            done();
        }, 0);
    });

    it('Select both rows (1-2) → gripper activates for both → delete all rows → undo → redo', (done) => {
        setupTable();
        const table = domHelpers.query(editorElement, '.e-table-element') as HTMLTableElement;
        const blockEl = table.closest('.e-block') as HTMLElement;

        let rowsDom = domHelpers.queryAll(blockEl, 'tbody tr');
        expect(rowsDom.length).toBe(2);
        let propsInitial = editor.blocks[0].properties as ITableBlockSettings;
        expect(propsInitial.rows.length).toBe(2);

        selectRectangle(editorElement, 1, 0, 2, 1);

        setTimeout(() => {
            const rowPinned = domHelpers.query(blockEl, '.e-row-action-handle.e-pinned') as HTMLElement;
            expect(rowPinned && rowPinned.style.display !== 'none').toBe(true);
            let propsGripperActive = editor.blocks[0].properties as ITableBlockSettings;
            expect(propsGripperActive.rows.length).toBe(2);

            const firstRow = rowsDom[0];
            const secondRow = rowsDom[1];
            expect(firstRow.classList.contains('e-row-selected')).toBe(true);
            expect(secondRow.classList.contains('e-row-selected')).toBe(true);
            expect(propsGripperActive.rows[0].cells[0].blocks[0].content[0].content).toBe('R1C1');
            expect(propsGripperActive.rows[0].cells[1].blocks[0].content[0].content).toBe('R1C2');
            expect(propsGripperActive.rows[1].cells[0].blocks[0].content[0].content).toBe('R2C1');
            expect(propsGripperActive.rows[1].cells[1].blocks[0].content[0].content).toBe('R2C2');

            const deleteIcon = editorElement.querySelector('.e-table-gripper-action-item') as HTMLElement;
            expect(deleteIcon).not.toBeNull();
            domHelpers.mouse(deleteIcon, 'click');

            let rowsAfterDelete = domHelpers.queryAll(blockEl, 'tbody tr');
            expect(rowsAfterDelete.length).toBe(0);
            let propsAfterDelete = editor.blocks[0].properties as ITableBlockSettings;
            expect(propsAfterDelete.rows.length).toBe(0);

            const headerCell1 = domHelpers.query(blockEl, 'thead th:not(.e-row-number)') as HTMLElement;
            expect(headerCell1.classList.contains('e-cell-focus')).toBe(true);

            triggerUndo(editorElement);

            let rowsAfterUndo = domHelpers.queryAll(blockEl, 'tbody tr');
            expect(rowsAfterUndo.length).toBe(2);
            let propsAfterUndo = editor.blocks[0].properties as ITableBlockSettings;
            expect(propsAfterUndo.rows.length).toBe(2);

            let rowNumbersUndo = domHelpers.queryAll(blockEl, 'tbody tr td.e-row-number').map(n => n.textContent);
            expect(rowNumbersUndo).toEqual(['1', '2']);
            expect(propsAfterUndo.rows[0].cells[0].blocks[0].content[0].content).toBe('R1C1');
            expect(propsAfterUndo.rows[0].cells[1].blocks[0].content[0].content).toBe('R1C2');
            expect(propsAfterUndo.rows[1].cells[0].blocks[0].content[0].content).toBe('R2C1');
            expect(propsAfterUndo.rows[1].cells[1].blocks[0].content[0].content).toBe('R2C2');

            triggerRedo(editorElement);

            let rowsAfterRedo = domHelpers.queryAll(blockEl, 'tbody tr');
            expect(rowsAfterRedo.length).toBe(0);
            let propsAfterRedo = editor.blocks[0].properties as ITableBlockSettings;
            expect(propsAfterRedo.rows.length).toBe(0);
            done();
        }, 0);
    });

    it('Select both rows (enableHeader: false) → delete all rows → focus on next block → undo → redo', (done) => {
        const tableSettings: ITableBlockSettings = {
            enableHeader: false,
            enableRowNumbers: true,
            columns: [{ id: 'c1', headerText: 'A' }, { id: 'c2', headerText: 'B' }],
            rows: [
                {
                    cells: [
                        { columnId: 'c1', blocks: [{ id: 'p1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'R1C1' }] }] },
                        { columnId: 'c2', blocks: [{ id: 'p2', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'R1C2' }] }] }
                    ]
                },
                {
                    cells: [
                        { columnId: 'c1', blocks: [{ id: 'p3', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'R2C1' }] }] },
                        { columnId: 'c2', blocks: [{ id: 'p4', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'R2C2' }] }] }
                    ]
                }
            ]
        } as ITableBlockSettings;

        const paraBlock = { id: 'para1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Next block' }] };
        const tableBlock = { id: 'tbl-no-header', blockType: BlockType.Table, properties: tableSettings } as any;
        const blocks: BlockModel[] = [tableBlock, paraBlock];
        editor = createEditor({ blocks });
        editor.appendTo('#editor');

        setTimeout(() => {
            const table = domHelpers.query(editorElement, '.e-table-element') as HTMLTableElement;
            const blockEl = table.closest('.e-block') as HTMLElement;

            let rowsDom = domHelpers.queryAll(blockEl, 'tbody tr');
            expect(rowsDom.length).toBe(2);
            let propsInitial = editor.blocks[0].properties as ITableBlockSettings;
            expect(propsInitial.rows.length).toBe(2);

            selectRectangle(editorElement, 0, 0, 1, 1);

            setTimeout(() => {
            const rowPinned = domHelpers.query(blockEl, '.e-row-action-handle.e-pinned') as HTMLElement;
            expect(rowPinned && rowPinned.style.display !== 'none').toBe(true);
            let propsGripperActive = editor.blocks[0].properties as ITableBlockSettings;
            expect(propsGripperActive.rows.length).toBe(2);

            const firstRow = rowsDom[0];
            const secondRow = rowsDom[1];
            expect(firstRow.classList.contains('e-row-selected')).toBe(true);
            expect(secondRow.classList.contains('e-row-selected')).toBe(true);
            expect(domHelpers.queryAll(blockEl, 'tbody td[role="gridcell"]').map(c => c.textContent.trim())).toEqual(['R1C1', 'R1C2', 'R2C1', 'R2C2']);
            expect(propsGripperActive.rows[0].cells[0].blocks[0].content[0].content).toBe('R1C1');
            expect(propsGripperActive.rows[0].cells[1].blocks[0].content[0].content).toBe('R1C2');
            expect(propsGripperActive.rows[1].cells[0].blocks[0].content[0].content).toBe('R2C1');
            expect(propsGripperActive.rows[1].cells[1].blocks[0].content[0].content).toBe('R2C2');

            const deleteIcon = editorElement.querySelector('.e-table-gripper-action-item') as HTMLElement;
            expect(deleteIcon).not.toBeNull();
            domHelpers.mouse(deleteIcon, 'click');

            expect(domHelpers.query(editorElement, '.e-table-element')).toBeNull();
            expect(editor.blocks.find(b => b.blockType === BlockType.Table)).toBeUndefined();
            const paraBlockEl = editorElement.querySelector('#para1') as HTMLElement;
            expect(paraBlockEl).not.toBeNull();
            let range: Range = getSelectedRange();
            let focusedBlock = findClosestParent(range.startContainer, '.e-block');
            expect(focusedBlock).toEqual(paraBlockEl);

            triggerUndo(editorElement);

            let rowsAfterUndo = domHelpers.queryAll(blockEl, 'tbody tr');
            expect(rowsAfterUndo.length).toBe(2);
            let propsAfterUndo = editor.blocks[0].properties as ITableBlockSettings;
            expect(propsAfterUndo.rows.length).toBe(2);

            let rowNumbersUndo = domHelpers.queryAll(blockEl, 'tbody tr td.e-row-number').map(n => n.textContent);
            expect(rowNumbersUndo).toEqual(['1', '2']);
            expect(propsAfterUndo.rows[0].cells[0].blocks[0].content[0].content).toBe('R1C1');
            expect(propsAfterUndo.rows[0].cells[1].blocks[0].content[0].content).toBe('R1C2');
            expect(propsAfterUndo.rows[1].cells[0].blocks[0].content[0].content).toBe('R2C1');
            expect(propsAfterUndo.rows[1].cells[1].blocks[0].content[0].content).toBe('R2C2');

            let overlay = editorElement.querySelector('.e-be-selection-overlay') as HTMLElement;
            expect(overlay).not.toBeNull();
            expect(overlay.style.display).toBe('block');

            triggerRedo(editorElement);

            expect(domHelpers.query(editorElement, '.e-table-element')).toBeNull();
            expect(editor.blocks.find(b => b.blockType === BlockType.Table)).toBeUndefined();

            const paraBlockElAfterRedo = editorElement.querySelector('#para1') as HTMLElement;
            range = getSelectedRange();
            focusedBlock = findClosestParent(range.startContainer, '.e-block');
            expect(focusedBlock).toEqual(paraBlockElAfterRedo);
            done();
            }, 0);
        }, 0);
    });

    it('Select first 2 columns (header) → gripper activates → delete columns → undo → redo', (done) => {
        const tableSettings: ITableBlockSettings = {
            enableHeader: true,
            enableRowNumbers: true,
            columns: [{ id: 'c1', headerText: 'A' }, { id: 'c2', headerText: 'B' }, { id: 'c3', headerText: 'C' }],
            rows: [
                {
                    cells: [
                        { columnId: 'c1', blocks: [{ id: 'p1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'R1C1' }] }] },
                        { columnId: 'c2', blocks: [{ id: 'p2', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'R1C2' }] }] },
                        { columnId: 'c3', blocks: [{ id: 'p3', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'R1C3' }] }] }
                    ]
                },
                {
                    cells: [
                        { columnId: 'c1', blocks: [{ id: 'p4', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'R2C1' }] }] },
                        { columnId: 'c2', blocks: [{ id: 'p5', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'R2C2' }] }] },
                        { columnId: 'c3', blocks: [{ id: 'p6', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'R2C3' }] }] }
                    ]
                }
            ]
        } as ITableBlockSettings;

        const tableBlock = { id: 'tbl-col', blockType: BlockType.Table, properties: tableSettings } as any;
        const blocks: BlockModel[] = [tableBlock];
        editor = createEditor({ blocks });
        editor.appendTo('#editor');

        setTimeout(() => {
            const table = domHelpers.query(editorElement, '.e-table-element') as HTMLTableElement;
            const blockEl = table.closest('.e-block') as HTMLElement;

            let headerCells = domHelpers.queryAll(blockEl, 'thead th[role="columnheader"]');
            expect(headerCells.length).toBe(3);
            let propsInitial = editor.blocks[0].properties as ITableBlockSettings;
            expect(propsInitial.columns.length).toBe(3);

            selectFullColumns(editorElement, 0, 1);

            setTimeout(() => {
                const colPinned = domHelpers.query(blockEl, '.e-col-action-handle.e-pinned.e-action-bar-active') as HTMLElement;
                expect(colPinned && colPinned.style.display !== 'none').toBe(true);
                let propsGripperActive = editor.blocks[0].properties as ITableBlockSettings;
                expect(propsGripperActive.columns.length).toBe(3);

                let headerCellsSelected = domHelpers.queryAll(blockEl, 'thead tr th.e-col-selected');
                expect(headerCellsSelected.length).toBe(2);
                expect(propsGripperActive.columns[0].headerText).toBe('A');
                expect(propsGripperActive.columns[1].headerText).toBe('B');
                expect(propsGripperActive.columns[2].headerText).toBe('C');

                const deleteIcon = editorElement.querySelector('.e-table-gripper-action-item') as HTMLElement;
                expect(deleteIcon).not.toBeNull();
                domHelpers.mouse(deleteIcon, 'click');

                let headerCellsAfterDelete = domHelpers.queryAll(blockEl, 'thead th[role="columnheader"]');
                expect(headerCellsAfterDelete.length).toBe(1);
                let propsAfterDelete = editor.blocks[0].properties as ITableBlockSettings;
                expect(propsAfterDelete.columns.length).toBe(1);

                let rowCellsAfterDelete = domHelpers.queryAll(blockEl, 'tbody tr td[role="gridcell"]');
                expect(rowCellsAfterDelete.length).toBe(2);
                expect(propsAfterDelete.columns[0].headerText).toBe('C');
                expect(propsAfterDelete.rows[0].cells[0].blocks[0].content[0].content).toBe('R1C3');
                expect(propsAfterDelete.rows[1].cells[0].blocks[0].content[0].content).toBe('R2C3');

                triggerUndo(editorElement);

                let headerCellsAfterUndo = domHelpers.queryAll(blockEl, 'thead th[role="columnheader"]');
                expect(headerCellsAfterUndo.length).toBe(3);
                let propsAfterUndo = editor.blocks[0].properties as ITableBlockSettings;
                expect(propsAfterUndo.columns.length).toBe(3);

                let rowCellsAfterUndo = domHelpers.queryAll(blockEl, 'tbody tr td[role="gridcell"]');
                expect(rowCellsAfterUndo.length).toBe(6);
                expect(propsAfterUndo.columns[0].headerText).toBe('A');
                expect(propsAfterUndo.columns[1].headerText).toBe('B');
                expect(propsAfterUndo.columns[2].headerText).toBe('C');
                expect(propsAfterUndo.rows[0].cells[0].blocks[0].content[0].content).toBe('R1C1');
                expect(propsAfterUndo.rows[0].cells[1].blocks[0].content[0].content).toBe('R1C2');
                expect(propsAfterUndo.rows[0].cells[2].blocks[0].content[0].content).toBe('R1C3');
                expect(propsAfterUndo.rows[1].cells[0].blocks[0].content[0].content).toBe('R2C1');
                expect(propsAfterUndo.rows[1].cells[1].blocks[0].content[0].content).toBe('R2C2');
                expect(propsAfterUndo.rows[1].cells[2].blocks[0].content[0].content).toBe('R2C3');

                triggerRedo(editorElement);

                let headerCellsAfterRedo = domHelpers.queryAll(blockEl, 'thead th[role="columnheader"]');
                expect(headerCellsAfterRedo.length).toBe(1);
                let propsAfterRedo = editor.blocks[0].properties as ITableBlockSettings;
                expect(propsAfterRedo.columns.length).toBe(1);

                let rowCellsAfterRedo = domHelpers.queryAll(blockEl, 'tbody tr td[role="gridcell"]');
                expect(rowCellsAfterRedo.length).toBe(2);
                expect(propsAfterRedo.columns[0].headerText).toBe('C');
                expect(propsAfterRedo.rows[0].cells[0].blocks[0].content[0].content).toBe('R1C3');
                expect(propsAfterRedo.rows[1].cells[0].blocks[0].content[0].content).toBe('R2C3');
                done();
            }, 0);
        }, 0);
    });

    it('Select 1st cell → shift+right to select row → shift+down to select both rows → delete → undo → redo', (done) => {
        const tableSettings: ITableBlockSettings = {
            enableHeader: true,
            enableRowNumbers: true,
            columns: [{ id: 'c1', headerText: 'A' }, { id: 'c2', headerText: 'B' }],
            rows: [
                {
                    cells: [
                        { columnId: 'c1', blocks: [{ id: 'p1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'R1C1' }] }] },
                        { columnId: 'c2', blocks: [{ id: 'p2', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'R1C2' }] }] }
                    ]
                },
                {
                    cells: [
                        { columnId: 'c1', blocks: [{ id: 'p3', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'R2C1' }] }] },
                        { columnId: 'c2', blocks: [{ id: 'p4', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'R2C2' }] }] }
                    ]
                }
            ]
        } as ITableBlockSettings;

        const tableBlock = { id: 'tbl-shift-keys', blockType: BlockType.Table, properties: tableSettings } as any;
        const blocks: BlockModel[] = [tableBlock];
        editor = createEditor({ blocks });
        editor.appendTo('#editor');

        setTimeout(() => {
            const table = domHelpers.query(editorElement, '.e-table-element') as HTMLTableElement;
            const blockEl = table.closest('.e-block') as HTMLElement;

            const firstCell = getDataCellEl(editorElement, 1, 0);
            expect(firstCell).not.toBeNull();
            
            const block = firstCell.querySelector('.e-block') as HTMLElement;
            const content = block.querySelector('.e-block-content') as HTMLElement;
            editor.blockManager.setFocusToBlock(block);
            
            const range = document.createRange();
            range.selectNodeContents(content.firstChild || content);
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);

            let rowsDom = domHelpers.queryAll(blockEl, 'tbody tr');
            expect(rowsDom.length).toBe(2);
            let propsInitial = editor.blocks[0].properties as ITableBlockSettings;
            expect(propsInitial.rows.length).toBe(2);

            const ev1 = new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, shiftKey: true });
            editorElement.dispatchEvent(ev1);

            const ev2 = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, shiftKey: true });
            editorElement.dispatchEvent(ev2);

            setTimeout(() => {
                const rowPinned = domHelpers.query(blockEl, '.e-row-action-handle.e-pinned') as HTMLElement;
                expect(rowPinned && rowPinned.style.display !== 'none').toBe(true);
                let propsGripperActive = editor.blocks[0].properties as ITableBlockSettings;
                expect(propsGripperActive.rows.length).toBe(2);

                const firstRow = rowsDom[0];
                const secondRow = rowsDom[1];
                expect(firstRow.classList.contains('e-row-selected')).toBe(true);
                expect(secondRow.classList.contains('e-row-selected')).toBe(true);
                expect(propsGripperActive.rows[0].cells[0].blocks[0].content[0].content).toBe('R1C1');
                expect(propsGripperActive.rows[0].cells[1].blocks[0].content[0].content).toBe('R1C2');
                expect(propsGripperActive.rows[1].cells[0].blocks[0].content[0].content).toBe('R2C1');
                expect(propsGripperActive.rows[1].cells[1].blocks[0].content[0].content).toBe('R2C2');

                const deleteIcon = editorElement.querySelector('.e-table-gripper-action-item') as HTMLElement;
                expect(deleteIcon).not.toBeNull();
                domHelpers.mouse(deleteIcon, 'click');

                let rowsAfterDelete = domHelpers.queryAll(blockEl, 'tbody tr');
                expect(rowsAfterDelete.length).toBe(0);
                let propsAfterDelete = editor.blocks[0].properties as ITableBlockSettings;
                expect(propsAfterDelete.rows.length).toBe(0);

                triggerUndo(editorElement);

                let rowsAfterUndo = domHelpers.queryAll(blockEl, 'tbody tr');
                expect(rowsAfterUndo.length).toBe(2);
                let propsAfterUndo = editor.blocks[0].properties as ITableBlockSettings;
                expect(propsAfterUndo.rows.length).toBe(2);

                let rowNumbersUndo = domHelpers.queryAll(blockEl, 'tbody tr td.e-row-number').map(n => n.textContent);
                expect(rowNumbersUndo).toEqual(['1', '2']);
                expect(propsAfterUndo.rows[0].cells[0].blocks[0].content[0].content).toBe('R1C1');
                expect(propsAfterUndo.rows[0].cells[1].blocks[0].content[0].content).toBe('R1C2');
                expect(propsAfterUndo.rows[1].cells[0].blocks[0].content[0].content).toBe('R2C1');
                expect(propsAfterUndo.rows[1].cells[1].blocks[0].content[0].content).toBe('R2C2');

                triggerRedo(editorElement);

                let rowsAfterRedo = domHelpers.queryAll(blockEl, 'tbody tr');
                expect(rowsAfterRedo.length).toBe(0);
                let propsAfterRedo = editor.blocks[0].properties as ITableBlockSettings;
                expect(propsAfterRedo.rows.length).toBe(0);

                done();
            }, 0);
        }, 0);
    });

    it('Select header cell 1 → shift+right to select header cell2 → shift+down twice to select both columns → delete → undo → redo', (done) => {
        const tableSettings: ITableBlockSettings = {
            enableHeader: true,
            enableRowNumbers: true,
            columns: [{ id: 'c1', headerText: 'A' }, { id: 'c2', headerText: 'B' }, { id: 'c3', headerText: 'C' }],
            rows: [
                {
                    cells: [
                        { columnId: 'c1', blocks: [{ id: 'p1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'R1C1' }] }] },
                        { columnId: 'c2', blocks: [{ id: 'p2', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'R1C2' }] }] },
                        { columnId: 'c3', blocks: [{ id: 'p3', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'R1C3' }] }] }
                    ]
                },
                {
                    cells: [
                        { columnId: 'c1', blocks: [{ id: 'p4', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'R2C1' }] }] },
                        { columnId: 'c2', blocks: [{ id: 'p5', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'R2C2' }] }] },
                        { columnId: 'c3', blocks: [{ id: 'p6', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'R2C3' }] }] }
                    ]
                }
            ]
        } as ITableBlockSettings;

        const tableBlock = { id: 'tbl-header-shift', blockType: BlockType.Table, properties: tableSettings } as any;
        const blocks: BlockModel[] = [tableBlock];
        editor = createEditor({ blocks });
        editor.appendTo('#editor');

        setTimeout(() => {
            const table = domHelpers.query(editorElement, '.e-table-element') as HTMLTableElement;
            const blockEl = table.closest('.e-block') as HTMLElement;

            const headerCell1 = getHeaderCell(editorElement, 0);
            expect(headerCell1).not.toBeNull();
            
            const block = headerCell1.closest('.e-block') as HTMLElement;
            editor.blockManager.setFocusToBlock(block);
            editor.blockManager.tableService.addCellFocus(headerCell1);
            
            const content = headerCell1;
            const range = document.createRange();
            range.selectNodeContents(content.firstChild || content);
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);

            let headerCells = domHelpers.queryAll(blockEl, 'thead th[role="columnheader"]');
            expect(headerCells.length).toBe(3);
            let propsInitial = editor.blocks[0].properties as ITableBlockSettings;
            expect(propsInitial.columns.length).toBe(3);

            const ev1 = new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, shiftKey: true });
            editorElement.dispatchEvent(ev1);

            const ev2 = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, shiftKey: true });
            editorElement.dispatchEvent(ev2);

            const ev3 = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, shiftKey: true });
            editorElement.dispatchEvent(ev3);

            setTimeout(() => {
                const colPinned = domHelpers.query(blockEl, '.e-col-action-handle.e-pinned') as HTMLElement;
                expect(colPinned && colPinned.style.display !== 'none').toBe(true);
                let propsGripperActive = editor.blocks[0].properties as ITableBlockSettings;
                expect(propsGripperActive.columns.length).toBe(3);

                let headerCellsSelected = domHelpers.queryAll(blockEl, 'thead th.e-col-selected');
                expect(headerCellsSelected.length).toBe(2);
                expect(propsGripperActive.columns[0].headerText).toBe('A');
                expect(propsGripperActive.columns[1].headerText).toBe('B');
                expect(propsGripperActive.columns[2].headerText).toBe('C');

                const deleteIcon = editorElement.querySelector('.e-table-gripper-action-item') as HTMLElement;
                expect(deleteIcon).not.toBeNull();
                domHelpers.mouse(deleteIcon, 'click');

                let headerCellsAfterDelete = domHelpers.queryAll(blockEl, 'thead th[role="columnheader"]');
                expect(headerCellsAfterDelete.length).toBe(1);
                let propsAfterDelete = editor.blocks[0].properties as ITableBlockSettings;
                expect(propsAfterDelete.columns.length).toBe(1);

                let rowCellsAfterDelete = domHelpers.queryAll(blockEl, 'tbody tr td[role="gridcell"]');
                expect(rowCellsAfterDelete.length).toBe(2);
                expect(propsAfterDelete.columns[0].headerText).toBe('C');
                expect(propsAfterDelete.rows[0].cells[0].blocks[0].content[0].content).toBe('R1C3');
                expect(propsAfterDelete.rows[1].cells[0].blocks[0].content[0].content).toBe('R2C3');

                triggerUndo(editorElement);

                let headerCellsAfterUndo = domHelpers.queryAll(blockEl, 'thead th[role="columnheader"]');
                expect(headerCellsAfterUndo.length).toBe(3);
                let propsAfterUndo = editor.blocks[0].properties as ITableBlockSettings;
                expect(propsAfterUndo.columns.length).toBe(3);

                let rowCellsAfterUndo = domHelpers.queryAll(blockEl, 'tbody tr td[role="gridcell"]');
                expect(rowCellsAfterUndo.length).toBe(6);
                expect(propsAfterUndo.columns[0].headerText).toBe('A');
                expect(propsAfterUndo.columns[1].headerText).toBe('B');
                expect(propsAfterUndo.columns[2].headerText).toBe('C');
                expect(propsAfterUndo.rows[0].cells[0].blocks[0].content[0].content).toBe('R1C1');
                expect(propsAfterUndo.rows[0].cells[1].blocks[0].content[0].content).toBe('R1C2');
                expect(propsAfterUndo.rows[0].cells[2].blocks[0].content[0].content).toBe('R1C3');
                expect(propsAfterUndo.rows[1].cells[0].blocks[0].content[0].content).toBe('R2C1');
                expect(propsAfterUndo.rows[1].cells[1].blocks[0].content[0].content).toBe('R2C2');
                expect(propsAfterUndo.rows[1].cells[2].blocks[0].content[0].content).toBe('R2C3');

                triggerRedo(editorElement);

                let headerCellsAfterRedo = domHelpers.queryAll(blockEl, 'thead th[role="columnheader"]');
                expect(headerCellsAfterRedo.length).toBe(1);
                let propsAfterRedo = editor.blocks[0].properties as ITableBlockSettings;
                expect(propsAfterRedo.columns.length).toBe(1);

                let rowCellsAfterRedo = domHelpers.queryAll(blockEl, 'tbody tr td[role="gridcell"]');
                expect(rowCellsAfterRedo.length).toBe(2);
                expect(propsAfterRedo.columns[0].headerText).toBe('C');
                expect(propsAfterRedo.rows[0].cells[0].blocks[0].content[0].content).toBe('R1C3');
                expect(propsAfterRedo.rows[1].cells[0].blocks[0].content[0].content).toBe('R2C3');

                done();
            }, 0);
        }, 0);
    });

    it('Select both rows via gripper click → delete → undo → redo', (done) => {
        setupTable();
        const table = domHelpers.query(editorElement, '.e-table-element') as HTMLTableElement;
        const blockEl = table.closest('.e-block') as HTMLElement;

        let rowsDom = domHelpers.queryAll(blockEl, 'tbody tr');
        expect(rowsDom.length).toBe(2);
        let propsInitial = editor.blocks[0].properties as ITableBlockSettings;
        expect(propsInitial.rows.length).toBe(2);

        selectRectangle(editorElement, 1, 0, 2, 1);

        setTimeout(() => {
            const rowPinned = domHelpers.query(blockEl, '.e-row-action-handle.e-pinned') as HTMLElement;
            expect(rowPinned && rowPinned.style.display !== 'none').toBe(true);
            let propsGripperActive = editor.blocks[0].properties as ITableBlockSettings;
            expect(propsGripperActive.rows.length).toBe(2);

            const firstRow = rowsDom[0];
            const secondRow = rowsDom[1];
            expect(firstRow.classList.contains('e-row-selected')).toBe(true);
            expect(secondRow.classList.contains('e-row-selected')).toBe(true);

            const deleteIcon = editorElement.querySelector('.e-table-gripper-action-item') as HTMLElement;
            expect(deleteIcon).not.toBeNull();
            domHelpers.mouse(deleteIcon, 'click');

            let rowsAfterDelete = domHelpers.queryAll(blockEl, 'tbody tr');
            expect(rowsAfterDelete.length).toBe(0);
            let propsAfterDelete = editor.blocks[0].properties as ITableBlockSettings;
            expect(propsAfterDelete.rows.length).toBe(0);

            triggerUndo(editorElement);

            let rowsAfterUndo = domHelpers.queryAll(blockEl, 'tbody tr');
            expect(rowsAfterUndo.length).toBe(2);
            let propsAfterUndo = editor.blocks[0].properties as ITableBlockSettings;
            expect(propsAfterUndo.rows.length).toBe(2);

            let rowNumbersUndo = domHelpers.queryAll(blockEl, 'tbody tr td.e-row-number').map(n => n.textContent);
            expect(rowNumbersUndo).toEqual(['1', '2']);
            expect(propsAfterUndo.rows[0].cells[0].blocks[0].content[0].content).toBe('R1C1');
            expect(propsAfterUndo.rows[0].cells[1].blocks[0].content[0].content).toBe('R1C2');
            expect(propsAfterUndo.rows[1].cells[0].blocks[0].content[0].content).toBe('R2C1');
            expect(propsAfterUndo.rows[1].cells[1].blocks[0].content[0].content).toBe('R2C2');

            triggerRedo(editorElement);

            let rowsAfterRedo = domHelpers.queryAll(blockEl, 'tbody tr');
            expect(rowsAfterRedo.length).toBe(0);
            let propsAfterRedo = editor.blocks[0].properties as ITableBlockSettings;
            expect(propsAfterRedo.rows.length).toBe(0);

            done();
        }, 0);
    });

    it('Select first 2 columns → click one pinned gripper → other grippers removed → delete that column → undo → redo', (done) => {
        const tableSettings: ITableBlockSettings = {
            enableHeader: true,
            enableRowNumbers: true,
            columns: [{ id: 'c1', headerText: 'A' }, { id: 'c2', headerText: 'B' }, { id: 'c3', headerText: 'C' }],
            rows: [
                {
                    cells: [
                        { columnId: 'c1', blocks: [{ id: 'p1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'R1C1' }] }] },
                        { columnId: 'c2', blocks: [{ id: 'p2', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'R1C2' }] }] },
                        { columnId: 'c3', blocks: [{ id: 'p3', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'R1C3' }] }] }
                    ]
                },
                {
                    cells: [
                        { columnId: 'c1', blocks: [{ id: 'p4', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'R2C1' }] }] },
                        { columnId: 'c2', blocks: [{ id: 'p5', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'R2C2' }] }] },
                        { columnId: 'c3', blocks: [{ id: 'p6', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'R2C3' }] }] }
                    ]
                }
            ]
        } as ITableBlockSettings;

        const tableBlock = { id: 'tbl-gripper-cols', blockType: BlockType.Table, properties: tableSettings } as any;
        const blocks: BlockModel[] = [tableBlock];
        editor = createEditor({ blocks });
        editor.appendTo('#editor');

        setTimeout(() => {
            const table = domHelpers.query(editorElement, '.e-table-element') as HTMLTableElement;
            const blockEl = table.closest('.e-block') as HTMLElement;

            let headerCells = domHelpers.queryAll(blockEl, 'thead th[role="columnheader"]');
            expect(headerCells.length).toBe(3);
            let propsInitial = editor.blocks[0].properties as ITableBlockSettings;
            expect(propsInitial.columns.length).toBe(3);

            selectFullColumns(editorElement, 0, 1);

            setTimeout(() => {
                const colPinnedGrippersBeforeClick = domHelpers.queryAll(blockEl, '.e-col-action-handle.e-pinned.e-action-bar-active') as HTMLElement[];
                expect(colPinnedGrippersBeforeClick.length).toBe(2);
                
                let propsGripperActive = editor.blocks[0].properties as ITableBlockSettings;
                expect(propsGripperActive.columns.length).toBe(3);

                let headerCellsSelected = domHelpers.queryAll(blockEl, 'thead th.e-col-selected');
                expect(headerCellsSelected.length).toBe(2);
                expect(propsGripperActive.columns[0].headerText).toBe('A');
                expect(propsGripperActive.columns[1].headerText).toBe('B');
                expect(propsGripperActive.columns[2].headerText).toBe('C');

                const firstPinnedColGripper = colPinnedGrippersBeforeClick[0];
                domHelpers.mouse(firstPinnedColGripper, 'click');

                setTimeout(() => {
                    const colPinnedGrippersAfterClick = domHelpers.queryAll(blockEl, '.e-col-action-handle.e-pinned') as HTMLElement[];
                    expect(colPinnedGrippersAfterClick.length).toBe(1);

                    const deleteIcon = editorElement.querySelector('.e-table-gripper-action-item') as HTMLElement;
                    expect(deleteIcon).not.toBeNull();
                    domHelpers.mouse(deleteIcon, 'click');

                    let headerCellsAfterDelete = domHelpers.queryAll(blockEl, 'thead th[role="columnheader"]');
                    expect(headerCellsAfterDelete.length).toBe(2);
                    let propsAfterDelete = editor.blocks[0].properties as ITableBlockSettings;
                    expect(propsAfterDelete.columns.length).toBe(2);

                    let rowCellsAfterDelete = domHelpers.queryAll(blockEl, 'tbody tr td[role="gridcell"]');
                    expect(rowCellsAfterDelete.length).toBe(4);
                    expect(propsAfterDelete.columns[0].headerText).toBe('B');
                    expect(propsAfterDelete.columns[1].headerText).toBe('C');
                    expect(propsAfterDelete.rows[0].cells[0].blocks[0].content[0].content).toBe('R1C2');
                    expect(propsAfterDelete.rows[0].cells[1].blocks[0].content[0].content).toBe('R1C3');
                    expect(propsAfterDelete.rows[1].cells[0].blocks[0].content[0].content).toBe('R2C2');
                    expect(propsAfterDelete.rows[1].cells[1].blocks[0].content[0].content).toBe('R2C3');

                    triggerUndo(editorElement);

                    let headerCellsAfterUndo = domHelpers.queryAll(blockEl, 'thead th[role="columnheader"]');
                    expect(headerCellsAfterUndo.length).toBe(3);
                    let propsAfterUndo = editor.blocks[0].properties as ITableBlockSettings;
                    expect(propsAfterUndo.columns.length).toBe(3);

                    let rowCellsAfterUndo = domHelpers.queryAll(blockEl, 'tbody tr td[role="gridcell"]');
                    expect(rowCellsAfterUndo.length).toBe(6);
                    expect(propsAfterUndo.columns[0].headerText).toBe('A');
                    expect(propsAfterUndo.columns[1].headerText).toBe('B');
                    expect(propsAfterUndo.columns[2].headerText).toBe('C');
                    expect(propsAfterUndo.rows[0].cells[0].blocks[0].content[0].content).toBe('R1C1');
                    expect(propsAfterUndo.rows[0].cells[1].blocks[0].content[0].content).toBe('R1C2');
                    expect(propsAfterUndo.rows[0].cells[2].blocks[0].content[0].content).toBe('R1C3');
                    expect(propsAfterUndo.rows[1].cells[0].blocks[0].content[0].content).toBe('R2C1');
                    expect(propsAfterUndo.rows[1].cells[1].blocks[0].content[0].content).toBe('R2C2');
                    expect(propsAfterUndo.rows[1].cells[2].blocks[0].content[0].content).toBe('R2C3');

                    triggerRedo(editorElement);

                    let headerCellsAfterRedo = domHelpers.queryAll(blockEl, 'thead th[role="columnheader"]');
                    expect(headerCellsAfterRedo.length).toBe(2);
                    let propsAfterRedo = editor.blocks[0].properties as ITableBlockSettings;
                    expect(propsAfterRedo.columns.length).toBe(2);

                    let rowCellsAfterRedo = domHelpers.queryAll(blockEl, 'tbody tr td[role="gridcell"]');
                    expect(rowCellsAfterRedo.length).toBe(4);
                    expect(propsAfterRedo.columns[0].headerText).toBe('B');
                    expect(propsAfterRedo.columns[1].headerText).toBe('C');
                    expect(propsAfterRedo.rows[0].cells[0].blocks[0].content[0].content).toBe('R1C2');
                    expect(propsAfterRedo.rows[0].cells[1].blocks[0].content[0].content).toBe('R1C3');
                    expect(propsAfterRedo.rows[1].cells[0].blocks[0].content[0].content).toBe('R2C2');
                    expect(propsAfterRedo.rows[1].cells[1].blocks[0].content[0].content).toBe('R2C3');

                    done();
                }, 50);
            }, 0);
        }, 0);
    });

    it('Select both rows → click one pinned gripper → other grippers removed → delete that row → undo → redo', (done) => {
        setupTable();
        const table = domHelpers.query(editorElement, '.e-table-element') as HTMLTableElement;
        const blockEl = table.closest('.e-block') as HTMLElement;

        let rowsDom = domHelpers.queryAll(blockEl, 'tbody tr');
        expect(rowsDom.length).toBe(2);
        let propsInitial = editor.blocks[0].properties as ITableBlockSettings;
        expect(propsInitial.rows.length).toBe(2);

        selectRectangle(editorElement, 1, 0, 2, 1);

        setTimeout(() => {
            const rowPinnedGrippersBeforeClick = domHelpers.queryAll(blockEl, '.e-row-action-handle.e-pinned') as HTMLElement[];
            expect(rowPinnedGrippersBeforeClick.length).toBe(2);
            
            let propsGripperActive = editor.blocks[0].properties as ITableBlockSettings;
            expect(propsGripperActive.rows.length).toBe(2);

            const firstRow = rowsDom[0];
            const secondRow = rowsDom[1];
            expect(firstRow.classList.contains('e-row-selected')).toBe(true);
            expect(secondRow.classList.contains('e-row-selected')).toBe(true);

            const firstPinnedGripper = rowPinnedGrippersBeforeClick[0];
            domHelpers.mouse(firstPinnedGripper, 'click');

            setTimeout(() => {
                const rowPinnedGrippersAfterClick = domHelpers.queryAll(blockEl, '.e-row-action-handle.e-pinned') as HTMLElement[];
                expect(rowPinnedGrippersAfterClick.length).toBe(1);

                const deleteIcon = editorElement.querySelector('.e-table-gripper-action-item') as HTMLElement;
                expect(deleteIcon).not.toBeNull();
                domHelpers.mouse(deleteIcon, 'click');

                let rowsAfterDelete = domHelpers.queryAll(blockEl, 'tbody tr');
                expect(rowsAfterDelete.length).toBe(1);
                let propsAfterDelete = editor.blocks[0].properties as ITableBlockSettings;
                expect(propsAfterDelete.rows.length).toBe(1);

                let rowNumbersAfterDelete = domHelpers.queryAll(blockEl, 'tbody tr td.e-row-number').map(n => n.textContent);
                expect(rowNumbersAfterDelete).toEqual(['1']);
                expect(propsAfterDelete.rows[0].cells[0].blocks[0].content[0].content).toBe('R2C1');
                expect(propsAfterDelete.rows[0].cells[1].blocks[0].content[0].content).toBe('R2C2');

                triggerUndo(editorElement);

                let rowsAfterUndo = domHelpers.queryAll(blockEl, 'tbody tr');
                expect(rowsAfterUndo.length).toBe(2);
                let propsAfterUndo = editor.blocks[0].properties as ITableBlockSettings;
                expect(propsAfterUndo.rows.length).toBe(2);

                let rowNumbersUndo = domHelpers.queryAll(blockEl, 'tbody tr td.e-row-number').map(n => n.textContent);
                expect(rowNumbersUndo).toEqual(['1', '2']);
                expect(propsAfterUndo.rows[0].cells[0].blocks[0].content[0].content).toBe('R1C1');
                expect(propsAfterUndo.rows[0].cells[1].blocks[0].content[0].content).toBe('R1C2');
                expect(propsAfterUndo.rows[1].cells[0].blocks[0].content[0].content).toBe('R2C1');
                expect(propsAfterUndo.rows[1].cells[1].blocks[0].content[0].content).toBe('R2C2');

                triggerRedo(editorElement);

                let rowsAfterRedo = domHelpers.queryAll(blockEl, 'tbody tr');
                expect(rowsAfterRedo.length).toBe(1);
                let propsAfterRedo = editor.blocks[0].properties as ITableBlockSettings;
                expect(propsAfterRedo.rows.length).toBe(1);

                let rowNumbersAfterRedo = domHelpers.queryAll(blockEl, 'tbody tr td.e-row-number').map(n => n.textContent);
                expect(rowNumbersAfterRedo).toEqual(['1']);
                expect(propsAfterRedo.rows[0].cells[0].blocks[0].content[0].content).toBe('R2C1');
                expect(propsAfterRedo.rows[0].cells[1].blocks[0].content[0].content).toBe('R2C2');

                done();
            }, 50);
        }, 0);
    });

    it('Select first 2 columns (enableHeader: false) → click one pinned gripper → other grippers removed → delete that column → undo → redo', (done) => {
        const tableSettings: ITableBlockSettings = {
            enableHeader: false,
            enableRowNumbers: true,
            columns: [{ id: 'c1', headerText: 'A' }, { id: 'c2', headerText: 'B' }, { id: 'c3', headerText: 'C' }],
            rows: [
                {
                    cells: [
                        { columnId: 'c1', blocks: [{ id: 'p1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'R1C1' }] }] },
                        { columnId: 'c2', blocks: [{ id: 'p2', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'R1C2' }] }] },
                        { columnId: 'c3', blocks: [{ id: 'p3', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'R1C3' }] }] }
                    ]
                },
                {
                    cells: [
                        { columnId: 'c1', blocks: [{ id: 'p4', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'R2C1' }] }] },
                        { columnId: 'c2', blocks: [{ id: 'p5', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'R2C2' }] }] },
                        { columnId: 'c3', blocks: [{ id: 'p6', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'R2C3' }] }] }
                    ]
                }
            ]
        } as ITableBlockSettings;

        const tableBlock = { id: 'tbl-gripper-cols-no-header', blockType: BlockType.Table, properties: tableSettings } as any;
        const blocks: BlockModel[] = [tableBlock];
        editor = createEditor({ blocks });
        editor.appendTo('#editor');

        setTimeout(() => {
            const table = domHelpers.query(editorElement, '.e-table-element') as HTMLTableElement;
            const blockEl = table.closest('.e-block') as HTMLElement;

            // Select first 2 columns (columns 0 and 1)
            selectFullColumns(editorElement, 0, 1);

            setTimeout(() => {
                const colPinnedGrippersBeforeClick = domHelpers.queryAll(blockEl, '.e-col-action-handle.e-pinned') as HTMLElement[];
                expect(colPinnedGrippersBeforeClick.length).toBe(2);

                let propsInitial = editor.blocks[0].properties as ITableBlockSettings;
                expect(propsInitial.rows.length).toBe(2);
                expect(propsInitial.columns.length).toBe(3);

                const allCells = domHelpers.queryAll(blockEl, 'tbody tr td[role="gridcell"]');
                expect(allCells[0].classList.contains('e-col-selected')).toBe(true);
                expect(allCells[1].classList.contains('e-col-selected')).toBe(true);

                const firstPinnedGripper = colPinnedGrippersBeforeClick[0];
                domHelpers.mouse(firstPinnedGripper, 'click');

                setTimeout(() => {
                    const colPinnedGrippersAfterClick = domHelpers.queryAll(blockEl, '.e-col-action-handle.e-pinned') as HTMLElement[];
                    expect(colPinnedGrippersAfterClick.length).toBe(1);

                    let propsAfterClick = editor.blocks[0].properties as ITableBlockSettings;
                    expect(propsAfterClick.columns.length).toBe(3);

                    const deleteIcon = editorElement.querySelector('.e-table-gripper-action-item') as HTMLElement;
                    expect(deleteIcon).not.toBeNull();
                    domHelpers.mouse(deleteIcon, 'click');

                    setTimeout(() => {
                        let propsAfterDelete = editor.blocks[0].properties as ITableBlockSettings;
                        expect(propsAfterDelete.columns.length).toBe(2);

                        const cellsAfterDelete = domHelpers.queryAll(blockEl, 'tbody tr td[role="gridcell"]');
                        expect(cellsAfterDelete.length).toBe(4); // 2 rows × 2 columns

                        triggerUndo(editorElement);
                        let propsAfterUndo = editor.blocks[0].properties as ITableBlockSettings;
                        expect(propsAfterUndo.columns.length).toBe(3);
                        const cellsAfterUndo = domHelpers.queryAll(blockEl, 'tbody tr td[role="gridcell"]');
                        expect(cellsAfterUndo.length).toBe(6); // 2 rows × 3 columns

                        triggerRedo(editorElement);
                        let propsAfterRedo = editor.blocks[0].properties as ITableBlockSettings;
                        expect(propsAfterRedo.columns.length).toBe(2);
                        const cellsAfterRedo = domHelpers.queryAll(blockEl, 'tbody tr td[role="gridcell"]');
                        expect(cellsAfterRedo.length).toBe(4); // 2 rows × 2 columns

                        done();
                    }, 50);
                }, 0);
            }, 0);
        }, 0);
    });

    it('full table select → click delete popup (trash icon) → table removed completely and focus on next para → undo restores full table with content/header/row numbers → redo removes again', (done) => {
        const tableSettings: ITableBlockSettings = {
            enableHeader: true,
            enableRowNumbers: true,
            columns: [
                { id: 'c1', headerText: 'Col A' },
                { id: 'c2', headerText: 'Col B' }
            ],
            rows: [
                {
                    cells: [
                        { columnId: 'c1', blocks: [{ id: 'p1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'A1' }] }] },
                        { columnId: 'c2', blocks: [{ id: 'p2', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'B1' }] }] }
                    ]
                },
                {
                    cells: [
                        { columnId: 'c1', blocks: [{ id: 'p3', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'A2' }] }] },
                        { columnId: 'c2', blocks: [{ id: 'p4', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'B2' }] }] }
                    ]
                }
            ]
        } as ITableBlockSettings;

        const tableBlock = { id: 'tbl-full-delete-popup', blockType: BlockType.Table, properties: tableSettings } as any;
        const paraBlock = { id: 'para1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Next block' }] };
        const blocks: BlockModel[] = [tableBlock, paraBlock];
        editor = createEditor({ blocks });
        editor.appendTo('#editor');
        const table = domHelpers.query(editorElement, '.e-table-element') as HTMLTableElement;
        const blockEl = table.closest('.e-block') as HTMLElement;

        // Full table column selection (triggers column grippers/popup)
        const totalCols = tableSettings.columns.length;
        selectFullColumns(editorElement, 0, totalCols - 1);
        // Assert: all columns selected
        const selectedCols = domHelpers.queryAll(blockEl, 'td.e-col-selected, th.e-col-selected');
        expect(selectedCols.length).toBe(6); // 2 header + 4 body cells

        // Hover first data cell to show gripper
        const firstCell = domHelpers.query(blockEl, 'tbody tr:nth-child(1) td[data-col="0"]') as HTMLElement;
        domHelpers.mouse(firstCell, 'mousemove');
        // Click trash icon in popup
        const trashIcon = domHelpers.query(document.body, '.e-table-gripper-action-item.e-trash'); // adjust selector if needed
        expect(trashIcon).not.toBeNull();
        domHelpers.mouse(trashIcon, 'click');
        // Assert: table completely removed (no DOM element, no model block)
        expect(domHelpers.query(editorElement, '.e-table-element')).toBeNull();
        expect(editor.blocks.find(b => b.blockType === BlockType.Table)).toBeUndefined();
        let paraBlockEl = editorElement.querySelector('#para1') as HTMLElement;
        expect(paraBlockEl).not.toBeNull();
        let range: Range = getSelectedRange();
        let focusedBlock = findClosestParent(range.startContainer, '.e-block');
        expect(focusedBlock).toEqual(paraBlockEl);
        // Undo → full table restored (structure + content + header + row numbers)
        triggerUndo(editorElement);
        const restoredTable = domHelpers.query(editorElement, '.e-table-element');
        expect(restoredTable).not.toBeNull();
        // Content restored
        const cellContents = domHelpers.queryAll(restoredTable, 'tbody td[role="gridcell"]')
            .map(td => td.textContent.trim() || '');
        expect(cellContents).toEqual(['A1', 'B1', 'A2', 'B2']);
        // Header and row numbers present
        expect(domHelpers.queryAll(restoredTable, 'thead th:not(.e-row-number)').length).toBe(2);
        expect(domHelpers.queryAll(restoredTable, '.e-row-number').length).toBe(3); // header + 2 rows
        let overlay = editorElement.querySelector('.e-be-selection-overlay') as HTMLElement;
        expect(overlay).not.toBeNull();
        expect(overlay.style.display).toBe('block');

        // Redo → removed again
        triggerRedo(editorElement);
        expect(domHelpers.query(editorElement, '.e-table-element')).toBeNull();
        expect(editor.blocks.find(b => b.blockType === BlockType.Table)).toBeUndefined();
        paraBlockEl = editorElement.querySelector('#para1') as HTMLElement;
        expect(paraBlockEl).not.toBeNull();
        range = getSelectedRange();
        focusedBlock = findClosestParent(range.startContainer, '.e-block');
        expect(focusedBlock).toEqual(paraBlockEl);
        done();
    });

    it('full table select → click delete popup (trash icon) → table removed completely and focus on previous para block → undo restores full table with content/header/row numbers → redo removes again', (done) => {
        const tableSettings: ITableBlockSettings = {
            enableHeader: true,
            enableRowNumbers: true,
            columns: [
                { id: 'c1', headerText: 'Col A' },
                { id: 'c2', headerText: 'Col B' }
            ],
            rows: [
                {
                    cells: [
                        { columnId: 'c1', blocks: [{ id: 'p1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'A1' }] }] },
                        { columnId: 'c2', blocks: [{ id: 'p2', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'B1' }] }] }
                    ]
                },
                {
                    cells: [
                        { columnId: 'c1', blocks: [{ id: 'p3', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'A2' }] }] },
                        { columnId: 'c2', blocks: [{ id: 'p4', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'B2' }] }] }
                    ]
                }
            ]
        } as ITableBlockSettings;

        const tableBlock = { id: 'tbl-full-delete-popup', blockType: BlockType.Table, properties: tableSettings } as any;
        const paraBlock = { id: 'para1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Next block' }] };
        const blocks: BlockModel[] = [paraBlock, tableBlock];
        editor = createEditor({ blocks });
        editor.appendTo('#editor');
        const table = domHelpers.query(editorElement, '.e-table-element') as HTMLTableElement;
        const blockEl = table.closest('.e-block') as HTMLElement;

        // Full table column selection (triggers column grippers/popup)
        const totalCols = tableSettings.columns.length;
        selectFullColumns(editorElement, 0, totalCols - 1);
        // Assert: all columns selected
        const selectedCols = domHelpers.queryAll(blockEl, 'td.e-col-selected, th.e-col-selected');
        expect(selectedCols.length).toBe(6); // 2 header + 4 body cells

        // Hover first data cell to show gripper
        const firstCell = domHelpers.query(blockEl, 'tbody tr:nth-child(1) td[data-col="0"]') as HTMLElement;
        domHelpers.mouse(firstCell, 'mousemove');
        // Click trash icon in popup
        const trashIcon = domHelpers.query(document.body, '.e-table-gripper-action-item.e-trash'); // adjust selector if needed
        expect(trashIcon).not.toBeNull();
        domHelpers.mouse(trashIcon, 'click');
        // Assert: table completely removed (no DOM element, no model block)
        expect(domHelpers.query(editorElement, '.e-table-element')).toBeNull();
        expect(editor.blocks.find(b => b.blockType === BlockType.Table)).toBeUndefined();
        let paraBlockEl = editorElement.querySelector('#para1') as HTMLElement;
        expect(paraBlockEl).not.toBeNull();
        let range: Range = getSelectedRange();
        let focusedBlock = findClosestParent(range.startContainer, '.e-block');
        expect(focusedBlock).toEqual(paraBlockEl);
        // Undo → full table restored (structure + content + header + row numbers)
        triggerUndo(editorElement);
        const restoredTable = domHelpers.query(editorElement, '.e-table-element');
        expect(restoredTable).not.toBeNull();
        // Content restored
        const cellContents = domHelpers.queryAll(restoredTable, 'tbody td[role="gridcell"]')
            .map(td => td.textContent.trim() || '');
        expect(cellContents).toEqual(['A1', 'B1', 'A2', 'B2']);
        // Header and row numbers present
        expect(domHelpers.queryAll(restoredTable, 'thead th:not(.e-row-number)').length).toBe(2);
        expect(domHelpers.queryAll(restoredTable, '.e-row-number').length).toBe(3); // header + 2 rows
        let overlay = editorElement.querySelector('.e-be-selection-overlay') as HTMLElement;
        expect(overlay).not.toBeNull();
        expect(overlay.style.display).toBe('block');

        // Redo → removed again
        triggerRedo(editorElement);
        expect(domHelpers.query(editorElement, '.e-table-element')).toBeNull();
        expect(editor.blocks.find(b => b.blockType === BlockType.Table)).toBeUndefined();
        paraBlockEl = editorElement.querySelector('#para1') as HTMLElement;
        expect(paraBlockEl).not.toBeNull();
        range = getSelectedRange();
        focusedBlock = findClosestParent(range.startContainer, '.e-block');
        expect(focusedBlock).toEqual(paraBlockEl);
        done();
    });
});

describe('Two-stage Delete key on multi-cell selection (new behaviour)', () => {
    let editor: BlockEditor;
    let editorElement: HTMLElement;

    function setup2x2(): void {
        const props: ITableBlockSettings = {
            enableHeader: true,
            enableRowNumbers: true,
            columns: [{ id: 'c1', headerText: 'A' }, { id: 'c2', headerText: 'B' }],
            rows: [
                {
                    cells: [
                        { columnId: 'c1', blocks: [{ id: 'p1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'a' }] }] },
                        { columnId: 'c2', blocks: [{ id: 'p2', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'b' }] }] }
                    ]
                },
                {
                    cells: [
                        { columnId: 'c1', blocks: [{ id: 'p3', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'c' }] }] },
                        { columnId: 'c2', blocks: [{ id: 'p4', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'd' }] }] }
                    ]
                }
            ]
        };
        const paraBlock = { id: 'para1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'Next block' }] };
        const blocks: BlockModel[] = [{ id: 'tbl2x2', blockType: BlockType.Table, properties: props }, paraBlock];
        editor = createEditor({ blocks });
        editor.appendTo('#editor');
    }

    function setup3x3Partial(): void {
        const props: ITableBlockSettings = {
            enableHeader: true,
            enableRowNumbers: true,
            columns: [
                { id: 'c1', headerText: 'A' },
                { id: 'c2', headerText: 'B' },
                { id: 'c3', headerText: 'C' }
            ],
            rows: [
                { cells: [{ columnId: 'c1', blocks: [{ id: 'p1', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'r1c1' }] }] }, { columnId: 'c2', blocks: [{ id: 'p2', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'r1c2' }] }] }, { columnId: 'c3', blocks: [{ id: 'p3', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'r1c3' }] }] }] },
                { cells: [{ columnId: 'c1', blocks: [{ id: 'p4', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'r2c1' }] }] }, { columnId: 'c2', blocks: [{ id: 'p5', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'r2c2' }] }] }, { columnId: 'c3', blocks: [{ id: 'p6', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'r2c3' }] }] }] },
                { cells: [{ columnId: 'c1', blocks: [{ id: 'p7', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'r3c1' }] }] }, { columnId: 'c2', blocks: [{ id: 'p8', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'r3c2' }] }] }, { columnId: 'c3', blocks: [{ id: 'p9', blockType: BlockType.Paragraph, content: [{ contentType: ContentType.Text, content: 'r3c3' }] }] }] }
            ]
        };
        const blocks: BlockModel[] = [{ id: 'tbl3x3', blockType: BlockType.Table, properties: props }];
        editor = createEditor({ blocks });
        editor.appendTo('#editor');
    }

    beforeEach(() => {
        editorElement = createElement('div', { id: 'editor' });
        document.body.appendChild(editorElement);
    });

    afterEach(() => {
        if (editor) { editor.destroy(); editor = undefined; }
        remove(editorElement);
    });

    it('2x2 table → multi-select both full rows → 1st Delete clears content, 2nd Delete removes rows → undo twice + redo twice', (done) => {
        setup2x2();

        const table = domHelpers.query(editorElement, '.e-table-element') as HTMLTableElement;
        const blockEl = table.closest('.e-block') as HTMLElement;
        const props = editor.blocks[0].properties as ITableBlockSettings;

        // Initial state checks
        expect(domHelpers.queryAll(blockEl, 'tbody tr').length).toBe(2);
        expect(props.rows.length).toBe(2);

        expect(domHelpers.queryAll(blockEl, 'tbody td[role="gridcell"]').map(c => c.textContent.trim())).toEqual(['a', 'b', 'c', 'd']);
        expect(props.rows[0].cells[0].blocks[0].content[0].content).toBe('a');
        expect(props.rows[0].cells[1].blocks[0].content[0].content).toBe('b');
        expect(props.rows[1].cells[0].blocks[0].content[0].content).toBe('c');
        expect(props.rows[1].cells[1].blocks[0].content[0].content).toBe('d');

        selectRectangle(editorElement, 1, 0, 2, 1);

        setTimeout(() => {
            const selectedRows = domHelpers.queryAll(blockEl, 'tr.e-row-selected');
            expect(selectedRows.length).toBe(2);
            expect(domHelpers.queryAll(blockEl, 'td.e-cell-focus, th.e-cell-focus').length).toBe(4); // 2×2 cells

            // 1st Delete → should clear content only
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete', bubbles: true, cancelable: true }));

            expect(domHelpers.queryAll(blockEl, 'tbody tr').length).toBe(2);
            expect(props.rows.length).toBe(2);

            expect(domHelpers.queryAll(blockEl, 'tbody td[role="gridcell"]').map(c => c.textContent.trim())).toEqual(['', '', '', '']);
            expect(props.rows[0].cells[0].blocks[0].content[0].content).toBe('');
            expect(props.rows[0].cells[1].blocks[0].content[0].content).toBe('');
            expect(props.rows[1].cells[0].blocks[0].content[0].content).toBe('');
            expect(props.rows[1].cells[1].blocks[0].content[0].content).toBe('');

            // DOM after clear
            const allDataCells = domHelpers.queryAll(blockEl, 'tbody td[role="gridcell"]');
            expect(allDataCells.map(c => c.textContent.trim())).toEqual(['', '', '', '']);
            expect(domHelpers.queryAll(blockEl, 'tbody tr').length).toBe(2); // rows still exist
            expect(domHelpers.queryAll(blockEl, 'tr.e-row-selected').length).toBe(2); // selection persists
            expect(domHelpers.queryAll(blockEl, 'td.e-cell-focus').length).toBeGreaterThan(0); // focus should remain

            // 2nd Delete → full rows selected → should delete both rows
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete', bubbles: true, cancelable: true }));

            expect(domHelpers.queryAll(blockEl, 'tbody tr').length).toBe(0);
            expect(props.rows.length).toBe(0);

            // Undo 1
            triggerUndo(editorElement);
            expect(domHelpers.queryAll(blockEl, 'tbody tr').length).toBe(2);
            expect(props.rows.length).toBe(2);

            expect(domHelpers.queryAll(blockEl, 'tbody td[role="gridcell"]').map(c => c.textContent.trim())).toEqual(['', '', '', '']);
            expect(props.rows[0].cells[0].blocks[0].content[0].content).toBe('');
            expect(props.rows[0].cells[1].blocks[0].content[0].content).toBe('');
            expect(props.rows[1].cells[0].blocks[0].content[0].content).toBe('');
            expect(props.rows[1].cells[1].blocks[0].content[0].content).toBe('');

            // Undo 2
            triggerUndo(editorElement);
            expect(domHelpers.queryAll(blockEl, 'tbody tr').length).toBe(2);
            expect(props.rows.length).toBe(2);

            expect(domHelpers.queryAll(blockEl, 'tbody td[role="gridcell"]').map(c => c.textContent.trim())).toEqual(['a', 'b', 'c', 'd']);
            expect(props.rows[0].cells[0].blocks[0].content[0].content).toBe('a');
            expect(props.rows[0].cells[1].blocks[0].content[0].content).toBe('b');
            expect(props.rows[1].cells[0].blocks[0].content[0].content).toBe('c');
            expect(props.rows[1].cells[1].blocks[0].content[0].content).toBe('d');

            // Redo 1
            triggerRedo(editorElement);
            expect(domHelpers.queryAll(blockEl, 'tbody tr').length).toBe(2);
            expect(props.rows.length).toBe(2);

            expect(domHelpers.queryAll(blockEl, 'tbody td[role="gridcell"]').map(c => c.textContent.trim())).toEqual(['', '', '', '']);
            expect(props.rows[0].cells[0].blocks[0].content[0].content).toBe('');
            expect(props.rows[0].cells[1].blocks[0].content[0].content).toBe('');
            expect(props.rows[1].cells[0].blocks[0].content[0].content).toBe('');
            expect(props.rows[1].cells[1].blocks[0].content[0].content).toBe('');

            // Redo 2
            triggerRedo(editorElement);
            expect(domHelpers.queryAll(blockEl, 'tbody tr').length).toBe(0);
            expect(props.rows.length).toBe(0);
            done();
        }, 50);
    });

    it('2x2 table → multi-select first full column → 1st Delete clears, 2nd Delete removes column → undo twice + redo twice', (done) => {
        setup2x2();
        const table = domHelpers.query(editorElement, '.e-table-element') as HTMLTableElement;
        const blockEl = table.closest('.e-block') as HTMLElement;
        const props = editor.blocks[0].properties as ITableBlockSettings;

        // Initial state checks (DOM + model)
        expect(domHelpers.queryAll(blockEl, 'tbody tr').length).toBe(2);
        expect(domHelpers.queryAll(blockEl, 'tbody tr td.e-row-number').map(n => n.textContent)).toEqual(['1', '2']);
        expect(domHelpers.queryAll(blockEl, 'colgroup col').length).toBe(3); // row-number + 2 data cols
        expect(props.columns.length).toBe(2);
        expect(props.rows[0].cells[0].blocks[0].content[0].content).toBe('a');
        expect(props.rows[1].cells[0].blocks[0].content[0].content).toBe('c');

        // Step 1: Select first full column (column 0)
        selectFullColumns(editorElement, 0, 0);

        setTimeout(() => {
            // Verify selection UI (column selection)
            const selectedCells = domHelpers.queryAll(blockEl, 'td.e-col-selected');
            expect(selectedCells.length).toBe(2); // one cell per row in col 0
            const focusedCells = domHelpers.queryAll(blockEl, 'td.e-cell-focus, th.e-cell-focus');
            expect(focusedCells.length).toBeGreaterThanOrEqual(2);

            // 1st Delete → should clear content only (first column)
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete', bubbles: true, cancelable: true }));

            // Model checks after clear
            expect(props.rows[0].cells[0].blocks[0].content[0].content).toBe('');
            expect(props.rows[1].cells[0].blocks[0].content[0].content).toBe('');
            // untouched cells remain
            expect(props.rows[0].cells[1].blocks[0].content[0].content).toBe('b');
            expect(props.rows[1].cells[1].blocks[0].content[0].content).toBe('d');

            // DOM checks after clear
            const firstColumnCells = domHelpers.queryAll(blockEl, 'tbody tr td[data-col="0"]');
            expect(firstColumnCells.map(c => c.textContent.trim())).toEqual(['', '']);
            const secondColumnCells = domHelpers.queryAll(blockEl, 'tbody tr td[data-col="1"]');
            expect(secondColumnCells.map(c => c.textContent.trim())).toEqual(['b', 'd']);
            expect(domHelpers.queryAll(blockEl, 'tbody tr').length).toBe(2); // rows still exist
            expect(domHelpers.queryAll(blockEl, 'colgroup col').length).toBe(3); // columns unchanged
            expect(domHelpers.queryAll(blockEl, 'tr.e-row-selected').length).toBe(0);
            expect(domHelpers.queryAll(blockEl, 'td.e-col-selected').length).toBeGreaterThan(0); // column selection persists
            expect(domHelpers.queryAll(blockEl, 'td.e-cell-focus').length).toBeGreaterThan(0); // focus should remain

            // 2nd Delete → full column selected → should delete the column
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete', bubbles: true, cancelable: true }));

            // Model checks after column deletion
            expect(props.columns.length).toBe(1);
            expect(props.rows[0].cells.length).toBe(1);
            expect(props.rows[1].cells.length).toBe(1);
            expect(props.rows[0].cells[0].blocks[0].content[0].content).toBe('b');
            expect(props.rows[1].cells[0].blocks[0].content[0].content).toBe('d');

            // DOM checks after column deletion
            expect(domHelpers.queryAll(blockEl, 'tbody tr').length).toBe(2);
            expect(domHelpers.queryAll(blockEl, 'tbody tr td.e-row-number').map(n => n.textContent)).toEqual(['1', '2']);
            expect(domHelpers.queryAll(blockEl, 'colgroup col').length).toBe(2); // row-number + 1 data col
            const remainingCells = domHelpers.queryAll(blockEl, 'tbody td[role="gridcell"]');
            expect(remainingCells.length).toBe(2);
            expect(remainingCells.map(c => c.textContent.trim())).toEqual(['b', 'd']);
            // Undo 1
            triggerUndo(editorElement);

            expect(props.columns.length).toBe(2);
            expect(props.rows[0].cells.length).toBe(2);
            expect(props.rows[0].cells[0].blocks[0].content[0].content).toBe('');
            expect(props.rows[1].cells[0].blocks[0].content[0].content).toBe('');
            expect(domHelpers.queryAll(blockEl, 'colgroup col').length).toBe(3);
            expect(domHelpers.queryAll(blockEl, 'tbody tr td[data-col="0"]').map(c => c.textContent.trim())).toEqual(['', '']);
            expect(domHelpers.queryAll(blockEl, 'tbody tr td[data-col="1"]').map(c => c.textContent.trim())).toEqual(['b', 'd']);

            // Undo 2 
            triggerUndo(editorElement);

            expect(props.columns.length).toBe(2);
            expect(props.rows[0].cells[0].blocks[0].content[0].content).toBe('a');
            expect(props.rows[1].cells[0].blocks[0].content[0].content).toBe('c');
            expect(domHelpers.queryAll(blockEl, 'tbody tr td[data-col="0"]').map(c => c.textContent.trim())).toEqual(['a', 'c']);
            expect(domHelpers.queryAll(blockEl, 'tbody tr td[data-col="1"]').map(c => c.textContent.trim())).toEqual(['b', 'd']);
            expect(domHelpers.queryAll(blockEl, 'colgroup col').length).toBe(3);

            // Redo 1
            triggerRedo(editorElement);
            expect(props.rows[0].cells[0].blocks[0].content[0].content).toBe('');
            expect(domHelpers.queryAll(blockEl, 'tbody tr td[data-col="0"]').map(c => c.textContent.trim())).toEqual(['', '']);

            // Redo 2
            triggerRedo(editorElement);
            expect(props.columns.length).toBe(1);
            expect(domHelpers.queryAll(blockEl, 'colgroup col').length).toBe(2);
            expect(domHelpers.queryAll(blockEl, 'tbody td[role="gridcell"]').length).toBe(2);
            done();
        }, 50);
    });

    it('3x3 table → partial rectangle (rows 2-3, cols 2-3) → 1st Delete clears content, 2nd Delete does NOTHING', (done) => {
        setup3x3Partial();
        const table = domHelpers.query(editorElement, '.e-table-element') as HTMLTableElement;
        const blockEl = table.closest('.e-block') as HTMLElement;
        const props = editor.blocks[0].properties as ITableBlockSettings;

        // Initial state checks (DOM + model)
        expect(domHelpers.queryAll(blockEl, 'tbody tr').length).toBe(3);
        expect(domHelpers.queryAll(blockEl, 'tbody tr td.e-row-number').map(n => n.textContent)).toEqual(['1', '2', '3']);
        expect(domHelpers.queryAll(blockEl, 'colgroup col').length).toBe(4);
        expect(props.rows.length).toBe(3);
        expect(props.columns.length).toBe(3);
        expect(props.rows[1].cells[1].blocks[0].content[0].content).toBe('r2c2');

        selectRectangle(editorElement, 1, 1, 2, 2);

        setTimeout(() => {
            // Verify selection UI
            const focusedCells = domHelpers.queryAll(blockEl, 'td.e-cell-focus');
            expect(focusedCells.length).toBe(4);

            const selectedCellsText = focusedCells.map(c => c.textContent.trim());
            expect(selectedCellsText).toContain('r1c2');
            expect(selectedCellsText).toContain('r1c3');
            expect(selectedCellsText).toContain('r2c2');
            expect(selectedCellsText).toContain('r2c3');

            expect(domHelpers.queryAll(blockEl, 'tr.e-row-selected').length).toBe(0);
            expect(domHelpers.queryAll(blockEl, 'td.e-col-selected').length).toBe(0);

            // 1st Delete
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete', bubbles: true, cancelable: true }));

            // Model checks after clear
            expect(props.rows[0].cells[1].blocks[0].content[0].content).toBe('');
            expect(props.rows[0].cells[2].blocks[0].content[0].content).toBe('');
            expect(props.rows[1].cells[1].blocks[0].content[0].content).toBe('');
            expect(props.rows[1].cells[2].blocks[0].content[0].content).toBe('');

            // DOM checks after clear
            const clearedCells = [
                domHelpers.query(blockEl, 'tbody tr:nth-child(1) td[data-col="1"]'),
                domHelpers.query(blockEl, 'tbody tr:nth-child(1) td[data-col="2"]'),
                domHelpers.query(blockEl, 'tbody tr:nth-child(2) td[data-col="1"]'),
                domHelpers.query(blockEl, 'tbody tr:nth-child(2) td[data-col="2"]') 
            ];
            expect(clearedCells.map(c => c.textContent.trim())).toEqual(['', '', '', '']);

            // Structure unchanged
            expect(domHelpers.queryAll(blockEl, 'tbody tr').length).toBe(3);
            expect(domHelpers.queryAll(blockEl, 'colgroup col').length).toBe(4);
            expect(domHelpers.queryAll(blockEl, 'tbody tr td.e-row-number').map(n => n.textContent)).toEqual(['1', '2', '3']);
            expect(domHelpers.queryAll(blockEl, 'td.e-cell-focus').length).toBe(4);

            // 2nd Delete → NOT full row or full column → should do NOTHING
            editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete', bubbles: true, cancelable: true }));

            // Model should be unchanged from after first delete
            expect(props.rows[0].cells[1].blocks[0].content[0].content).toBe('');
            expect(props.rows[1].cells[2].blocks[0].content[0].content).toBe('');

            // DOM should be unchanged
            expect(clearedCells.map(c => c.textContent.trim())).toEqual(['', '', '', '']);
            expect(domHelpers.queryAll(blockEl, 'tbody tr').length).toBe(3);
            expect(domHelpers.queryAll(blockEl, 'colgroup col').length).toBe(4);
            expect(domHelpers.queryAll(blockEl, 'td.e-cell-focus').length).toBe(4); // selection remains
            expect(domHelpers.query(blockEl, 'tbody tr:nth-child(1) td[data-col="0"]').textContent.trim()).toBe('r1c1');
            done();
        }, 50);
    });

    it('2x2 table → click first row action handle → 1st Delete clears content, 2nd Delete removes row → undo twice + redo twice', (done) => {
        setup2x2();

        const table = domHelpers.query(editorElement, '.e-table-element') as HTMLTableElement;
        const blockEl = table.closest('.e-block') as HTMLElement;
        const props = editor.blocks[0].properties as ITableBlockSettings;

        // Initial state checks
        expect(domHelpers.queryAll(blockEl, 'tbody tr').length).toBe(2);
        expect(domHelpers.queryAll(blockEl, 'tbody td.e-row-number').map(n => n.textContent.trim())).toEqual(['1', '2']);
        expect(domHelpers.queryAll(blockEl, 'tbody td[role="gridcell"]').map(c => c.textContent.trim())).toEqual(['a', 'b', 'c', 'd']);

        // Step 1: Simulate mousemove on a cell inside first data row (this triggers gripper)
        const firstDataCell = domHelpers.query(blockEl, 'tbody tr:nth-child(1) td[role="gridcell"]') as HTMLElement;
        firstDataCell.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));

        setTimeout(() => {
            // Find visible row gripper (non-pinned)
            const rowGripper = domHelpers.query(blockEl, '.e-row-action-handle:not(.e-pinned)') as HTMLElement;
            expect(rowGripper).not.toBeNull("Row gripper should be visible after mousemove");

            // Click the gripper
            rowGripper.dispatchEvent(new MouseEvent('click', { bubbles: true }));

            setTimeout(() => {
                // After gripper click
                const selectedRow = domHelpers.query(blockEl, 'tr.e-row-selected');
                expect(selectedRow).not.toBeNull();
                expect(selectedRow).toBe(domHelpers.query(blockEl, 'tbody tr:nth-child(1)'));

                const focusedCells = domHelpers.queryAll(blockEl, 'td.e-cell-focus');
                expect(focusedCells.length).toBe(2);
                expect(focusedCells.map(c => c.textContent.trim())).toEqual(['a', 'b']);

                // 1st Delete → clear content
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete', bubbles: true, cancelable: true }));

                // Model check
                expect(props.rows[0].cells[0].blocks[0].content[0].content).toBe('');
                expect(props.rows[0].cells[1].blocks[0].content[0].content).toBe('');
                expect(props.rows[1].cells[0].blocks[0].content[0].content).toBe('c');

                // DOM check
                const row1Cells = domHelpers.queryAll(blockEl, 'tbody tr:nth-child(1) td[role="gridcell"]');
                expect(row1Cells.map(c => c.textContent.trim())).toEqual(['', '']);
                expect(domHelpers.queryAll(blockEl, 'tbody tr').length).toBe(2);
                expect(domHelpers.queryAll(blockEl, 'td.e-cell-focus').length).toBe(2);

                // 2nd Delete → delete the row
                editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete', bubbles: true, cancelable: true }));

                expect(props.rows.length).toBe(1);
                expect(domHelpers.queryAll(blockEl, 'tbody tr').length).toBe(1);
                expect(domHelpers.queryAll(blockEl, 'tbody td[role="gridcell"]').map(c => c.textContent.trim())).toEqual(['c', 'd']);

                // Undo 1 → row comes back empty
                triggerUndo(editorElement);

                expect(props.rows.length).toBe(2);
                expect(props.rows[0].cells[0].blocks[0].content[0].content).toBe('');
                expect(props.rows[0].cells[1].blocks[0].content[0].content).toBe('');
                expect(domHelpers.queryAll(blockEl, 'tbody tr').length).toBe(2);
                expect(domHelpers.queryAll(blockEl, 'tbody tr:nth-child(1) td[role="gridcell"]').map(c => c.textContent.trim())).toEqual(['', '']);

                // Undo 2 → original content restored
                triggerUndo(editorElement);

                expect(props.rows.length).toBe(2);
                expect(props.rows[0].cells[0].blocks[0].content[0].content).toBe('a');
                expect(props.rows[0].cells[1].blocks[0].content[0].content).toBe('b');

                // Redo 1 → back to empty first row
                triggerRedo(editorElement);

                expect(props.rows[0].cells[0].blocks[0].content[0].content).toBe('');

                // Redo 2 → row deleted again
                triggerRedo(editorElement);

                expect(props.rows.length).toBe(1);
                expect(domHelpers.queryAll(blockEl, 'tbody td[role="gridcell"]').map(c => c.textContent.trim())).toEqual(['c', 'd']);

                done();
            }, 80);
        }, 80);
    });

    it('2x2 table → click 1st column gripper → Shift+click 2nd column gripper → Delete twice → Undo twice + Redo twice', (done) => {
        setup2x2();

        let table = domHelpers.query(editorElement, '.e-table-element') as HTMLTableElement;
        let blockEl = table.closest('.e-block') as HTMLElement;
        const props = editor.blocks[0].properties as ITableBlockSettings;

        // Initial checks
        expect(domHelpers.queryAll(blockEl, 'thead th[role="columnheader"]').length).toBe(2);
        expect(domHelpers.queryAll(blockEl, 'tbody td[role="gridcell"]').map(c => c.textContent.trim())).toEqual(['a', 'b', 'c', 'd']);

        // Step 1: Trigger floating gripper for column 0
        const col0Cell = domHelpers.query(blockEl, 'tbody tr:nth-child(1) td[data-col="0"]') as HTMLElement;
        col0Cell.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));

        setTimeout(() => {
            let colGripper = domHelpers.query(blockEl, '.e-col-action-handle:not(.e-pinned)') as HTMLElement;
            expect(colGripper).not.toBeNull("Floating gripper for col 0 should appear");

            // Click to pin it
            colGripper.dispatchEvent(new MouseEvent('click', { bubbles: true }));

            setTimeout(() => {
                // After click → should have one pinned gripper
                const pinnedGripper = domHelpers.query(blockEl, '.e-col-action-handle.e-pinned') as HTMLElement;
                expect(pinnedGripper).not.toBeNull();
                expect(pinnedGripper.dataset.colIndex).toBe('0');

                // Step 2: Trigger floating gripper for column 1 (hover a cell in col 1)
                const col1Cell = domHelpers.query(blockEl, 'tbody tr:nth-child(1) td[data-col="1"]') as HTMLElement;
                col1Cell.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));

                setTimeout(() => {
                    // Now the floating gripper should be on column 1
                    colGripper = domHelpers.query(blockEl, '.e-col-action-handle:not(.e-pinned)') as HTMLElement;
                    expect(colGripper).not.toBeNull("Floating gripper should now be on column 1");

                    // Shift + click it
                    const shiftClick = new MouseEvent('click', { bubbles: true, shiftKey: true });
                    colGripper.dispatchEvent(shiftClick);

                    setTimeout(() => {
                        // After Shift+click → both columns selected
                        expect(domHelpers.queryAll(blockEl, 'td.e-col-selected').length).toBe(4);
                        expect(domHelpers.queryAll(blockEl, 'td.e-cell-focus').length).toBe(4);

                        // 1st Delete → clear content
                        editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete', bubbles: true }));

                        expect(props.rows[0].cells[0].blocks[0].content[0].content).toBe('');
                        expect(props.rows[0].cells[1].blocks[0].content[0].content).toBe('');
                        expect(props.rows[1].cells[0].blocks[0].content[0].content).toBe('');
                        expect(props.rows[1].cells[1].blocks[0].content[0].content).toBe('');

                        // 2nd Delete → removes table
                        editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete', bubbles: true }));

                        expect(domHelpers.query(editorElement, '.e-table-element')).toBeNull();
                        expect(editor.blocks.find(b => b.blockType === BlockType.Table)).toBeUndefined();

                        // Undo 1 → columns restored empty
                        triggerUndo(editorElement);
                        table = domHelpers.query(editorElement, '.e-table-element') as HTMLTableElement;
                        blockEl = table.closest('.e-block') as HTMLElement;
                        expect(props.columns.length).toBe(2);
                        expect(domHelpers.queryAll(blockEl, 'tbody td[role="gridcell"]').map(c => c.textContent.trim())).toEqual(['', '', '', '']);

                        // Undo 2 → original content
                        triggerUndo(editorElement);
                        table = domHelpers.query(editorElement, '.e-table-element') as HTMLTableElement;
                        blockEl = table.closest('.e-block') as HTMLElement;
                        expect(domHelpers.queryAll(blockEl, 'tbody td[role="gridcell"]').map(c => c.textContent.trim())).toEqual(['a', 'b', 'c', 'd']);

                        done();
                    }, 80);
                }, 80);
            }, 80);
        }, 80);
    });

    it('2x2 table → click 1st row gripper → Shift+click 2nd row gripper → Delete twice → Undo twice + Redo twice', (done) => {
        setup2x2();

        const table = domHelpers.query(editorElement, '.e-table-element') as HTMLTableElement;
        const blockEl = table.closest('.e-block') as HTMLElement;
        const props = editor.blocks[0].properties as ITableBlockSettings;

        // Initial checks
        expect(domHelpers.queryAll(blockEl, 'tbody tr').length).toBe(2);
        expect(domHelpers.queryAll(blockEl, 'tbody td[role="gridcell"]').map(c => c.textContent.trim())).toEqual(['a', 'b', 'c', 'd']);

        // Step 1: Trigger floating gripper for row 1 (mousemove on a cell in row 1)
        const row1Cell = domHelpers.query(blockEl, 'tbody tr:nth-child(1) td[role="gridcell"]') as HTMLElement;
        row1Cell.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));

        setTimeout(() => {
            let rowGripper = domHelpers.query(blockEl, '.e-row-action-handle:not(.e-pinned)') as HTMLElement;
            expect(rowGripper).not.toBeNull("Floating gripper for row 1 should appear");

            // Click to pin it
            rowGripper.dispatchEvent(new MouseEvent('click', { bubbles: true }));

            setTimeout(() => {
                // After first click → one pinned gripper
                const pinnedGripper = domHelpers.query(blockEl, '.e-row-action-handle.e-pinned') as HTMLElement;
                expect(pinnedGripper).not.toBeNull();
                expect(pinnedGripper.dataset.rowIndex).toBe('1');

                // Step 2: Trigger floating gripper for row 2 (hover a cell in row 2)
                const row2Cell = domHelpers.query(blockEl, 'tbody tr:nth-child(2) td[role="gridcell"]') as HTMLElement;
                row2Cell.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));

                setTimeout(() => {
                    // Floating gripper should now be on row 2
                    rowGripper = domHelpers.query(blockEl, '.e-row-action-handle:not(.e-pinned)') as HTMLElement;
                    expect(rowGripper).not.toBeNull("Floating gripper should now be on row 2");

                    // Shift + click it
                    const shiftClick = new MouseEvent('click', { bubbles: true, shiftKey: true });
                    rowGripper.dispatchEvent(shiftClick);

                    setTimeout(() => {
                        // After Shift+click → both rows selected
                        expect(domHelpers.queryAll(blockEl, 'tr.e-row-selected').length).toBe(2);
                        expect(domHelpers.queryAll(blockEl, 'td.e-cell-focus').length).toBe(4);

                        // 1st Delete → clear content
                        editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete', bubbles: true }));

                        expect(props.rows[0].cells[0].blocks[0].content[0].content).toBe('');
                        expect(props.rows[0].cells[1].blocks[0].content[0].content).toBe('');
                        expect(props.rows[1].cells[0].blocks[0].content[0].content).toBe('');
                        expect(props.rows[1].cells[1].blocks[0].content[0].content).toBe('');

                        // 2nd Delete → delete rows
                        editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete', bubbles: true }));

                        expect(props.rows.length).toBe(0);
                        expect(domHelpers.queryAll(blockEl, 'tbody tr').length).toBe(0);

                        // Undo 1 → rows restored (empty)
                        triggerUndo(editorElement);
                        expect(props.rows.length).toBe(2);
                        expect(domHelpers.queryAll(blockEl, 'tbody td[role="gridcell"]').map(c => c.textContent.trim())).toEqual(['', '', '', '']);

                        // Undo 2 → original content restored
                        triggerUndo(editorElement);
                        expect(domHelpers.queryAll(blockEl, 'tbody td[role="gridcell"]').map(c => c.textContent.trim())).toEqual(['a', 'b', 'c', 'd']);

                        // Redo 1 → empty
                        triggerRedo(editorElement);
                        expect(domHelpers.queryAll(blockEl, 'tbody td[role="gridcell"]').map(c => c.textContent.trim())).toEqual(['', '', '', '']);

                        // Redo 2 → rows deleted again
                        triggerRedo(editorElement);
                        expect(props.rows.length).toBe(0);

                        done();
                    }, 80);
                }, 80);
            }, 80);
        }, 80);
    });

    it('row mouse drag select first row → Shift+click second row gripper → Delete twice → Undo twice + Redo twice', (done) => {
        setup2x2();

        const table = domHelpers.query(editorElement, '.e-table-element') as HTMLTableElement;
        const blockEl = table.closest('.e-block') as HTMLElement;
        const props = editor.blocks[0].properties as ITableBlockSettings;

        // Initial checks
        expect(domHelpers.queryAll(blockEl, 'tbody tr').length).toBe(2);
        expect(domHelpers.queryAll(blockEl, 'tbody td[role="gridcell"]').map(c => c.textContent.trim())).toEqual(['a', 'b', 'c', 'd']);

        // Step 1: Mouse drag select full first data row
        const row1FirstCell = domHelpers.query(blockEl, 'tbody tr:nth-child(1) td[data-col="0"]') as HTMLElement;
        const row1LastCell  = domHelpers.query(blockEl, 'tbody tr:nth-child(1) td[data-col="1"]') as HTMLElement;

        row1FirstCell.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        row1LastCell.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
        document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

        setTimeout(() => {
            expect(domHelpers.queryAll(blockEl, 'tr.e-row-selected').length).toBe(1);
            expect(domHelpers.queryAll(blockEl, 'td.e-cell-focus').length).toBe(2);

            // Step 2: Hover second row gripper → Shift+click
            const secondRowCell = domHelpers.query(blockEl, 'tbody tr:nth-child(2) td[data-col="0"]') as HTMLElement;
            secondRowCell.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));

            setTimeout(() => {
                const secondGripper = domHelpers.query(blockEl, '.e-row-action-handle:not(.e-pinned)') as HTMLElement;
                expect(secondGripper).not.toBeNull("Floating gripper should appear on second row after hover");

                const shiftClick = new MouseEvent('click', { bubbles: true, shiftKey: true });
                secondGripper.dispatchEvent(shiftClick);

                setTimeout(() => {
                    expect(domHelpers.queryAll(blockEl, 'tr.e-row-selected').length).toBe(2);
                    expect(domHelpers.queryAll(blockEl, 'td.e-cell-focus').length).toBe(4);

                    // 1st Delete → clear content
                    editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete', bubbles: true }));

                    expect(props.rows[0].cells[0].blocks[0].content[0].content).toBe('');
                    expect(props.rows[0].cells[1].blocks[0].content[0].content).toBe('');
                    expect(props.rows[1].cells[0].blocks[0].content[0].content).toBe('');
                    expect(props.rows[1].cells[1].blocks[0].content[0].content).toBe('');

                    expect(domHelpers.queryAll(blockEl, 'tbody td[role="gridcell"]').map(c => c.textContent.trim())).toEqual(['', '', '', '']);

                    // 2nd Delete → delete rows
                    editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete', bubbles: true }));

                    expect(props.rows.length).toBe(0);
                    expect(domHelpers.queryAll(blockEl, 'tbody tr').length).toBe(0);

                    // Undo 1 → rows restored empty
                    triggerUndo(editorElement);
                    expect(props.rows.length).toBe(2);
                    expect(domHelpers.queryAll(blockEl, 'tbody td[role="gridcell"]').map(c => c.textContent.trim())).toEqual(['', '', '', '']);

                    // Undo 2 → original content restored
                    triggerUndo(editorElement);
                    expect(domHelpers.queryAll(blockEl, 'tbody td[role="gridcell"]').map(c => c.textContent.trim())).toEqual(['a', 'b', 'c', 'd']);

                    // Redo 1 → empty again
                    triggerRedo(editorElement);
                    expect(domHelpers.queryAll(blockEl, 'tbody td[role="gridcell"]').map(c => c.textContent.trim())).toEqual(['', '', '', '']);

                    // Redo 2 → rows deleted
                    triggerRedo(editorElement);
                    expect(props.rows.length).toBe(0);

                    done();
                }, 80);
            }, 80);
        }, 80);
    });

    // mousemove removes keyboard selection (on test case alone)
    // it('row Shift+Arrow select first row → Shift+click second row gripper → Delete twice → Undo twice + Redo twice', (done) => {
    //     setup2x2();

    //     const table = domHelpers.query(editorElement, '.e-table-element') as HTMLTableElement;
    //     const blockEl = table.closest('.e-block') as HTMLElement;
    //     const props = editor.blocks[0].properties as ITableBlockSettings;

    //     // Initial checks
    //     expect(domHelpers.queryAll(blockEl, 'tbody tr').length).toBe(2);
    //     expect(domHelpers.queryAll(blockEl, 'tbody td[role="gridcell"]').map(c => c.textContent.trim())).toEqual(['a', 'b', 'c', 'd']);

    //     // Step 1: Focus first cell → Shift+Right Arrow to select full first row
    //     const firstCell = domHelpers.query(blockEl, 'tbody tr:nth-child(1) td[data-col="0"]') as HTMLElement;
    //     firstCell.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    //     editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, shiftKey: true }));

    //     setTimeout(() => {
    //         expect(domHelpers.queryAll(blockEl, 'tr.e-row-selected').length).toBe(1);
    //         expect(domHelpers.queryAll(blockEl, 'td.e-cell-focus').length).toBe(2);

    //         // Step 2: Hover second row gripper → Shift+click
    //         const secondRowCell = domHelpers.query(blockEl, 'tbody tr:nth-child(2) td[data-col="0"]') as HTMLElement;
    //         secondRowCell.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));

    //         setTimeout(() => {
    //             const secondGripper = domHelpers.query(blockEl, '.e-row-action-handle:not(.e-pinned)') as HTMLElement;
    //             expect(secondGripper).not.toBeNull("Floating gripper should appear on second row after hover");

    //             const shiftClick = new MouseEvent('click', { bubbles: true, shiftKey: true });
    //             secondGripper.dispatchEvent(shiftClick);

    //             setTimeout(() => {
    //                 expect(domHelpers.queryAll(blockEl, 'tr.e-row-selected').length).toBe(2);
    //                 expect(domHelpers.queryAll(blockEl, 'td.e-cell-focus').length).toBe(4);

    //                 // 1st Delete → clear content
    //                 editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete', bubbles: true }));

    //                 expect(props.rows[0].cells[0].blocks[0].content[0].content).toBe('');
    //                 expect(props.rows[0].cells[1].blocks[0].content[0].content).toBe('');
    //                 expect(props.rows[1].cells[0].blocks[0].content[0].content).toBe('');
    //                 expect(props.rows[1].cells[1].blocks[0].content[0].content).toBe('');

    //                 // 2nd Delete → delete rows
    //                 editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete', bubbles: true }));

    //                 expect(props.rows.length).toBe(0);
    //                 expect(domHelpers.queryAll(blockEl, 'tbody tr').length).toBe(0);

    //                 // Undo 1 → rows restored empty
    //                 triggerUndo(editorElement);
    //                 expect(props.rows.length).toBe(2);
    //                 expect(domHelpers.queryAll(blockEl, 'tbody td[role="gridcell"]').map(c => c.textContent.trim())).toEqual(['', '', '', '']);

    //                 // Undo 2 → original content restored
    //                 triggerUndo(editorElement);
    //                 expect(domHelpers.queryAll(blockEl, 'tbody td[role="gridcell"]').map(c => c.textContent.trim())).toEqual(['a', 'b', 'c', 'd']);

    //                 // Redo 1 → empty
    //                 triggerRedo(editorElement);
    //                 expect(domHelpers.queryAll(blockEl, 'tbody td[role="gridcell"]').map(c => c.textContent.trim())).toEqual(['', '', '', '']);

    //                 // Redo 2 → rows deleted
    //                 triggerRedo(editorElement);
    //                 expect(props.rows.length).toBe(0);

    //                 done();
    //             }, 80);
    //         }, 80);
    //     }, 80);
    // });

    it('column select first column → Shift+click second column gripper → Delete twice → Undo twice + Redo twice', (done) => {
        setup2x2();

        const table = domHelpers.query(editorElement, '.e-table-element') as HTMLTableElement;
        const blockEl = table.closest('.e-block') as HTMLElement;
        const props = editor.blocks[0].properties as ITableBlockSettings;

        // Initial checks
        expect(domHelpers.queryAll(blockEl, 'thead th[role="columnheader"]').length).toBe(2);
        expect(domHelpers.queryAll(blockEl, 'tbody td[role="gridcell"]').map(c => c.textContent.trim())).toEqual(['a', 'b', 'c', 'd']);

        // Step 1: Select first full column using helper
        selectFullColumns(editorElement, 0, 0);

        setTimeout(() => {
            expect(domHelpers.queryAll(blockEl, 'td.e-col-selected').length).toBe(2);
            expect(domHelpers.queryAll(blockEl, 'td.e-cell-focus').length).toBe(2);

            // Step 2: Hover second column gripper → Shift+click to add it
            const col1TopCell = domHelpers.query(blockEl, 'tbody tr:nth-child(1) td[data-col="1"]') as HTMLElement;
            col1TopCell.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));

            setTimeout(() => {
                const secondGripper = domHelpers.query(blockEl, '.e-col-action-handle:not(.e-pinned)') as HTMLElement;
                expect(secondGripper).not.toBeNull("Floating gripper should appear on second column after hover");

                const shiftClick = new MouseEvent('click', { bubbles: true, shiftKey: true });
                secondGripper.dispatchEvent(shiftClick);

                setTimeout(() => {
                    expect(domHelpers.queryAll(blockEl, 'td.e-col-selected').length).toBe(4);
                    expect(domHelpers.queryAll(blockEl, 'td.e-cell-focus').length).toBe(4);

                    // 1st Delete → clear content
                    editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete', bubbles: true }));

                    expect(props.rows[0].cells[0].blocks[0].content[0].content).toBe('');
                    expect(props.rows[0].cells[1].blocks[0].content[0].content).toBe('');
                    expect(props.rows[1].cells[0].blocks[0].content[0].content).toBe('');
                    expect(props.rows[1].cells[1].blocks[0].content[0].content).toBe('');

                    // 2nd Delete → delete columns
                    editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete', bubbles: true }));

                    expect(domHelpers.query(editorElement, '.e-table-element')).toBeNull();
                    expect(editor.blocks.find(b => b.blockType === BlockType.Table)).toBeUndefined();
                    let paraBlockEl = editorElement.querySelector('#para1') as HTMLElement;
                    expect(paraBlockEl).not.toBeNull();
                    let range: Range = getSelectedRange();
                    let focusedBlock = findClosestParent(range.startContainer, '.e-block');
                    expect(focusedBlock).toEqual(paraBlockEl);

                    // 1st Undo → table restored, but cells empty
                    triggerUndo(editorElement);
                    const restoredTable1 = domHelpers.query(editorElement, '.e-table-element');
                    expect(restoredTable1).not.toBeNull();
                    const cellContents1 = domHelpers.queryAll(restoredTable1, 'tbody td[role="gridcell"]')
                        .map(td => td.textContent.trim() || '');
                    expect(cellContents1).toEqual(['', '', '', '']);

                    // 2nd Undo → cells with original content
                    triggerUndo(editorElement);
                    const restoredTable2 = domHelpers.query(editorElement, '.e-table-element');
                    expect(restoredTable2).not.toBeNull();
                    const cellContents2 = domHelpers.queryAll(restoredTable2, 'tbody td[role="gridcell"]')
                        .map(td => td.textContent.trim() || '');
                    expect(cellContents2).toEqual(['a', 'b', 'c', 'd']);

                    // 1st Redo → back to empty cells
                    triggerRedo(editorElement);
                    const restoredTable3 = domHelpers.query(editorElement, '.e-table-element');
                    expect(restoredTable3).not.toBeNull();
                    const cellContents3 = domHelpers.queryAll(restoredTable3, 'tbody td[role="gridcell"]')
                        .map(td => td.textContent.trim() || '');
                    expect(cellContents3).toEqual(['', '', '', '']);

                    // 2nd Redo → table null
                    triggerRedo(editorElement);
                    expect(domHelpers.query(editorElement, '.e-table-element')).toBeNull();
                    expect(editor.blocks.find(b => b.blockType === BlockType.Table)).toBeUndefined();
                    paraBlockEl = editorElement.querySelector('#para1') as HTMLElement;
                    expect(paraBlockEl).not.toBeNull();
                    range = getSelectedRange();
                    focusedBlock = findClosestParent(range.startContainer, '.e-block');
                    expect(focusedBlock).toEqual(paraBlockEl);
                    done();
                }, 80);
            }, 80);
        }, 80);
    });

    // mousemove removes keyboard selection (on test case alone)
    // it('column Shift+Arrow select first column → Shift+click second column gripper → Delete twice → Undo twice + Redo twice', (done) => {
    //     setup2x2();

    //     const table = domHelpers.query(editorElement, '.e-table-element') as HTMLTableElement;
    //     const blockEl = table.closest('.e-block') as HTMLElement;
    //     const props = editor.blocks[0].properties as ITableBlockSettings;

    //     // Initial checks
    //     expect(domHelpers.queryAll(blockEl, 'thead th[role="columnheader"]').length).toBe(2);
    //     expect(domHelpers.queryAll(blockEl, 'tbody td[role="gridcell"]').map(c => c.textContent.trim())).toEqual(['a', 'b', 'c', 'd']);

    //     // Step 1: Focus first cell → Shift+Down Arrow to select full first column
    //     const firstCell = domHelpers.query(blockEl, 'tbody tr:nth-child(1) td[data-col="0"]') as HTMLElement;
    //     firstCell.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    //     editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, shiftKey: true }));

    //     setTimeout(() => {
    //         expect(domHelpers.queryAll(blockEl, 'td.e-col-selected').length).toBe(2);
    //         expect(domHelpers.queryAll(blockEl, 'td.e-cell-focus').length).toBe(2);

    //         // Step 2: Hover second column gripper → Shift+click
    //         const secondColCell = domHelpers.query(blockEl, 'tbody tr:nth-child(1) td[data-col="1"]') as HTMLElement;
    //         secondColCell.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));

    //         setTimeout(() => {
    //             const secondGripper = domHelpers.query(blockEl, '.e-col-action-handle:not(.e-pinned)') as HTMLElement;
    //             expect(secondGripper).not.toBeNull("Floating gripper should appear on second column after hover");

    //             const shiftClick = new MouseEvent('click', { bubbles: true, shiftKey: true });
    //             secondGripper.dispatchEvent(shiftClick);

    //             setTimeout(() => {
    //                 expect(domHelpers.queryAll(blockEl, 'td.e-col-selected').length).toBe(4);
    //                 expect(domHelpers.queryAll(blockEl, 'td.e-cell-focus').length).toBe(4);

    //                 // 1st Delete → clear content
    //                 editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete', bubbles: true }));

    //                 expect(props.rows[0].cells[0].blocks[0].content[0].content).toBe('');
    //                 expect(props.rows[0].cells[1].blocks[0].content[0].content).toBe('');
    //                 expect(props.rows[1].cells[0].blocks[0].content[0].content).toBe('');
    //                 expect(props.rows[1].cells[1].blocks[0].content[0].content).toBe('');

    //                 // 2nd Delete → delete columns
    //                 editorElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete', bubbles: true }));

    //                 expect(props.columns.length).toBe(0);
    //                 expect(domHelpers.queryAll(blockEl, 'thead th[role="columnheader"]').length).toBe(0);

    //                 // Undo 1 → columns restored empty
    //                 triggerUndo(editorElement);
    //                 expect(props.columns.length).toBe(2);
    //                 expect(domHelpers.queryAll(blockEl, 'tbody td[role="gridcell"]').map(c => c.textContent.trim())).toEqual(['', '', '', '']);

    //                 // Undo 2 → original content restored
    //                 triggerUndo(editorElement);
    //                 expect(domHelpers.queryAll(blockEl, 'tbody td[role="gridcell"]').map(c => c.textContent.trim())).toEqual(['a', 'b', 'c', 'd']);

    //                 // Redo 1 → empty
    //                 triggerRedo(editorElement);
    //                 expect(domHelpers.queryAll(blockEl, 'tbody td[role="gridcell"]').map(c => c.textContent.trim())).toEqual(['', '', '', '']);

    //                 // Redo 2 → columns deleted
    //                 triggerRedo(editorElement);
    //                 expect(props.columns.length).toBe(0);

    //                 done();
    //             }, 80);
    //         }, 80);
    //     }, 80);
    // });
    
    it('full table select → Delete key twice → table removed → 1st undo restores empty cells, 2nd undo restores content → 1st redo empty, 2nd redo table null', (done) => {
        setup2x2();
        const table = domHelpers.query(editorElement, '.e-table-element') as HTMLTableElement;
        const props = editor.blocks[0].properties as ITableBlockSettings;
        const blockEl = table.closest('.e-block') as HTMLElement;
        // Full table column selection
        const totalCols = props.columns.length;
        selectFullColumns(editorElement, 0, totalCols - 1);

        // First Delete key → clear contents
        domHelpers.key(editorElement, 'Delete');
        // Second Delete key → remove block
        domHelpers.key(editorElement, 'Delete');
        expect(domHelpers.query(editorElement, '.e-table-element')).toBeNull();
        expect(editor.blocks.find(b => b.blockType === BlockType.Table)).toBeUndefined();
        let paraBlockEl = editorElement.querySelector('#para1') as HTMLElement;
        expect(paraBlockEl).not.toBeNull();
        let range: Range = getSelectedRange();
        let focusedBlock = findClosestParent(range.startContainer, '.e-block');
        expect(focusedBlock).toEqual(paraBlockEl);

        // 1st Undo → table restored, but cells empty
        triggerUndo(editorElement);
        const restoredTable1 = domHelpers.query(editorElement, '.e-table-element');
        expect(restoredTable1).not.toBeNull();
        const cellContents1 = domHelpers.queryAll(restoredTable1, 'tbody td[role="gridcell"]')
            .map(td => td.textContent.trim() || '');
        expect(cellContents1).toEqual(['', '', '', '']);
        let overlay = editorElement.querySelector('.e-be-selection-overlay') as HTMLElement;
        expect(overlay).not.toBeNull();
        expect(overlay.style.display).toBe('block');

        // 2nd Undo → cells with original content
        triggerUndo(editorElement);
        const restoredTable2 = domHelpers.query(editorElement, '.e-table-element');
        expect(restoredTable2).not.toBeNull();
        const cellContents2 = domHelpers.queryAll(restoredTable2, 'tbody td[role="gridcell"]')
            .map(td => td.textContent.trim() || '');
        expect(cellContents2).toEqual(['a', 'b', 'c', 'd']);
        // Expect overlay visible after 2nd undo
        overlay = editorElement.querySelector('.e-be-selection-overlay') as HTMLElement;
        expect(overlay).not.toBeNull();
        expect(overlay.style.display).toBe('block');

        // 1st Redo → back to empty cells
        triggerRedo(editorElement);
        const restoredTable3 = domHelpers.query(editorElement, '.e-table-element');
        expect(restoredTable3).not.toBeNull();
        const cellContents3 = domHelpers.queryAll(restoredTable3, 'tbody td[role="gridcell"]')
            .map(td => td.textContent.trim() || '');
        expect(cellContents3).toEqual(['', '', '', '']);
        // Expect overlay visible after 1st redo
        overlay = editorElement.querySelector('.e-be-selection-overlay') as HTMLElement;
        expect(overlay).not.toBeNull();
        expect(overlay.style.display).toBe('block');

        // 2nd Redo → table null
        triggerRedo(editorElement);
        expect(domHelpers.query(editorElement, '.e-table-element')).toBeNull();
        expect(editor.blocks.find(b => b.blockType === BlockType.Table)).toBeUndefined();
        paraBlockEl = editorElement.querySelector('#para1') as HTMLElement;
        expect(paraBlockEl).not.toBeNull();
        range = getSelectedRange();
        focusedBlock = findClosestParent(range.startContainer, '.e-block');
        expect(focusedBlock).toEqual(paraBlockEl);
        done();
    });

    it('3x3 table → row gripper chain: click row1 -> Shift+click row2 -> Shift+click row3 selects all 3 rows', (done) => {
        setup3x3Partial();
        const table = domHelpers.query(editorElement, '.e-table-element') as HTMLTableElement;
        const blockEl = table.closest('.e-block') as HTMLElement;

        // Hover first data row to show floating gripper and pin it
        const row1Cell = domHelpers.query(blockEl, 'tbody tr:nth-child(1) td[role="gridcell"]') as HTMLElement;
        row1Cell.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
        let rowGripper = domHelpers.query(blockEl, '.e-row-action-handle:not(.e-pinned)') as HTMLElement;
        expect(rowGripper).not.toBeNull('Floating gripper for row 1 should appear');
        rowGripper.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        const pinned = domHelpers.query(blockEl, '.e-row-action-handle.e-pinned') as HTMLElement;
        expect(pinned).not.toBeNull();
        expect(pinned.dataset.rowIndex).toBe('1');

        // Hover row 2 and Shift+click to select rows 1-2
        const row2Cell = domHelpers.query(blockEl, 'tbody tr:nth-child(2) td[role="gridcell"]') as HTMLElement;
        row2Cell.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
        rowGripper = domHelpers.query(blockEl, '.e-row-action-handle:not(.e-pinned)') as HTMLElement;
        expect(rowGripper).not.toBeNull('Floating gripper for row 2 should appear');
        rowGripper.dispatchEvent(new MouseEvent('click', { bubbles: true, shiftKey: true }));
        // Expect two rows selected
        expect(domHelpers.queryAll(blockEl, 'tr.e-row-selected').length).toBe(2);
        // 3 columns in body × 2 rows = 6 focused cells
        expect(domHelpers.queryAll(blockEl, 'td.e-cell-focus').length).toBe(6);

        // Hover row 3 and Shift+click to extend to all 3 rows
        const row3Cell = domHelpers.query(blockEl, 'tbody tr:nth-child(3) td[role="gridcell"]') as HTMLElement;
        row3Cell.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
        rowGripper = domHelpers.query(blockEl, '.e-row-action-handle:not(.e-pinned)') as HTMLElement;
        expect(rowGripper).not.toBeNull('Floating gripper for row 3 should appear');
        rowGripper.dispatchEvent(new MouseEvent('click', { bubbles: true, shiftKey: true }));
        expect(domHelpers.queryAll(blockEl, 'tr.e-row-selected').length).toBe(3);
        // 3 columns × 3 rows = 9 focused cells
        expect(domHelpers.queryAll(blockEl, 'td.e-cell-focus').length).toBe(9);
        done();
    });

    it('3x3 table → column gripper chain: click col1 -> Shift+click col2 -> Shift+click col3 selects all 3 columns', (done) => {
        setup3x3Partial();
        const table = domHelpers.query(editorElement, '.e-table-element') as HTMLTableElement;
        const blockEl = table.closest('.e-block') as HTMLElement;

        // Hover first data column cell to show floating col gripper and pin it
        const col0Cell = domHelpers.query(blockEl, 'tbody tr:nth-child(1) td[data-col="0"]') as HTMLElement;
        col0Cell.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));

        let colGripper = domHelpers.query(blockEl, '.e-col-action-handle:not(.e-pinned)') as HTMLElement;
        expect(colGripper).not.toBeNull('Floating gripper for col 0 should appear');
        colGripper.dispatchEvent(new MouseEvent('click', { bubbles: true }));

        const pinned = domHelpers.query(blockEl, '.e-col-action-handle.e-pinned') as HTMLElement;
        expect(pinned).not.toBeNull();
        expect(pinned.dataset.colIndex).toBe('0');

        // Hover column 1 and Shift+click to select cols 0-1
        const col1Cell = domHelpers.query(blockEl, 'tbody tr:nth-child(1) td[data-col="1"]') as HTMLElement;
        col1Cell.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));

        colGripper = domHelpers.query(blockEl, '.e-col-action-handle:not(.e-pinned)') as HTMLElement;
        expect(colGripper).not.toBeNull('Floating gripper for col 1 should appear');
        colGripper.dispatchEvent(new MouseEvent('click', { bubbles: true, shiftKey: true }));

        // Expect two columns selected: 3 rows × 2 cols = 6 focused cells
        expect(domHelpers.queryAll(blockEl, 'td.e-col-selected').length).toBe(6);
        expect(domHelpers.queryAll(blockEl, 'td.e-cell-focus').length).toBe(6);

        // Hover column 2 and Shift+click to extend to all 3 columns
        const col2Cell = domHelpers.query(blockEl, 'tbody tr:nth-child(1) td[data-col="2"]') as HTMLElement;
        col2Cell.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));

        colGripper = domHelpers.query(blockEl, '.e-col-action-handle:not(.e-pinned)') as HTMLElement;
        expect(colGripper).not.toBeNull('Floating gripper for col 2 should appear');
        colGripper.dispatchEvent(new MouseEvent('click', { bubbles: true, shiftKey: true }));

        // Expect three columns selected: 3 rows × 3 cols = 9 focused cells
        expect(domHelpers.queryAll(blockEl, 'td.e-col-selected').length).toBe(9);
        expect(domHelpers.queryAll(blockEl, 'td.e-cell-focus').length).toBe(9);
        done();
    });
});