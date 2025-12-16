import { BlockModel, ITableBlockSettings } from '../../models/index';
import { getBlockModelById } from './block';
import * as constants from '../../common/constant';

export function toDomCol(dataCol: number, rowNumberEnabled: boolean): number {
    return rowNumberEnabled ? dataCol + 1 : dataCol;
}

export function toDomRow(dataRow: number, headerEnabled: boolean): number {
    return headerEnabled ? dataRow + 1 : dataRow;
}

export function toModelRow(domRow: number, headerEnabled: boolean): number {
    return headerEnabled ? domRow - 1 : domRow;
}

export function getDataCell(tableElement: HTMLTableElement, row: number, col: number): HTMLTableCellElement {
    return tableElement.querySelector(`td[data-row="${row}"][data-col="${col}"]`)
        || tableElement.querySelector(`th[data-row="${row}"][data-col="${col}"]`);
}

export function getHeaderCell(tableElement: HTMLTableElement, col: number): HTMLTableCellElement {
    const thead: HTMLTableSectionElement = tableElement.tHead;
    if (!thead) { return null; }
    // Try both dataset and index fallback
    let cell: HTMLTableCellElement = thead.querySelector(`th[data-row="0"][data-col="${col}"]`) as HTMLTableCellElement;
    if (!cell) { cell = thead.querySelectorAll('th')[col as number] as HTMLTableCellElement; }
    return cell || null;
}

export function doesHtmlHasTable(html: string, text?: string): boolean {
    const htmlHasTable: boolean = !!(html && /<table[\s\S]*?>[\s\S]*?<\/table>/i.test(html));
    const textLooksTabular: boolean = !!(text && (text.indexOf('\t') !== -1 || /\r?\n.*\t/.test(text)));
    return htmlHasTable || textLooksTabular;
}

export function getTableElements(
    blockId: string,
    rootEditorElement: HTMLElement,
    blocks: BlockModel[]
): { table: HTMLTableElement, props: ITableBlockSettings } | null {
    const blockEl: HTMLElement = rootEditorElement.querySelector(`#${blockId}`);
    if (!blockEl) { return null; }
    const table: HTMLTableElement = blockEl.querySelector('table.e-table-element') as HTMLTableElement;
    if (!table) { return null; }
    const block: BlockModel = getBlockModelById(blockId, blocks);
    const props: any = (block && (block.properties as ITableBlockSettings)) || {};
    return { table, props };
}

/**
 * Focuses all editable cells in the table.
 * Useful for "Select All" (Ctrl+A) inside a table.
 *
 * @param {HTMLElement} tableEl - The <table> element inside the table block
 * @returns {void}
 *
 * @hidden
 */
export function focusAllCellsInTable(tableEl: HTMLTableElement): void {
    const cells: NodeListOf<HTMLElement> = tableEl.querySelectorAll('td[role="gridcell"]') as NodeListOf<HTMLElement>;
    cells.forEach((cell: HTMLElement) => {
        if (cell.classList.contains('e-row-number')) { return; }
        cell.classList.add(constants.TABLE_CELL_FOCUS);
    });
}

/**
 * Removes the focus highlight from all cells in the given table.
 *
 * @param {Element} table - The table element or any element containing the table
 * @returns {void}
 *
 * @hidden
 */
export function removeFocusFromAllCells(table: Element): void {
    const focusedCells: NodeListOf<HTMLElement> = table.querySelectorAll('.' + constants.TABLE_CELL_FOCUS);
    if (focusedCells) {
        focusedCells.forEach((cell: HTMLElement) => cell.classList.remove(constants.TABLE_CELL_FOCUS));
    }
}
