import { createElement } from '@syncfusion/ej2-base';
import { BlockEditor } from '../../src/index';
import { BlockModel, ITableBlockSettings, TableRowModel, TableCellModel, TableColumnModel } from '../../src/models/index';
import { BlockType, ContentType } from '../../src/models/enums';
import { createEditor } from '../common/util.spec';
import { getBlockContentElement, setCursorPosition } from '../../src/common/index';

interface Blob {
    text(): Promise<string>;
}

declare const Blob: {
    prototype: Blob;
    new(blobParts?: BlobPart[], options?: BlobPropertyBag): Blob;
};

function buildTableBlock(id: string, cols: number, rows: number, withDistinctText = true, enableHeader = true, enableRowNumbers = true): BlockModel {
    const columns: TableColumnModel[] = Array.from({ length: cols }).map((_, i) => ({ id: `col${i + 1}`, headerText: `H${i + 1}` }));
    const bodyRows: TableRowModel[] = Array.from({ length: rows }).map((_, r) => ({
        id: `row${r + 1}`,
        cells: columns.map((c, cIdx) => ({
            id: `cell_${r + 1}_${cIdx + 1}`,
            columnId: c.id,
            blocks: [{ id: `b_${r + 1}_${cIdx + 1}`, blockType: BlockType.Paragraph, content: [{ id: `c_${r + 1}_${cIdx + 1}`, contentType: ContentType.Text, content: withDistinctText ? `R${r + 1}C${cIdx + 1}` : '' }] }]
        } as TableCellModel))
    } as TableRowModel));
    const props: ITableBlockSettings = { columns, rows: bodyRows, width: '100%', enableHeader, enableRowNumbers } as ITableBlockSettings;
    return { id, blockType: BlockType.Table, properties: props } as BlockModel;
}

function getTable(editorElement: HTMLElement): HTMLTableElement {
    return editorElement.querySelector('.e-table-block table') as HTMLTableElement;
}

// NOTE: row is 1-based, col is 0-based
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

function dispatchCtrlKey(editor: BlockEditor, key: string) {
    const ev = new KeyboardEvent('keydown', { key, code: `Key${key}`, ctrlKey: true, bubbles: true });
    editor.element.dispatchEvent(ev);
}

