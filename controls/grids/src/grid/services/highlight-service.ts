import { IGrid } from '../base/interface';
import { Column } from '../models/column';
import { Row } from '../models/row';
import { HighlightSettingsModel } from '../models/highlight-settings';
import { isNullOrUndefined, getValue } from '@syncfusion/ej2-base';

/**
 * @hidden
 */
type RecordKey = string | number;

/**
 * @hidden
 */
interface IActiveCell {
    /** The highlighted cell element. */
    element: HTMLElement;
    /** The row index of the cell. */
    rowIndex: number;
    /** The column index of the cell. */
    colIndex: number;
    /** The settings used for the highlight. */
    settings: HighlightSettingsModel;
    /** The primary key value of the record in the highlighted cell. */
    key?: RecordKey;
    /** The time the highlight started, used to resume it after a re-render. */
    start: number;
}

/**
 * HighlightService handles cell and row highlighting when data changes.
 * It manages comparison logic, animation lifecycle, and provides methods to trigger highlights.
 *
 * @hidden
 */
export class HighlightService {
    private grid: IGrid;
    private previousData: Map<RecordKey, Object> = new Map();
    private animatingCells: Set<string> = new Set();
    private animatingRows: Set<number> = new Set();
    private timeoutIds: Map<string, ReturnType<typeof setTimeout>> = new Map();
    private activeCells: Map<string, IActiveCell> = new Map();

    constructor(grid: IGrid) {
        this.grid = grid;
    }

    /**
     * Initialize the service by storing initial data state.
     * Called when the grid is created or data is refreshed.
     */
    /**
     * Initialize the highlight service.
     * @returns {void}
     * @hidden
     */
    public initialize(): void {
        this.previousData.clear();
        const records: Object[] = this.grid.getCurrentViewRecords();
        if (Array.isArray(records)) {
            const storeRecord: (record: Object, index: number) => void = (record: Object, index: number) => {
                this.previousData.set(this.recordKey(record, index), this.cloneRecord(record));
            };
            records.forEach(storeRecord);
        }
    }

    /**
     * Compare a row's current data with its previous state.
     * @param {number} rowIndex - The row index to compare
     * @param {any} currentRecord - The current record data
     * @returns {number[] | null} Array of changed column indices, or null if no changes
     * @hidden
     */
    public compareRow(rowIndex: number, currentRecord: Object): number[] | null {
        // Keyed by primary key so a row that moved (sort/filter) is still compared with its own previous values
        const recordKey: RecordKey = this.recordKey(currentRecord, rowIndex);
        const previousRecord: Object = this.previousData.get(recordKey);

        // New row - no previous data to compare
        if (isNullOrUndefined(previousRecord)) {
            this.previousData.set(recordKey, this.cloneRecord(currentRecord));
            return null;
        }

        const changedColumns: number[] = [];
        const columns: Column[] = this.grid.getVisibleColumns();

        for (let colIndex: number = 0; colIndex < columns.length; colIndex++) {
            // eslint-disable-next-line security/detect-object-injection
            const column: Column = columns[colIndex];
            const field: string = column.field;
            if (!field) {
                continue;
            }

            const currentValue: unknown = this.getNestedValue(currentRecord, field);
            const previousValue: unknown = this.getNestedValue(previousRecord, field);

            if (!this.valuesEqual(currentValue, previousValue)) {
                changedColumns.push(colIndex);
            }
        }

        // Update the stored previous data
        if (changedColumns.length > 0) {
            this.previousData.set(recordKey, this.cloneRecord(currentRecord));
        }

        return changedColumns.length > 0 ? changedColumns : null;
    }

