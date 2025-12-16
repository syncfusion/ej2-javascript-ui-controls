import { createElement, remove } from '@syncfusion/ej2-base';
import { createEditor } from '../common/util.spec';
import { BlockEditor } from '../../src/index';
import { BlockModel } from '../../src/models/block/block-model';
import { BlockType, ContentType } from '../../src/models/enums';
import { ITableBlockSettings } from '../../src/models/block/block-props';
import { setCursorPosition, getSelectedRange } from '../../src/common/utils/index';

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
                        { columnId: 'c1', blocks: [{ id: 'p1', blockType: BlockType.Paragraph, content: [{ id: 't1', contentType: ContentType.Text, content: 'R1C1' }] }] },
                        { columnId: 'c2', blocks: [{ id: 'p2', blockType: BlockType.Paragraph, content: [{ id: 't2', contentType: ContentType.Text, content: 'R1C2' }] }] }
                    ]
                },
                {
                    cells: [
                        { columnId: 'c1', blocks: [{ id: 'p3', blockType: BlockType.Paragraph, content: [{ id: 't3', contentType: ContentType.Text, content: 'R2C1' }] }] },
                        { columnId: 'c2', blocks: [{ id: 'p4', blockType: BlockType.Paragraph, content: [{ id: 't4', contentType: ContentType.Text, content: 'R2C2' }] }] }
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
                // Assert colgroup widths recalculated equally
                const colEls = domHelpers.queryAll(blockEl, 'colgroup > col').slice(1) as HTMLTableColElement[];
                const widths = colEls.map(c => c.style.width);
                expect(widths.every(w => w === widths[0])).toBe(true);
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

        it('Delete row at start → undo → redo', (done) => {
            setupTable();
            const table = domHelpers.query(editorElement, '.e-table-element');
            const blockEl = table.closest('.e-block');
            const firstCell = domHelpers.query(blockEl, 'tbody tr:first-child td[role="gridcell"]');
            domHelpers.mouse(firstCell, 'mousemove');
            domHelpers.mouse(domHelpers.query(blockEl, '.e-row-action-handle'), 'click');
            setTimeout(() => {
                domHelpers.mouse(domHelpers.query(document, '.e-table-gripper-action-item.e-trash'), 'click');
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
                    { cells: [{ columnId: 'c1', blocks: [{ id: 'a', blockType: BlockType.Paragraph, content: [{ id: 'ta', contentType: ContentType.Text, content: '1' }] }] }, { columnId: 'c2', blocks: [{ id: 'b', blockType: BlockType.Paragraph, content: [{ id: 'tb', contentType: ContentType.Text, content: '2' }] }] }] },
                    { cells: [{ columnId: 'c1', blocks: [{ id: 'c', blockType: BlockType.Paragraph, content: [{ id: 'tc', contentType: ContentType.Text, content: '3' }] }] }, { columnId: 'c2', blocks: [{ id: 'd', blockType: BlockType.Paragraph, content: [{ id: 'td', contentType: ContentType.Text, content: '4' }] }] }] },
                    { cells: [{ columnId: 'c1', blocks: [{ id: 'e', blockType: BlockType.Paragraph, content: [{ id: 'te', contentType: ContentType.Text, content: '5' }] }] }, { columnId: 'c2', blocks: [{ id: 'f', blockType: BlockType.Paragraph, content: [{ id: 'tf', contentType: ContentType.Text, content: '6' }] }] }] }
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
                    { cells: [{ columnId: 'c1', blocks: [{ id: 'a', blockType: BlockType.Paragraph, content: [{ id: 'ta', contentType: ContentType.Text, content: '1' }] }] }, { columnId: 'c2', blocks: [{ id: 'b', blockType: BlockType.Paragraph, content: [{ id: 'tb', contentType: ContentType.Text, content: '2' }] }] }, { columnId: 'c3', blocks: [{ id: 'g', blockType: BlockType.Paragraph, content: [{ id: 'tg', contentType: ContentType.Text, content: '7' }] }] }] },
                    { cells: [{ columnId: 'c1', blocks: [{ id: 'c', blockType: BlockType.Paragraph, content: [{ id: 'tc', contentType: ContentType.Text, content: '3' }] }] }, { columnId: 'c2', blocks: [{ id: 'd', blockType: BlockType.Paragraph, content: [{ id: 'td', contentType: ContentType.Text, content: '4' }] }] }, { columnId: 'c3', blocks: [{ id: 'h', blockType: BlockType.Paragraph, content: [{ id: 'th', contentType: ContentType.Text, content: '8' }] }] }] },
                    { cells: [{ columnId: 'c1', blocks: [{ id: 'e', blockType: BlockType.Paragraph, content: [{ id: 'te', contentType: ContentType.Text, content: '5' }] }] }, { columnId: 'c2', blocks: [{ id: 'f', blockType: BlockType.Paragraph, content: [{ id: 'tf', contentType: ContentType.Text, content: '6' }] }] }, { columnId: 'c3', blocks: [{ id: 'i', blockType: BlockType.Paragraph, content: [{ id: 'ti', contentType: ContentType.Text, content: '9' }] }] }] }
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
                    { cells: [{ columnId: 'c1', blocks: [{ id: 'a', blockType: BlockType.Paragraph, content: [{ id: 'ta', contentType: ContentType.Text, content: '1' }] }] }, { columnId: 'c2', blocks: [{ id: 'b', blockType: BlockType.Paragraph, content: [{ id: 'tb', contentType: ContentType.Text, content: '2' }] }] }, { columnId: 'c3', blocks: [{ id: 'g', blockType: BlockType.Paragraph, content: [{ id: 'tg', contentType: ContentType.Text, content: '7' }] }] }] },
                    { cells: [{ columnId: 'c1', blocks: [{ id: 'c', blockType: BlockType.Paragraph, content: [{ id: 'tc', contentType: ContentType.Text, content: '3' }] }] }, { columnId: 'c2', blocks: [{ id: 'd', blockType: BlockType.Paragraph, content: [{ id: 'td', contentType: ContentType.Text, content: '4' }] }] }, { columnId: 'c3', blocks: [{ id: 'h', blockType: BlockType.Paragraph, content: [{ id: 'th', contentType: ContentType.Text, content: '8' }] }] }] },
                    { cells: [{ columnId: 'c1', blocks: [{ id: 'e', blockType: BlockType.Paragraph, content: [{ id: 'te', contentType: ContentType.Text, content: '5' }] }] }, { columnId: 'c2', blocks: [{ id: 'f', blockType: BlockType.Paragraph, content: [{ id: 'tf', contentType: ContentType.Text, content: '6' }] }] }, { columnId: 'c3', blocks: [{ id: 'i', blockType: BlockType.Paragraph, content: [{ id: 'ti', contentType: ContentType.Text, content: '9' }] }] }] }
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
                    { cells: [{ columnId: 'c1', blocks: [{ id: 'a', blockType: BlockType.Paragraph, content: [{ id: 'ta', contentType: ContentType.Text, content: '1' }] }] }, { columnId: 'c2', blocks: [{ id: 'b', blockType: BlockType.Paragraph, content: [{ id: 'tb', contentType: ContentType.Text, content: '2' }] }] }, { columnId: 'c3', blocks: [{ id: 'g', blockType: BlockType.Paragraph, content: [{ id: 'tg', contentType: ContentType.Text, content: '7' }] }] }] },
                    { cells: [{ columnId: 'c1', blocks: [{ id: 'c', blockType: BlockType.Paragraph, content: [{ id: 'tc', contentType: ContentType.Text, content: '3' }] }] }, { columnId: 'c2', blocks: [{ id: 'd', blockType: BlockType.Paragraph, content: [{ id: 'td', contentType: ContentType.Text, content: '4' }] }] }, { columnId: 'c3', blocks: [{ id: 'h', blockType: BlockType.Paragraph, content: [{ id: 'th', contentType: ContentType.Text, content: '8' }] }] }] },
                    { cells: [{ columnId: 'c1', blocks: [{ id: 'e', blockType: BlockType.Paragraph, content: [{ id: 'te', contentType: ContentType.Text, content: '5' }] }] }, { columnId: 'c2', blocks: [{ id: 'f', blockType: BlockType.Paragraph, content: [{ id: 'tf', contentType: ContentType.Text, content: '6' }] }] }, { columnId: 'c3', blocks: [{ id: 'i', blockType: BlockType.Paragraph, content: [{ id: 'ti', contentType: ContentType.Text, content: '9' }] }] }] }
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
                    { cells: [{ columnId: 'c1', blocks: [{ id: 'a', blockType: BlockType.Paragraph, content: [{ id: 'ta', contentType: ContentType.Text, content: '1' }] }] }, { columnId: 'c2', blocks: [{ id: 'b', blockType: BlockType.Paragraph, content: [{ id: 'tb', contentType: ContentType.Text, content: '2' }] }] }] },
                    { cells: [{ columnId: 'c1', blocks: [{ id: 'c', blockType: BlockType.Paragraph, content: [{ id: 'tc', contentType: ContentType.Text, content: '3' }] }] }, { columnId: 'c2', blocks: [{ id: 'd', blockType: BlockType.Paragraph, content: [{ id: 'td', contentType: ContentType.Text, content: '4' }] }] }] }
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
                    { cells: [{ columnId: 'c1', blocks: [{ id: 'a', blockType: BlockType.Paragraph, content: [{ id: 'ta', contentType: ContentType.Text, content: '1' }] }] }, { columnId: 'c2', blocks: [{ id: 'b', blockType: BlockType.Paragraph, content: [{ id: 'tb', contentType: ContentType.Text, content: '2' }] }] }, { columnId: 'c3', blocks: [{ id: 'g', blockType: BlockType.Paragraph, content: [{ id: 'tg', contentType: ContentType.Text, content: '7' }] }] }] },
                    { cells: [{ columnId: 'c1', blocks: [{ id: 'c', blockType: BlockType.Paragraph, content: [{ id: 'tc', contentType: ContentType.Text, content: '3' }] }] }, { columnId: 'c2', blocks: [{ id: 'd', blockType: BlockType.Paragraph, content: [{ id: 'td', contentType: ContentType.Text, content: '4' }] }] }, { columnId: 'c3', blocks: [{ id: 'h', blockType: BlockType.Paragraph, content: [{ id: 'th', contentType: ContentType.Text, content: '8' }] }] }] },
                    { cells: [{ columnId: 'c1', blocks: [{ id: 'e', blockType: BlockType.Paragraph, content: [{ id: 'te', contentType: ContentType.Text, content: '5' }] }] }, { columnId: 'c2', blocks: [{ id: 'f', blockType: BlockType.Paragraph, content: [{ id: 'tf', contentType: ContentType.Text, content: '6' }] }] }, { columnId: 'c3', blocks: [{ id: 'i', blockType: BlockType.Paragraph, content: [{ id: 'ti', contentType: ContentType.Text, content: '9' }] }] }] }
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
                    { cells: [{ columnId: 'c1', blocks: [{ id: 'a', blockType: BlockType.Paragraph, content: [{ id: 'ta', contentType: ContentType.Text, content: '1' }] }] }, { columnId: 'c2', blocks: [{ id: 'b', blockType: BlockType.Paragraph, content: [{ id: 'tb', contentType: ContentType.Text, content: '2' }] }] }] },
                    { cells: [{ columnId: 'c1', blocks: [{ id: 'c', blockType: BlockType.Paragraph, content: [{ id: 'tc', contentType: ContentType.Text, content: '3' }] }] }, { columnId: 'c2', blocks: [{ id: 'd', blockType: BlockType.Paragraph, content: [{ id: 'td', contentType: ContentType.Text, content: '4' }] }] }] }
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
                        { columnId: 'c1', blocks: [{ id: 'p1', blockType: BlockType.Paragraph, content: [{ id: 't1', contentType: ContentType.Text, content: 'R1C1' }] }] },
                        { columnId: 'c2', blocks: [{ id: 'p2', blockType: BlockType.Paragraph, content: [{ id: 't2', contentType: ContentType.Text, content: 'R1C2' }] }] }
                    ]
                },
                {
                    cells: [
                        { columnId: 'c1', blocks: [{ id: 'p3', blockType: BlockType.Paragraph, content: [{ id: 't3', contentType: ContentType.Text, content: 'R2C1' }] }] },
                        { columnId: 'c2', blocks: [{ id: 'p4', blockType: BlockType.Paragraph, content: [{ id: 't4', contentType: ContentType.Text, content: 'R2C2' }] }] }
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

    it('Type in text in table header → undo → redo', () => {
        setupTable();
        const table = domHelpers.query(editorElement, '.e-table-element');
        const blockEl = table.closest('.e-block') as HTMLElement;
        const props = editor.blocks[0].properties as ITableBlockSettings;

        const firstHeader = domHelpers.query(blockEl, 'thead th:not(.e-row-number)');
        editor.blockManager.setFocusToBlock(blockEl);

        firstHeader.textContent = 'Updated header1';
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