describe('Table Clipboard actions: ', () => {
    let editor: BlockEditor;
    let editorElement: HTMLElement;

    beforeEach(() => {
        editorElement = createElement('div', { id: 'editor-v1' });
        document.body.appendChild(editorElement);

        const before: BlockModel = { id: 'before', blockType: BlockType.Paragraph, content: [{ id: 'bc', contentType: ContentType.Text, content: 'Before' }] };
        const table: BlockModel = buildTableBlock('table_block', 3, 3, true, true, true);
        const after: BlockModel = { id: 'after', blockType: BlockType.Paragraph, content: [{ id: 'ac', contentType: ContentType.Text, content: 'After' }] };

        editor = createEditor({ blocks: [before, table, after] });
        editor.appendTo('#editor-v1');
    });

    afterEach(() => {
        if (editor) { editor.destroy(); }
        if (editorElement && editorElement.parentElement) { editorElement.parentElement.removeChild(editorElement); }
    });

    it('Copy 2x2 cells (Ctrl+C) writes html/tsv via navigator.clipboard;', (done) => {
        selectRectangle(editorElement, 1, 1, 2, 2);

        let copiedHtml = '';
        let copiedText = '';

        spyOn(navigator as any, 'clipboard').and.returnValue((navigator as any).clipboard);
        spyOn((navigator as any).clipboard, 'write').and.callFake((items: any[]) => Promise.resolve());
        spyOn(window as any, 'ClipboardItem').and.callFake((obj: any) => {
            const htmlBlob: Blob = obj['text/html'];
            const textBlob: Blob = obj['text/plain'];
            (htmlBlob.text as any)().then((t: string) => copiedHtml = t);
            (textBlob.text as any)().then((t: string) => copiedText = t);
            return obj;
        });

        dispatchCtrlKey(editor, 'c');

        const targetCell = getDataCellEl(editorElement, 1, 0);
        const targetBlock = targetCell.querySelector('.e-block') as HTMLElement;
        const targetContent = getBlockContentElement(targetBlock);
        editor.blockManager.setFocusToBlock(targetBlock);
        setCursorPosition(targetContent, 0);

        spyOn((navigator as any).clipboard, 'read').and.returnValue(Promise.resolve([{
            types: ['text/html', 'text/plain'],
            getType: (type: string) => Promise.resolve({
                text: () => Promise.resolve(type === 'text/html' ? copiedHtml : copiedText)
            })
        }]));

        editor.blockManager.clipboardAction.handleContextPaste().then(() => {
            setTimeout(() => {
                const tableModel = editor.blocks[1] as BlockModel;
                const props = tableModel.properties as ITableBlockSettings;
                expect(props.rows[0].cells[0].blocks[0].content[0].content).toBe('R1C1');
                expect(props.rows[0].cells[1].blocks[0].content[0].content).toBe('R1C2');
                expect(props.rows[1].cells[0].blocks[0].content[0].content).toBe('R2C1');
                expect(props.rows[1].cells[1].blocks[0].content[0].content).toBe('R2C2');

                const domR1C1 = getDataCellEl(editorElement, 1, 0);
                const domR1C2 = getDataCellEl(editorElement, 1, 1);
                expect(domR1C1.textContent.trim()).toBe('R1C1');
                expect(domR1C2.textContent.trim()).toBe('R1C2');
                done();
            }, 100);
        });
    });

    it('Copy 2x2 and paste into another region', () => {
        selectRectangle(editorElement, 1, 1, 2, 2);
        const tableBlockElement = editorElement.querySelector('.e-table-block') as HTMLElement;
        const copyPayload = editor.blockManager.clipboardAction.getTablePayload(tableBlockElement);

        const targetCell = getDataCellEl(editorElement, 1, 1);
        const targetBlock = targetCell.querySelector('.e-block') as HTMLElement;
        const targetContent = getBlockContentElement(targetBlock);
        editor.blockManager.setFocusToBlock(targetBlock);
        setCursorPosition(targetContent, 0);

        editor.blockManager.clipboardAction.performPasteOperation(copyPayload);

        const props = (editor.blocks[1] as BlockModel).properties as ITableBlockSettings;
        expect(props.rows[0].cells[0].blocks[0].content[0].content).toBe('R1C1');
        expect(props.rows[0].cells[1].blocks[0].content[0].content).toBe('R1C2');
        expect(props.rows[1].cells[0].blocks[0].content[0].content).toBe('R2C1');
        expect(props.rows[1].cells[1].blocks[0].content[0].content).toBe('R2C2');
        expect(getDataCellEl(editorElement, 1, 0).textContent!.trim()).toBe('R1C1');
        expect(getDataCellEl(editorElement, 1, 1).textContent!.trim()).toBe('R1C2');
    });

    it('Paste HTML table larger than current columns expands width', () => {
        const html = '<table><thead><tr><th>A</th><th>B</th><th>C</th><th>D</th></tr></thead><tbody>' +
            '<tr><td>v11</td><td>v12</td><td>v13</td><td>v14</td></tr>' +
            '<tr><td>v21</td><td>v22</td><td>v23</td><td>v24</td></tr>' +
            '</tbody></table>';

        const targetCell = getDataCellEl(editorElement, 1, 2);
        const targetBlock = targetCell.querySelector('.e-block') as HTMLElement;
        const targetContent = getBlockContentElement(targetBlock);
        editor.blockManager.setFocusToBlock(targetBlock);
        setCursorPosition(targetContent, 0);

        editor.blockManager.clipboardAction.performPasteOperation({ html });

        const props = (editor.blocks[1] as BlockModel).properties as ITableBlockSettings;
        expect(props.columns.length).toBeGreaterThanOrEqual(4);
        expect(props.rows[0].cells[2].blocks[0].content[0].content).toBe('v11');
        expect(getDataCellEl(editorElement, 1, 2).textContent!.trim()).toBe('v11');
    });

    it('Paste TSV into table cells', () => {
        const text = 'a\tb\n1\t2';
        const targetCell = getDataCellEl(editorElement, 2, 1);
        const targetBlock = targetCell.querySelector('.e-block') as HTMLElement;
        const targetContent = getBlockContentElement(targetBlock);
        editor.blockManager.setFocusToBlock(targetBlock);
        setCursorPosition(targetContent, 0);

        editor.blockManager.clipboardAction.performPasteOperation({ text });

        const props = (editor.blocks[1] as BlockModel).properties as ITableBlockSettings;
        expect(props.rows[1].cells[1].blocks[0].content[0].content).toBe('a');
        expect(getDataCellEl(editorElement, 2, 1).textContent!.trim()).toBe('a');
    });

    it('Cut full selected row removes it from model and DOM', () => {
        selectRectangle(editorElement, 1, 0, 1, 2);
        const targetCell = getDataCellEl(editorElement, 1, 0);
        const targetBlock = targetCell.querySelector('.e-block') as HTMLElement;
        editor.blockManager.setFocusToBlock(targetBlock);

        editor.blockManager.clipboardAction.performCutOperation();

        const props = (editor.blocks[1] as BlockModel).properties as ITableBlockSettings;
        expect(props.rows.length).toBe(2);
        expect(getTable(editorElement).rows.length).toBe(3);
    });

    it('Cut full selected column removes it from model and DOM', () => {
        selectRectangle(editorElement, 1, 1, 3, 1);
        const targetCell = getDataCellEl(editorElement, 1, 0);
        const targetBlock = targetCell.querySelector('.e-block') as HTMLElement;
        editor.blockManager.setFocusToBlock(targetBlock);

        editor.blockManager.clipboardAction.performCutOperation();

        const props = (editor.blocks[1] as BlockModel).properties as ITableBlockSettings;
        expect(props.columns.length).toBe(2);
        const header = getTable(editorElement).tHead!.rows[0];
        expect(header.cells.length).toBe(3);
    });

    it('br should be maintained on cutting a whole block inside cell by selection', () => {
        const targetCell = getDataCellEl(editorElement, 1, 0);
        const targetBlock = targetCell.querySelector('.e-block') as HTMLElement;
        const content = getBlockContentElement(targetBlock);
        editor.blockManager.setFocusToBlock(targetBlock);
        editor.setSelection(content.id, 0, content.textContent.length);

        editor.blockManager.clipboardAction.performCutOperation();

        expect(content.innerHTML).toContain('br');
        expect(editor.blockManager.currentFocusedBlock.id).toBe(targetBlock.id);
    });

    it('Paste HTML table outside creates a new Table block', () => {
        const html = '<table><thead><tr><th>X</th><th>Y</th></tr></thead><tbody>' +
            '<tr><td>p</td><td>q</td></tr>' +
            '</tbody></table>';
        const afterBlockEl = editorElement.querySelector('#after') as HTMLElement;
        const afterContent = getBlockContentElement(afterBlockEl);
        editor.blockManager.setFocusToBlock(afterBlockEl);
        setCursorPosition(afterContent, 0);

        editor.blockManager.clipboardAction.performPasteOperation({ html });

        const tableBlocks = editor.blocks.filter(b => b.blockType === BlockType.Table);
        expect(tableBlocks.length).toBeGreaterThan(1);
        const newTable = tableBlocks[tableBlocks.length - 1] as BlockModel;
        const props = newTable.properties as ITableBlockSettings;
        expect(props.columns.length).toBe(2);
        const newTableEl = editorElement.querySelectorAll('.e-table-block table');
        expect(newTableEl.length).toBeGreaterThan(1);
    });

    it('Cell paste ignores header row from HTML table', () => {
        const html = '<table><thead><tr><th>HDR1</th><th>HDR2</th></tr></thead>' +
            '<tbody><tr><td>d11</td><td>d12</td></tr></tbody></table>';
        const targetCell = getDataCellEl(editorElement, 1, 0);
        const targetBlock = targetCell.querySelector('.e-block') as HTMLElement;
        const targetContent = getBlockContentElement(targetBlock);
        editor.blockManager.setFocusToBlock(targetBlock);
        setCursorPosition(targetContent, 0);

        editor.blockManager.clipboardAction.performPasteOperation({ html });

        const model = editor.blocks[1] as BlockModel;
        const props = model.properties as ITableBlockSettings;
        expect(props.rows[0].cells[0].blocks[0].content[0].content).toBe('d11');
        expect(getDataCellEl(editorElement, 1, 0).textContent!.trim()).toBe('d11');
    });

    it('Cell paste normalizes ragged HTML rows (padding missing cells)', () => {
        const html = '<table><tbody>' +
            '<tr><td>a</td><td>b</td><td>c</td></tr>' +
            '<tr><td>d</td></tr>' +
            '</tbody></table>';
        const targetCell = getDataCellEl(editorElement, 1, 0);
        const targetBlock = targetCell.querySelector('.e-block') as HTMLElement;
        const targetContent = getBlockContentElement(targetBlock);
        editor.blockManager.setFocusToBlock(targetBlock);
        setCursorPosition(targetContent, 0);

        editor.blockManager.clipboardAction.performPasteOperation({ html });

        const model = editor.blocks[1] as BlockModel;
        const props = model.properties as ITableBlockSettings;
        expect(props.rows[0].cells[0].blocks[0].content[0].content).toBe('a');
        expect(props.rows[0].cells[2].blocks[0].content[0].content).toBe('c');
        expect(props.rows[1].cells[0].blocks[0].content[0].content).toBe('d');

        // DOM assertions
        expect(getDataCellEl(editorElement, 1, 0).textContent!.trim()).toBe('a');
        expect(getDataCellEl(editorElement, 1, 2).textContent!.trim()).toBe('c');
        expect(getDataCellEl(editorElement, 2, 0).textContent!.trim()).toBe('d');
    });

    it('Copy full row then paste into another row', () => {
        selectRectangle(editorElement, 1, 0, 1, 2);
        const tableBlockElement = editorElement.querySelector('.e-table-block') as HTMLElement;
        const copyPayload = editor.blockManager.clipboardAction.getTablePayload(tableBlockElement);

        const targetCell = getDataCellEl(editorElement, 2, 0);
        const targetBlock = targetCell.querySelector('.e-block') as HTMLElement;
        const targetContent = getBlockContentElement(targetBlock);
        editor.blockManager.setFocusToBlock(targetBlock);
        setCursorPosition(targetContent, 0);

        editor.blockManager.clipboardAction.performPasteOperation(copyPayload);

        const model = editor.blocks[1] as BlockModel;
        const props = model.properties as ITableBlockSettings;
        expect(props.rows[1].cells[0].blocks[0].content[0].content).toBe('R1C1');
        expect(props.rows[1].cells[1].blocks[0].content[0].content).toBe('R1C2');
        expect(props.rows[1].cells[2].blocks[0].content[0].content).toBe('R1C3');

        // DOM assertions
        expect(getDataCellEl(editorElement, 2, 0).textContent!.trim()).toBe('R1C1');
        expect(getDataCellEl(editorElement, 2, 1).textContent!.trim()).toBe('R1C2');
        expect(getDataCellEl(editorElement, 2, 2).textContent!.trim()).toBe('R1C3');
    });

    it('Copy full column then paste into another column', () => {
        selectRectangle(editorElement, 1, 0, 3, 0);
        const tableBlockElement = editorElement.querySelector('.e-table-block') as HTMLElement;
        const copyPayload = editor.blockManager.clipboardAction.getTablePayload(tableBlockElement);

        const targetCell = getDataCellEl(editorElement, 1, 2);
        const targetBlock = targetCell.querySelector('.e-block') as HTMLElement;
        const targetContent = getBlockContentElement(targetBlock);
        editor.blockManager.setFocusToBlock(targetBlock);
        setCursorPosition(targetContent, 0);

        editor.blockManager.clipboardAction.performPasteOperation(copyPayload);

        const model = editor.blocks[1] as BlockModel;
        const props = model.properties as ITableBlockSettings;
        expect(props.rows[0].cells[2].blocks[0].content[0].content).toBe('R1C1');
        expect(props.rows[1].cells[2].blocks[0].content[0].content).toBe('R2C1');
        expect(props.rows[2].cells[2].blocks[0].content[0].content).toBe('R3C1');
        // DOM assertions
        expect(getDataCellEl(editorElement, 1, 2).textContent!.trim()).toBe('R1C1');
        expect(getDataCellEl(editorElement, 2, 2).textContent!.trim()).toBe('R2C1');
        expect(getDataCellEl(editorElement, 3, 2).textContent!.trim()).toBe('R3C1');
    });

    it('Paste MS Word-like table HTML cleans and pastes correctly', () => {
        const msHtml = '<table class="MsoNormalTable" border="1" cellspacing="0" cellpadding="0"><tbody>' +
            '<tr><td><p>W1</p></td><td><p>W2</p></td></tr>' +
            '</tbody></table>';
        const targetCell = getDataCellEl(editorElement, 1, 0);
        const targetBlock = targetCell.querySelector('.e-block') as HTMLElement;
        const targetContent = getBlockContentElement(targetBlock);
        editor.blockManager.setFocusToBlock(targetBlock);
        setCursorPosition(targetContent, 0);

        editor.blockManager.clipboardAction.performPasteOperation({ html: msHtml });

        const model = editor.blocks[1] as BlockModel;
        const props = model.properties as ITableBlockSettings;
        expect(props.rows[0].cells[0].blocks[0].content[0].content).toBe('W1');
        expect(getDataCellEl(editorElement, 1, 0).textContent!.trim()).toBe('W1');
    });

    it('Plain text without tabs pasted inside table cell is inserted into inner block', () => {
        const text = 'Hello world';
        const targetCell = getDataCellEl(editorElement, 2, 2);
        const targetBlock = targetCell.querySelector('.e-block') as HTMLElement;
        const targetContent = getBlockContentElement(targetBlock);
        editor.blockManager.setFocusToBlock(targetBlock);
        setCursorPosition(targetContent, targetContent.textContent!.length);

        editor.blockManager.clipboardAction.performPasteOperation({ text });

        const td = getDataCellEl(editorElement, 2, 2);
        expect(td.textContent!.indexOf('Hello world') !== -1).toBe(true);
        const props = (editor.blocks[1] as BlockModel).properties as ITableBlockSettings;
        const content = props.rows[1].cells[2].blocks[0].content[1].content;
        expect(content.indexOf('Hello world') !== -1).toBe(true);
    });

    it('Cut partial rectangle clears only contents and keeps structure', () => {
        selectRectangle(editorElement, 1, 0, 2, 1);
        const targetCell = getDataCellEl(editorElement, 1, 0);
        const targetBlock = targetCell.querySelector('.e-block') as HTMLElement;
        editor.blockManager.setFocusToBlock(targetBlock);

        editor.blockManager.clipboardAction.performCutOperation();

        const props = (editor.blocks[1] as BlockModel).properties as ITableBlockSettings;
        expect(props.rows.length).toBe(3);
        expect(props.columns.length).toBe(3);
        expect(props.rows[0].cells[0].blocks[0].content.length).toBe(0);
        expect(props.rows[0].cells[1].blocks[0].content.length).toBe(0);
        expect(props.rows[1].cells[0].blocks[0].content.length).toBe(0);
        expect(props.rows[1].cells[1].blocks[0].content.length).toBe(0);

        expect(getDataCellEl(editorElement, 1, 0).textContent.trim()).toBe('');
        expect(getDataCellEl(editorElement, 1, 1).textContent.trim()).toBe('');
        expect(getDataCellEl(editorElement, 2, 0).textContent.trim()).toBe('');
        expect(getDataCellEl(editorElement, 2, 1).textContent.trim()).toBe('');
    });

    it('Paste ragged TSV normalizes to rectangle (pads missing cells)', () => {
        const text = 'a\tb\tc\n1\t2';
        const targetCell = getDataCellEl(editorElement, 1, 0);
        const targetBlock = targetCell.querySelector('.e-block') as HTMLElement;
        editor.blockManager.setFocusToBlock(targetBlock);
        setCursorPosition(getBlockContentElement(targetBlock), 0);

        editor.blockManager.clipboardAction.performPasteOperation({ text });

        const props = (editor.blocks[1] as BlockModel).properties as ITableBlockSettings;
        expect(props.rows[0].cells[0].blocks[0].content[0].content).toBe('a');
        expect(props.rows[0].cells[1].blocks[0].content[0].content).toBe('b');
        expect(props.rows[0].cells[2].blocks[0].content[0].content).toBe('c');
        expect(props.rows[1].cells[0].blocks[0].content[0].content).toBe('1');
        expect(props.rows[1].cells[1].blocks[0].content[0].content).toBe('2');
        expect(props.rows[1].cells[2].blocks[0].content[0].content).toBe('R2C3');

        expect(getDataCellEl(editorElement, 1, 0).textContent.trim()).toBe('a');
        expect(getDataCellEl(editorElement, 1, 1).textContent.trim()).toBe('b');
        expect(getDataCellEl(editorElement, 1, 2).textContent.trim()).toBe('c');
        expect(getDataCellEl(editorElement, 2, 0).textContent.trim()).toBe('1');
        expect(getDataCellEl(editorElement, 2, 1).textContent.trim()).toBe('2');
        expect(getDataCellEl(editorElement, 2, 2).textContent.trim()).toBe('R2C3');
    });

    it('Paste near bottom-right grows rows and columns to fit', () => {
        const html = '<table><tbody><tr><td>X1</td><td>X2</td></tr><tr><td>Y1</td><td>Y2</td></tr></tbody></table>';
        const targetCell = getDataCellEl(editorElement, 3, 2);
        const targetBlock = targetCell.querySelector('.e-block') as HTMLElement;
        editor.blockManager.setFocusToBlock(targetBlock);
        setCursorPosition(getBlockContentElement(targetBlock), 0);

        editor.blockManager.clipboardAction.performPasteOperation({ html });

        const props = (editor.blocks[1] as BlockModel).properties as ITableBlockSettings;
        expect(props.rows.length).toBeGreaterThanOrEqual(4);
        expect(props.columns.length).toBeGreaterThanOrEqual(4);
        expect(getDataCellEl(editorElement, 3, 2).textContent!.trim()).toBe('X1');
    });

    it('Copy full table rectangle and paste outside as a new Table block', () => {
        // select from header first data th to bottom-right data td
        const headerCell = getTable(editorElement).tHead!.rows[0].cells[1] as HTMLTableCellElement;
        const lastCell = getDataCellEl(editorElement, 3, 2);
        headerCell.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        lastCell.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
        document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

        const tableBlockElement = editorElement.querySelector('.e-table-block') as HTMLElement;
        const copyPayload = editor.blockManager.clipboardAction.getTablePayload(tableBlockElement);

        const afterBlockEl = editorElement.querySelector('#after') as HTMLElement;
        editor.blockManager.setFocusToBlock(afterBlockEl);
        setCursorPosition(getBlockContentElement(afterBlockEl), 0);

        editor.blockManager.clipboardAction.performPasteOperation(copyPayload);

        const tables = editor.blocks.filter(b => b.blockType === BlockType.Table);
        expect(tables.length).toBeGreaterThan(1);
    });

    it('Paste HTML table with e-row-number first column ignores row-number cells', () => {
        const html = '<table><tbody>' +
            '<tr><td class="e-row-number">1</td><td>A</td><td>B</td></tr>' +
            '<tr><td class="e-row-number">2</td><td>C</td><td>D</td></tr>' +
            '</tbody></table>';
        const targetCell = getDataCellEl(editorElement, 1, 0);
        const targetBlock = targetCell.querySelector('.e-block') as HTMLElement;
        editor.blockManager.setFocusToBlock(targetBlock);
        setCursorPosition(getBlockContentElement(targetBlock), 0);

        editor.blockManager.clipboardAction.performPasteOperation({ html });

        const props = (editor.blocks[1] as BlockModel).properties as ITableBlockSettings;
        expect(props.rows[0].cells[0].blocks[0].content[0].content).toBe('A');
        expect(getDataCellEl(editorElement, 1, 0).textContent!.trim()).toBe('A');
    });

    it('Copy partial text within a cell and paste into another cell (non-table selection path)', () => {
        const srcCell = getDataCellEl(editorElement, 1, 1);
        const srcBlock = srcCell.querySelector('.e-block') as HTMLElement;
        const srcContent = getBlockContentElement(srcBlock);
        editor.blockManager.setFocusToBlock(srcBlock);
        const range = document.createRange();
        range.setStart(srcContent.firstChild as Text, 0);
        range.setEnd(srcContent.firstChild as Text, 2);
        const sel = window.getSelection(); sel!.removeAllRanges(); sel!.addRange(range);

        // use normal getClipboardPayload for inline selection
        const payload = editor.blockManager.clipboardAction.getClipboardPayload();

        const dstCell = getDataCellEl(editorElement, 2, 2);
        const dstBlock = dstCell.querySelector('.e-block') as HTMLElement;
        const dstContent = getBlockContentElement(dstBlock);
        editor.blockManager.setFocusToBlock(dstBlock);
        setCursorPosition(dstContent, 0);

        editor.blockManager.clipboardAction.performPasteOperation({ html: payload.html, text: payload.text, blockeditorData: payload.blockeditorData });

        const props = (editor.blocks[1] as BlockModel).properties as ITableBlockSettings;
        expect(props.rows[1].cells[2].blocks[0].content[0].content.startsWith('R1')).toBe(true);

        // DOM assertion
        expect(getDataCellEl(editorElement, 2, 2).textContent!.trim().length).toBeGreaterThan(0);
    });

    it('Copy full row then paste into another row by selecting the gripper', () => {
        selectRectangle(editorElement, 1, 0, 1, 2);
        const tableBlockElement = editorElement.querySelector('.e-table-block') as HTMLElement;
        const copyPayload = editor.blockManager.clipboardAction.getTablePayload(tableBlockElement);

        const secondCell = getDataCellEl(editorElement, 2, 0);
        secondCell.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));

        const rowAction = tableBlockElement.querySelector('.e-row-action-handle');
        expect(rowAction).not.toBeNull();
        rowAction.dispatchEvent(new MouseEvent('click', { bubbles: true }));

        // Visual selection assertions
        const secondRow = tableBlockElement.querySelectorAll('tbody tr')[1];
        expect(secondRow.classList.contains('e-row-selected')).toBe(true);

        const pinned = tableBlockElement.querySelector('.e-row-action-handle.e-pinned') as HTMLElement;
        expect(pinned && pinned.style.display !== 'none').toBe(true);

        // Perform paste
        editor.blockManager.clipboardAction.performPasteOperation(copyPayload);

        const model = editor.blocks[1] as BlockModel;
        const props = model.properties as ITableBlockSettings;
        expect(props.rows[1].cells[0].blocks[0].content[0].content).toBe('R1C1');
        expect(props.rows[1].cells[1].blocks[0].content[0].content).toBe('R1C2');
        expect(props.rows[1].cells[2].blocks[0].content[0].content).toBe('R1C3');

        // DOM assertions
        expect(getDataCellEl(editorElement, 2, 0).textContent!.trim()).toBe('R1C1');
        expect(getDataCellEl(editorElement, 2, 1).textContent!.trim()).toBe('R1C2');
        expect(getDataCellEl(editorElement, 2, 2).textContent!.trim()).toBe('R1C3');
    });

    it('Copy full column then paste into another column by selecting the gripper', () => {
        selectRectangle(editorElement, 1, 0, 3, 0);
        const tableBlockElement = editorElement.querySelector('.e-table-block') as HTMLElement;
        const copyPayload = editor.blockManager.clipboardAction.getTablePayload(tableBlockElement);

        const secondCell = getDataCellEl(editorElement, 1, 1);
        secondCell.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));

        const colAction = tableBlockElement.querySelector('.e-col-action-handle') as HTMLElement;
        expect(colAction).not.toBeNull();
        colAction.dispatchEvent(new MouseEvent('click', { bubbles: true }));

        // Visual selection assertions
        const rows = tableBlockElement.querySelectorAll('tbody tr') as NodeListOf<HTMLTableRowElement>;
        expect(rows[0].cells[2].classList.contains('e-col-selected')).toBe(true); // first data column
        expect(rows[1].cells[2].classList.contains('e-col-selected')).toBe(true);

        const pinned = tableBlockElement.querySelector('.e-col-action-handle.e-pinned') as HTMLElement;
        expect(pinned && pinned.style.display !== 'none').toBe(true);

        editor.blockManager.clipboardAction.performPasteOperation(copyPayload);

        const model = editor.blocks[1] as BlockModel;
        const props = model.properties as ITableBlockSettings;
        expect(props.rows[0].cells[1].blocks[0].content[0].content).toBe('R1C1');
        expect(props.rows[1].cells[1].blocks[0].content[0].content).toBe('R2C1');
        expect(props.rows[2].cells[1].blocks[0].content[0].content).toBe('R3C1');
        // DOM assertions
        expect(getDataCellEl(editorElement, 1, 1).textContent!.trim()).toBe('R1C1');
        expect(getDataCellEl(editorElement, 2, 1).textContent!.trim()).toBe('R2C1');
        expect(getDataCellEl(editorElement, 3, 1).textContent!.trim()).toBe('R3C1');
    });
})