    /**
     * Highlight a single cell.
     * @param {HTMLElement} cellElement - The cell DOM element
     * @param {number} rowIndex - The row index
     * @param {number} colIndex - The column index
     * @param {HighlightSettingsModel} settings - Highlight configuration
     * @param {number} elapsed - The time already elapsed, used to resume a running highlight
     * @param {number} startTime - The time the highlight started, used to resume it after a re-render
     * @returns {void}
     * @hidden
     */
    public highlightCell(cellElement: HTMLElement, rowIndex: number, colIndex: number, settings: HighlightSettingsModel,
                         elapsed: number = 0, startTime?: number): void {
        if (!cellElement) {
            return;
        }

        // Identify the cell by its record, not its position, so a sort cannot make two cells collide
        const rowKey: RecordKey = this.getRowKey(cellElement);
        const cellKey: string = isNullOrUndefined(rowKey) ? `${rowIndex}-${colIndex}` : `k:${rowKey}-${colIndex}`;

        // Clear existing timeout if cell is being re-highlighted
        const existingTimeoutId: ReturnType<typeof setTimeout> = this.timeoutIds.get(cellKey);
        if (existingTimeoutId) {
            clearTimeout(existingTimeoutId);
            this.timeoutIds.delete(cellKey);
        }

        if (this.animatingCells.has(cellKey)) {
            // Restart animation by removing and re-adding the class
            cellElement.classList.remove('e-grid-cell-changed');
            void cellElement.offsetHeight; // Force reflow
        }

        // Add accessibility attributes
        cellElement.setAttribute('aria-label', 'Cell updated');
        cellElement.setAttribute('role', 'status');

        // Apply highlight style configuration
        this.applyHighlightStyle(cellElement, settings);
        if (elapsed > 0) {
            // Resume a flash that was already running on a replaced element instead of restarting it
            const flash: number = this.getDuration(settings.flashDuration, 500);
            cellElement.style.setProperty('animation-delay', `${-elapsed}ms, ${flash - elapsed}ms`);
        }

        // Add animation class
        cellElement.classList.add('e-grid-cell-changed');
        this.animatingCells.add(cellKey);
        this.activeCells.set(cellKey, { element: cellElement, rowIndex: rowIndex, colIndex: colIndex, settings: settings,
            key: rowKey, start: startTime || Date.now() });

        // Remove after animation completes
        const duration: number = Math.max(this.getTotalDuration(settings) - elapsed, 0);
        const onAnimationComplete: () => void = () => {
            cellElement.classList.remove('e-grid-cell-changed');
            this.clearHighlightStyle(cellElement);
            cellElement.removeAttribute('aria-label');
            cellElement.removeAttribute('role');
            this.animatingCells.delete(cellKey);
            this.activeCells.delete(cellKey);
            this.timeoutIds.delete(cellKey);
        };
        const timeoutId: ReturnType<typeof setTimeout> = setTimeout(onAnimationComplete, duration);
        this.timeoutIds.set(cellKey, timeoutId);
    }

    /**
     * Highlight a single row.
     * @param {HTMLElement} rowElement - The row DOM element
     * @param {number} rowIndex - The row index
     * @param {HighlightSettingsModel} settings - Highlight configuration
     * @returns {void}
     * @hidden
     */
    public highlightRow(rowElement: HTMLElement, rowIndex: number, settings: HighlightSettingsModel): void {
        if (!rowElement) {
            return;
        }
        // Flash every cell of the row so it uses the same colors as a cell flash and restarts any running cell flash
        const cells: NodeListOf<Element> = rowElement.querySelectorAll('.e-rowcell');
        for (let colIndex: number = 0; colIndex < cells.length; colIndex++) {
            this.highlightCell(cells[colIndex as number] as HTMLElement, rowIndex, colIndex, settings);
        }
    }

    /**
     * Highlight multiple cells at once.
     * Useful for batch updates or formula-driven highlighting.
     *
     * @param {Array<{rowIndex: number, colIndex: number}>} cellIndices - Array of cell positions
     * @param {HighlightSettingsModel} settings - Highlight configuration
     * @returns {void}
     * @hidden
     */
    public highlightCells(cellIndices: Array<{rowIndex: number; colIndex: number}>, settings: HighlightSettingsModel): void {
        const onCellHighlight: (cell: {rowIndex: number; colIndex: number}) => void = (cell: {rowIndex: number; colIndex: number}) => {
            const element: Element = this.grid.getCellFromIndex(cell.rowIndex, cell.colIndex);
            if (element && element instanceof HTMLElement) {
                this.highlightCell(element, cell.rowIndex, cell.colIndex, settings);
            }
        };
        cellIndices.forEach(onCellHighlight);
    }

    /**
     * Highlight multiple rows at once.
     *
     * @param {number[]} rowIndices - Array of row indices
     * @param {HighlightSettingsModel} settings - Highlight configuration
     * @returns {void}
     * @hidden
     */
    public highlightRows(rowIndices: number[], settings: HighlightSettingsModel): void {
        const onRowHighlight: (rowIndex: number) => void = (rowIndex: number) => {
            const element: Element = this.grid.getRowByIndex(rowIndex);
            if (element && element instanceof HTMLElement) {
                this.highlightRow(element, rowIndex, settings);
            }
        };
        rowIndices.forEach(onRowHighlight);
    }

