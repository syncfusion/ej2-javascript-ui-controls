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
 * @param {Element} table - The table element
 * @returns {void}
 *
 * @hidden
 */
export function removeFocusFromAllCells(table: Element): void {
    const focusedCells: NodeListOf<HTMLElement> = table.querySelectorAll('.' + constants.TABLE_CELL_FOCUS);
    if (focusedCells) {
        focusedCells.forEach((cell: HTMLElement) => {
            cell.classList.remove(constants.TABLE_CELL_FOCUS);
            cell.scrollLeft = 0;
        });
    }
}

/**
 * Returns the current width mode ('px' | 'percent')
 *
 * @param {HTMLTableElement} table - The table element
 * @returns {string} - width mode ('px' | 'percent')
 *
 * @hidden
 */
export function getWidthMode(table: HTMLTableElement): 'px' | 'percent' {
    return table.getAttribute('data-col-width-mode') === 'px' ? 'px' : 'percent';
}

/**
 * Sets the table width mode ('px' | 'percent')
 *
 * @param {HTMLTableElement} table - The table element
 * @param {string} mode - mode ('px' | 'percent')
 * @returns {void}
 *
 * @hidden
 */
export function setTableWidthMode(table: HTMLTableElement, mode: 'px' | 'percent'): void {
    table.setAttribute('data-col-width-mode', mode);
}

/**
 * Performs equal percentage distribution for all cols
 *
 * @param {HTMLTableElement} table - The table element
 * @param {ITableBlockSettings} props - The table settings
 * @returns {void}
 *
 * @hidden
 */
export function applyEqualPercent(table: HTMLTableElement, props: ITableBlockSettings): void {
    const colgroup: HTMLTableColElement = table.querySelector('colgroup') as HTMLTableColElement;
    const n: number = props.columns.length;
    const pct: number = 100 / Math.max(1, n);
    for (let i: number = 0; i < n; i++) {
        const domIdx: number = props.enableRowNumbers ? i + 1 : i;
        const colEl: HTMLTableColElement = colgroup.children[domIdx as number] as HTMLTableColElement;
        colEl.style.width = `${pct.toFixed(2)}%`;
        props.columns[i as number].width = `${pct.toFixed(2)}%`;
    }

    setTableWidthMode(table, 'percent');
}

/**
 * Checks whether equal percent fits within the container
 *
 * @param {number} containerWidthPx - The table container width
 * @param {number} nCols - Total number of cols
 * @param {number} minColPx - The minimum value of a column
 * @returns {boolean} - The boolean value
 *
 * @hidden
 */
export function projectEqualPercentFits(containerWidthPx: number, nCols: number, minColPx: number): boolean {
    const pct: number = 100 / Math.max(1, nCols);
    const projectedPx: number = containerWidthPx * (pct / 100);
    return projectedPx >= minColPx;
}

/**
 * Changes width of all columns from percent to pixel units
 *
 * @param {HTMLTableElement} table - The table element
 * @param {ITableBlockSettings} props - The table settings
 * @param {object} defaultPxForNew - Default values of new col
 * @returns {void}
 *
 * @hidden
 */
export function changeColWidthToPxUnits(
    table: HTMLTableElement,
    props: ITableBlockSettings,
    defaultPxForNew?: { index: number; width: number }
): void {
    const dataCols: HTMLTableColElement[] = getColgroupChildren(table);

    for (let i: number = 0; i < dataCols.length; i++) {
        let w: number = dataCols[i as number].getBoundingClientRect().width;
        if (defaultPxForNew && defaultPxForNew.index === i) {
            w = defaultPxForNew.width;
        }
        dataCols[i as number].style.width = `${w.toFixed(0)}px`;
        props.columns[i as number].width = `${w.toFixed(0)}px`;
    }
    setTableWidthMode(table, 'px');
}

export function getColgroupChildren(table: HTMLTableElement): HTMLTableColElement[] {
    const colgroup: HTMLTableColElement = table.querySelector('colgroup') as HTMLTableColElement;
    const dataCols: HTMLTableColElement[] = Array.from(colgroup.children)
        .filter((c: Element) => !(c as HTMLElement).classList.contains('e-col-row-number')) as HTMLTableColElement[];
    return dataCols;
}

export function getSelectedCells(tableBlock: HTMLElement): NodeListOf<HTMLTableCellElement> {
    const table: HTMLTableElement = tableBlock.querySelector('table') as HTMLTableElement;
    // 1. Whole row selection
    if (table.querySelector('tr.e-row-selected')) {
        return table.querySelectorAll('tr.e-row-selected td:not(.e-row-number)') as NodeListOf<HTMLTableCellElement>;
    }

    // 2. Whole column selection
    if (table.querySelector('td.e-col-selected')) {
        return table.querySelectorAll('td.e-col-selected, th.e-col-selected') as NodeListOf<HTMLTableCellElement>;
    }

    // 3. Default: individually focused cells
    return table.querySelectorAll(
        `td.${constants.TABLE_CELL_FOCUS}, th.${constants.TABLE_CELL_FOCUS}`
    ) as NodeListOf<HTMLTableCellElement>;
}

// Returns true if there is any visual selection in the table block
export function hasActiveTableSelection(tableBlockElement: HTMLElement): boolean {
    if (!tableBlockElement) { return false; }

    const selectedCells: NodeListOf<HTMLTableCellElement> = getSelectedCells(tableBlockElement);
    // Rectangle selection
    if (selectedCells && selectedCells.length > 1) { return true; }
    // Row selection
    if (tableBlockElement.querySelector('tbody tr.e-row-selected')) { return true; }
    // Column selection
    if (tableBlockElement.querySelector('td.e-col-selected, th.e-col-selected')) { return true; }
    return false;
}