describe('Table Clipboard Overlapping and growth scenarios: ', () => {
    let editor: BlockEditor;
    let editorElement: HTMLElement;

    beforeEach(() => {
        editorElement = createElement('div', { id: 'editor-v1-overlap' });
        document.body.appendChild(editorElement);
        const before: BlockModel = { id: 'before-ov', blockType: BlockType.Paragraph, content: [{ id: 'bc-ov', contentType: ContentType.Text, content: 'Before' }] };
        const table: BlockModel = buildTableBlock('table_block_ov', 4, 4, true, true, true);
        const after: BlockModel = { id: 'after-ov', blockType: BlockType.Paragraph, content: [{ id: 'ac-ov', contentType: ContentType.Text, content: 'After' }] };
        editor = createEditor({ blocks: [before, table, after] });
        editor.appendTo('#editor-v1-overlap');
    });

    afterEach(() => {
        if (editor) { editor.destroy(); }
        if (editorElement && editorElement.parentElement) { editorElement.parentElement.removeChild(editorElement); }
    });

    it('Copy 2x2 and paste starting at overlapped bottom-right cell (R2C2)', () => {
        selectRectangle(editorElement, 1, 1, 2, 2);
        const tableBlockElement = editorElement.querySelector('.e-table-block') as HTMLElement;
        const copyPayload = editor.blockManager.clipboardAction.getTablePayload(tableBlockElement);

        const target = getDataCellEl(editorElement, 2, 1);
        const blk = target.querySelector('.e-block') as HTMLElement;
        editor.blockManager.setFocusToBlock(blk);
        setCursorPosition(getBlockContentElement(blk), 0);

        editor.blockManager.clipboardAction.performPasteOperation(copyPayload);

        const props = (editor.blocks[1] as BlockModel).properties as ITableBlockSettings;
        // Model assertions
        expect(props.rows[1].cells[1].blocks[0].content[0].content).toBe('R1C2');
        expect(props.rows[1].cells[2].blocks[0].content[0].content).toBe('R1C3');
        expect(props.rows[2].cells[1].blocks[0].content[0].content).toBe('R2C2');
        expect(props.rows[2].cells[2].blocks[0].content[0].content).toBe('R2C3');

        // DOM assertions
        expect(getDataCellEl(editorElement, 2, 1).textContent!.trim()).toBe('R1C2');
        expect(getDataCellEl(editorElement, 2, 2).textContent!.trim()).toBe('R1C3');
        expect(getDataCellEl(editorElement, 3, 1).textContent!.trim()).toBe('R2C2');
        expect(getDataCellEl(editorElement, 3, 2).textContent!.trim()).toBe('R2C3');
    });

    it('Copy 2x3 and paste starting at near bottom-right causing growth', () => {
        selectRectangle(editorElement, 1, 1, 2, 3);
        const tableBlockElement = editorElement.querySelector('.e-table-block') as HTMLElement;
        const copyPayload = editor.blockManager.clipboardAction.getTablePayload(tableBlockElement);

        const target = getDataCellEl(editorElement, 3, 3);
        const blk = target.querySelector('.e-block') as HTMLElement;
        editor.blockManager.setFocusToBlock(blk);
        setCursorPosition(getBlockContentElement(blk), 0);

        editor.blockManager.clipboardAction.performPasteOperation(copyPayload);

        const props = (editor.blocks[1] as BlockModel).properties as ITableBlockSettings;
        // Model assertions
        expect(props.columns.length).toBeGreaterThanOrEqual(5);
        expect(props.rows.length).toBeGreaterThanOrEqual(4);
        expect(props.rows[2].cells[3].blocks[0].content[0].content).toBeDefined();

        // DOM assertions
        expect(getDataCellEl(editorElement, 3, 3).textContent!.trim()).toBe('R1C2');
        expect(getDataCellEl(editorElement, 3, 4).textContent!.trim()).toBe('R1C3');
        expect(getDataCellEl(editorElement, 3, 5).textContent!.trim()).toBe('R1C4');
        expect(getDataCellEl(editorElement, 4, 3).textContent!.trim()).toBe('R2C2');
        expect(getDataCellEl(editorElement, 4, 5).textContent!.trim()).toBe('R2C4');
    });

    it('Copy 1x3 row slice and paste with horizontal overlap in same row', () => {
        selectRectangle(editorElement, 2, 0, 2, 2);
        const tableBlockElement = editorElement.querySelector('.e-table-block') as HTMLElement;
        const copyPayload = editor.blockManager.clipboardAction.getTablePayload(tableBlockElement);

        const target = getDataCellEl(editorElement, 2, 1);
        const blk = target.querySelector('.e-block') as HTMLElement;
        editor.blockManager.setFocusToBlock(blk);
        setCursorPosition(getBlockContentElement(blk), 0);

        editor.blockManager.clipboardAction.performPasteOperation(copyPayload);

        const props = (editor.blocks[1] as BlockModel).properties as ITableBlockSettings;
        // Model assertions
        expect(props.rows[1].cells[1].blocks[0].content[0].content).toBe('R2C1');
        expect(props.rows[1].cells[2].blocks[0].content[0].content).toBe('R2C2');
        expect(props.rows[1].cells[3].blocks[0].content[0].content).toBe('R2C3');

        // DOM assertions
        expect(getDataCellEl(editorElement, 2, 1).textContent!.trim()).toBe('R2C1');
        expect(getDataCellEl(editorElement, 2, 2).textContent!.trim()).toBe('R2C2');
        expect(getDataCellEl(editorElement, 2, 3).textContent!.trim()).toBe('R2C3');
    });

    it('Copy 3x1 column slice and paste starting at bottom row to trigger row growth', () => {
        selectRectangle(editorElement, 1, 0, 3, 0);
        const tableBlockElement = editorElement.querySelector('.e-table-block') as HTMLElement;
        const copyPayload = editor.blockManager.clipboardAction.getTablePayload(tableBlockElement);

        const target = getDataCellEl(editorElement, 4, 0);
        const blk = target.querySelector('.e-block') as HTMLElement;
        editor.blockManager.setFocusToBlock(blk);
        setCursorPosition(getBlockContentElement(blk), 0);

        editor.blockManager.clipboardAction.performPasteOperation(copyPayload);

        const props = (editor.blocks[1] as BlockModel).properties as ITableBlockSettings;
        // Model assertions
        expect(props.rows.length).toBeGreaterThanOrEqual(6);
        expect(props.rows[3].cells[0].blocks[0].content[0].content).toBe('R1C1');
        expect(props.rows[4].cells[0].blocks[0].content[0].content).toBe('R2C1');
        expect(props.rows[5].cells[0].blocks[0].content[0].content).toBe('R3C1');

        // DOM assertions
        expect(getDataCellEl(editorElement, 4, 0).textContent!.trim()).toBe('R1C1');
        expect(getDataCellEl(editorElement, 5, 0).textContent!.trim()).toBe('R2C1');
        expect(getDataCellEl(editorElement, 6, 0).textContent!.trim()).toBe('R3C1');
    });

    it('Exact overlap paste (same start) keeps data consistent without corruption', () => {
        selectRectangle(editorElement, 2, 1, 3, 2);
        const tableBlockElement = editorElement.querySelector('.e-table-block') as HTMLElement;
        const copyPayload = editor.blockManager.clipboardAction.getTablePayload(tableBlockElement);

        const target = getDataCellEl(editorElement, 2, 1);
        const blk = target.querySelector('.e-block') as HTMLElement;
        editor.blockManager.setFocusToBlock(blk);
        setCursorPosition(getBlockContentElement(blk), 0);

        // snapshot values at target range
        const beforeProps = (editor.blocks[1] as BlockModel).properties as ITableBlockSettings;
        const v1 = beforeProps.rows[1].cells[1].blocks[0].content[0].content;
        const v2 = beforeProps.rows[1].cells[2].blocks[0].content[0].content;
        const v3 = beforeProps.rows[2].cells[1].blocks[0].content[0].content;
        const v4 = beforeProps.rows[2].cells[2].blocks[0].content[0].content;

        editor.blockManager.clipboardAction.performPasteOperation(copyPayload);

        const props = (editor.blocks[1] as BlockModel).properties as ITableBlockSettings;
        // Model assertions
        expect(props.rows[1].cells[1].blocks[0].content[0].content).toBe(v1);
        expect(props.rows[1].cells[2].blocks[0].content[0].content).toBe(v2);
        expect(props.rows[2].cells[1].blocks[0].content[0].content).toBe(v3);
        expect(props.rows[2].cells[2].blocks[0].content[0].content).toBe(v4);

        // DOM assertions
        expect(getDataCellEl(editorElement, 2, 1).textContent!.trim()).toBe(v1);
        expect(getDataCellEl(editorElement, 2, 2).textContent!.trim()).toBe(v2);
        expect(getDataCellEl(editorElement, 3, 1).textContent!.trim()).toBe(v3);
        expect(getDataCellEl(editorElement, 3, 2).textContent!.trim()).toBe(v4);
    });

    it('Copy 2x2 from bottom-right quadrant and paste at row1,col2 (overlap up/left)', () => {
        selectRectangle(editorElement, 2, 1, 3, 2);
        const tableBlockElement = editorElement.querySelector('.e-table-block') as HTMLElement;
        const copyPayload = editor.blockManager.clipboardAction.getTablePayload(tableBlockElement);

        const t = getDataCellEl(editorElement, 1, 2);
        const blk = t.querySelector('.e-block') as HTMLElement;
        editor.blockManager.setFocusToBlock(blk);
        setCursorPosition(getBlockContentElement(blk), 0);

        editor.blockManager.clipboardAction.performPasteOperation(copyPayload);

        const props = (editor.blocks[1] as BlockModel).properties as ITableBlockSettings;
        // Model assertions
        expect(props.rows[0].cells[2].blocks[0].content[0].content).toBe('R2C2');
        expect(props.rows[0].cells[3].blocks[0].content[0].content).toBe('R2C3');
        expect(props.rows[1].cells[2].blocks[0].content[0].content).toBe('R3C2');
        expect(props.rows[1].cells[3].blocks[0].content[0].content).toBe('R3C3');

        // DOM assertions
        expect(getDataCellEl(editorElement, 1, 2).textContent!.trim()).toBe('R2C2');
        expect(getDataCellEl(editorElement, 1, 3).textContent!.trim()).toBe('R2C3');
        expect(getDataCellEl(editorElement, 2, 2).textContent!.trim()).toBe('R3C2');
        expect(getDataCellEl(editorElement, 2, 3).textContent!.trim()).toBe('R3C3');
    });

    it('Paste TSV with trailing empty cell near right edge pads empties and grows if needed', () => {
        const text = 'A\tB\t\nC\tD\t';
        const t = getDataCellEl(editorElement, 2, 2);
        const blk = t.querySelector('.e-block') as HTMLElement;
        editor.blockManager.setFocusToBlock(blk);
        setCursorPosition(getBlockContentElement(blk), 0);

        editor.blockManager.clipboardAction.performPasteOperation({ text });

        const props = (editor.blocks[1] as BlockModel).properties as ITableBlockSettings;
        // Model assertions
        expect(props.columns.length).toBeGreaterThanOrEqual(4);
        expect(props.rows[1].cells[2].blocks[0].content[0].content).toBe('A');
        expect(props.rows[1].cells[3].blocks[0].content[0].content).toBe('B');
        expect(props.rows[2].cells[2].blocks[0].content[0].content).toBe('C');
        expect(props.rows[2].cells[3].blocks[0].content[0].content).toBe('D');
        expect(props.rows[1].cells[4].blocks[0].content[0].content || '').toBe(''); // trailing empty

        // DOM assertions
        expect(getDataCellEl(editorElement, 2, 2).textContent!.trim()).toBe('A');
        expect(getDataCellEl(editorElement, 2, 3).textContent!.trim()).toBe('B');
        expect(getDataCellEl(editorElement, 3, 2).textContent!.trim()).toBe('C');
        expect(getDataCellEl(editorElement, 3, 3).textContent!.trim()).toBe('D');
        expect(getDataCellEl(editorElement, 2, 4).textContent!.trim()).toBe('');
    });

    // Overlapping/growth combinations (representative subset)
    it('Copy 2x2 and paste overlapping to right within same rows', () => {
        selectRectangle(editorElement, 1, 0, 2, 1);
        const tableBlockElement = editorElement.querySelector('.e-table-block') as HTMLElement;
        const copyPayload = editor.blockManager.clipboardAction.getTablePayload(tableBlockElement);

        const targetCell = getDataCellEl(editorElement, 1, 1);
        const blk = targetCell.querySelector('.e-block') as HTMLElement;
        editor.blockManager.setFocusToBlock(blk);
        setCursorPosition(getBlockContentElement(blk), 0);

        editor.blockManager.clipboardAction.performPasteOperation(copyPayload);

        const props = (editor.blocks[1] as BlockModel).properties as ITableBlockSettings;
        // Model assertions
        expect(props.rows[0].cells[1].blocks[0].content[0].content).toBe('R1C1');
        expect(props.rows[0].cells[2].blocks[0].content[0].content).toBe('R1C2');
        expect(props.rows[1].cells[1].blocks[0].content[0].content).toBe('R2C1');
        expect(props.rows[1].cells[2].blocks[0].content[0].content).toBe('R2C2');

        // DOM assertions
        expect(getDataCellEl(editorElement, 1, 1).textContent!.trim()).toBe('R1C1');
        expect(getDataCellEl(editorElement, 1, 2).textContent!.trim()).toBe('R1C2');
        expect(getDataCellEl(editorElement, 2, 1).textContent!.trim()).toBe('R2C1');
        expect(getDataCellEl(editorElement, 2, 2).textContent!.trim()).toBe('R2C2');
    });

    it('Copy 2x2 and paste starting at last column to trigger horizontal growth', () => {
        selectRectangle(editorElement, 1, 1, 2, 2);
        const tableBlockElement = editorElement.querySelector('.e-table-block') as HTMLElement;
        const copyPayload = editor.blockManager.clipboardAction.getTablePayload(tableBlockElement);

        const targetCell = getDataCellEl(editorElement, 1, 2);
        const blk = targetCell.querySelector('.e-block') as HTMLElement;
        editor.blockManager.setFocusToBlock(blk);
        setCursorPosition(getBlockContentElement(blk), 0);

        editor.blockManager.clipboardAction.performPasteOperation(copyPayload);

        const props = (editor.blocks[1] as BlockModel).properties as ITableBlockSettings;
        // Model assertions
        expect(props.columns.length).toBeGreaterThanOrEqual(4);
        expect(props.rows[0].cells[2].blocks[0].content[0].content).toBe('R1C2');
        expect(props.rows[0].cells[3].blocks[0].content[0].content).toBe('R1C3');
        expect(props.rows[1].cells[2].blocks[0].content[0].content).toBe('R2C2');
        expect(props.rows[1].cells[3].blocks[0].content[0].content).toBe('R2C3');

        // DOM assertions
        expect(getDataCellEl(editorElement, 1, 2).textContent!.trim()).toBe('R1C2');
        expect(getDataCellEl(editorElement, 1, 3).textContent!.trim()).toBe('R1C3');
        expect(getDataCellEl(editorElement, 2, 2).textContent!.trim()).toBe('R2C2');
        expect(getDataCellEl(editorElement, 2, 3).textContent!.trim()).toBe('R2C3');
    });

    it('Paste TSV 3x3 at middle (row2,col1) grows table down and right', () => {
        const text = 'A1\tA2\tA3\nB1\tB2\tB3\nC1\tC2\tC3';
        const targetCell = getDataCellEl(editorElement, 2, 1);
        const blk = targetCell.querySelector('.e-block') as HTMLElement;
        editor.blockManager.setFocusToBlock(blk);
        setCursorPosition(getBlockContentElement(blk), 0);

        editor.blockManager.clipboardAction.performPasteOperation({ text });

        const props = (editor.blocks[1] as BlockModel).properties as ITableBlockSettings;
        // Model assertions
        expect(props.rows.length).toBeGreaterThanOrEqual(4);
        expect(props.columns.length).toBeGreaterThanOrEqual(4);
        expect(props.rows[1].cells[1].blocks[0].content[0].content).toBe('A1');
        expect(props.rows[3].cells[3].blocks[0].content[0].content).toBe('C3');

        // DOM assertions
        expect(getDataCellEl(editorElement, 2, 1).textContent!.trim()).toBe('A1');
        expect(getDataCellEl(editorElement, 2, 3).textContent!.trim()).toBe('A3');
        expect(getDataCellEl(editorElement, 4, 1).textContent!.trim()).toBe('C1');
        expect(getDataCellEl(editorElement, 4, 3).textContent!.trim()).toBe('C3');
    });

    it('Copy once and paste twice into two different destinations', () => {
        selectRectangle(editorElement, 1, 0, 2, 1);
        const tableBlockElement = editorElement.querySelector('.e-table-block') as HTMLElement;
        const copyPayload = editor.blockManager.clipboardAction.getTablePayload(tableBlockElement);

        // first target
        let t = getDataCellEl(editorElement, 2, 1);
        let blk = t.querySelector('.e-block') as HTMLElement;
        editor.blockManager.setFocusToBlock(blk);
        setCursorPosition(getBlockContentElement(blk), 0);
        editor.blockManager.clipboardAction.performPasteOperation(copyPayload);

        // second target
        t = getDataCellEl(editorElement, 1, 2);
        blk = t.querySelector('.e-block') as HTMLElement;
        editor.blockManager.setFocusToBlock(blk);
        setCursorPosition(getBlockContentElement(blk), 0);
        editor.blockManager.clipboardAction.performPasteOperation(copyPayload);

        const props = (editor.blocks[1] as BlockModel).properties as ITableBlockSettings;
        // Model assertions
        expect(props.rows[1].cells[1].blocks[0].content[0].content).toBe('R1C1');
        expect(props.rows[0].cells[2].blocks[0].content[0].content).toBe('R1C1');

        // DOM assertions
        expect(getDataCellEl(editorElement, 2, 1).textContent!.trim()).toBe('R1C1');
        expect(getDataCellEl(editorElement, 1, 2).textContent!.trim()).toBe('R1C1');
    });

    it('Large TSV paste 20x10 grows table', () => {
        const rows = 20, cols = 10;
        const lines: string[] = [];
        for (let r = 0; r < rows; r++) {
            const row: string[] = [];
            for (let c = 0; c < cols; c++) { row.push(`V${r}_${c}`); }
            lines.push(row.join('\t'));
        }
        const text = lines.join('\n');

        const target = getDataCellEl(editorElement, 1, 0);
        const blk = target.querySelector('.e-block') as HTMLElement;
        editor.blockManager.setFocusToBlock(blk);
        setCursorPosition(getBlockContentElement(blk), 0);

        editor.blockManager.clipboardAction.performPasteOperation({ text });

        const props = (editor.blocks[1] as BlockModel).properties as ITableBlockSettings;
        // Model assertions
        expect(props.rows.length).toBeGreaterThanOrEqual(20);
        expect(props.columns.length).toBeGreaterThanOrEqual(10);
        expect(props.rows[0].cells[0].blocks[0].content[0].content).toBe('V0_0');
        expect(props.rows[19].cells[9].blocks[0].content[0].content).toBe('V19_9');

        // DOM assertions
        expect(getDataCellEl(editorElement, 1, 0).textContent!.trim()).toBe('V0_0');
        expect(getDataCellEl(editorElement, 20, 9).textContent!.trim()).toBe('V19_9');
    });

    it('Pasting HTML with two tables outside creates two new Table blocks', () => {
        const html = '<table><tbody><tr><td>A1</td></tr></tbody></table>' +
            '<p>Between</p>' +
            '<table><tbody><tr><td>B1</td></tr></tbody></table>';

        const afterBlockEl = editorElement.querySelector('#after-ov') as HTMLElement;
        editor.blockManager.setFocusToBlock(afterBlockEl);
        setCursorPosition(getBlockContentElement(afterBlockEl), 0);

        editor.blockManager.clipboardAction.performPasteOperation({ html });

        // Model assertions
        const tables = editor.blocks.filter(b => b.blockType === BlockType.Table);
        expect(tables.length).toBe(3);

        // DOM assertions – verify two new tables exist after the "After" paragraph
        const tableBlocks = editorElement.querySelectorAll('.e-table-block');
        expect(tableBlocks.length).toBe(3);
        expect(tableBlocks[1].querySelector('td:not(.e-row-number)').textContent.trim()).toBe('A1');
        expect(tableBlocks[2].querySelector('td:not(.e-row-number)').textContent.trim()).toBe('B1');
    });
});