    /**
     * Re-apply running highlights whose cell element was replaced by a re-render
     * (virtual scrolling, infinite scrolling and DOM virtualization rebuild rows after a save).
     * @returns {void}
     * @hidden
     */
    public reapplyDetached(): void {
        const items: IActiveCell[] = [];
        this.activeCells.forEach((item: IActiveCell) => items.push(item));
        items.forEach((item: IActiveCell) => {
            // Still attached and still showing the same record: nothing to do. The element can also be reused
            // for a different record (sorting/infinite scroll), in which case the flash must move with the record.
            if (item.element.isConnected && (isNullOrUndefined(item.key) || this.getRowKey(item.element) === item.key)) {
                return;
            }
            if (item.element.isConnected) {
                this.clearCellHighlight(item.element);
            }
            const oldKey: string = isNullOrUndefined(item.key) ? `${item.rowIndex}-${item.colIndex}` : `k:${item.key}-${item.colIndex}`;
            // Look the record up in the rendered rows; the grid's row objects can lag behind the DOM at this point.
            const located: {cell: HTMLElement; rowIndex: number} = isNullOrUndefined(item.key) ? null
                : this.findRenderedCell(item.key, item.colIndex);
            const cell: Element = isNullOrUndefined(item.key) ? this.grid.getCellFromIndex(item.rowIndex, item.colIndex)
                : located && located.cell;
            const elapsed: number = Date.now() - item.start;
            clearTimeout(this.timeoutIds.get(oldKey));
            this.timeoutIds.delete(oldKey);
            this.animatingCells.delete(oldKey);
            this.activeCells.delete(oldKey);
            if (cell && cell instanceof HTMLElement && elapsed < this.getTotalDuration(item.settings)) {
                this.highlightCell(cell, located ? located.rowIndex : item.rowIndex, item.colIndex, item.settings, elapsed, item.start);
            }
        });
    }

    /**
     * Clear all highlight state and remove any active animations.
     * @returns {void}
     * @hidden
     */
    public clearHighlights(): void {
        // activeCells keeps the element of every running flash, so no grid lookup is needed (the grid may be destroyed)
        this.activeCells.forEach((item: IActiveCell) => {
            item.element.classList.remove('e-grid-cell-changed');
            this.clearHighlightStyle(item.element);
        });
        this.animatingCells.clear();
        this.activeCells.clear();

        const onClearRow: (rowIndex: number) => void = (rowIndex: number) => {
            const element: Element = this.grid.isDestroyed ? null : this.grid.getRowByIndex(rowIndex);
            if (element && element instanceof HTMLElement) {
                element.classList.remove('e-grid-row-changed');
            }
        };
        this.animatingRows.forEach(onClearRow);
        this.animatingRows.clear();
    }

    /**
     * Destroy the service and clean up resources.
     * @returns {void}
     * @hidden
     */
    public destroy(): void {
        this.clearHighlights();

        // Clear all timeout references to prevent memory leaks
        this.timeoutIds.forEach((timeoutId: ReturnType<typeof setTimeout>) => {
            clearTimeout(timeoutId);
        });
        this.timeoutIds.clear();

        this.previousData.clear();
        this.animatingCells.clear();
        this.animatingRows.clear();
    }

    // Private helper methods

    /**
     * Clone a record to store for comparison.
     * Performs a shallow clone of the record properties.
     * @param {any} record - The record to clone
     * @returns {any} The cloned record
     * @hidden
     */
    private cloneRecord(record: Object): Object {
        if (isNullOrUndefined(record)) {
            return null;
        }
        return Object.assign({}, record);
    }

    /**
     * Get a nested property value using dot notation (e.g., 'user.name').
     * @param {any} obj - The object to traverse
     * @param {string} path - The property path with dot notation
     * @returns {any} The nested value
     * @hidden
     */
    private getNestedValue(obj: Object, path: string): unknown {
        if (isNullOrUndefined(obj) || !path) {
            return undefined;
        }

        const keys: string[] = path.split('.');
        let value: unknown = obj;

        for (const key of keys) {
            if (isNullOrUndefined(value)) {
                return undefined;
            }
            // eslint-disable-next-line security/detect-object-injection
            const keyValue: unknown = (value as Object)[key];
            value = keyValue;
        }

        return value;
    }

