/* eslint-disable @typescript-eslint/no-explicit-any */

import { BlockEditor, BlockModel, BlockType, ContentType } from "../../src/index";
import { BlockEditorModel } from "../../src/blockeditor/base/blockeditor-model";
import { IHeadingBlockSettings, TableCellModel, TableColumnModel, ITableBlockSettings, TableRowModel } from '../../src/models/block/block-props';

export function createEditor(args: BlockEditorModel): BlockEditor {
    args.width = '400px';
    args.height = '400px';
    const editor: BlockEditor = new BlockEditor(args);
    return editor;
}

export function setRange(start: Node, end: Node, startOffset: number, endOffset: number) {
    const range: Range = document.createRange();
    const selection: Selection | null = window.getSelection();
    if (selection) {
        range.setStart(start, startOffset);
        range.setEnd(end, endOffset);
        selection.removeAllRanges();
        selection.addRange(range);
    }
}
export function createMockClipboardEvent(type: string, clipboardData: any = {}): ClipboardEvent {
    const event: any = {
        type,
        preventDefault: jasmine.createSpy(),
        clipboardData: clipboardData,
        bubbles: true,
        cancelable: true
    };
    return event as ClipboardEvent;
}
export function triggerMouseMove(node: HTMLElement, x: number, y: number): void {
    const event = new MouseEvent('mousemove', { bubbles: true, cancelable: true, clientX: x, clientY: y });
    node.dispatchEvent(event);
}

export function buildTableBlock(id: string, cols: number, rows: number, enableHeader = true, enableRowNumbers = true): BlockModel {
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

export function getTable(editorElement: HTMLElement): HTMLTableElement {
    return editorElement.querySelector('.e-table-block table') as HTMLTableElement;
}

export function getDataCell(editorElement: HTMLElement, row: number, col: number): HTMLTableCellElement {
    const table = getTable(editorElement);
    return table.querySelector(`td[data-row="${row}"][data-col="${col}"]`) as HTMLTableCellElement;
}

export function getHeaderCell(editorElement: HTMLElement, col: number): HTMLTableCellElement | null {
    const table = getTable(editorElement);
    const thead = table.tHead;
    if (!thead) { return null; }
    // Try both dataset and index fallback
    let cell = thead.querySelector(`th[data-row="0"][data-col="${col}"]`) as HTMLTableCellElement;
    if (!cell) { cell = thead.querySelectorAll('th')[col] as HTMLTableCellElement; }
    return cell || null;
}

export function getRowNumberCell(editorElement: HTMLElement, bodyRowIndex: number): HTMLTableCellElement {
    const table = getTable(editorElement);
    const tbodyRow = table.tBodies[0].rows[bodyRowIndex];
    return tbodyRow.querySelector('td.e-row-number') as HTMLTableCellElement;
}

export function getDataCellEl(editorElement: HTMLElement, row: number, col: number): HTMLTableCellElement {
    const table = getTable(editorElement);
    return table.querySelector(`td[data-row="${row}"][data-col="${col}"]`) as HTMLTableCellElement;
}

export function selectRectangle(editorElement: HTMLElement, startRow: number, startCol: number, endRow: number, endCol: number): void {
    const start = getDataCellEl(editorElement, startRow, startCol);
    const end = getDataCellEl(editorElement, endRow, endCol);
    start.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    end.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
    document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
}

export function selectHeaderRectangle(editorElement: HTMLElement, startCol: number, endCol: number): void {
    const start = getHeaderCell(editorElement, startCol);
    const end = getHeaderCell(editorElement, endCol);
    start.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    end.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
    document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
}