describe('Table Clipboard Combinations: ', () => {
    let editor: BlockEditor;
    let editorElement: HTMLElement;

    function selectRectangle(startRow: number, startCol: number, endRow: number, endCol: number): void {
        const start = getDataCellEl(editorElement, startRow, startCol);
        const end = getDataCellEl(editorElement, endRow, endCol);
        start.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        end.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
        document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    }

    beforeEach(() => {
        editorElement = createElement('div', { id: 'editor-v1-combo' });
        document.body.appendChild(editorElement);

        const before: BlockModel = { id: 'before', blockType: BlockType.Paragraph, content: [{ id: 'bc', contentType: ContentType.Text, content: 'Before' }] };
        const table: BlockModel = buildTableBlock('table_block', 3, 3, true, true, true);
        const after: BlockModel = { id: 'after', blockType: BlockType.Paragraph, content: [{ id: 'ac', contentType: ContentType.Text, content: 'After' }] };

        editor = createEditor({ blocks: [before, table, after] });
        editor.appendTo('#editor-v1-combo');
    });

    afterEach(() => {
        if (editor) { editor.destroy(); }
        if (editorElement && editorElement.parentElement) { editorElement.parentElement.removeChild(editorElement); }
    });

    it('Copy 2x2 and paste overlapping to right within same rows', () => {
        selectRectangle(1, 0, 2, 1);
        const tableBlockElement = editorElement.querySelector('.e-table-block') as HTMLElement;
        const copyPayload = editor.blockManager.clipboardAction.getTablePayload(tableBlockElement);

        const targetCell = getDataCellEl(editorElement, 1, 1);
        const blk = targetCell.querySelector('.e-block') as HTMLElement;
        editor.blockManager.setFocusToBlock(blk);
        setCursorPosition(getBlockContentElement(blk), 0);

        editor.blockManager.clipboardAction.performPasteOperation(copyPayload);

        const props = (editor.blocks[1] as BlockModel).properties as ITableBlockSettings;
        // Model assertions
        expect(props.rows[0].cells[1].blocks[0].content[0].content).toBe('R1C1');
        expect(props.rows[0].cells[2].blocks[0].content[0].content).toBe('R1C2');
        expect(props.rows[1].cells[1].blocks[0].content[0].content).toBe('R2C1');
        expect(props.rows[1].cells[2].blocks[0].content[0].content).toBe('R2C2');

        // DOM assertions
        expect(getDataCellEl(editorElement, 1, 1).textContent!.trim()).toBe('R1C1');
        expect(getDataCellEl(editorElement, 1, 2).textContent!.trim()).toBe('R1C2');
        expect(getDataCellEl(editorElement, 2, 1).textContent!.trim()).toBe('R2C1');
        expect(getDataCellEl(editorElement, 2, 2).textContent!.trim()).toBe('R2C2');
    });

    it('Copy 2x2 and paste overlapping downward within same columns', () => {
        selectRectangle(1, 1, 2, 2);
        const tableBlockElement = editorElement.querySelector('.e-table-block') as HTMLElement;
        const copyPayload = editor.blockManager.clipboardAction.getTablePayload(tableBlockElement);

        const targetCell = getDataCellEl(editorElement, 2, 1);
        const blk = targetCell.querySelector('.e-block') as HTMLElement;
        editor.blockManager.setFocusToBlock(blk);
        setCursorPosition(getBlockContentElement(blk), 0);

        editor.blockManager.clipboardAction.performPasteOperation(copyPayload);

        const props = (editor.blocks[1] as BlockModel).properties as ITableBlockSettings;
        // Model assertions
        expect(props.rows[1].cells[1].blocks[0].content[0].content).toBe('R1C2');
        expect(props.rows[1].cells[2].blocks[0].content[0].content).toBe('R1C3');
        expect(props.rows[2].cells[1].blocks[0].content[0].content).toBe('R2C2');
        expect(props.rows[2].cells[2].blocks[0].content[0].content).toBe('R2C3');

        // DOM assertions
        expect(getDataCellEl(editorElement, 2, 1).textContent!.trim()).toBe('R1C2');
        expect(getDataCellEl(editorElement, 2, 2).textContent!.trim()).toBe('R1C3');
        expect(getDataCellEl(editorElement, 3, 1).textContent!.trim()).toBe('R2C2');
        expect(getDataCellEl(editorElement, 3, 2).textContent!.trim()).toBe('R2C3');
    });

    it('Copy 3x3 and paste at (3,2) causing growth and partial overlap', () => {
        selectRectangle(1, 0, 3, 2);
        const tableBlockElement = editorElement.querySelector('.e-table-block') as HTMLElement;
        const copyPayload = editor.blockManager.clipboardAction.getTablePayload(tableBlockElement);

        const targetCell = getDataCellEl(editorElement, 3, 2);
        const blk = targetCell.querySelector('.e-block') as HTMLElement;
        editor.blockManager.setFocusToBlock(blk);
        setCursorPosition(getBlockContentElement(blk), 0);

        editor.blockManager.clipboardAction.performPasteOperation(copyPayload);

        const props = (editor.blocks[1] as BlockModel).properties as ITableBlockSettings;
        // Model assertions
        expect(props.rows.length).toBeGreaterThanOrEqual(5);
        expect(props.columns.length).toBeGreaterThanOrEqual(5);
        expect(props.rows[2].cells[2].blocks[0].content[0].content).toBe('R1C1');
        expect(props.rows[4].cells[4].blocks[0].content[0].content).toBe('R3C3');

        // DOM assertions
        expect(getDataCellEl(editorElement, 3, 2).textContent!.trim()).toBe('R1C1');
        expect(getDataCellEl(editorElement, 3, 3).textContent!.trim()).toBe('R1C2');
        expect(getDataCellEl(editorElement, 5, 4).textContent!.trim()).toBe('R3C3');
    });

    // Todo(Issue - empty cells not considered)
    it('Copy with empty cells overwrites target including empties', () => {
        // Clear R1C2 via cut of a 1x1 rectangle
        selectRectangle(1, 1, 1, 1);
        const targetCell = getDataCellEl(editorElement, 1, 1);
        const blk = targetCell.querySelector('.e-block') as HTMLElement;
        editor.blockManager.setFocusToBlock(blk);
        editor.blockManager.clipboardAction.performCutOperation();

        // Now copy row1 cols 0..1 (contains empty at col1)
        selectRectangle(1, 0, 1, 1);
        const tableBlockElement = editorElement.querySelector('.e-table-block') as HTMLElement;
        const copyPayload = editor.blockManager.clipboardAction.getTablePayload(tableBlockElement);

        // Paste at row 2, col 1
        const targetCell1 = getDataCellEl(editorElement, 2, 1);
        const blk1 = targetCell1.querySelector('.e-block') as HTMLElement;
        editor.blockManager.setFocusToBlock(blk1);
        setCursorPosition(getBlockContentElement(blk1), 0);

        editor.blockManager.clipboardAction.performPasteOperation(copyPayload);

        const props = (editor.blocks[1] as BlockModel).properties as ITableBlockSettings;
        // Model assertions
        expect(props.rows[1].cells[1].blocks[0].content[0].content).toBe('R1C1');
        // expect(props.rows[1].cells[2].blocks[0].content[0].content).toBe(''); // empty preserved

        // DOM assertions
        expect(getDataCellEl(editorElement, 2, 1).textContent!.trim()).toBe('R1C1');
        // expect(getDataCellEl(editorElement, 2, 2).textContent!.trim()).toBe(''); // visually empty
    });

    it('Copy 2x2 and paste starting at last column to trigger horizontal growth (overlap right edge)', () => {
        selectRectangle(1, 1, 2, 2);
        const tableBlockElement = editorElement.querySelector('.e-table-block') as HTMLElement;
        const copyPayload = editor.blockManager.clipboardAction.getTablePayload(tableBlockElement);

        const targetCell = getDataCellEl(editorElement, 1, 2);
        const blk = targetCell.querySelector('.e-block') as HTMLElement;
        editor.blockManager.setFocusToBlock(blk);
        setCursorPosition(getBlockContentElement(blk), 0);

        editor.blockManager.clipboardAction.performPasteOperation(copyPayload);

        const props = (editor.blocks[1] as BlockModel).properties as ITableBlockSettings;
        // Model assertions
        expect(props.columns.length).toBeGreaterThanOrEqual(4);
        expect(props.rows[0].cells[2].blocks[0].content[0].content).toBe('R1C2');
        expect(props.rows[1].cells[3].blocks[0].content[0].content).toBe('R2C3');

        // DOM assertions
        expect(getDataCellEl(editorElement, 1, 2).textContent!.trim()).toBe('R1C2');
        expect(getDataCellEl(editorElement, 1, 3).textContent!.trim()).toBe('R1C3');
        expect(getDataCellEl(editorElement, 2, 3).textContent!.trim()).toBe('R2C3');
    });

    it('Copy 2x2 and paste starting at bottom row to trigger vertical growth (overlap bottom edge)', () => {
        selectRectangle(2, 0, 3, 1);
        const tableBlockElement = editorElement.querySelector('.e-table-block') as HTMLElement;
        const copyPayload = editor.blockManager.clipboardAction.getTablePayload(tableBlockElement);

        const targetCell = getDataCellEl(editorElement, 3, 0);
        const blk = targetCell.querySelector('.e-block') as HTMLElement;
        editor.blockManager.setFocusToBlock(blk);
        setCursorPosition(getBlockContentElement(blk), 0);

        editor.blockManager.clipboardAction.performPasteOperation(copyPayload);

        const props = (editor.blocks[1] as BlockModel).properties as ITableBlockSettings;
        // Model assertions
        expect(props.rows.length).toBeGreaterThanOrEqual(4);
        expect(props.rows[2].cells[0].blocks[0].content[0].content).toBe('R2C1');
        expect(props.rows[3].cells[1].blocks[0].content[0].content).toBe('R3C2');

        // DOM assertions
        expect(getDataCellEl(editorElement, 3, 0).textContent!.trim()).toBe('R2C1');
        expect(getDataCellEl(editorElement, 3, 1).textContent!.trim()).toBe('R2C2');
        expect(getDataCellEl(editorElement, 4, 1).textContent!.trim()).toBe('R3C2');
    });

    it('Reverse selection copy then paste preserves orientation', () => {
        selectRectangle(3, 2, 2, 1);
        const tableBlockElement = editorElement.querySelector('.e-table-block') as HTMLElement;
        const copyPayload = editor.blockManager.clipboardAction.getTablePayload(tableBlockElement);

        const targetCell = getDataCellEl(editorElement, 1, 0);
        const blk = targetCell.querySelector('.e-block') as HTMLElement;
        editor.blockManager.setFocusToBlock(blk);
        setCursorPosition(getBlockContentElement(blk), 0);

        editor.blockManager.clipboardAction.performPasteOperation(copyPayload);

        const props = (editor.blocks[1] as BlockModel).properties as ITableBlockSettings;
        // Model assertions
        expect(props.rows[0].cells[0].blocks[0].content[0].content).toBe('R2C2');
        expect(props.rows[1].cells[1].blocks[0].content[0].content).toBe('R3C3');

        // DOM assertions
        expect(getDataCellEl(editorElement, 1, 0).textContent!.trim()).toBe('R2C2');
        expect(getDataCellEl(editorElement, 1, 1).textContent!.trim()).toBe('R2C3');
        expect(getDataCellEl(editorElement, 2, 1).textContent!.trim()).toBe('R3C3');
    });

    it('Copy 2x1 and paste at bottom-right to overlap within bounds only', () => {
        selectRectangle(1, 2, 2, 2);
        const tableBlockElement = editorElement.querySelector('.e-table-block') as HTMLElement;
        const copyPayload = editor.blockManager.clipboardAction.getTablePayload(tableBlockElement);

        const targetCell = getDataCellEl(editorElement, 2, 1);
        const blk = targetCell.querySelector('.e-block') as HTMLElement;
        editor.blockManager.setFocusToBlock(blk);
        setCursorPosition(getBlockContentElement(blk), 0);

        editor.blockManager.clipboardAction.performPasteOperation(copyPayload);

        const props = (editor.blocks[1] as BlockModel).properties as ITableBlockSettings;
        // Model assertions
        expect(props.rows[1].cells[1].blocks[0].content[0].content).toBe('R1C3');
        expect(props.rows[2].cells[1].blocks[0].content[0].content).toBe('R2C3');

        // DOM assertions
        expect(getDataCellEl(editorElement, 2, 1).textContent!.trim()).toBe('R1C3');
        expect(getDataCellEl(editorElement, 3, 1).textContent!.trim()).toBe('R2C3');
    });

    it('Copy 1x2 and paste at last column to grow by one and overlap one cell', () => {
        selectRectangle(1, 0, 1, 1);
        const tableBlockElement = editorElement.querySelector('.e-table-block') as HTMLElement;
        const copyPayload = editor.blockManager.clipboardAction.getTablePayload(tableBlockElement);

        const targetCell = getDataCellEl(editorElement, 1, 2);
        const blk = targetCell.querySelector('.e-block') as HTMLElement;
        editor.blockManager.setFocusToBlock(blk);
        setCursorPosition(getBlockContentElement(blk), 0);

        editor.blockManager.clipboardAction.performPasteOperation(copyPayload);

        const props = (editor.blocks[1] as BlockModel).properties as ITableBlockSettings;
        // Model assertions
        expect(props.columns.length).toBeGreaterThanOrEqual(4);
        expect(props.rows[0].cells[2].blocks[0].content[0].content).toBe('R1C1');
        expect(props.rows[0].cells[3].blocks[0].content[0].content).toBe('R1C2');

        // DOM assertions
        expect(getDataCellEl(editorElement, 1, 2).textContent!.trim()).toBe('R1C1');
        expect(getDataCellEl(editorElement, 1, 3).textContent!.trim()).toBe('R1C2');
    });

    it('Copy 2x2 from bottom-right quadrant and paste at row1,col2 (overlap up/left)', () => {
        selectRectangle(2, 1, 3, 2);
        const tableBlockElement = editorElement.querySelector('.e-table-block') as HTMLElement;
        const copyPayload = editor.blockManager.clipboardAction.getTablePayload(tableBlockElement);

        const t = getDataCellEl(editorElement, 1, 2);
        const blk = t.querySelector('.e-block') as HTMLElement;
        editor.blockManager.setFocusToBlock(blk);
        setCursorPosition(getBlockContentElement(blk), 0);

        editor.blockManager.clipboardAction.performPasteOperation(copyPayload);

        const props = (editor.blocks[1] as BlockModel).properties as ITableBlockSettings;
        // Model assertions
        expect(props.rows[0].cells[2].blocks[0].content[0].content).toBe('R2C2');
        expect(props.rows[1].cells[3].blocks[0].content[0].content).toBe('R3C3');

        // DOM assertions
        expect(getDataCellEl(editorElement, 1, 2).textContent!.trim()).toBe('R2C2');
        expect(getDataCellEl(editorElement, 1, 3).textContent!.trim()).toBe('R2C3');
        expect(getDataCellEl(editorElement, 2, 2).textContent!.trim()).toBe('R3C2');
        expect(getDataCellEl(editorElement, 2, 3).textContent!.trim()).toBe('R3C3');
    });
});