    /**
     * Compare two values for equality, handling different types.
     * @param {any} val1 - The first value
     * @param {any} val2 - The second value
     * @returns {boolean} True if equal
     * @hidden
     */
    private valuesEqual(val1: unknown, val2: unknown): boolean {
        // Handle null/undefined
        if (isNullOrUndefined(val1) && isNullOrUndefined(val2)) {
            return true;
        }
        if (isNullOrUndefined(val1) || isNullOrUndefined(val2)) {
            return false;
        }

        // Handle arrays
        if (Array.isArray(val1) && Array.isArray(val2)) {
            if (val1.length !== val2.length) {
                return false;
            }
            for (let i: number = 0; i < val1.length; i++) {
                // eslint-disable-next-line security/detect-object-injection
                if (!this.valuesEqual(val1[i], val2[i])) {
                    return false;
                }
            }
            return true;
        }

        // Handle dates - must come before the object check, a Date has no own enumerable keys
        if (val1 instanceof Date && val2 instanceof Date) {
            return val1.getTime() === val2.getTime();
        }

        // Handle objects - fixed: avoid nested loop for keys comparison
        if (typeof val1 === 'object' && typeof val2 === 'object') {
            const keys1: string[] = Object.keys(val1);
            const keys2: string[] = Object.keys(val2);
            if (keys1.length !== keys2.length) {
                return false;
            }
            // Check if all keys in val1 exist in val2 with equal values (O(n) instead of O(n²))
            for (const key of keys1) {
                // eslint-disable-next-line security/detect-object-injection
                if (!(key in val2) || !this.valuesEqual(val1[key], val2[key])) {
                    return false;
                }
            }
            return true;
        }

        return val1 === val2;
    }

    /**
     * Apply the CSS variables read by the grid highlight theme styles.
     * A configured color is set inline; otherwise the theme color applies.
     * @param {HTMLElement} element - The cell or row element
     * @param {HighlightSettingsModel} settings - Highlight configuration
     * @returns {void}
     * @hidden
     */
    private applyHighlightStyle(element: HTMLElement, settings: HighlightSettingsModel): void {
        const flash: number = this.getDuration(settings.flashDuration, 500);
        const fade: number = this.getDuration(settings.fadeDuration, 1000);
        element.style.setProperty('--e-grid-highlight-flash-duration', `${flash}ms`);
        element.style.setProperty('--e-grid-highlight-fade-duration', `${fade}ms`);
        if (settings.color) {
            element.style.setProperty('--e-grid-change-highlight-color', settings.color);
        } else {
            element.style.removeProperty('--e-grid-change-highlight-color');
        }
    }

    private clearHighlightStyle(element: HTMLElement): void {
        ['--e-grid-highlight-flash-duration', '--e-grid-highlight-fade-duration',
            '--e-grid-change-highlight-color', 'animation-delay'].forEach((name: string) => element.style.removeProperty(name));
    }

    private getDuration(value: number, fallback: number): number {
        return typeof value === 'number' && value >= 0 ? value : fallback;
    }

    /**
     * Find the rendered cell of a record by its primary key.
     * @param {any} key - The primary key value
     * @param {number} colIndex - The column index
     * @returns {object} The cell element and its row index
     * @hidden
     */
    public findRenderedCell(key: RecordKey, colIndex: number): {cell: HTMLElement; rowIndex: number} {
        const rows: Element[] = this.grid.getRows() as Element[];
        for (let i: number = 0; i < rows.length; i++) {
            const tr: Element = rows[parseInt(i.toString(), 10)];
            if (tr && tr.getAttribute && this.getRowKey(tr.firstElementChild as HTMLElement) === key) {
                const cell: HTMLElement = tr.querySelectorAll('.e-rowcell')[parseInt(colIndex.toString(), 10)] as HTMLElement;
                const rowIndex: number = parseInt(tr.getAttribute('aria-rowindex'), 10) - 1;
                return cell && rowIndex >= 0 ? { cell: cell, rowIndex: rowIndex } : null;
            }
        }
        return null;
    }

    private clearCellHighlight(cellElement: HTMLElement): void {
        cellElement.classList.remove('e-grid-cell-changed');
        this.clearHighlightStyle(cellElement);
        cellElement.removeAttribute('aria-label');
        cellElement.removeAttribute('role');
    }

    /**
     * Get the primary key value of a record, or its position when the grid has no primary key.
     * @param {any} record - The record
     * @param {number} index - The fallback position
     * @returns {any} The key
     * @hidden
     */
    public recordKey(record: Object, index: number): RecordKey {
        const pkName: string = this.grid.getPrimaryKeyFieldNames()[0];
        const value: RecordKey = pkName && record ? getValue(pkName, record) : undefined;
        return isNullOrUndefined(value) ? index : `k:${value}`;
    }

    private getRowKey(cellElement: HTMLElement): RecordKey {
        const pkName: string = this.grid.getPrimaryKeyFieldNames()[0];
        const tr: Element = cellElement.parentElement;
        const rowObj: Row<Column> = tr && pkName ? this.grid.getRowObjectFromUID(tr.getAttribute('data-uid')) : null;
        return rowObj && rowObj.data ? getValue(pkName, rowObj.data) : undefined;
    }

    private getTotalDuration(settings: HighlightSettingsModel): number {
        return this.getDuration(settings.flashDuration, 500) + this.getDuration(settings.fadeDuration, 1000);
    }
}