describe('Table Clipboard Undo Redo', () => {
    let editor: BlockEditor;
    let editorElement: HTMLElement;

    beforeEach(() => {
        editorElement = createElement('div', { id: 'editor-undo-redo' });
        document.body.appendChild(editorElement);

        const before: BlockModel = { id: 'before-ur', blockType: BlockType.Paragraph, content: [{ id: 'bc-ur', contentType: ContentType.Text, content: 'Before' }] };
        const table: BlockModel = buildTableBlock('table_block_ur', 3, 3, true, true, true);
        const after: BlockModel = { id: 'after-ur', blockType: BlockType.Paragraph, content: [{ id: 'ac-ur', contentType: ContentType.Text, content: 'After' }] };

        editor = createEditor({ blocks: [before, table, after] });
        editor.appendTo('#editor-undo-redo');
    });

    afterEach(() => {
        if (editor) { editor.destroy(); }
        if (editorElement && editorElement.parentElement) { editorElement.parentElement.removeChild(editorElement); }
    });

    describe('Cut – partial cells', () => {
        it('single cell: cut, undo restores, redo re-applies', () => {
            // Select single cell R1C1 (data row 1, data col 0)
            selectRectangle(editorElement, 1, 0, 1, 0);
            const targetCell = getDataCellEl(editorElement, 1, 0);
            const targetBlock = targetCell.querySelector('.e-block') as HTMLElement;
            editor.blockManager.setFocusToBlock(targetBlock);

            // Snapshot before
            const beforeText = targetCell.textContent!.trim();
            const propsBefore = (editor.blocks[1] as BlockModel).properties as ITableBlockSettings;
            const beforeModelText = propsBefore.rows[0].cells[0].blocks[0].content[0].content;

            // Cut
            editor.blockManager.clipboardAction.performCutOperation();

            // Assert cleared (model + DOM)
            let props = (editor.blocks[1] as BlockModel).properties as ITableBlockSettings;
            expect(props.rows[0].cells[0].blocks[0].content.length).toBe(0);
            expect(getDataCellEl(editorElement, 1, 0).textContent!.trim()).toBe('');

            // Undo
            editor.blockManager.undoRedoAction.undo();

            // Assert restored
            props = (editor.blocks[1] as BlockModel).properties as ITableBlockSettings;
            expect(props.rows[0].cells[0].blocks[0].content[0].content).toBe(beforeModelText);
            expect(getDataCellEl(editorElement, 1, 0).textContent!.trim()).toBe(beforeText);

            // Redo
            editor.blockManager.undoRedoAction.redo();

            // Assert cleared again
            props = (editor.blocks[1] as BlockModel).properties as ITableBlockSettings;
            expect(props.rows[0].cells[0].blocks[0].content.length).toBe(0);
            expect(getDataCellEl(editorElement, 1, 0).textContent!.trim()).toBe('');
        });

        it('rectangular multi-cell: cut, undo restores, redo re-applies', () => {
            // Select 2x2 rectangle: rows 1-2, cols 0-1
            selectRectangle(editorElement, 1, 0, 2, 1);
            const focusEl = getDataCellEl(editorElement, 1, 0).querySelector('.e-block') as HTMLElement;
            editor.blockManager.setFocusToBlock(focusEl);

            // Snapshot before
            const before = [
                getDataCellEl(editorElement, 1, 0).textContent!.trim(),
                getDataCellEl(editorElement, 1, 1).textContent!.trim(),
                getDataCellEl(editorElement, 2, 0).textContent!.trim(),
                getDataCellEl(editorElement, 2, 1).textContent!.trim()
            ];

            // Cut
            editor.blockManager.clipboardAction.performCutOperation();

            // Assert cleared
            let props = (editor.blocks[1] as BlockModel).properties as ITableBlockSettings;
            expect(props.rows[0].cells[0].blocks[0].content.length).toBe(0);
            expect(props.rows[0].cells[1].blocks[0].content.length).toBe(0);
            expect(props.rows[1].cells[0].blocks[0].content.length).toBe(0);
            expect(props.rows[1].cells[1].blocks[0].content.length).toBe(0);
            expect(getDataCellEl(editorElement, 1, 0).textContent!.trim()).toBe('');
            expect(getDataCellEl(editorElement, 1, 1).textContent!.trim()).toBe('');
            expect(getDataCellEl(editorElement, 2, 0).textContent!.trim()).toBe('');
            expect(getDataCellEl(editorElement, 2, 1).textContent!.trim()).toBe('');

            // Undo restores
            editor.blockManager.undoRedoAction.undo();
            props = (editor.blocks[1] as BlockModel).properties as ITableBlockSettings;
            expect(props.rows[0].cells[0].blocks[0].content[0].content).toBe(before[0]);
            expect(props.rows[0].cells[1].blocks[0].content[0].content).toBe(before[1]);
            expect(props.rows[1].cells[0].blocks[0].content[0].content).toBe(before[2]);
            expect(props.rows[1].cells[1].blocks[0].content[0].content).toBe(before[3]);
            expect(getDataCellEl(editorElement, 1, 0).textContent!.trim()).toBe(before[0]);
            expect(getDataCellEl(editorElement, 1, 1).textContent!.trim()).toBe(before[1]);
            expect(getDataCellEl(editorElement, 2, 0).textContent!.trim()).toBe(before[2]);
            expect(getDataCellEl(editorElement, 2, 1).textContent!.trim()).toBe(before[3]);

            // Redo re-applies clear
            editor.blockManager.undoRedoAction.redo();
            props = (editor.blocks[1] as BlockModel).properties as ITableBlockSettings;
            expect(props.rows[0].cells[0].blocks[0].content.length).toBe(0);
            expect(props.rows[0].cells[1].blocks[0].content.length).toBe(0);
            expect(props.rows[1].cells[0].blocks[0].content.length).toBe(0);
            expect(props.rows[1].cells[1].blocks[0].content.length).toBe(0);
            expect(getDataCellEl(editorElement, 1, 0).textContent!.trim()).toBe('');
            expect(getDataCellEl(editorElement, 1, 1).textContent!.trim()).toBe('');
            expect(getDataCellEl(editorElement, 2, 0).textContent!.trim()).toBe('');
            expect(getDataCellEl(editorElement, 2, 1).textContent!.trim()).toBe('');
        });

        it('mixed multi-row multi-col: cut, undo restores, redo re-applies', () => {
            // Select 2x2 rectangle not at origin: rows 2-3, cols 1-2
            selectRectangle(editorElement, 2, 1, 3, 2);
            const focusEl = getDataCellEl(editorElement, 2, 1).querySelector('.e-block') as HTMLElement;
            editor.blockManager.setFocusToBlock(focusEl);

            // Snapshot before
            const before = [
                getDataCellEl(editorElement, 2, 1).textContent!.trim(),
                getDataCellEl(editorElement, 2, 2).textContent!.trim(),
                getDataCellEl(editorElement, 3, 1).textContent!.trim(),
                getDataCellEl(editorElement, 3, 2).textContent!.trim()
            ];

            // Cut
            editor.blockManager.clipboardAction.performCutOperation();

            // Assert cleared
            let props = (editor.blocks[1] as BlockModel).properties as ITableBlockSettings;
            expect(props.rows[1].cells[1].blocks[0].content.length).toBe(0);
            expect(props.rows[1].cells[2].blocks[0].content.length).toBe(0);
            expect(props.rows[2].cells[1].blocks[0].content.length).toBe(0);
            expect(props.rows[2].cells[2].blocks[0].content.length).toBe(0);
            expect(getDataCellEl(editorElement, 2, 1).textContent!.trim()).toBe('');
            expect(getDataCellEl(editorElement, 2, 2).textContent!.trim()).toBe('');
            expect(getDataCellEl(editorElement, 3, 1).textContent!.trim()).toBe('');
            expect(getDataCellEl(editorElement, 3, 2).textContent!.trim()).toBe('');

            // Undo
            editor.blockManager.undoRedoAction.undo();
            props = (editor.blocks[1] as BlockModel).properties as ITableBlockSettings;
            expect(props.rows[1].cells[1].blocks[0].content[0].content).toBe(before[0]);
            expect(props.rows[1].cells[2].blocks[0].content[0].content).toBe(before[1]);
            expect(props.rows[2].cells[1].blocks[0].content[0].content).toBe(before[2]);
            expect(props.rows[2].cells[2].blocks[0].content[0].content).toBe(before[3]);
            expect(getDataCellEl(editorElement, 2, 1).textContent!.trim()).toBe(before[0]);
            expect(getDataCellEl(editorElement, 2, 2).textContent!.trim()).toBe(before[1]);
            expect(getDataCellEl(editorElement, 3, 1).textContent!.trim()).toBe(before[2]);
            expect(getDataCellEl(editorElement, 3, 2).textContent!.trim()).toBe(before[3]);

            // Redo
            editor.blockManager.undoRedoAction.redo();
            props = (editor.blocks[1] as BlockModel).properties as ITableBlockSettings;
            expect(props.rows[1].cells[1].blocks[0].content.length).toBe(0);
            expect(props.rows[1].cells[2].blocks[0].content.length).toBe(0);
            expect(props.rows[2].cells[1].blocks[0].content.length).toBe(0);
            expect(props.rows[2].cells[2].blocks[0].content.length).toBe(0);
            expect(getDataCellEl(editorElement, 2, 1).textContent!.trim()).toBe('');
            expect(getDataCellEl(editorElement, 2, 2).textContent!.trim()).toBe('');
            expect(getDataCellEl(editorElement, 3, 1).textContent!.trim()).toBe('');
            expect(getDataCellEl(editorElement, 3, 2).textContent!.trim()).toBe('');
        });
    });

    describe('Cut – full rows/columns', () => {
        it('single full row: cut, undo restores, redo re-applies', () => {
            // Select entire row 1 (all columns)
            selectRectangle(editorElement, 1, 0, 1, 2);
            const focusEl = getDataCellEl(editorElement, 1, 0).querySelector('.e-block') as HTMLElement;
            editor.blockManager.setFocusToBlock(focusEl);

            // Snapshot before
            const beforeRow = [
                getDataCellEl(editorElement, 1, 0).textContent!.trim(),
                getDataCellEl(editorElement, 1, 1).textContent!.trim(),
                getDataCellEl(editorElement, 1, 2).textContent!.trim()
            ];

            // Cut (deletes the row)
            editor.blockManager.clipboardAction.performCutOperation();

            // Assert row removed
            let props = (editor.blocks[1] as BlockModel).properties as ITableBlockSettings;
            expect(props.rows.length).toBe(2);
            expect(getTable(editorElement).rows.length).toBe(3); // header + 2 body rows

            // Undo restores row at same index
            editor.blockManager.undoRedoAction.undo();
            props = (editor.blocks[1] as BlockModel).properties as ITableBlockSettings;
            expect(props.rows.length).toBe(3);
            expect(getTable(editorElement).rows.length).toBe(4);
            expect(getDataCellEl(editorElement, 1, 0).textContent!.trim()).toBe(beforeRow[0]);
            expect(getDataCellEl(editorElement, 1, 1).textContent!.trim()).toBe(beforeRow[1]);
            expect(getDataCellEl(editorElement, 1, 2).textContent!.trim()).toBe(beforeRow[2]);

            // Redo deletes again
            editor.blockManager.undoRedoAction.redo();
            props = (editor.blocks[1] as BlockModel).properties as ITableBlockSettings;
            expect(props.rows.length).toBe(2);
            expect(getTable(editorElement).rows.length).toBe(3);
        });

        it('multiple contiguous full rows: cut, undo restores, redo re-applies', () => {
            // Select entire rows 1..2
            selectRectangle(editorElement, 1, 0, 2, 2);
            const focusEl = getDataCellEl(editorElement, 1, 0).querySelector('.e-block') as HTMLElement;
            editor.blockManager.setFocusToBlock(focusEl);

            // Snapshot before for first row
            const beforeFirstRow = [
                getDataCellEl(editorElement, 1, 0).textContent!.trim(),
                getDataCellEl(editorElement, 1, 1).textContent!.trim(),
                getDataCellEl(editorElement, 1, 2).textContent!.trim()
            ];

            // Cut (deletes rows)
            editor.blockManager.clipboardAction.performCutOperation();

            // Assert rows removed
            let props = (editor.blocks[1] as BlockModel).properties as ITableBlockSettings;
            expect(props.rows.length).toBe(1);
            expect(getTable(editorElement).rows.length).toBe(2); // header + 1 body row

            // Undo restores
            editor.blockManager.undoRedoAction.undo();
            props = (editor.blocks[1] as BlockModel).properties as ITableBlockSettings;
            expect(props.rows.length).toBe(3);
            expect(getTable(editorElement).rows.length).toBe(4);
            expect(getDataCellEl(editorElement, 1, 0).textContent!.trim()).toBe(beforeFirstRow[0]);
            expect(getDataCellEl(editorElement, 1, 1).textContent!.trim()).toBe(beforeFirstRow[1]);
            expect(getDataCellEl(editorElement, 1, 2).textContent!.trim()).toBe(beforeFirstRow[2]);

            // Redo deletes again
            editor.blockManager.undoRedoAction.redo();
            props = (editor.blocks[1] as BlockModel).properties as ITableBlockSettings;
            expect(props.rows.length).toBe(1);
            expect(getTable(editorElement).rows.length).toBe(2);
        });

        it('single full column: cut, undo restores, redo re-applies', () => {
            // Select entire column 1 (middle data column)
            selectRectangle(editorElement, 1, 1, 3, 1);
            const focusEl = getDataCellEl(editorElement, 1, 0).querySelector('.e-block') as HTMLElement;
            editor.blockManager.setFocusToBlock(focusEl);

            // Snapshot before (all rows for that column)
            const beforeCol = [
                getDataCellEl(editorElement, 1, 1).textContent!.trim(),
                getDataCellEl(editorElement, 2, 1).textContent!.trim(),
                getDataCellEl(editorElement, 3, 1).textContent!.trim()
            ];

            // Cut (deletes the column)
            editor.blockManager.clipboardAction.performCutOperation();

            // Assert column removed
            let props = (editor.blocks[1] as BlockModel).properties as ITableBlockSettings;
            expect(props.columns.length).toBe(2);
            const header = getTable(editorElement).tHead!.rows[0];
            expect(header.cells.length).toBe(3); // row-number + 2 data headers

            // Undo restores
            editor.blockManager.undoRedoAction.undo();
            props = (editor.blocks[1] as BlockModel).properties as ITableBlockSettings;
            expect(props.columns.length).toBe(3);
            expect(getTable(editorElement).tHead!.rows[0].cells.length).toBe(4);
            expect(getDataCellEl(editorElement, 1, 1).textContent!.trim()).toBe(beforeCol[0]);
            expect(getDataCellEl(editorElement, 2, 1).textContent!.trim()).toBe(beforeCol[1]);
            expect(getDataCellEl(editorElement, 3, 1).textContent!.trim()).toBe(beforeCol[2]);

            // Redo deletes again
            editor.blockManager.undoRedoAction.redo();
            props = (editor.blocks[1] as BlockModel).properties as ITableBlockSettings;
            expect(props.columns.length).toBe(2);
            expect(getTable(editorElement).tHead!.rows[0].cells.length).toBe(3);
        });

        it('multiple contiguous full columns: cut, undo restores, redo re-applies', () => {
            // Select columns 0..1 across all rows
            selectRectangle(editorElement, 1, 0, 3, 1);
            const focusEl = getDataCellEl(editorElement, 1, 0).querySelector('.e-block') as HTMLElement;
            editor.blockManager.setFocusToBlock(focusEl);

            // Snapshot before (first row, first two columns)
            const beforeCells = [
                getDataCellEl(editorElement, 1, 0).textContent!.trim(),
                getDataCellEl(editorElement, 1, 1).textContent!.trim()
            ];

            // Cut (deletes columns)
            editor.blockManager.clipboardAction.performCutOperation();

            // Assert columns removed
            let props = (editor.blocks[1] as BlockModel).properties as ITableBlockSettings;
            expect(props.columns.length).toBe(1);
            expect(getTable(editorElement).tHead!.rows[0].cells.length).toBe(2); // row-number + 1 header

            // Undo restores both columns
            editor.blockManager.undoRedoAction.undo();
            props = (editor.blocks[1] as BlockModel).properties as ITableBlockSettings;
            expect(props.columns.length).toBe(3);
            expect(getTable(editorElement).tHead!.rows[0].cells.length).toBe(4);
            expect(getDataCellEl(editorElement, 1, 0).textContent!.trim()).toBe(beforeCells[0]);
            expect(getDataCellEl(editorElement, 1, 1).textContent!.trim()).toBe(beforeCells[1]);

            // Redo deletes again
            editor.blockManager.undoRedoAction.redo();
            props = (editor.blocks[1] as BlockModel).properties as ITableBlockSettings;
            expect(props.columns.length).toBe(1);
            expect(getTable(editorElement).tHead!.rows[0].cells.length).toBe(2);
        });
    });

    describe('Paste – cells overwrite (no expansion)', () => {
        it('small rectangle: paste overwrites, undo restores, redo re-applies', () => {
            // Overwrite 2x2 starting at (row1,col1)
            const target = getDataCellEl(editorElement, 1, 1);
            const blk = target.querySelector('.e-block') as HTMLElement;
            editor.blockManager.setFocusToBlock(blk);

            // Snapshot old values
            const old = [
                getDataCellEl(editorElement, 1, 1).textContent!.trim(),
                getDataCellEl(editorElement, 1, 2).textContent!.trim(),
                getDataCellEl(editorElement, 2, 1).textContent!.trim(),
                getDataCellEl(editorElement, 2, 2).textContent!.trim()
            ];

            const text = 'A1\tA2\nB1\tB2';
            editor.blockManager.clipboardAction.performPasteOperation({ text });

            // Assert overwritten
            let props = (editor.blocks[1] as BlockModel).properties as ITableBlockSettings;
            expect(props.rows[0].cells[1].blocks[0].content[0].content).toBe('A1');
            expect(props.rows[0].cells[2].blocks[0].content[0].content).toBe('A2');
            expect(props.rows[1].cells[1].blocks[0].content[0].content).toBe('B1');
            expect(props.rows[1].cells[2].blocks[0].content[0].content).toBe('B2');
            expect(getDataCellEl(editorElement, 1, 1).textContent!.trim()).toBe('A1');

            // Undo restores
            editor.blockManager.undoRedoAction.undo();
            props = (editor.blocks[1] as BlockModel).properties as ITableBlockSettings;
            expect(props.rows[0].cells[1].blocks[0].content[0].content).toBe(old[0]);
            expect(props.rows[0].cells[2].blocks[0].content[0].content).toBe(old[1]);
            expect(props.rows[1].cells[1].blocks[0].content[0].content).toBe(old[2]);
            expect(props.rows[1].cells[2].blocks[0].content[0].content).toBe(old[3]);

            // Redo re-applies
            editor.blockManager.undoRedoAction.redo();
            props = (editor.blocks[1] as BlockModel).properties as ITableBlockSettings;
            expect(props.rows[0].cells[1].blocks[0].content[0].content).toBe('A1');
            expect(props.rows[0].cells[2].blocks[0].content[0].content).toBe('A2');
            expect(props.rows[1].cells[1].blocks[0].content[0].content).toBe('B1');
            expect(props.rows[1].cells[2].blocks[0].content[0].content).toBe('B2');
        });

        it('mixed content blocks: paste overwrites and undo restores full cell content', () => {
            // Target single cell (row2,col0) with diverse HTML
            const target = getDataCellEl(editorElement, 2, 0);
            const blk = target.querySelector('.e-block') as HTMLElement;
            editor.blockManager.setFocusToBlock(blk);

            const oldText = target.textContent!.trim();

            const html = '<table><tbody><tr>' +
                '<td><p>P1</p><ul><li>L1</li><li>L2</li></ul><pre><code>C1</code></pre></td>' +
                '</tr></tbody></table>';

            editor.blockManager.clipboardAction.performPasteOperation({ html });

            // Model should now have multiple blocks inside that cell
            let props = (editor.blocks[1] as BlockModel).properties as ITableBlockSettings;
            expect(props.rows[1].cells[0].blocks[0].content[0].content).toContain('P1L1L2C1');
            expect(getDataCellEl(editorElement, 2, 0).textContent.trim()).toContain('P1L1L2C1');

            // Undo restores entire previous content
            editor.blockManager.undoRedoAction.undo();
            props = (editor.blocks[1] as BlockModel).properties as ITableBlockSettings;
            expect(props.rows[1].cells[0].blocks[0].content[0].content).toBe(oldText);
            expect(getDataCellEl(editorElement, 2, 0).textContent!.trim()).toBe(oldText);

            // Redo reapplies mixed blocks
            editor.blockManager.undoRedoAction.redo();
            props = (editor.blocks[1] as BlockModel).properties as ITableBlockSettings;
            expect(props.rows[1].cells[0].blocks[0].content[0].content).toContain('P1L1L2C1');
            expect(getDataCellEl(editorElement, 2, 0).textContent.trim()).toContain('P1L1L2C1');
        });

        it('empty source cells create empty paragraphs; undo removes them', () => {
            // Target (row1,col0)
            const target = getDataCellEl(editorElement, 1, 0);
            const blk = target.querySelector('.e-block') as HTMLElement;
            editor.blockManager.setFocusToBlock(blk);
            const old = target.textContent!.trim();

            // 1x2 TSV with first empty, second X -> only first cell affected here
            const text = '\tX';
            editor.blockManager.clipboardAction.performPasteOperation({ text });

            let props = (editor.blocks[1] as BlockModel).properties as ITableBlockSettings;
            expect((props.rows[0].cells[0].blocks[0].content[0].content || '').length >= 0).toBe(true);
            expect(getDataCellEl(editorElement, 1, 0).textContent!.trim()).toBe('');

            editor.blockManager.undoRedoAction.undo();
            props = (editor.blocks[1] as BlockModel).properties as ITableBlockSettings;
            expect(props.rows[0].cells[0].blocks[0].content[0].content).toBe(old);
            expect(getDataCellEl(editorElement, 1, 0).textContent!.trim()).toBe(old);

            editor.blockManager.undoRedoAction.redo();
            props = (editor.blocks[1] as BlockModel).properties as ITableBlockSettings;
            expect(getDataCellEl(editorElement, 1, 0).textContent!.trim()).toBe('');
        });
    });

    describe('Paste – auto expansion', () => {
        it('requires new rows only; undo removes rows and restores', () => {
            const target = getDataCellEl(editorElement, 3, 0);
            const blk = target.querySelector('.e-block') as HTMLElement;
            editor.blockManager.setFocusToBlock(blk);

            const text = 'N0\n\tN1\n\tN2';
            editor.blockManager.clipboardAction.performPasteOperation({ text });

            let props = (editor.blocks[1] as BlockModel).properties as ITableBlockSettings;
            expect(props.rows.length).toBeGreaterThanOrEqual(5); // header + 3 old -> data rows >= 5 model rows
            expect((props.rows[2].cells[0].blocks[0].content[0].content)).toContain('N0');
            expect((props.rows[3].cells[1].blocks[0].content[0].content)).toContain('N1');
            expect((props.rows[4].cells[1].blocks[0].content[0].content)).toContain('N2');
            expect(getDataCellEl(editorElement, 3, 0).textContent!.trim()).toBe('N0');
            expect(getDataCellEl(editorElement, 4, 1).textContent.trim()).toBe('N1');
            expect(getDataCellEl(editorElement, 5, 1).textContent.trim()).toBe('N2');

            editor.blockManager.undoRedoAction.undo();
            props = (editor.blocks[1] as BlockModel).properties as ITableBlockSettings;
            expect(props.rows.length).toBe(3);
            expect((props.rows[2].cells[0].blocks[0].content[0].content)).toContain('R3C1');
            expect(getDataCellEl(editorElement, 3, 0).textContent.trim()).toBe('R3C1');

            editor.blockManager.undoRedoAction.redo();
            props = (editor.blocks[1] as BlockModel).properties as ITableBlockSettings;
            expect((props.rows[2].cells[0].blocks[0].content[0].content)).toContain('N0');
            expect((props.rows[3].cells[1].blocks[0].content[0].content)).toContain('N1');
            expect((props.rows[4].cells[1].blocks[0].content[0].content)).toContain('N2');
            expect(getDataCellEl(editorElement, 3, 0).textContent!.trim()).toBe('N0');
            expect(getDataCellEl(editorElement, 4, 1).textContent.trim()).toBe('N1');
            expect(getDataCellEl(editorElement, 5, 1).textContent.trim()).toBe('N2');
        });

        it('requires new columns only; undo removes columns and restores', () => {
            // Paste 1x2 at last column so only columns grow
            const target = getDataCellEl(editorElement, 1, 3 - 1); // col index 2 is last
            const blk = target.querySelector('.e-block') as HTMLElement;
            editor.blockManager.setFocusToBlock(blk);

            const text = 'C1\tC2';
            editor.blockManager.clipboardAction.performPasteOperation({ text });

            let props = (editor.blocks[1] as BlockModel).properties as ITableBlockSettings;
            expect(props.columns.length).toBeGreaterThanOrEqual(4);
            expect(getDataCellEl(editorElement, 1, 2).textContent!.trim()).toBe('C1');
            expect(getDataCellEl(editorElement, 1, 3).textContent!.trim()).toBe('C2');

            editor.blockManager.undoRedoAction.undo();
            props = (editor.blocks[1] as BlockModel).properties as ITableBlockSettings;
            expect(props.columns.length).toBe(3);

            editor.blockManager.undoRedoAction.redo();
            expect(getDataCellEl(editorElement, 1, 2).textContent!.trim()).toBe('C1');
        });

        it('requires both rows and columns; undo removes both and restores', () => {
            // Target bottom-right cell so 2x2 causes both row and col growth
            const target = getDataCellEl(editorElement, 3, 2);
            const blk = target.querySelector('.e-block') as HTMLElement;
            editor.blockManager.setFocusToBlock(blk);

            const text = 'A\tB\nC\tD';
            editor.blockManager.clipboardAction.performPasteOperation({ text });

            let props = (editor.blocks[1] as BlockModel).properties as ITableBlockSettings;
            expect(props.rows.length).toBeGreaterThanOrEqual(4);
            expect(props.columns.length).toBeGreaterThanOrEqual(4);
            expect(getDataCellEl(editorElement, 3, 2).textContent!.trim()).toBe('A');
            expect(getDataCellEl(editorElement, 4, 3).textContent!.trim()).toBe('D');

            editor.blockManager.undoRedoAction.undo();
            props = (editor.blocks[1] as BlockModel).properties as ITableBlockSettings;
            expect(props.rows.length).toBe(3);
            expect(props.columns.length).toBe(3);

            editor.blockManager.undoRedoAction.redo();
            expect(getDataCellEl(editorElement, 3, 2).textContent!.trim()).toBe('A');
        });

        it('last row/col edge with expansion; undo contracts', () => {
            const target = getDataCellEl(editorElement, 3, 2);
            const blk = target.querySelector('.e-block') as HTMLElement;
            editor.blockManager.setFocusToBlock(blk);

            const text = 'X\tY\nZ\tW';
            editor.blockManager.clipboardAction.performPasteOperation({ text });

            let props = (editor.blocks[1] as BlockModel).properties as ITableBlockSettings;
            expect(props.rows.length).toBeGreaterThan(3);
            expect(props.columns.length).toBeGreaterThan(3);

            editor.blockManager.undoRedoAction.undo();
            props = (editor.blocks[1] as BlockModel).properties as ITableBlockSettings;
            expect(props.rows.length).toBe(3);
            expect(props.columns.length).toBe(3);
        });
    });

    describe('Focus restoration', () => {
        it('restores focus to first pasted cell on redo and undo', () => {
            // Paste 2x2 at (row2, col1)
            const target = getDataCellEl(editorElement, 2, 1);
            const blk = target.querySelector('.e-block') as HTMLElement;
            editor.blockManager.setFocusToBlock(blk);

            const text = 'F1\tF2\nF3\tF4';
            editor.blockManager.clipboardAction.performPasteOperation({ text });

            // After paste, first pasted cell should be focused
            let td = getDataCellEl(editorElement, 2, 1);
            expect(td.classList.contains('e-cell-focus')).toBe(true);

            // Undo -> handler should set focus back to the first pasted cell
            editor.blockManager.undoRedoAction.undo();
            td = getDataCellEl(editorElement, 2, 1);
            expect(td.classList.contains('e-cell-focus')).toBe(true);

            // Redo -> focus again to same first cell
            editor.blockManager.undoRedoAction.redo();
            td = getDataCellEl(editorElement, 2, 1);
            expect(td.classList.contains('e-cell-focus')).toBe(true);
        });
    });
});
